import { getGutendexBook, getGutenbergText } from "@/lib/api/gutendex";
import { findGoogleBookByTitleAuthor } from "@/lib/api/googleBooks";
import { parseChapters } from "@/lib/books/parseChapters";
import { normalizeGutendexBook, normalizeGoogleBook } from "@/lib/books/normalizeBook";
import { getBookById } from "@/lib/books/getBook";
import { findGutenbergMatch } from "@/lib/books/findGutenbergMatch";
import { mergeBooks } from "@/lib/books/mergeBooks";
import { internetArchiveUrl } from "@/lib/api/internetArchive";

function googleEmbedUrl(volumeId, language) {
  const hl = language ? `&hl=${encodeURIComponent(language)}` : "";
  return `https://books.google.com/books?id=${encodeURIComponent(volumeId)}&printsec=frontcover&output=embed${hl}`;
}

function archiveEmbedUrl(identifier) {
  return `https://archive.org/embed/${encodeURIComponent(identifier)}`;
}

async function loadGutenbergReader(pgId, book = null) {
  const item = await getGutendexBook(pgId);
  if (!item || item.copyright === true) return null;
  const gutenbergBook = normalizeGutendexBook(item);
  const merged = book
    ? {
        ...book,
        gutenbergId: gutenbergBook.gutenbergId,
        formats: gutenbergBook.formats,
        sources: { ...book.sources, gutenberg: gutenbergBook.sources.gutenberg },
      }
    : gutenbergBook;
  const text = await getGutenbergText(item);
  if (!text) return { book: merged, chapters: [] };
  return {
    book: merged,
    chapters: parseChapters(text, merged.title),
  };
}

export async function getReadableBook(rawId) {
  const data = await getBookById(rawId);
  let book = data?.book || null;
  if (!book) return null;

  const pgId =
    (String(rawId).startsWith("pg-") || /^\d+$/.test(String(rawId)) ? rawId : "") ||
    book.gutenbergId ||
    book.sources?.gutenberg ||
    (await findGutenbergMatch(book));

  if (pgId) {
    const reader = await loadGutenbergReader(pgId, book);
    if (reader?.chapters?.length) {
      return { mode: "text", book: reader.book, chapters: reader.chapters };
    }
  }

  if (!book.sources?.googleBooks) {
    const volume = await findGoogleBookByTitleAuthor(
      book.title,
      book.authors?.[0]?.name,
      book.languages?.[0]
    );
    if (volume) book = mergeBooks(book, normalizeGoogleBook(volume));
  }

  if (book.sources?.googleBooks) {
    const language = book.languages?.[0] || "";
    return {
      mode: "embed",
      book,
      embedUrl: googleEmbedUrl(book.sources.googleBooks, language),
      externalUrl:
        book.previewUrl ||
        `https://books.google.com/books?id=${book.sources.googleBooks}${language ? `&hl=${language}` : ""}`,
      provider: "Google Books",
    };
  }

  const archiveId = book.archiveId || book.sources?.internetArchive || data.archive?.[0]?.id;
  if (archiveId) {
    return {
      mode: "embed",
      book,
      embedUrl: archiveEmbedUrl(archiveId),
      externalUrl: internetArchiveUrl(archiveId),
      provider: "Internet Archive",
    };
  }

  if (book.sources?.openLibrary) {
    return {
      mode: "links",
      book,
      links: [
        {
          label: "Open Library",
          href: `https://openlibrary.org/works/${book.sources.openLibrary}`,
        },
        book.previewUrl ? { label: "Google Books preview", href: book.previewUrl } : null,
      ].filter(Boolean),
    };
  }

  return { mode: "links", book, links: [] };
}

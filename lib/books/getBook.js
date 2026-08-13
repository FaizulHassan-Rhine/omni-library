import {
  getOpenLibraryWork,
  getOpenLibraryEditions,
  getOpenLibraryRatings,
  getOpenLibraryAuthor,
  extractOpenLibraryId,
} from "@/lib/api/openLibrary";
import { getGoogleBook, findGoogleBookByIsbn, findGoogleBookByTitleAuthor } from "@/lib/api/googleBooks";
import { getGutendexBook } from "@/lib/api/gutendex";
import { findGutenbergMatch } from "@/lib/books/findGutenbergMatch";
import { searchInternetArchive } from "@/lib/api/internetArchive";
import {
  normalizeOpenLibraryWork,
  normalizeOpenLibraryEdition,
  normalizeGoogleBook,
  normalizeGutendexBook,
} from "@/lib/books/normalizeBook";
import { mergeBooks } from "@/lib/books/mergeBooks";
import { getAvailability } from "@/lib/books/bookAvailability";
import { internetArchiveUrl } from "@/lib/api/internetArchive";

export function parseBookId(id) {
  const value = decodeURIComponent(id || "");
  if (value.startsWith("pg-")) return { type: "gutenberg", id: value };
  if (value.startsWith("gb-")) return { type: "google", id: value.replace(/^gb-/, "") };
  if (value.startsWith("ia-")) return { type: "archive", id: value.replace(/^ia-/, "") };
  if (/^OL\d+M$/i.test(value)) return { type: "edition", id: value };
  return { type: "work", id: value };
}

async function enrichWithGoogle(book) {
  if (book.sources?.googleBooks && book.previewUrl) return book;
  let volume = null;
  if (book.isbn13 || book.isbn10) {
    volume = await findGoogleBookByIsbn(book.isbn13 || book.isbn10);
  }
  if (!volume && book.title) {
    volume = await findGoogleBookByTitleAuthor(book.title, book.authors?.[0]?.name, book.languages?.[0]);
  }
  if (!volume) return book;
  return mergeBooks(book, normalizeGoogleBook(volume));
}

export async function getBookById(rawId) {
  const parsed = parseBookId(rawId);

  if (parsed.type === "gutenberg") {
    const item = await getGutendexBook(parsed.id);
    if (!item) return null;
    let book = normalizeGutendexBook(item);
    book = await enrichWithGoogle(book);
    return { book, editions: [], ratings: null, archive: [] };
  }

  if (parsed.type === "archive") {
    return {
      book: {
        id: `ia-${parsed.id}`,
        title: parsed.id,
        authors: [],
        archiveId: parsed.id,
        sources: { openLibrary: "", googleBooks: "", gutenberg: "", internetArchive: parsed.id },
        availability: getAvailability({ archiveId: parsed.id, sources: { internetArchive: parsed.id } }),
      },
      editions: [],
      ratings: null,
      archive: [{ id: parsed.id, title: parsed.id, url: internetArchiveUrl(parsed.id) }],
    };
  }

  if (parsed.type === "google") {
    const volume = await getGoogleBook(parsed.id);
    if (!volume) return null;
    return { book: normalizeGoogleBook(volume), editions: [], ratings: null, archive: [] };
  }

  const workId = extractOpenLibraryId(parsed.id);
  const [work, editions, ratings] = await Promise.all([
    getOpenLibraryWork(workId),
    getOpenLibraryEditions(workId, 20),
    getOpenLibraryRatings(workId),
  ]);

  if (!work) return null;

  const firstEdition = editions[0];
  let book = normalizeOpenLibraryWork(work, {
    authors: (work.authors || []).map((item) => ({
      id: extractOpenLibraryId(item.author?.key),
      name: item.author?.key ? extractOpenLibraryId(item.author.key) : "",
    })),
    firstPublishedYear: Number(String(work.first_publish_date || firstEdition?.publish_date || "").slice(0, 4)) || null,
    editionCount: editions.length,
    pages: firstEdition?.number_of_pages || null,
    isbn10: firstEdition?.isbn_10?.[0] || "",
    isbn13: firstEdition?.isbn_13?.[0] || "",
    publisher: firstEdition?.publishers?.[0] || "",
    ratings: {
      average: ratings?.summary?.average || 0,
      count: ratings?.summary?.count || 0,
    },
  });

  const authorIds = (work.authors || [])
    .map((item) => extractOpenLibraryId(item.author?.key))
    .filter(Boolean)
    .slice(0, 5);
  const authorDocs = await Promise.all(authorIds.map((authorId) => getOpenLibraryAuthor(authorId)));
  book.authors = authorDocs.filter(Boolean).map((doc) => ({
    id: extractOpenLibraryId(doc.key),
    name: doc.name || "Unknown",
  }));

  book = await enrichWithGoogle(book);

  const ocaid = editions.map((edition) => edition.ocaid).find(Boolean);
  if (ocaid) {
    book.archiveId = ocaid;
    book.sources.internetArchive = ocaid;
    book.hasFulltext = true;
  }

  if (!book.sources.gutenberg) {
    const pgId = await findGutenbergMatch(book);
    if (pgId) {
      book.gutenbergId = pgId;
      book.sources.gutenberg = pgId;
    }
  }

  if (book.sources.gutenberg) {
    const gut = await getGutendexBook(book.sources.gutenberg);
    if (gut) book = mergeBooks(book, normalizeGutendexBook(gut));
  }

  const isbn = book.isbn13 || book.isbn10;
  const archive = book.archiveId
    ? [{ identifier: book.archiveId, title: book.title }]
    : isbn
      ? await searchInternetArchive({ isbn })
      : await searchInternetArchive({ q: `"${book.title}"` });

  if (archive[0]?.identifier) {
    book.archiveId = book.archiveId || archive[0].identifier;
    book.sources.internetArchive = book.sources.internetArchive || archive[0].identifier;
    book.hasFulltext = true;
  }

  book.availability = getAvailability(book);

  const normalizedEditions = editions.map((edition) => normalizeOpenLibraryEdition(edition, workId)).filter(Boolean);

  return {
    book,
    editions: normalizedEditions,
    ratings,
    archive: archive.map((item) => ({
      id: item.identifier,
      title: item.title,
      url: internetArchiveUrl(item.identifier),
    })),
  };
}

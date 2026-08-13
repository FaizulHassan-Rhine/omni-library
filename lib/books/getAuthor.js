import {
  getOpenLibraryAuthor,
  getOpenLibraryAuthorWorks,
  searchOpenLibraryAuthors,
  openLibraryAuthorPhoto,
  extractOpenLibraryId,
} from "@/lib/api/openLibrary";
import { getWikipediaSummary } from "@/lib/api/wikipedia";
import { normalizeOpenLibraryAuthor, normalizeOpenLibraryDoc, emptyBook } from "@/lib/books/normalizeBook";
import { openLibraryCover } from "@/lib/books/covers";
import { slugify } from "@/lib/utils/slug";
import { FEATURED_AUTHORS } from "@/lib/utils/categories";

function workToBook(work) {
  if (!work) return null;
  if (work.cover_i || work.author_name) return normalizeOpenLibraryDoc(work);
  return emptyBook({
    id: extractOpenLibraryId(work.key),
    slug: slugify(work.title),
    title: work.title || "Untitled",
    cover: openLibraryCover(work.covers?.[0], "L"),
    covers: [openLibraryCover(work.covers?.[0], "L")].filter(Boolean),
    firstPublishedYear: Number(String(work.first_publish_date || "").slice(0, 4)) || null,
    editionCount: work.edition_count || 0,
    sources: { openLibrary: extractOpenLibraryId(work.key), googleBooks: "", gutenberg: "", internetArchive: "" },
  });
}

export async function getAuthorById(id) {
  const authorId = extractOpenLibraryId(id);
  const [doc, works] = await Promise.all([
    getOpenLibraryAuthor(authorId),
    getOpenLibraryAuthorWorks(authorId, 30),
  ]);
  if (!doc) return null;

  let wikipedia = null;
  if (!doc.bio || (typeof doc.bio === "object" && !doc.bio.value) || String(doc.bio).length < 80) {
    wikipedia = await getWikipediaSummary(doc.name);
  }

  const author = normalizeOpenLibraryAuthor(doc, {
    photo: openLibraryAuthorPhoto(authorId, "L"),
    workCount: works.length || doc.work_count,
    wikipedia,
  });

  const books = works.map((work) => {
    const book = workToBook(work);
    if (!book) return null;
    book.authors = [{ id: author.id, name: author.name }];
    return book;
  }).filter(Boolean);
  const languages = [...new Set(books.flatMap((book) => book.languages || []))];
  const subjects = [...new Set(books.flatMap((book) => book.subjects || author.subjects || []))].slice(0, 12);

  return {
    author: { ...author, subjects, languages },
    works: books,
    stats: {
      works: author.workCount || books.length,
      editions: books.reduce((sum, book) => sum + (book.editionCount || 0), 0),
      languages: languages.length,
    },
  };
}

export async function searchAuthors(q, limit = 12) {
  const docs = await searchOpenLibraryAuthors(q, limit);
  return docs.map((doc) =>
    normalizeOpenLibraryAuthor(
      { ...doc, key: doc.key?.startsWith("/authors/") ? doc.key : `/authors/${doc.key}` },
      {
        photo: openLibraryAuthorPhoto(doc.key, "M"),
        workCount: doc.work_count,
        topWork: doc.top_work,
        subjects: doc.top_subjects,
      }
    )
  );
}

export async function getFeaturedAuthors() {
  const results = await Promise.allSettled(FEATURED_AUTHORS.map((name) => searchAuthors(name, 1)));
  return results
    .filter((result) => result.status === "fulfilled" && result.value[0])
    .map((result) => result.value[0]);
}

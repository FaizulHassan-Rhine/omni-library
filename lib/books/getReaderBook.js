import { getGutendexBook, getGutenbergText } from "@/lib/api/gutendex";
import { parseChapters } from "@/lib/books/parseChapters";
import { normalizeGutendexBook } from "@/lib/books/normalizeBook";

export async function getReaderBook(id) {
  const item = await getGutendexBook(id);
  if (!item || item.copyright === true) return null;
  const book = normalizeGutendexBook(item);
  const text = await getGutenbergText(item);
  if (!text) return { book, chapters: [] };
  return {
    book,
    chapters: parseChapters(text, book.title),
  };
}

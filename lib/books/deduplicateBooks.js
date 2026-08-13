import { normalizeText } from "@/lib/utils/slug";
import { mergeBooks } from "@/lib/books/mergeBooks";

function keysFor(book) {
  const keys = [];
  if (book.isbn13) keys.push(`isbn13:${book.isbn13}`);
  if (book.isbn10) keys.push(`isbn10:${book.isbn10}`);
  if (book.sources?.openLibrary) keys.push(`ol:${book.sources.openLibrary}`);
  if (book.sources?.googleBooks) keys.push(`gb:${book.sources.googleBooks}`);
  if (book.sources?.gutenberg) keys.push(`pg:${book.sources.gutenberg}`);
  const title = normalizeText(book.title);
  const author = normalizeText(book.authors?.[0]?.name);
  if (title && author) keys.push(`ta:${title}|${author}`);
  return keys;
}

export function deduplicateBooks(books = []) {
  const groups = [];
  const index = new Map();

  books.filter(Boolean).forEach((book) => {
    const keys = keysFor(book);
    let found = -1;
    for (const key of keys) {
      if (index.has(key)) {
        found = index.get(key);
        break;
      }
    }

    if (found === -1) {
      const nextIndex = groups.length;
      groups.push(book);
      keys.forEach((key) => index.set(key, nextIndex));
      return;
    }

    groups[found] = mergeBooks(groups[found], book);
    keysFor(groups[found]).forEach((key) => index.set(key, found));
  });

  return groups;
}

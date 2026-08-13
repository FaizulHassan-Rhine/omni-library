import { searchGutendex } from "@/lib/api/gutendex";
import { normalizeText } from "@/lib/utils/slug";

function titlesMatch(left, right) {
  const a = normalizeText(left).replace(/^(the|a|an) /, "");
  const b = normalizeText(right).replace(/^(the|a|an) /, "");
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.startsWith(b) || b.startsWith(a)) return a.length > 6 && b.length > 6;
  const shortA = a.split(" ").slice(0, 5).join(" ");
  const shortB = b.split(" ").slice(0, 5).join(" ");
  return shortA === shortB && shortA.length > 8;
}

export async function findGutenbergMatch(book) {
  if (book?.gutenbergId || book?.sources?.gutenberg) {
    return book.gutenbergId || book.sources.gutenberg;
  }
  const year = book?.firstPublishedYear;
  if (year && year > 1928 && book.ebookAccess !== "public") return "";

  const lastName = (book.authors?.[0]?.name || "").split(" ").filter(Boolean).pop() || "";
  const query = [book.title, lastName].filter(Boolean).join(" ");
  if (!query) return "";

  const { results } = await searchGutendex({ q: query, copyright: false });
  const match = (results || []).find((item) => titlesMatch(item.title, book.title));
  return match ? `pg-${match.id}` : "";
}

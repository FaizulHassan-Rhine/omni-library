import { fetchJson, withQuery } from "@/lib/api/fetchJson";
import { REVALIDATE } from "@/lib/utils/cache";
import { looksLikeIsbn, normalizeIsbn } from "@/lib/utils/format";
import { normalizeLanguage } from "@/lib/utils/languages";

const BASE = "https://www.googleapis.com/books/v1/volumes";

export function hasGoogleBooksKey() {
  return Boolean(process.env.GOOGLE_BOOKS_API_KEY);
}

function withKey(params = {}) {
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  return key ? { ...params, key } : params;
}

export async function searchGoogleBooks({
  q,
  page = 1,
  limit = 20,
  language,
  orderBy,
  filter,
} = {}) {
  const query = looksLikeIsbn(q) ? `isbn:${normalizeIsbn(q)}` : String(q || "").trim();
  if (!query) return { items: [], total: 0 };

  const startIndex = Math.max(0, (page - 1) * limit);
  const data = await fetchJson(
    withQuery(
      BASE,
      withKey({
        q: query,
        startIndex,
        maxResults: Math.min(Math.max(limit, 1), 40),
        langRestrict: language || undefined,
        orderBy: orderBy === "newest" ? "newest" : "relevance",
        printType: "books",
        filter: filter || undefined,
      })
    ),
    { revalidate: REVALIDATE.search }
  );

  let items = data?.items || [];
  if (language) {
    items = items.filter((item) => normalizeLanguage(item.volumeInfo?.language) === language);
  }

  return {
    items,
    total: data?.totalItems || 0,
  };
}

export async function getGoogleBook(volumeId) {
  if (!volumeId) return null;
  return fetchJson(
    withQuery(`${BASE}/${encodeURIComponent(volumeId)}`, withKey()),
    { revalidate: REVALIDATE.book }
  );
}

export async function findGoogleBookByIsbn(isbn) {
  const compact = normalizeIsbn(isbn);
  if (!compact) return null;
  const { items } = await searchGoogleBooks({ q: compact, limit: 1 });
  return items[0] || null;
}

export async function findGoogleBookByTitleAuthor(title, author, language) {
  if (!title) return null;
  const quoted = `"${title.replace(/"/g, "")}"`;
  const q = author ? `intitle:${quoted} inauthor:${author}` : `intitle:${quoted}`;
  const { items } = await searchGoogleBooks({ q, limit: 3, language });
  return items[0] || (await searchGoogleBooks({ q: title, limit: 1, language })).items[0] || null;
}

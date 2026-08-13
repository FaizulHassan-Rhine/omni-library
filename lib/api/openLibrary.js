import { fetchJson, withQuery } from "@/lib/api/fetchJson";
import { REVALIDATE } from "@/lib/utils/cache";
import { toOpenLibraryLang } from "@/lib/utils/languages";
import { openLibraryCover, openLibraryAuthorPhoto } from "@/lib/books/covers";

const BASE = "https://openlibrary.org";

export { openLibraryCover, openLibraryAuthorPhoto };

export function extractOpenLibraryId(key) {
  if (!key) return "";
  return String(key).split("/").filter(Boolean).pop();
}

export async function searchOpenLibrary({
  q,
  page = 1,
  limit = 20,
  language,
  subject,
  sort,
  hasFulltext,
  yearMin,
  yearMax,
} = {}) {
  const olLang = language ? toOpenLibraryLang(language) : "";
  let query = String(q || "").trim();
  if (query === "*") query = "";

  if (!query) {
    query = olLang
      ? olLang === "eng"
        ? `language:${olLang}`
        : `language:${olLang} AND NOT language:eng`
      : subject
        ? `subject:${subject}`
        : "books";
  } else if (olLang && !query.includes("language:")) {
    query = `(${query}) AND language:${olLang}`;
  }

  if (subject && !query.includes("subject:")) query = `${query} subject:${subject}`;
  if (yearMin && yearMax) query = `${query} first_publish_year:[${yearMin} TO ${yearMax}]`;
  else if (yearMin) query = `${query} first_publish_year:[${yearMin} TO 9999]`;
  else if (yearMax) query = `${query} first_publish_year:[0 TO ${yearMax}]`;

  const fields = [
    "key",
    "title",
    "subtitle",
    "author_name",
    "author_key",
    "first_publish_year",
    "cover_i",
    "isbn",
    "language",
    "subject",
    "ratings_average",
    "ratings_count",
    "edition_count",
    "publisher",
    "number_of_pages_median",
    "ia",
    "ebook_access",
    "has_fulltext",
    "id_google",
    "id_project_gutenberg",
    "cover_edition_key",
    "public_scan_b",
  ].join(",");

  const data = await fetchJson(
    withQuery(`${BASE}/search.json`, {
      q: query,
      page,
      limit,
      fields,
      sort: mapSort(sort),
      has_fulltext: hasFulltext ? "true" : undefined,
    }),
    { revalidate: REVALIDATE.search }
  );

  return {
    docs: data?.docs || [],
    numFound: data?.numFound || 0,
  };
}

function mapSort(sort) {
  switch (sort) {
    case "newest":
      return "new";
    case "oldest":
      return "old";
    case "popularity":
      return "rating";
    case "title":
      return "title";
    default:
      return undefined;
  }
}

export async function getOpenLibraryWork(id) {
  const workId = extractOpenLibraryId(id);
  return fetchJson(`${BASE}/works/${workId}.json`, { revalidate: REVALIDATE.book });
}

export async function getOpenLibraryEditions(id, limit = 24) {
  const workId = extractOpenLibraryId(id);
  const data = await fetchJson(`${BASE}/works/${workId}/editions.json?limit=${limit}`, {
    revalidate: REVALIDATE.editions,
  });
  return data?.entries || [];
}

export async function getOpenLibraryRatings(id) {
  const workId = extractOpenLibraryId(id);
  return fetchJson(`${BASE}/works/${workId}/ratings.json`, { revalidate: REVALIDATE.book });
}

export async function getOpenLibraryAuthor(id) {
  const authorId = extractOpenLibraryId(id);
  return fetchJson(`${BASE}/authors/${authorId}.json`, { revalidate: REVALIDATE.author });
}

export async function getOpenLibraryAuthorWorks(id, limit = 24) {
  const authorId = extractOpenLibraryId(id);
  const data = await fetchJson(`${BASE}/authors/${authorId}/works.json?limit=${limit}`, {
    revalidate: REVALIDATE.author,
  });
  return data?.entries || [];
}

export async function searchOpenLibraryAuthors(q, limit = 10) {
  const data = await fetchJson(
    withQuery(`${BASE}/search/authors.json`, { q, limit }),
    { revalidate: REVALIDATE.search }
  );
  return data?.docs || [];
}

export async function getOpenLibrarySubject(subject, { limit = 24, offset = 0 } = {}) {
  const slug = String(subject).replace(/\s+/g, "_").toLowerCase();
  return fetchJson(`${BASE}/subjects/${encodeURIComponent(slug)}.json?limit=${limit}&offset=${offset}`, {
    revalidate: REVALIDATE.subject,
  });
}

export async function getOpenLibraryTrending(range = "now") {
  const data = await fetchJson(`${BASE}/trending/${range}.json?limit=16`, {
    revalidate: REVALIDATE.trending,
  });
  return data?.works || [];
}

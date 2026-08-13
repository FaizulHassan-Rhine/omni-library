import { fetchJson, fetchText, withQuery } from "@/lib/api/fetchJson";
import { REVALIDATE } from "@/lib/utils/cache";

const BASE = "https://gutendex.com/books";

export function gutenbergNumericId(id) {
  return String(id || "").replace(/^pg-/i, "");
}

export async function searchGutendex({
  q,
  page = 1,
  language,
  sort = "popular",
  topic,
  copyright = false,
  timeout = 12000,
} = {}) {
  const data = await fetchJson(
    withQuery(BASE, {
      search: q || undefined,
      page,
      languages: language || undefined,
      sort,
      topic: topic || undefined,
      copyright: copyright === false ? "false" : undefined,
    }),
    { revalidate: REVALIDATE.free, timeout }
  );

  return {
    results: data?.results || [],
    count: data?.count || 0,
    next: data?.next || null,
  };
}

export async function getGutendexBook(id) {
  const numeric = gutenbergNumericId(id);
  return fetchJson(`${BASE}/${numeric}`, { revalidate: REVALIDATE.book });
}

export async function getPopularGutendexBooks({ language, page = 1 } = {}) {
  return searchGutendex({ page, language, sort: "popular", copyright: false });
}

export function gutenbergTextUrls(book) {
  const id = gutenbergNumericId(book?.id);
  const formats = book?.formats || {};
  const keys = Object.keys(formats);
  const ranked = [
    ...keys.filter((key) => key.startsWith("text/plain") && /utf-8/i.test(key)),
    ...keys.filter((key) => key.startsWith("text/plain") && !/us-ascii/i.test(key)),
    ...keys.filter((key) => key.startsWith("text/plain")),
    ...keys.filter((key) => key.includes("text/html")),
  ];

  return [
    ...ranked.map((key) => formats[key]),
    id ? `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt` : "",
    id ? `https://www.gutenberg.org/ebooks/${id}.txt.utf-8` : "",
    id ? `https://www.gutenberg.org/files/${id}/${id}-0.txt` : "",
    id ? `https://www.gutenberg.org/files/${id}/${id}.txt` : "",
  ].filter((url, index, list) => url && list.indexOf(url) === index);
}

export async function getGutenbergText(book) {
  for (const url of gutenbergTextUrls(book)) {
    const text = await fetchText(url, { revalidate: REVALIDATE.reader, timeout: 60000 });
    if (text && text.length > 400 && !/^<!doctype html>/i.test(text.slice(0, 80))) {
      return text;
    }
    if (text && text.includes("<") && text.length > 800) {
      return text;
    }
  }
  return null;
}

export function gutenbergCover(book) {
  return book?.formats?.["image/jpeg"] || "";
}

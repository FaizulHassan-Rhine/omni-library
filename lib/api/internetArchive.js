import { fetchJson } from "@/lib/api/fetchJson";
import { REVALIDATE } from "@/lib/utils/cache";
import { normalizeIsbn } from "@/lib/utils/format";

const SEARCH = "https://archive.org/advancedsearch.php";

export async function searchInternetArchive({ q, isbn, rows = 6 } = {}) {
  const queryParts = ["mediatype:texts"];
  if (isbn) queryParts.push(`isbn:${normalizeIsbn(isbn)}`);
  else if (q) queryParts.push(`(${q})`);
  else return [];

  const url = new URL(SEARCH);
  url.searchParams.set("q", queryParts.join(" AND "));
  url.searchParams.set("output", "json");
  url.searchParams.set("rows", String(rows));
  ["identifier", "title", "creator", "year", "language", "description"].forEach((field) => {
    url.searchParams.append("fl[]", field);
  });

  const data = await fetchJson(url.toString(), { revalidate: REVALIDATE.book });

  return data?.response?.docs || [];
}

export function internetArchiveUrl(identifier) {
  if (!identifier) return "";
  return `https://archive.org/details/${identifier}`;
}

export function internetArchiveCover(identifier) {
  if (!identifier) return "";
  return `https://archive.org/services/img/${identifier}`;
}

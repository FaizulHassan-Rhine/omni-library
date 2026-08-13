import { fetchJson } from "@/lib/api/fetchJson";
import { REVALIDATE } from "@/lib/utils/cache";

export async function getWikipediaSummary(title) {
  if (!title) return null;
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  const data = await fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`, {
    revalidate: REVALIDATE.author,
  });
  if (!data || data.type === "disambiguation") return null;
  return {
    title: data.title,
    extract: data.extract || "",
    thumbnail: data.thumbnail?.source || "",
    url: data.content_urls?.desktop?.page || "",
  };
}

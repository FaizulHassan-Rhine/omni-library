import { REVALIDATE, USER_AGENT } from "@/lib/utils/cache";

export async function fetchJson(url, { revalidate = REVALIDATE.book, timeout = 12000 } = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
      next: { revalidate },
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchText(url, { revalidate = REVALIDATE.reader, timeout = 60000 } = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/plain, text/html;q=0.9, */*;q=0.8",
      },
      next: { revalidate },
      signal: AbortSignal.timeout(timeout),
      redirect: "follow",
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

export function withQuery(base, params) {
  const url = new URL(base);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === false) return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

export function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("en", { notation: n >= 10000 ? "compact" : "standard" }).format(n);
}

export function formatYear(value) {
  if (!value) return "";
  const year = String(value).slice(0, 4);
  return /^\d{4}$/.test(year) ? year : "";
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatYear(value) || String(value);
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

export function truncate(value, length = 180) {
  const text = String(value || "").trim();
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export function unique(list) {
  return [...new Set((list || []).filter(Boolean))];
}

export function httpsUrl(url) {
  if (!url) return "";
  return String(url).replace(/^http:\/\//i, "https://");
}

export function looksLikeIsbn(query) {
  const compact = String(query || "").replace(/[-\s]/g, "");
  return /^(?:\d{9}[\dX]|\d{13})$/i.test(compact);
}

export function normalizeIsbn(value) {
  return String(value || "")
    .replace(/[-\s]/g, "")
    .toUpperCase();
}

export function joinNames(authors = []) {
  return authors
    .map((author) => (typeof author === "string" ? author : author?.name))
    .filter(Boolean)
    .join(", ");
}

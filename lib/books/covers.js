import { httpsUrl, normalizeIsbn, unique } from "@/lib/utils/format";

const OL_COVERS = "https://covers.openlibrary.org";

function validId(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function openLibraryCover(coverId, size = "M") {
  const id = validId(coverId);
  if (!id) return "";
  return `${OL_COVERS}/b/id/${id}-${size}.jpg?default=false`;
}

export function openLibraryIsbnCover(isbn, size = "M") {
  const compact = normalizeIsbn(isbn);
  if (compact.length < 10) return "";
  return `${OL_COVERS}/b/isbn/${compact}-${size}.jpg?default=false`;
}

export function openLibraryEditionCover(olid, size = "M") {
  const id = String(olid || "").replace(/^\/books\//, "").trim();
  if (!/^OL\d+M$/i.test(id)) return "";
  return `${OL_COVERS}/b/olid/${id}-${size}.jpg?default=false`;
}

export function openLibraryAuthorPhoto(authorId, size = "M") {
  if (!authorId) return "";
  const id = String(authorId).replace(/^\/authors\//, "");
  return `${OL_COVERS}/a/olid/${id}-${size}.jpg?default=false`;
}

export function googleVolumeId(value = "") {
  const raw = String(value || "");
  const fromId = raw.replace(/^gb-/i, "");
  if (fromId && !fromId.includes("/") && !fromId.includes("http")) return fromId;
  const match = raw.match(/[?&]id=([^&]+)/i) || raw.match(/frontcover\/([^?/]+)/i);
  return match ? decodeURIComponent(match[1]) : "";
}

export function cleanGoogleCover(url) {
  if (!url) return "";
  return httpsUrl(url)
    .replace(/&edge=curl/gi, "")
    .replace(/zoom=\d/, "zoom=1");
}

export function googleCoverUrls(volumeId, existingUrl = "") {
  const id = googleVolumeId(volumeId) || googleVolumeId(existingUrl);
  const urls = [];
  if (id) {
    urls.push(`https://books.google.com/books/content?id=${encodeURIComponent(id)}&printsec=frontcover&img=1&zoom=1&source=gbs_api`);
    urls.push(`https://books.google.com/books/publisher/content/images/frontcover/${encodeURIComponent(id)}?fife=w400`);
  }
  if (existingUrl && /google/i.test(existingUrl)) urls.push(cleanGoogleCover(existingUrl));
  return unique(urls.filter(Boolean));
}

export function gutenbergCoverUrl(gutenbergId) {
  const id = String(gutenbergId || "").replace(/^pg-/i, "");
  if (!id) return "";
  return `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`;
}

export function archiveCoverUrl(identifier) {
  if (!identifier) return "";
  return `https://archive.org/services/img/${identifier}`;
}

export function isLikelyPlaceholderUrl(url) {
  const value = String(url || "");
  if (!value) return true;
  return /nophoto|nocover|no[_-]?cover|placeholder|unavailable|default=true/i.test(value)
    || /archive\.org\/services\/img/i.test(value);
}

function withMissingCover404(url) {
  if (!/covers\.openlibrary\.org/i.test(url)) return url;
  if (/[?&]default=/i.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}default=false`;
}

export function isPlaceholderImage(image, src = "") {
  const width = image?.naturalWidth || 0;
  const height = image?.naturalHeight || 0;
  if (width < 48 || height < 48) return true;
  if (/-L\.jpg/i.test(src) && width <= 200) return true;
  const ratio = width / height;
  return ratio > 1.35 || ratio < 0.45;
}

export function isMissingCoverArt(image, src = "") {
  const shown = image?.currentSrc || src || "";
  if (!shown) return true;
  if (isLikelyPlaceholderUrl(shown)) return true;
  return isPlaceholderImage(image, shown);
}

export function buildCoverList(book = {}, extra = []) {
  const googleId = book.sources?.googleBooks || "";
  const gutenbergId = book.gutenbergId || book.sources?.gutenberg || "";

  return unique([
    ...googleCoverUrls(googleId, book.cover),
    openLibraryCover(book.coverId),
    openLibraryEditionCover(book.coverEditionKey),
    openLibraryIsbnCover(book.isbn13),
    openLibraryIsbnCover(book.isbn10),
    ...(book.covers || []),
    book.cover,
    gutenbergCoverUrl(gutenbergId),
    ...extra,
  ]
    .filter((url) => url && !isLikelyPlaceholderUrl(url))
    .map(withMissingCover404));
}

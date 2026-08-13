import { slugify } from "@/lib/utils/slug";
import { httpsUrl, normalizeIsbn, unique } from "@/lib/utils/format";
import { normalizeLanguage } from "@/lib/utils/languages";
import { extractOpenLibraryId } from "@/lib/api/openLibrary";
import { gutenbergCover } from "@/lib/api/gutendex";
import { getAvailability } from "@/lib/books/bookAvailability";
import {
  archiveCoverUrl,
  googleCoverUrls,
  gutenbergCoverUrl,
  openLibraryCover,
  openLibraryEditionCover,
  openLibraryIsbnCover,
} from "@/lib/books/covers";

function asText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return asText(value[0]);
  if (typeof value === "object") return value.value || value.description || "";
  return String(value);
}

function pickIsbn(list = [], length) {
  const match = (list || [])
    .map(normalizeIsbn)
    .find((value) => (length === 13 ? value.length === 13 : value.length === 10 || value.length === 11));
  return match || "";
}

function gutenbergAuthorName(name) {
  if (!name) return "";
  if (!name.includes(",")) return name;
  const [last, ...rest] = name.split(",").map((part) => part.trim());
  return `${rest.join(" ")} ${last}`.trim();
}

export function emptyBook(partial = {}) {
  return {
    id: "",
    slug: "",
    title: "",
    subtitle: "",
    authors: [],
    description: "",
    isbn10: "",
    isbn13: "",
    cover: "",
    covers: [],
    coverId: 0,
    coverEditionKey: "",
    languages: [],
    subjects: [],
    firstPublishedYear: null,
    publisher: "",
    editionCount: 0,
    pages: null,
    ratings: { average: 0, count: 0 },
    availability: getAvailability(),
    sources: {
      openLibrary: "",
      googleBooks: "",
      gutenberg: "",
      internetArchive: "",
    },
    format: "",
    publishDate: "",
    ...partial,
  };
}

export function normalizeOpenLibraryDoc(doc) {
  if (!doc) return null;
  const workId = extractOpenLibraryId(doc.key);
  const isbns = doc.isbn || [];
  const gutenbergId = doc.id_project_gutenberg?.[0];
  const archiveId = Array.isArray(doc.ia) ? doc.ia[0] : typeof doc.ia === "string" ? doc.ia : "";
  const authorNames = doc.author_name || (doc.authors || []).map((item) => item.name).filter(Boolean);
  const authorKeys = doc.author_key || (doc.authors || []).map((item) => item.key);
  const authors = authorNames.map((name, index) => ({
    id: extractOpenLibraryId(authorKeys?.[index]),
    name,
  }));
  const coverId = doc.cover_i || doc.cover_id || doc.covers?.[0];
  const isbn13 = pickIsbn(isbns, 13);
  const isbn10 = pickIsbn(isbns, 10);
  const googleId = doc.id_google?.[0] || "";
  const covers = unique([
    ...googleCoverUrls(googleId),
    openLibraryCover(coverId),
    openLibraryEditionCover(doc.cover_edition_key),
    openLibraryIsbnCover(isbn13),
    openLibraryIsbnCover(isbn10),
    archiveCoverUrl(archiveId),
    gutenbergCoverUrl(gutenbergId),
  ]);

  const book = emptyBook({
    id: workId,
    slug: slugify(doc.title),
    title: doc.title || "Untitled",
    subtitle: doc.subtitle || "",
    authors,
    isbn10,
    isbn13,
    cover: covers[0] || "",
    covers,
    coverId,
    coverEditionKey: doc.cover_edition_key || "",
    languages: unique((doc.language || []).map(normalizeLanguage)),
    subjects: unique((doc.subject || []).slice(0, 12)),
    firstPublishedYear: doc.first_publish_year || null,
    publisher: Array.isArray(doc.publisher) ? doc.publisher[0] : doc.publisher || "",
    editionCount: doc.edition_count || 0,
    pages: doc.number_of_pages_median || null,
    ratings: {
      average: Number(doc.ratings_average) || 0,
      count: Number(doc.ratings_count) || 0,
    },
    sources: {
      openLibrary: workId,
      googleBooks: googleId,
      gutenberg: gutenbergId ? `pg-${gutenbergId}` : "",
      internetArchive: archiveId || "",
    },
  });

  book.gutenbergId = gutenbergId ? `pg-${gutenbergId}` : "";
  book.hasFulltext = Boolean(doc.has_fulltext || doc.public_scan_b);
  book.archiveId = archiveId || "";
  book.ebookAccess = doc.ebook_access || "";
  book.availability = getAvailability(book);
  return book;
}

export function normalizeOpenLibraryWork(work, extras = {}) {
  if (!work) return null;
  const workId = extractOpenLibraryId(work.key);
  const authors = (extras.authors || work.authors || []).map((item) => {
    if (item.name) return { id: item.id || extractOpenLibraryId(item.author?.key || item.key), name: item.name };
    return { id: extractOpenLibraryId(item.author?.key || item.key), name: extras.authorNames?.[0] || "Unknown" };
  });

  const coverId = work.covers?.[0];
  const covers = unique([
    ...googleCoverUrls(extras.googleId),
    openLibraryCover(coverId, "L"),
    openLibraryCover(coverId, "M"),
    openLibraryIsbnCover(extras.isbn13, "L"),
    openLibraryIsbnCover(extras.isbn10, "L"),
    archiveCoverUrl(extras.archiveId),
    gutenbergCoverUrl(extras.gutenbergId),
  ]);

  const book = emptyBook({
    id: workId,
    slug: slugify(work.title),
    title: work.title || "Untitled",
    subtitle: work.subtitle || "",
    authors,
    description: asText(work.description),
    cover: covers[0] || "",
    covers,
    coverId,
    coverEditionKey: extras.coverEditionKey || "",
    languages: unique((work.languages || []).map((item) => normalizeLanguage(item.key || item))),
    subjects: unique((work.subjects || []).slice(0, 18)),
    firstPublishedYear: extras.firstPublishedYear || Number(String(work.first_publish_date || "").slice(0, 4)) || null,
    editionCount: extras.editionCount || 0,
    pages: extras.pages || null,
    ratings: extras.ratings || { average: 0, count: 0 },
    isbn10: extras.isbn10 || "",
    isbn13: extras.isbn13 || "",
    publisher: extras.publisher || "",
    sources: {
      openLibrary: workId,
      googleBooks: extras.googleId || "",
      gutenberg: extras.gutenbergId || "",
      internetArchive: extras.archiveId || "",
    },
  });

  book.gutenbergId = extras.gutenbergId || "";
  book.hasFulltext = Boolean(extras.hasFulltext);
  book.archiveId = extras.archiveId || "";
  book.ebookAccess = extras.ebookAccess || "";
  book.availability = getAvailability(book);
  return book;
}

export function normalizeOpenLibraryEdition(edition, workId) {
  if (!edition) return null;
  const editionId = extractOpenLibraryId(edition.key);
  const isbns = [...(edition.isbn_13 || []), ...(edition.isbn_10 || [])];
  const isbn10 = pickIsbn(edition.isbn_10 || isbns, 10);
  const isbn13 = pickIsbn(edition.isbn_13 || isbns, 13);
  const coverId = edition.covers?.[0];
  const covers = unique([
    openLibraryCover(coverId),
    openLibraryEditionCover(editionId),
    openLibraryIsbnCover(isbn13),
    openLibraryIsbnCover(isbn10),
  ]);
  return emptyBook({
    id: editionId,
    slug: slugify(edition.title),
    title: edition.title || "Untitled",
    subtitle: edition.subtitle || "",
    authors: (edition.authors || []).map((item) => ({ id: extractOpenLibraryId(item.key), name: item.name || "" })),
    isbn10,
    isbn13,
    cover: covers[0] || "",
    covers,
    coverId,
    coverEditionKey: editionId,
    languages: unique((edition.languages || []).map((item) => normalizeLanguage(extractOpenLibraryId(item.key)))),
    firstPublishedYear: Number(String(edition.publish_date || "").slice(0, 4)) || null,
    publisher: edition.publishers?.[0] || "",
    pages: edition.number_of_pages || null,
    format: edition.physical_format || edition.physical_format || "",
    publishDate: edition.publish_date || "",
    sources: { openLibrary: workId || editionId, googleBooks: "", gutenberg: "", internetArchive: "" },
  });
}

export function normalizeGoogleBook(volume) {
  if (!volume) return null;
  const info = volume.volumeInfo || {};
  const access = volume.accessInfo || {};
  const identifiers = info.industryIdentifiers || [];
  const isbn10 = identifiers.find((item) => item.type === "ISBN_10")?.identifier || "";
  const isbn13 = identifiers.find((item) => item.type === "ISBN_13")?.identifier || "";
  const thumbnail = httpsUrl(info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || info.imageLinks?.small || info.imageLinks?.large);
  const covers = unique([
    ...googleCoverUrls(volume.id, thumbnail),
    openLibraryIsbnCover(isbn13),
    openLibraryIsbnCover(isbn10),
  ]);
  const publicDomain = Boolean(access.publicDomain);
  const previewable = access.viewability && access.viewability !== "NO_PAGES";

  const book = emptyBook({
    id: `gb-${volume.id}`,
    slug: slugify(info.title),
    title: info.title || "Untitled",
    subtitle: info.subtitle || "",
    authors: (info.authors || []).map((name) => ({ id: "", name })),
    description: asText(info.description),
    isbn10: normalizeIsbn(isbn10),
    isbn13: normalizeIsbn(isbn13),
    cover: covers[0] || "",
    covers,
    languages: unique([normalizeLanguage(info.language)]),
    subjects: unique(info.categories || []),
    firstPublishedYear: Number(String(info.publishedDate || "").slice(0, 4)) || null,
    publisher: info.publisher || "",
    pages: info.pageCount || null,
    ratings: {
      average: Number(info.averageRating) || 0,
      count: Number(info.ratingsCount) || 0,
    },
    sources: {
      openLibrary: "",
      googleBooks: volume.id,
      gutenberg: "",
      internetArchive: "",
    },
  });

  book.previewUrl = previewable ? access.webReaderLink || info.previewLink || "" : "";
  book.hasFulltext = publicDomain || previewable;
  book.embeddable = Boolean(access.embeddable);
  book.viewability = access.viewability || "";
  book.availability = getAvailability(book);
  if (publicDomain) {
    book.availability = { ...book.availability, status: "free", label: "Read Free" };
  }
  return book;
}

export function normalizeGutendexBook(item) {
  if (!item) return null;
  const authors = (item.authors || []).map((author) => ({
    id: "",
    name: gutenbergAuthorName(author.name),
    birthYear: author.birth_year,
    deathYear: author.death_year,
  }));

  const cover = httpsUrl(gutenbergCover(item)) || gutenbergCoverUrl(item.id);
  const covers = unique([cover, gutenbergCoverUrl(item.id)]);

  const book = emptyBook({
    id: `pg-${item.id}`,
    slug: slugify(item.title),
    title: item.title || "Untitled",
    authors,
    cover: covers[0] || "",
    covers,
    languages: unique((item.languages || []).map(normalizeLanguage)),
    subjects: unique((item.subjects || []).slice(0, 12)),
    ratings: { average: 0, count: item.download_count || 0 },
    sources: {
      openLibrary: "",
      googleBooks: "",
      gutenberg: `pg-${item.id}`,
      internetArchive: "",
    },
  });

  book.gutenbergId = `pg-${item.id}`;
  book.downloadCount = item.download_count || 0;
  book.formats = item.formats || {};
  book.availability = getAvailability(book);
  return book;
}

export function normalizeInternetArchiveDoc(doc) {
  if (!doc) return null;
  const cover = archiveCoverUrl(doc.identifier);
  return emptyBook({
    id: `ia-${doc.identifier}`,
    slug: slugify(doc.title),
    title: doc.title || "Untitled",
    authors: (Array.isArray(doc.creator) ? doc.creator : [doc.creator]).filter(Boolean).map((name) => ({ id: "", name })),
    description: asText(doc.description),
    cover,
    covers: cover ? [cover] : [],
    languages: unique((Array.isArray(doc.language) ? doc.language : [doc.language]).map(normalizeLanguage)),
    firstPublishedYear: Number(doc.year) || null,
    sources: {
      openLibrary: "",
      googleBooks: "",
      gutenberg: "",
      internetArchive: doc.identifier,
    },
    archiveId: doc.identifier,
  });
}

export function normalizeOpenLibraryAuthor(doc, extras = {}) {
  if (!doc) return null;
  const id = extractOpenLibraryId(doc.key);
  const bio = asText(doc.bio);
  return {
    id,
    name: doc.name || extras.name || "Unknown author",
    bio: extras.wikipedia?.extract || bio,
    birthDate: doc.birth_date || "",
    deathDate: doc.death_date || "",
    photo: extras.photo || "",
    workCount: doc.work_count || extras.workCount || 0,
    topWork: doc.top_work || extras.topWork || "",
    subjects: unique(doc.top_subjects || extras.subjects || []).slice(0, 12),
    wikipediaUrl: extras.wikipedia?.url || "",
    nationality: extras.nationality || "",
    sources: { openLibrary: id, wikipedia: extras.wikipedia?.title || "" },
  };
}

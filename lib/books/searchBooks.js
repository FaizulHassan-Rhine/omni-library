import { searchOpenLibrary, getOpenLibraryTrending, getOpenLibrarySubject } from "@/lib/api/openLibrary";
import { searchGoogleBooks } from "@/lib/api/googleBooks";
import { searchGutendex } from "@/lib/api/gutendex";
import { normalizeOpenLibraryDoc, normalizeGoogleBook, normalizeGutendexBook } from "@/lib/books/normalizeBook";
import { deduplicateBooks } from "@/lib/books/deduplicateBooks";
import { getLanguage, isNonLatinQuery, bookMatchesLanguage } from "@/lib/utils/languages";

export async function searchBooks({
  q = "",
  page = 1,
  type = "book",
  language = "",
  subject = "",
  sort = "relevance",
  free = false,
  preview = false,
  hasCover = false,
  yearMin = "",
  yearMax = "",
} = {}) {
  const query = q.trim();
  const lang = language ? getLanguage(language) : null;
  const browsingLanguage = Boolean(lang) && (!query || query === "*");
  const googleQuery = query && query !== "*" ? query : lang?.native || lang?.seed || subject || "";
  const wantsGoogle = Boolean(googleQuery) && (Boolean(query && query !== "*") || Boolean(language) || isNonLatinQuery(query));
  const pageSize = browsingLanguage ? 40 : 20;

  const olPromise = searchOpenLibrary({
    q: query && query !== "*" ? query : subject || "",
    page,
    limit: pageSize,
    language,
    subject,
    sort,
    hasFulltext: preview || free,
    yearMin,
    yearMax,
  });

  const googlePromise = wantsGoogle
    ? searchLanguageGoogleBooks({
        query: googleQuery,
        lang,
        page,
        browsing: browsingLanguage,
        sort,
        preview,
      })
    : Promise.resolve({ items: [], total: 0 });

  const gutenbergPromise =
    free || type === "free" || language
      ? searchGutendex({ q: query && query !== "*" ? query : "", page, language: lang?.code, topic: subject })
      : Promise.resolve({ results: [], count: 0 });

  const [olResult, googleResult, gutenbergResult] = await Promise.allSettled([
    olPromise,
    googlePromise,
    gutenbergPromise,
  ]);

  const ol = olResult.status === "fulfilled" ? olResult.value : { docs: [], numFound: 0 };
  const google = googleResult.status === "fulfilled" ? googleResult.value : { items: [], total: 0 };
  const gutenberg = gutenbergResult.status === "fulfilled" ? gutenbergResult.value : { results: [], count: 0 };

  let books = browsingLanguage
    ? [
        ...(google.items || []).map(normalizeGoogleBook),
        ...(ol.docs || []).map(normalizeOpenLibraryDoc),
        ...(gutenberg.results || []).map(normalizeGutendexBook),
      ]
    : [
        ...(ol.docs || []).map(normalizeOpenLibraryDoc),
        ...(google.items || []).map(normalizeGoogleBook),
        ...((free || type === "free" || language ? gutenberg.results : []) || []).map(normalizeGutendexBook),
      ];
  books = books.filter(Boolean);

  let merged = deduplicateBooks(books);
  if (lang) merged = merged.filter((book) => bookMatchesLanguage(book, lang));

  if (hasCover) merged = merged.filter((book) => book.cover);
  if (free) merged = merged.filter((book) => book.availability?.status === "free");
  if (preview) merged = merged.filter((book) => ["free", "preview"].includes(book.availability?.status));
  if (sort === "title") merged.sort((a, b) => a.title.localeCompare(b.title, lang?.code || undefined));

  return {
    books: merged,
    total: Math.max(ol.numFound || 0, google.total || 0, gutenberg.count || 0, merged.length),
    page,
    pageSize,
  };
}

export async function getFreeBooks({ language = "", page = 1 } = {}) {
  const lang = language ? getLanguage(language) : null;
  const pageSize = 32;

  const gutendexPromise = searchGutendex({
    page,
    language: lang?.code,
    sort: "popular",
    copyright: false,
    timeout: 8000,
  }).catch(() => ({ results: [], count: 0 }));

  const olPromise = searchOpenLibrary({
    q: "",
    page,
    limit: pageSize,
    language: lang?.code || "",
    sort: "popularity",
    hasFulltext: true,
  }).catch(() => ({ docs: [], numFound: 0 }));

  const extraSearchPromise =
    lang && lang.code !== "en" && page === 1
      ? searchGutendex({
          q: lang.native || lang.name,
          copyright: false,
          timeout: 8000,
        }).catch(() => ({ results: [], count: 0 }))
      : Promise.resolve({ results: [], count: 0 });

  const [gutenberg, ol, extra] = await Promise.all([gutendexPromise, olPromise, extraSearchPromise]);

  let books = deduplicateBooks(
    [
      ...(gutenberg.results || []).map(normalizeGutendexBook),
      ...(extra.results || []).map(normalizeGutendexBook),
      ...(ol.docs || []).map(normalizeOpenLibraryDoc),
    ].filter(Boolean)
  );

  if (lang) books = books.filter((book) => bookMatchesLanguage(book, lang));
  books = books.filter(
    (book) =>
      ["free", "preview"].includes(book.availability?.status) ||
      book.hasFulltext ||
      book.archiveId ||
      book.sources?.internetArchive
  );

  books.sort((a, b) => {
    const rank = (book) => (book.availability?.status === "free" ? 2 : book.availability?.status === "preview" ? 1 : 0);
    return rank(b) - rank(a) || (b.ratings?.count || 0) - (a.ratings?.count || 0);
  });

  return {
    books,
    count: Math.max(gutenberg.count || 0, extra.count || 0, ol.numFound || 0, books.length),
    page,
    pageSize,
  };
}

async function searchLanguageGoogleBooks({ query, lang, page, browsing, sort, preview }) {
  const orderBy = sort === "newest" ? "newest" : "relevance";
  const filter = preview ? "partial" : undefined;
  const language = lang?.code || "";
  const extraQueries = browsing && page === 1 ? lang?.catalogQueries || [] : [];
  const queries = extraQueries.length ? [query, ...extraQueries] : [query];

  const results = await Promise.all(
    queries.map((term, index) =>
      searchGoogleBooks({
        q: term,
        page: index === 0 ? page : 1,
        limit: browsing ? 40 : 20,
        language,
        orderBy,
        filter,
      }).catch(() => ({ items: [], total: 0 }))
    )
  );

  return {
    items: results.flatMap((result) => result.items || []),
    total: Math.max(...results.map((result) => result.total || 0), 0),
  };
}

export async function getTrendingBooks() {
  const [works, google] = await Promise.all([
    getOpenLibraryTrending("now").catch(() => []),
    searchGoogleBooks({ q: "subject:fiction", limit: 12, orderBy: "newest" }).catch(() => ({ items: [] })),
  ]);
  const books = [
    ...(works || []).map(normalizeOpenLibraryDoc),
    ...(google.items || []).map(normalizeGoogleBook),
  ].filter(Boolean);
  const merged = deduplicateBooks(books);
  if (merged.length) return merged.slice(0, 16);
  const fallback = await searchOpenLibrary({ q: "*", sort: "popularity", limit: 16 });
  return fallback.docs.map(normalizeOpenLibraryDoc).filter(Boolean);
}

const HERO_BOOKS = [
  {
    id: "OL82563W",
    title: "Harry Potter and the Philosopher's Stone",
    authors: [{ id: "OL23919A", name: "J.K. Rowling" }],
    cover: "https://books.google.com/books/publisher/content/images/frontcover/5iTebBW-w7QC?fife=w400",
    sources: { googleBooks: "5iTebBW-w7QC" },
  },
  {
    id: "OL27448W",
    title: "The Hobbit",
    authors: [{ id: "OL26320A", name: "J.R.R. Tolkien" }],
    cover: "https://covers.openlibrary.org/b/isbn/9780618260300-L.jpg?default=false",
  },
  {
    id: "OL1168007W",
    title: "Pride and Prejudice",
    authors: [{ id: "OL21594A", name: "Jane Austen" }],
    cover: "https://books.google.com/books/publisher/content/images/frontcover/s1gVAAAAYAAJ?fife=w400",
    sources: { googleBooks: "s1gVAAAAYAAJ" },
  },
  {
    id: "gb-FzVjBgAAQBAJ",
    title: "The Alchemist",
    authors: [{ id: "OL234664A", name: "Paulo Coelho" }],
    cover: "https://books.google.com/books/publisher/content/images/frontcover/FzVjBgAAQBAJ?fife=w400",
    sources: { googleBooks: "FzVjBgAAQBAJ" },
  },
  {
    id: "OL3140822W",
    title: "To Kill a Mockingbird",
    authors: [{ id: "OL498120A", name: "Harper Lee" }],
    cover: "https://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=2&source=gbs_api",
    sources: { googleBooks: "PGR2AwAAQBAJ" },
  },
  {
    id: "OL82586W",
    title: "One Hundred Years of Solitude",
    authors: [{ id: "OL455455A", name: "Gabriel García Márquez" }],
    cover: "https://covers.openlibrary.org/b/id/15185412-L.jpg?default=false",
  },
];

export async function getHeroFeaturedBooks() {
  return HERO_BOOKS.map((book) => ({
    ...book,
    covers: [book.cover],
  }));
}

export async function getSubjectBooks(subject, { limit = 16, offset = 0 } = {}) {
  const [data, google] = await Promise.all([
    getOpenLibrarySubject(subject, { limit, offset }),
    searchGoogleBooks({ q: `subject:${subject.replace(/_/g, " ")}`, limit }).catch(() => ({ items: [] })),
  ]);
  const works = data?.works || [];
  const books = deduplicateBooks([
    ...works.map(normalizeOpenLibraryDoc),
    ...(google.items || []).map(normalizeGoogleBook),
  ]).filter(Boolean);

  return {
    name: data?.name || subject,
    books,
    workCount: data?.work_count || books.length,
    subjectType: data?.subject_type || "subject",
    related: (Array.isArray(data?.subjects)
      ? data.subjects.map((item) => item.name || item.key || item)
      : Object.keys(data?.subjects || {})
    )
      .filter(Boolean)
      .slice(0, 8),
    authors: (data?.authors || []).slice(0, 8).map((item) => ({
      name: item.name || item.key,
      count: item.count,
    })),
  };
}

export async function getRecentBooks() {
  const year = new Date().getFullYear();
  const [ol, google] = await Promise.all([
    searchOpenLibrary({
      q: `first_publish_year:[${year - 1} TO ${year}]`,
      sort: "newest",
      limit: 16,
    }),
    searchGoogleBooks({ q: "subject:literature", limit: 12, orderBy: "newest" }),
  ]);
  return deduplicateBooks([
    ...ol.docs.map(normalizeOpenLibraryDoc),
    ...(google.items || []).map(normalizeGoogleBook),
  ]).filter(Boolean).slice(0, 16);
}

export async function getClassicBooks() {
  const data = await getSubjectBooks("classics", { limit: 12 });
  return data.books;
}

export async function getSimilarBooks(book) {
  const subject = book?.subjects?.[0];
  const language = book?.languages?.[0];
  if (subject) {
    const data = await getSubjectBooks(subject, { limit: 10 });
    const similar = data.books.filter((item) => item.id !== book.id).slice(0, 8);
    if (similar.length) return similar;
  }
  if (book?.title) {
    const google = await searchGoogleBooks({ q: book.title, limit: 8, language });
    return (google.items || [])
      .map(normalizeGoogleBook)
      .filter((item) => item && item.id !== book.id)
      .slice(0, 8);
  }
  return [];
}

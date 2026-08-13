import { SITE } from "@/lib/utils/categories";
import { joinNames, truncate } from "@/lib/utils/format";
import { languageName } from "@/lib/utils/languages";

export function bookJsonLd(book) {
  if (!book) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    alternateName: book.subtitle || undefined,
    author: book.authors?.map((author) => ({
      "@type": "Person",
      name: author.name,
      url: author.id ? `${SITE.url}/author/${author.id}` : undefined,
    })),
    isbn: book.isbn13 || book.isbn10 || undefined,
    image: book.cover || undefined,
    datePublished: book.firstPublishedYear ? String(book.firstPublishedYear) : undefined,
    inLanguage: book.languages?.[0] || undefined,
    numberOfPages: book.pages || undefined,
    publisher: book.publisher ? { "@type": "Organization", name: book.publisher } : undefined,
    aggregateRating:
      book.ratings?.count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: book.ratings.average,
            ratingCount: book.ratings.count,
            bestRating: 5,
          }
        : undefined,
    description: truncate(book.description, 300) || undefined,
  };
}

export function bookMetadata(book) {
  const authors = joinNames(book.authors);
  const title = `${book.title}${authors ? ` by ${authors}` : ""} | ${SITE.name}`;
  const description =
    truncate(book.description, 160) ||
    `Discover ${book.title}${authors ? ` by ${authors}` : ""} on ${SITE.name}.`;
  return {
    title,
    description,
    openGraph: {
      title: book.title,
      description,
      type: "book",
      images: book.cover ? [{ url: book.cover }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description,
      images: book.cover ? [book.cover] : [],
    },
  };
}

export function authorMetadata(author) {
  const title = `${author.name} | ${SITE.name}`;
  const description = truncate(author.bio, 160) || `Explore books by ${author.name} on ${SITE.name}.`;
  return {
    title,
    description,
    openGraph: { title, description, images: author.photo ? [{ url: author.photo }] : [] },
    twitter: { card: "summary", title, description, images: author.photo ? [author.photo] : [] },
  };
}

export function subjectMetadata(name, description) {
  const title = `${name} books | ${SITE.name}`;
  const desc = description || `Browse ${name} books from libraries and open collections worldwide.`;
  return { title, description: desc, openGraph: { title, description: desc } };
}

export function languageMetadata(code) {
  const name = languageName(code);
  const title = `Books in ${name} | ${SITE.name}`;
  const description = `Discover books, editions and free literature in ${name}.`;
  return { title, description, openGraph: { title, description } };
}

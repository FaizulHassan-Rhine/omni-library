import { Suspense } from "react";
import Link from "next/link";
import { searchBooks } from "@/lib/books/searchBooks";
import { searchAuthors } from "@/lib/books/getAuthor";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { MobileFilterDrawer } from "@/components/search/MobileFilterDrawer";
import { BookGrid } from "@/components/books/BookGrid";
import { AuthorCard } from "@/components/authors/AuthorCard";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import { formatNumber } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search",
  description: "Search books, authors, ISBNs, subjects and languages across open library collections.",
};

function hrefForPage(params, page) {
  const next = new URLSearchParams(params);
  next.set("page", String(page));
  return `/search?${next.toString()}`;
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "";
  const page = Math.max(1, Number(params.page) || 1);
  const type = params.type || "book";
  const filters = {
    q,
    page,
    type,
    language: params.language || "",
    subject: params.subject || "",
    sort: params.sort || "relevance",
    free: params.free === "1",
    preview: params.preview === "1",
    hasCover: params.hasCover === "1",
    yearMin: params.yearMin || "",
    yearMax: params.yearMax || "",
  };

  let books = [];
  let authors = [];
  let total = 0;

  if (type === "author" && q) {
    authors = await searchAuthors(q, 20).catch(() => []);
    total = authors.length;
  } else {
    const result = await searchBooks(filters).catch(() => ({ books: [], total: 0 }));
    books = result.books;
    total = result.total;
  }

  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, value]) => value))
  ).toString();

  return (
    <Container className="py-10 sm:py-14">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">Search the catalog</p>
      <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {q ? `Results for “${q}”` : "Search books from around the world"}
      </h1>
      <div className="mt-6 max-w-3xl">
        <GlobalSearch variant="hero" key={q} initialQuery={q} />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-foreground-secondary">
          {total ? `${formatNumber(total)} records` : "No matching records yet"}
        </p>
        <Suspense>
          <MobileFilterDrawer />
        </Suspense>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        <Suspense>
          <FilterSidebar className="hidden lg:block" />
        </Suspense>
        <div>
          {type === "author" ? (
            authors.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {authors.map((author) => (
                  <AuthorCard key={author.id} author={author} />
                ))}
              </div>
            ) : (
              <EmptyState title="No authors found" description="Try a different name, or search by book title instead." />
            )
          ) : books.length ? (
            <>
              <BookGrid books={books} />
              <Pagination page={page} total={total} hrefForPage={(nextPage) => hrefForPage(queryString, nextPage)} />
            </>
          ) : (
            <EmptyState
              title="No books matched this search"
              action={
                <Link href="/" className="text-sm font-medium text-accent">
                  Browse the homepage
                </Link>
              }
            />
          )}
        </div>
      </div>
    </Container>
  );
}

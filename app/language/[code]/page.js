import { searchBooks } from "@/lib/books/searchBooks";
import { getLanguage } from "@/lib/utils/languages";
import { BookGrid } from "@/components/books/BookGrid";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { languageMetadata } from "@/lib/seo/metadata";
import { formatNumber } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { code } = await params;
  return languageMetadata(code);
}

export default async function LanguagePage({ params, searchParams }) {
  const { code } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const sort = query.sort || "relevance";
  const language = getLanguage(code);
  const q = query.q || "";
  const result = await searchBooks({
    q,
    language: language.code,
    page,
    sort,
  }).catch(() => ({ books: [], total: 0, pageSize: 40 }));

  return (
    <Container className="py-10 sm:py-14">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">Language</p>
      <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-foreground">Books in {language.name}</h1>
      <p className="mt-3 max-w-2xl text-foreground-secondary">
        Browse thousands of titles in {language.native}
        {language.code === "bn"
          ? " from Bangladesh and Indian Bangla literature, including novels, poetry, stories and translations."
          : ", including previews from Google Books and open library collections."}
      </p>
      <div className="mt-6 max-w-2xl">
        <GlobalSearch extraParams={{ language: language.code }} initialQuery={q} />
      </div>
      <p className="mt-3 text-sm text-foreground-muted">
        {result.total
          ? `${formatNumber(result.total)} books in ${language.name}. Search in ${language.native} to narrow the list, then open Read where a copy exists.`
          : `Search in ${language.native} for the widest results, then open Read to preview or read where a copy exists.`}
      </p>
      <div className="mt-8">
        {result.books.length ? (
          <>
            <BookGrid books={result.books} />
            <Pagination
              page={page}
              total={result.total}
              pageSize={result.pageSize || 40}
              hrefForPage={(next) =>
                `/language/${code}?sort=${sort}&page=${next}${q ? `&q=${encodeURIComponent(q)}` : ""}`
              }
            />
          </>
        ) : (
          <EmptyState title={`No ${language.name} books were returned`} />
        )}
      </div>
    </Container>
  );
}

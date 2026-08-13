import { getFreeBooks } from "@/lib/books/searchBooks";
import { BookGrid } from "@/components/books/BookGrid";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import { getLanguage, LANGUAGES } from "@/lib/utils/languages";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export const maxDuration = 30;

export const metadata = {
  title: "Free Books",
  description: "Read public-domain books from Project Gutenberg in a calm, distraction-free reader.",
};

export default async function FreeBooksPage({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const language = params.language || "";
  const lang = language ? getLanguage(language) : null;
  const data = await getFreeBooks({ language, page }).catch(() => ({ books: [], count: 0, pageSize: 32 }));
  const books = data.books || [];

  return (
    <Container className="py-10 sm:py-14">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">Public domain</p>
      <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-foreground">Free to read</h1>
      <p className="mt-3 max-w-2xl text-foreground-secondary">
        Complete books from Project Gutenberg, Open Library, and Internet Archive. Open any title in the Omni Library reader.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/free-books"
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors",
            !language ? "border-accent bg-accent text-white" : "border-border hover:border-accent"
          )}
        >
          All languages
        </Link>
        {LANGUAGES.slice(0, 8).map((item) => (
          <Link
            key={item.code}
            href={`/free-books?language=${item.code}`}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              language === item.code ? "border-accent bg-accent text-white" : "border-border hover:border-accent"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="mt-10">
        {books.length ? (
          <>
            <BookGrid books={books} />
            <Pagination
              page={page}
              total={data.count || books.length}
              pageSize={data.pageSize || 32}
              hrefForPage={(next) => `/free-books?page=${next}${language ? `&language=${language}` : ""}`}
            />
          </>
        ) : (
          <EmptyState
            title={lang ? `No free ${lang.name} books found` : "Free books could not be loaded"}
            description={
              lang
                ? `We could not find readable public-domain ${lang.name} titles right now. Try another language, or browse the full ${lang.name} catalog.`
                : "Try another search, or browse categories and languages."
            }
            action={
              lang ? (
                <Link href={`/language/${lang.code}`} className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">
                  Browse {lang.name} books
                </Link>
              ) : null
            }
          />
        )}
      </div>
    </Container>
  );
}

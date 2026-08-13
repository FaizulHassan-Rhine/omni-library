import { getTrendingBooks, getClassicBooks, getRecentBooks, getSubjectBooks, getFreeBooks } from "@/lib/books/searchBooks";
import { getFeaturedAuthors } from "@/lib/books/getAuthor";
import { CATEGORIES } from "@/lib/utils/categories";
import { LANGUAGES } from "@/lib/utils/languages";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { LanguageCard } from "@/components/ui/LanguageCard";
import { BookRow } from "@/components/books/BookRow";
import { AuthorCard } from "@/components/authors/AuthorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";

export async function TrendingSection() {
  const books = await getTrendingBooks().catch(() => []);
  return (
    <section>
      <SectionHeader
        eyebrow="Now reading"
        title="Trending books"
        description="Titles gaining attention across open catalogs and libraries."
        href="/search?sort=popularity"
      />
      {books.length ? <BookRow books={books} /> : <EmptyState title="Trending titles are unavailable right now" />}
    </section>
  );
}

export function CategoriesSection() {
  return (
    <section>
      <SectionHeader eyebrow="Browse" title="Explore categories" href="/categories" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}

export async function AuthorsSection() {
  const authors = await getFeaturedAuthors().catch(() => []);
  return (
    <section>
      <SectionHeader eyebrow="Voices" title="Popular authors" href="/authors" />
      {authors.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      ) : (
        <EmptyState title="Author highlights are unavailable right now" />
      )}
    </section>
  );
}

export async function FreeBooksSection() {
  const data = await getFreeBooks({ page: 1 }).catch(() => ({ books: [] }));
  const books = (data.books || []).slice(0, 12);
  return (
    <section>
      <SectionHeader
        eyebrow="Public domain"
        title="Free to read"
        description="Complete books ready to open in the Omni Library reader — legally available and free."
        href="/free-books"
        actionLabel="Browse free books"
      />
      {books.length ? <BookRow books={books} /> : <EmptyState title="Free books could not be loaded" />}
    </section>
  );
}

export function LanguagesSection() {
  return (
    <section>
      <SectionHeader eyebrow="Worldwide" title="Explore by language" href="/languages" />
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {LANGUAGES.slice(0, 16).map((language) => (
          <LanguageCard key={language.code} language={language} />
        ))}
      </div>
    </section>
  );
}

export async function ClassicsSection() {
  const books = await getClassicBooks().catch(() => []);
  return (
    <section className="rounded-[24px] border border-border bg-card px-4 py-8 sm:px-8">
      <SectionHeader
        eyebrow="Editorial"
        title="Timeless classics"
        description="Works that continue to travel across languages, editions and centuries."
        href="/subject/classics"
      />
      {books.length ? <BookRow books={books} className="mx-0 px-0" /> : <EmptyState title="Classics are unavailable right now" />}
    </section>
  );
}

export async function RecentSection() {
  const [recent, discovered] = await Promise.all([
    getRecentBooks().catch(() => []),
    getSubjectBooks("literature", { limit: 12 }).then((data) => data.books).catch(() => []),
  ]);
  return (
    <div className="grid gap-12 lg:grid-cols-1">
      <section>
        <SectionHeader title="Recently published" href="/search?sort=newest" />
        {recent.length ? <BookRow books={recent} /> : <EmptyState title="New titles could not be loaded" />}
      </section>
      <section>
        <SectionHeader title="Recently discovered" href="/search?q=literature" />
        {discovered.length ? <BookRow books={discovered} /> : null}
      </section>
    </div>
  );
}

export function HomeSectionsFallback() {
  return (
    <Container className="space-y-6 py-10">
      <div className="h-8 w-48 animate-pulse rounded bg-background-secondary" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-64 w-40 shrink-0 animate-pulse rounded-2xl bg-background-secondary" />
        ))}
      </div>
    </Container>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CATEGORIES, SITE } from "@/lib/utils/categories";
import { LANGUAGES } from "@/lib/utils/languages";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background-secondary">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl text-foreground">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-foreground-secondary">
            A calm place to discover books, editions, languages and freely available literature from open libraries around the world.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
            <li><Link href="/" className="hover:text-accent">Discover</Link></li>
            <li><Link href="/search" className="hover:text-accent">Search</Link></li>
            <li><Link href="/free-books" className="hover:text-accent">Free Books</Link></li>
            <li><Link href="/saved" className="hover:text-accent">Saved Books</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Categories</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
            {CATEGORIES.slice(0, 6).map((item) => (
              <li key={item.slug}>
                <Link href={`/subject/${item.slug}`} className="hover:text-accent">{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Languages</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
            {LANGUAGES.slice(0, 6).map((item) => (
              <li key={item.code}>
                <Link href={`/language/${item.code}`} className="hover:text-accent">{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-5 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Catalog data from Open Library, Google Books, Project Gutenberg and the Internet Archive.</p>
          <p>Built for readers, not for noise.</p>
        </Container>
      </div>
    </footer>
  );
}

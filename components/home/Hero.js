import { Suspense } from "react";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Container } from "@/components/ui/Container";
import { HeroCoverStack, HeroCoverFallback } from "@/components/home/HeroCoverStack";
import { getHeroFeaturedBooks } from "@/lib/books/searchBooks";

async function HeroCovers() {
  const books = await getHeroFeaturedBooks().catch(() => []);
  return <HeroCoverStack books={books} />;
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-accent-soft/60" aria-hidden />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-8">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">Explore the world&apos;s books</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            Find your next
            <br />
            <span className="text-gradient">great read.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-foreground-secondary sm:text-lg">
            Search millions of books, authors, editions, languages, classics and freely available literature from libraries and open collections around the world.
          </p>
          <div className="mt-8 max-w-3xl">
            <GlobalSearch variant="hero" />
          </div>
        </div>
        <Suspense fallback={<HeroCoverFallback />}>
          <HeroCovers />
        </Suspense>
      </Container>
    </section>
  );
}

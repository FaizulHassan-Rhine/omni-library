import { getFeaturedAuthors, searchAuthors } from "@/lib/books/getAuthor";
import { AuthorCard } from "@/components/authors/AuthorCard";
import { Container } from "@/components/ui/Container";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export const metadata = {
  title: "Authors",
  description: "Discover authors, lifespans and works indexed from open library catalogs.",
};

export default async function AuthorsPage({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "";
  const authors = q ? await searchAuthors(q, 24).catch(() => []) : await getFeaturedAuthors().catch(() => []);

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground">Authors</h1>
      <p className="mt-3 max-w-2xl text-foreground-secondary">Search writers from every language and century, then follow their complete works.</p>
      <div className="mt-6 max-w-xl">
        <GlobalSearch initialQuery={q} />
      </div>
      <p className="mt-4 text-sm text-foreground-muted">Use the main search and choose the Author filter for precise name lookup.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {authors.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}
      </div>
    </Container>
  );
}

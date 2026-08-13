import { notFound } from "next/navigation";
import { getAuthorById } from "@/lib/books/getAuthor";
import { BookGrid } from "@/components/books/BookGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BookCover } from "@/components/books/BookCover";
import { authorMetadata } from "@/lib/seo/metadata";
import { formatNumber } from "@/lib/utils/format";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getAuthorById(id).catch(() => null);
  if (!data?.author) return { title: "Author not found" };
  return authorMetadata(data.author);
}

export default async function AuthorPage({ params }) {
  const { id } = await params;
  const data = await getAuthorById(id).catch(() => null);
  if (!data?.author) notFound();
  const { author, works, stats } = data;
  const lifespan = [author.birthDate, author.deathDate].filter(Boolean).join(" – ");
  const popular = [...works].sort((a, b) => (b.editionCount || 0) - (a.editionCount || 0)).slice(0, 8);

  return (
    <Container className="py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[200px_1fr] lg:gap-12">
        <div className="overflow-hidden rounded-[20px] border border-border bg-card">
          <BookCover src={author.photo} title={author.name} className="aspect-square rounded-none" sizes="200px" />
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">Author</p>
          <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-foreground">{author.name}</h1>
          {lifespan ? <p className="mt-2 text-foreground-secondary">{lifespan}</p> : null}
          {author.bio ? <p className="mt-5 max-w-3xl text-base leading-8 text-foreground-secondary">{author.bio}</p> : null}
          <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <dt className="text-xs text-foreground-muted">Works</dt>
              <dd className="mt-1 font-sans text-2xl font-semibold tracking-tight">{formatNumber(stats.works)}</dd>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <dt className="text-xs text-foreground-muted">Editions</dt>
              <dd className="mt-1 font-sans text-2xl font-semibold tracking-tight">{formatNumber(stats.editions)}</dd>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <dt className="text-xs text-foreground-muted">Languages</dt>
              <dd className="mt-1 font-sans text-2xl font-semibold tracking-tight">{stats.languages || "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      {popular.length ? (
        <section className="mt-14">
          <SectionHeader title="Popular works" />
          <BookGrid books={popular} />
        </section>
      ) : null}

      <section className="mt-14">
        <SectionHeader title="Complete works" />
        {works.length ? <BookGrid books={works} /> : <p className="text-foreground-secondary">No works were returned for this author.</p>}
      </section>

      {author.subjects?.length ? (
        <section className="mt-14">
          <SectionHeader title="Subjects" />
          <div className="flex flex-wrap gap-2">
            {author.subjects.map((subject) => (
              <a
                key={subject}
                href={`/subject/${encodeURIComponent(String(subject).toLowerCase().replace(/\s+/g, "-"))}`}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground-secondary hover:border-accent hover:text-accent"
              >
                {subject}
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}

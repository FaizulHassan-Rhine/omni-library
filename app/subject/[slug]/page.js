import { notFound } from "next/navigation";
import { getSubjectBooks } from "@/lib/books/searchBooks";
import { getCategory } from "@/lib/utils/categories";
import { BookGrid } from "@/components/books/BookGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { subjectMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  const name = category?.name || slug.replace(/-/g, " ");
  return subjectMetadata(name, category?.description);
}

export default async function SubjectPage({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  const query = category?.query || slug.replace(/-/g, "_");
  const data = await getSubjectBooks(query, { limit: 24 }).catch(() => null);
  if (!data) notFound();

  const title = category?.name || data.name || slug.replace(/-/g, " ");

  return (
    <Container className="py-10 sm:py-14">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">Subject</p>
      <h1 className="mt-3 font-sans text-4xl font-semibold capitalize tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 max-w-2xl text-foreground-secondary">
        {category?.description || `Books, editions and authors connected to ${title}.`}
      </p>

      <section className="mt-10">
        {data.books.length ? <BookGrid books={data.books} /> : <EmptyState title="No books found for this subject" />}
      </section>

      {data.authors?.length ? (
        <section className="mt-14">
          <SectionHeader title="Popular authors for this subject" />
          <div className="flex flex-wrap gap-2">
            {data.authors.map((author) => (
              <span key={author.name} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground-secondary">
                {author.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {data.related?.length ? (
        <section className="mt-10">
          <SectionHeader title="Related subjects" />
          <div className="flex flex-wrap gap-2">
            {data.related.map((subject) => (
              <a
                key={subject}
                href={`/subject/${encodeURIComponent(String(subject).toLowerCase().replace(/\s+/g, "-"))}`}
                className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
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

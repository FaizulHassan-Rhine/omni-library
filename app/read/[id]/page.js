import { notFound } from "next/navigation";
import { getReadableBook } from "@/lib/books/getReadSource";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { EmbedReader } from "@/components/reader/EmbedReader";
import { ReaderUnavailable } from "@/components/reader/ReaderUnavailable";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getReadableBook(id).catch(() => null);
  if (!data?.book) return { title: "Reader" };
  return { title: `Reading ${data.book.title}`, robots: { index: false } };
}

export default async function ReadPage({ params }) {
  const { id } = await params;
  const data = await getReadableBook(id).catch(() => null);
  if (!data?.book) notFound();

  if (data.mode === "text") {
    return <ReaderShell book={data.book} chapters={data.chapters} />;
  }

  if (data.mode === "embed") {
    return (
      <EmbedReader
        book={data.book}
        embedUrl={data.embedUrl}
        externalUrl={data.externalUrl}
        provider={data.provider}
      />
    );
  }

  return (
    <div className="min-h-screen py-16">
      <Container>
        <ReaderUnavailable book={data.book} links={data.links} />
      </Container>
    </div>
  );
}

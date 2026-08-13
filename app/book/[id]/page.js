import { notFound } from "next/navigation";
import { getBookById } from "@/lib/books/getBook";
import { getSimilarBooks } from "@/lib/books/searchBooks";
import { BookDetailHero } from "@/components/books/BookDetailHero";
import { BookTabs } from "@/components/books/BookTabs";
import { Container } from "@/components/ui/Container";
import { bookJsonLd, bookMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getBookById(id).catch(() => null);
  if (!data?.book) return { title: "Book not found" };
  return bookMetadata(data.book);
}

export default async function BookPage({ params }) {
  const { id } = await params;
  const data = await getBookById(id).catch(() => null);
  if (!data?.book) notFound();

  const similar = await getSimilarBooks(data.book).catch(() => []);
  const jsonLd = bookJsonLd(data.book);

  return (
    <Container className="py-10 sm:py-14">
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <BookDetailHero book={data.book} />
      <BookTabs book={data.book} editions={data.editions} ratings={data.ratings} similar={similar} archive={data.archive} />
    </Container>
  );
}

import { BookGridSkeleton } from "@/components/books/BookSkeleton";
import { Container } from "@/components/ui/Container";

export default function SearchLoading() {
  return (
    <Container className="py-14">
      <div className="mb-8 h-10 w-72 animate-pulse rounded bg-background-secondary" />
      <BookGridSkeleton />
    </Container>
  );
}

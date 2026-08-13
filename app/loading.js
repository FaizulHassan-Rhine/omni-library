import { BookGridSkeleton } from "@/components/books/BookSkeleton";
import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-12">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-background-secondary" />
      <BookGridSkeleton />
    </Container>
  );
}

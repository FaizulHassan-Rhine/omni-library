import { Container } from "@/components/ui/Container";
import { AuthorSkeleton } from "@/components/books/BookSkeleton";

export default function AuthorLoading() {
  return (
    <Container className="py-14">
      <AuthorSkeleton />
    </Container>
  );
}

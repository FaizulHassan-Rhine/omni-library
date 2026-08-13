import { Container } from "@/components/ui/Container";

export default function BookLoading() {
  return (
    <Container className="grid gap-8 py-14 lg:grid-cols-[280px_1fr]">
      <div className="aspect-[2/3] animate-pulse rounded-2xl bg-background-secondary" />
      <div className="space-y-4">
        <div className="h-10 w-2/3 animate-pulse rounded bg-background-secondary" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-background-secondary" />
        <div className="h-24 w-full animate-pulse rounded bg-background-secondary" />
      </div>
    </Container>
  );
}

"use client";

import { ErrorState } from "@/components/ui/ErrorState";
import { Container } from "@/components/ui/Container";

export default function BookError({ reset }) {
  return (
    <Container className="py-20">
      <ErrorState title="This book could not be loaded" onRetry={reset} />
    </Container>
  );
}

"use client";

import { ErrorState } from "@/components/ui/ErrorState";
import { Container } from "@/components/ui/Container";

export default function Error({ reset }) {
  return (
    <Container className="py-20">
      <ErrorState onRetry={reset} />
    </Container>
  );
}

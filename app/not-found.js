import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">404</p>
      <h1 className="mt-4 font-sans text-4xl font-semibold tracking-tight text-foreground">This page is not on the shelf.</h1>
      <p className="mx-auto mt-3 max-w-md text-foreground-secondary">
        The book, author or collection you were looking for could not be found.
      </p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
        Return home
      </Link>
    </Container>
  );
}

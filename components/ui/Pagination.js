import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Pagination({ page, total, pageSize = 20, hrefForPage }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const prev = page > 1 ? hrefForPage(page - 1) : null;
  const next = page < pageCount ? hrefForPage(page + 1) : null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
      <Link
        href={prev || "#"}
        aria-disabled={!prev}
        className={cn(
          "inline-flex h-10 items-center gap-1 rounded-full border border-border px-4 text-sm transition-colors",
          prev ? "hover:border-accent hover:text-accent" : "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Link>
      <span className="text-sm text-foreground-secondary">
        Page {page} of {pageCount}
      </span>
      <Link
        href={next || "#"}
        aria-disabled={!next}
        className={cn(
          "inline-flex h-10 items-center gap-1 rounded-full border border-border px-4 text-sm transition-colors",
          next ? "hover:border-accent hover:text-accent" : "pointer-events-none opacity-40"
        )}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

import Link from "next/link";
import { BookCover } from "@/components/books/BookCover";
import { BookAvailabilityBadge } from "@/components/books/BookAvailabilityBadge";
import { RatingDisplay } from "@/components/books/RatingDisplay";
import { SaveBookButton } from "@/components/books/SaveBookButton";
import { getReadHref, canOpenReader } from "@/lib/books/bookAvailability";
import { joinNames } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function BookCard({ book, className }) {
  if (!book) return null;
  const authors = joinNames(book.authors);
  const href = `/book/${encodeURIComponent(book.id)}`;
  const readHref = canOpenReader(book) ? getReadHref(book) : "";
  const readLabel = book.availability?.status === "free" ? "Read Free" : "Read";

  return (
    <article className={cn("group relative flex h-full w-[138px] shrink-0 flex-col sm:w-[160px] md:w-[176px]", className)}>
      <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <SaveBookButton book={book} />
      </div>
      <Link href={href} className="flex min-h-0 flex-1 flex-col">
        <BookCover book={book} title={book.title} author={authors} />
        <h3 className="mt-3 line-clamp-2 min-h-10 font-medium leading-5 text-foreground">{book.title}</h3>
        <p className="mt-1 line-clamp-1 min-h-5 text-sm text-foreground-secondary">{authors || "\u00a0"}</p>
        <div className="mt-2 flex min-h-5 flex-wrap items-center gap-2">
          {book.firstPublishedYear ? (
            <span className="text-xs text-foreground-muted">{book.firstPublishedYear}</span>
          ) : (
            <span className="text-xs text-transparent">0000</span>
          )}
          <RatingDisplay average={book.ratings?.average} count={book.ratings?.count} className="text-xs" />
        </div>
      </Link>
      <div className="mt-auto pt-2">
        {readHref ? (
          <Link
            href={readHref}
            className="inline-flex h-6 items-center rounded-full bg-success/12 px-2.5 text-[11px] font-medium text-success hover:bg-success/20"
          >
            {readLabel}
          </Link>
        ) : (
          <BookAvailabilityBadge availability={book.availability} />
        )}
      </div>
    </article>
  );
}

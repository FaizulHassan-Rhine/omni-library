import Link from "next/link";
import { BookOpen, Eye } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { BookAvailabilityBadge } from "@/components/books/BookAvailabilityBadge";
import { RatingDisplay } from "@/components/books/RatingDisplay";
import { SaveBookButton } from "@/components/books/SaveBookButton";
import { ShareButton } from "@/components/books/ShareButton";
import { getReadHref } from "@/lib/books/bookAvailability";
import { joinNames } from "@/lib/utils/format";
import { languageName } from "@/lib/utils/languages";

export function BookDetailHero({ book }) {
  const authors = joinNames(book.authors);
  const readHref = getReadHref(book);
  const isFree = book.availability?.status === "free";
  const canPreview = book.previewUrl || book.availability?.previewUrl;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
      <div className="mx-auto w-full max-w-[260px] lg:mx-0">
        <BookCover
          book={book}
          title={book.title}
          author={authors}
          priority
          sizes="280px"
          className="shadow-soft"
        />
      </div>
      <div>
        <BookAvailabilityBadge availability={book.availability} />
        <h1 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">{book.title}</h1>
        {book.subtitle ? <p className="mt-2 font-sans text-lg text-foreground-secondary">{book.subtitle}</p> : null}
        <p className="mt-3 text-base text-foreground-secondary">
          {book.authors?.map((author, index) => (
            <span key={author.id || author.name}>
              {author.id ? (
                <Link href={`/author/${author.id}`} className="text-accent hover:text-accent-hover">
                  {author.name}
                </Link>
              ) : (
                author.name
              )}
              {index < book.authors.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <RatingDisplay average={book.ratings?.average} count={book.ratings?.count} />
          {book.firstPublishedYear ? <span className="text-sm text-foreground-secondary">First published {book.firstPublishedYear}</span> : null}
          {book.pages ? <span className="text-sm text-foreground-secondary">{book.pages} pages</span> : null}
          {book.languages?.[0] ? <span className="text-sm text-foreground-secondary">{languageName(book.languages[0])}</span> : null}
          {book.publisher ? <span className="text-sm text-foreground-secondary">{book.publisher}</span> : null}
          {book.editionCount ? <span className="text-sm text-foreground-secondary">{book.editionCount} editions</span> : null}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={readHref}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <BookOpen className="h-4 w-4" />
            {isFree ? "Read Free" : "Read"}
          </Link>
          {canPreview && !isFree ? (
            <a
              href={canPreview}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:border-accent hover:text-accent"
            >
              <Eye className="h-4 w-4" />
              Preview
            </a>
          ) : null}
          <SaveBookButton book={book} variant="button" />
          <ShareButton title={book.title} text={`Discover ${book.title}${authors ? ` by ${authors}` : ""} on Omni Library`} />
        </div>
      </div>
    </div>
  );
}

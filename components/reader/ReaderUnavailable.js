import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export function ReaderUnavailable({ book, links = [] }) {
  const fallbackLinks = [
    ...links,
    book?.sources?.openLibrary
      ? { label: "Open Library", href: `https://openlibrary.org/works/${book.sources.openLibrary}` }
      : null,
    book?.previewUrl ? { label: "Google Books preview", href: book.previewUrl } : null,
    book?.sources?.internetArchive
      ? { label: "Internet Archive", href: `https://archive.org/details/${book.sources.internetArchive}` }
      : null,
  ].filter(Boolean);

  return (
    <EmptyState
      title="Full text is not freely available here"
      description="This title is still under copyright, or the open collections do not have a readable copy yet. Use a library source below if one exists."
      action={
        <div className="flex flex-wrap justify-center gap-3">
          {book?.id ? (
            <Link href={`/book/${encodeURIComponent(book.id)}`} className="rounded-full border border-border px-4 py-2 text-sm hover:border-accent hover:text-accent">
              Back to book
            </Link>
          ) : null}
          {fallbackLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              {item.label}
            </a>
          ))}
        </div>
      }
    />
  );
}

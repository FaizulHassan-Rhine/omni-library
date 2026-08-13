import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export function EmbedReader({ book, embedUrl, externalUrl, provider }) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md">
        <div className="min-w-0">
          <p className="truncate font-sans text-lg font-semibold tracking-tight text-foreground">{book.title}</p>
          <p className="text-xs text-foreground-muted">Reading via {provider}</p>
        </div>
        <div className="flex items-center gap-2">
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs hover:border-accent hover:text-accent"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open source
            </a>
          ) : null}
          <Link
            href={`/book/${encodeURIComponent(book.id)}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs hover:border-accent hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>
      </header>
      <iframe
        title={`${book.title} reader`}
        src={embedUrl}
        className="min-h-0 w-full flex-1 bg-background-secondary"
        allow="fullscreen"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

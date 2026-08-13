"use client";

import { useState } from "react";
import Link from "next/link";
import { BookCover } from "@/components/books/BookCover";
import { BookGrid } from "@/components/books/BookGrid";
import { RatingDisplay } from "@/components/books/RatingDisplay";
import { languageName } from "@/lib/utils/languages";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "editions", label: "Editions" },
  { id: "reviews", label: "Reviews" },
  { id: "subjects", label: "Subjects" },
  { id: "similar", label: "Similar Books" },
  { id: "where", label: "Where to Read" },
];

export function BookTabs({ book, editions = [], ratings, similar = [], archive = [] }) {
  const [tab, setTab] = useState("overview");

  return (
    <div className="mt-12">
      <div className="flex gap-1 overflow-x-auto border-b border-border scrollbar-thin" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-3 text-sm transition-colors",
              tab === item.id
                ? "border-accent font-medium text-foreground"
                : "border-transparent text-foreground-secondary hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="pt-8">
        {tab === "overview" ? (
          <div className="max-w-3xl text-base leading-8 text-foreground-secondary whitespace-pre-line">
            {book.description || "No description is available for this work yet. Editions and catalog records may still help you decide where to start."}
          </div>
        ) : null}

        {tab === "editions" ? (
          editions.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {editions.map((edition) => (
                <article key={edition.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                  <div className="w-16 shrink-0">
                    <BookCover book={edition} title={edition.title} sizes="64px" />
                  </div>
                  <div className="min-w-0 text-sm">
                    <h3 className="font-medium text-foreground">{edition.title}</h3>
                    <p className="mt-1 text-foreground-secondary">
                      {[edition.format, edition.publisher, edition.publishDate || edition.firstPublishedYear, edition.languages?.[0] ? languageName(edition.languages[0]) : ""]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {edition.isbn13 || edition.isbn10 ? (
                      <p className="mt-1 text-foreground-muted">ISBN {edition.isbn13 || edition.isbn10}</p>
                    ) : null}
                    {edition.pages ? <p className="text-foreground-muted">{edition.pages} pages</p> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-foreground-secondary">Edition details are not listed for this record yet.</p>
          )
        ) : null}

        {tab === "reviews" ? (
          <div className="max-w-xl">
            <RatingDisplay average={book.ratings?.average} count={book.ratings?.count} />
            {ratings?.counts ? (
              <ul className="mt-6 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <li key={star} className="flex items-center gap-3 text-sm text-foreground-secondary">
                    <span className="w-12">{star} star</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-background-secondary">
                      <div
                        className="h-full rounded-full bg-accent-secondary"
                        style={{
                          width: `${Math.min(100, ((ratings.counts[star] || 0) / Math.max(book.ratings?.count || 1, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-10 text-right">{ratings.counts[star] || 0}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-foreground-secondary">Community ratings are limited for this title.</p>
            )}
          </div>
        ) : null}

        {tab === "subjects" ? (
          book.subjects?.length ? (
            <div className="flex flex-wrap gap-2">
              {book.subjects.map((subject) => (
                <Link
                  key={subject}
                  href={`/subject/${encodeURIComponent(subject.toLowerCase().replace(/\s+/g, "-"))}`}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground-secondary hover:border-accent hover:text-accent"
                >
                  {subject}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-foreground-secondary">No subjects are attached to this work yet.</p>
          )
        ) : null}

        {tab === "similar" ? (
          similar.length ? <BookGrid books={similar} /> : <p className="text-foreground-secondary">Similar titles will appear as more catalog data is linked.</p>
        ) : null}

        {tab === "where" ? (
          <ul className="space-y-3 text-sm">
            <li>
              <Link href={`/read/${encodeURIComponent(book.id)}`} className="text-accent hover:text-accent-hover">
                Read in Omni Library
              </Link>
            </li>
            {book.gutenbergId || book.sources?.gutenberg ? (
              <li>
                <Link href={`/read/${book.gutenbergId || book.sources.gutenberg}`} className="text-accent hover:text-accent-hover">
                  Project Gutenberg text
                </Link>
              </li>
            ) : null}
            {book.sources?.openLibrary ? (
              <li>
                <a href={`https://openlibrary.org/works/${book.sources.openLibrary}`} target="_blank" rel="noreferrer" className="text-accent hover:text-accent-hover">
                  Open Library catalog record
                </a>
              </li>
            ) : null}
            {book.previewUrl ? (
              <li>
                <a href={book.previewUrl} target="_blank" rel="noreferrer" className="text-accent hover:text-accent-hover">
                  Google Books preview
                </a>
              </li>
            ) : null}
            {archive.map((item) => (
              <li key={item.id}>
                <a href={item.url} target="_blank" rel="noreferrer" className="text-accent hover:text-accent-hover">
                  Internet Archive · {item.title || item.id}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

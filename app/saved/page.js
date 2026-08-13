"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container } from "@/components/ui/Container";
import { Dropdown } from "@/components/ui/Dropdown";
import { useSavedBooks } from "@/components/saved/SavedBooksProvider";
import { cn } from "@/lib/utils/cn";

const STATUSES = [
  { id: "all", label: "All" },
  { id: "want", label: "Want to Read" },
  { id: "reading", label: "Reading" },
  { id: "finished", label: "Finished" },
];

export default function SavedPage() {
  const { list, ready, setStatus, remove } = useSavedBooks();
  const [filter, setFilter] = useState("all");

  const books = useMemo(
    () => (filter === "all" ? list : list.filter((book) => book.status === filter)),
    [list, filter]
  );

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground">Saved books</h1>
      <p className="mt-3 max-w-2xl text-foreground-secondary">
        Your shelf lives in this browser for now. Statuses can later move with you to an Omni Library account.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              filter === item.id ? "border-accent bg-accent-soft text-accent" : "border-border text-foreground-secondary"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {!ready ? (
        <div className="mt-10 h-48 animate-pulse rounded-2xl bg-background-secondary" />
      ) : books.length ? (
        <div className="mt-10 space-y-6">
          <BookGrid books={books} />
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {books.map((book) => (
              <li key={book.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <Link href={`/book/${book.id}`} className="font-medium hover:text-accent">
                  {book.title}
                </Link>
                <div className="flex items-center gap-2">
                  <Dropdown
                    size="sm"
                    align="right"
                    ariaLabel="Reading status"
                    value={book.status}
                    onChange={(value) => setStatus(book.id, value)}
                    options={[
                      { value: "want", label: "Want to Read" },
                      { value: "reading", label: "Reading" },
                      { value: "finished", label: "Finished" },
                    ]}
                  />
                  <button type="button" onClick={() => remove(book.id)} className="text-sm text-error">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="Your shelf is empty"
            description="Save books from search, subject pages or the homepage to start a reading list."
            action={
              <Link href="/search" className="text-sm font-medium text-accent">
                Find a book
              </Link>
            }
          />
        </div>
      )}
    </Container>
  );
}

"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSavedBooks } from "@/components/saved/SavedBooksProvider";
import { cn } from "@/lib/utils/cn";

export function SaveBookButton({ book, variant = "icon" }) {
  const { isSaved, save, remove } = useSavedBooks();
  const saved = isSaved(book?.id);

  function toggle() {
    if (!book?.id) return;
    if (saved) remove(book.id);
    else save(book, "want");
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
          saved
            ? "border-accent bg-accent-soft text-accent"
            : "border-border text-foreground hover:border-accent hover:text-accent"
        )}
      >
        {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle();
      }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/90 text-foreground-secondary backdrop-blur-sm transition-colors hover:text-accent",
        saved && "border-accent text-accent"
      )}
      aria-label={saved ? "Remove from saved books" : "Save book"}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </button>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import { cn } from "@/lib/utils/cn";
import { looksLikeIsbn } from "@/lib/utils/format";

export function GlobalSearch({ variant = "nav", initialQuery = "", className, extraParams = {} }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef(null);
  const listId = useId();
  const isHero = variant === "hero";

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return undefined;

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/books/suggestions?q=${encodeURIComponent(q)}`);
        if (!response.ok) return;
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setOpen(true);
        setActive(-1);
      } catch {
        setSuggestions([]);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onPointerDown(event) {
      if (!boxRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function go(q = query) {
    const value = q.trim();
    if (!value) return;
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(extraParams).filter(([, value]) => value))
    );
    params.set("q", value);
    setOpen(false);
    router.push(`/search?${params.toString()}`);
  }

  function onKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (active >= 0 && suggestions[active]) {
        router.push(suggestions[active].href);
        setOpen(false);
      } else {
        go();
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const hint = looksLikeIsbn(query) ? "ISBN" : "Book, author, subject";

  return (
    <div ref={boxRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          go();
        }}
        className={cn(
          "flex items-center gap-3 rounded-full border border-border bg-card transition-colors",
          "focus-within:border-accent",
          isHero ? "px-5 py-3.5 shadow-soft sm:px-6 sm:py-4" : "px-3 py-2"
        )}
      >
        <Search className={cn("shrink-0 text-foreground-muted", isHero ? "h-5 w-5" : "h-4 w-4")} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search in any language, title, author, ISBN..."
          className={cn(
            "w-full border-0 bg-transparent text-foreground shadow-none outline-none ring-0 placeholder:text-foreground-muted focus:border-0 focus:outline-none focus:ring-0",
            isHero ? "text-base sm:text-lg" : "text-sm"
          )}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
        />
        {isHero ? (
          <button
            type="submit"
            className="hidden rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            Search
          </button>
        ) : null}
      </form>
      {isHero ? <p className="mt-3 text-xs text-foreground-muted">বাংলা, English, Español, العربية and more · {hint}</p> : null}
      {open && query.trim().length >= 2 && suggestions.length ? (
        <SearchSuggestions id={listId} suggestions={suggestions} active={active} onSelect={() => setOpen(false)} />
      ) : null}
    </div>
  );
}

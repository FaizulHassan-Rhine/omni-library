"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, UserRound, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useSavedBooks } from "@/components/saved/SavedBooksProvider";
import { SITE } from "@/lib/utils/categories";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/", label: "Discover" },
  { href: "/categories", label: "Categories" },
  { href: "/authors", label: "Authors" },
  { href: "/free-books", label: "Free Books", highlight: true },
  { href: "/languages", label: "Languages" },
];

export function Navbar() {
  const pathname = usePathname();
  const { count } = useSavedBooks();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-border bg-background/80 backdrop-blur-md" : "border-transparent bg-background"
      )}
    >
      <Container className="flex h-16 items-center gap-4 lg:h-[72px]">
        <Link href="/" className="shrink-0 font-serif text-xl tracking-tight text-foreground">
          {SITE.name}
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                link.highlight
                  ? "rounded-full bg-accent px-3 py-1.5 font-semibold text-white hover:bg-accent/90"
                  : pathname === link.href
                    ? "font-medium text-foreground hover:text-accent"
                    : "text-foreground-secondary hover:text-accent"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mx-auto hidden min-w-0 flex-1 justify-center px-4 md:flex lg:max-w-xl">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle compact />
          <Link
            href="/saved"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground-secondary transition-colors hover:text-accent"
            aria-label="Saved books"
          >
            <Bookmark className="h-4 w-4" />
            {count > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-accent-soft text-accent sm:inline-flex" aria-label="Profile">
            <UserRound className="h-4 w-4" />
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </Container>

      <div className="border-t border-border px-4 py-2 md:hidden">
        <GlobalSearch />
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-[rgba(16,21,18,0.45)]" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[min(100%,340px)] border-l border-border bg-background p-5">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-xl">{SITE.name}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-3 text-base",
                    link.highlight
                      ? "bg-accent font-semibold text-white"
                      : "text-foreground hover:bg-background-secondary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/saved" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base text-foreground hover:bg-background-secondary">
                Saved Books
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

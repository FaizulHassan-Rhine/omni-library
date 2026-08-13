"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { joinNames } from "@/lib/utils/format";
import { getReadHref, canOpenReader } from "@/lib/books/bookAvailability";
import { cn } from "@/lib/utils/cn";

const ROTATE_MS = 4200;

function featuredHref(book) {
  return canOpenReader(book) ? getReadHref(book) : `/book/${encodeURIComponent(book.id)}`;
}

function wrapOffset(index, active, length) {
  let offset = (index - active) % length;
  if (offset < 0) offset += length;
  if (offset > Math.floor(length / 2)) offset -= length;
  return offset;
}

function slotStyle(offset) {
  if (offset === 0) {
    return { x: 0, rotate: 0, scale: 1, z: 30, opacity: 1 };
  }
  if (offset === -1) {
    return { x: -58, rotate: -12, scale: 0.82, z: 10, opacity: 1 };
  }
  if (offset === 1) {
    return { x: 58, rotate: 10, scale: 0.82, z: 10, opacity: 1 };
  }
  return { x: offset * 12, rotate: offset * 4, scale: 0.72, z: 0, opacity: 0 };
}

function isFakeCover(image) {
  const width = image?.naturalWidth || 0;
  const height = image?.naturalHeight || 0;
  if (width < 140 || height < 180) return true;
  if (width === 128 && height === 170) return true;
  return false;
}

function HeroImage({ book, priority = false, className, onReject }) {
  return (
    <div className={cn("relative aspect-[2/3] w-full overflow-hidden rounded-[14px] bg-accent-soft", className)}>
      <img
        src={book.cover}
        alt={book.title}
        fetchPriority={priority ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => onReject?.(book)}
        onLoad={(event) => {
          if (isFakeCover(event.currentTarget)) onReject?.(book);
        }}
      />
    </div>
  );
}

export function HeroCoverStack({ books = [] }) {
  const [covers, setCovers] = useState(() => books.filter((book) => book?.cover).slice(0, 6));
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setCovers(books.filter((book) => book?.cover).slice(0, 6));
    setActive(0);
  }, [books]);

  useEffect(() => {
    if (active >= covers.length) setActive(0);
  }, [active, covers.length]);

  useEffect(() => {
    if (covers.length < 2 || paused) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % covers.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [covers.length, paused]);

  function reject(book) {
    const key = book.id || book.cover;
    setCovers((list) => list.filter((item) => (item.id || item.cover) !== key));
  }

  if (!covers.length) return null;

  const featured = covers[active] || covers[0];
  const authors = joinNames(featured.authors);

  return (
    <div
      className="mx-auto w-full max-w-[440px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto h-[340px] w-full sm:h-[400px] lg:h-[460px]" aria-roledescription="carousel" aria-label="Most read books">
        {covers.map((book, index) => {
          const offset = wrapOffset(index, active, covers.length);
          const slot = slotStyle(offset);
          const isCenter = offset === 0;
          const names = joinNames(book.authors);

          return (
            <div
              key={book.id || book.cover || index}
              className="absolute top-4 left-1/2 w-[58%] origin-bottom will-change-transform"
              style={{
                transform: `translateX(-50%) translateX(${slot.x}%) rotate(${slot.rotate}deg) scale(${slot.scale})`,
                zIndex: slot.z,
                opacity: slot.opacity,
                pointerEvents: slot.opacity === 0 ? "none" : "auto",
                transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease",
              }}
            >
              {isCenter ? (
                <Link href={featuredHref(book)} className="group relative block">
                  <div className="relative overflow-hidden rounded-[14px]">
                    <HeroImage
                      book={book}
                      priority={index === 0}
                      className="shadow-[0_22px_48px_rgba(24,32,27,0.22)]"
                      onReject={reject}
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                      Most read
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(24,32,27,0.8)] via-[rgba(24,32,27,0.32)] to-transparent px-4 pt-16 pb-4 text-white">
                      <p className="font-sans text-lg font-semibold leading-6 tracking-tight">{book.title}</p>
                      {names ? <p className="mt-1 line-clamp-1 text-xs opacity-85">{names}</p> : null}
                    </div>
                  </div>
                </Link>
              ) : (
                <button
                  type="button"
                  className="block w-full cursor-pointer"
                  aria-label={`Show ${book.title}`}
                  onClick={() => setActive(index)}
                >
                  <HeroImage book={book} className="shadow-soft" onReject={reject} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-2" role="tablist" aria-label="Featured books">
        {covers.map((book, index) => (
          <button
            key={book.id || book.cover || index}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={book.title}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === active ? "w-6 bg-accent" : "w-1.5 bg-foreground-muted/40 hover:bg-foreground-muted"
            )}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {featured.title}
        {authors ? ` by ${authors}` : ""}
      </p>
    </div>
  );
}

export function HeroCoverFallback({ className }) {
  return (
    <div
      className={cn(
        "mx-auto h-[340px] w-full max-w-[440px] animate-pulse rounded-[20px] bg-background-secondary sm:h-[400px] lg:h-[460px]",
        className
      )}
    />
  );
}

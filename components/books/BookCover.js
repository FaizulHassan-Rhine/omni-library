"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { buildCoverList } from "@/lib/books/covers";

const PALETTES = [
  { bg: "#3f5d4c", spine: "#2c4236", ink: "#f6f1e6", rule: "#d4b07a" },
  { bg: "#3b4a5c", spine: "#2a3542", ink: "#f4efe6", rule: "#b7c4ce" },
  { bg: "#5c4034", spine: "#433025", ink: "#f7f0e4", rule: "#d7b48a" },
  { bg: "#4a3b52", spine: "#352a3c", ink: "#f5efe8", rule: "#c9a66b" },
  { bg: "#3a5150", spine: "#2a3c3b", ink: "#eef4f1", rule: "#8fbfa8" },
  { bg: "#5a3d42", spine: "#412c30", ink: "#f6eee8", rule: "#d4a3a8" },
];

function initials(title = "") {
  return (title.trim()[0] || "B").toUpperCase();
}

function paletteFor(title = "") {
  let hash = 0;
  for (const char of title) hash = (hash * 33 + char.charCodeAt(0)) | 0;
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

function GeneratedCover({ title, author, year }) {
  const palette = paletteFor(title);
  const letter = initials(title);

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-3.5 sm:p-4"
      style={{
        background: `linear-gradient(160deg, ${palette.bg} 0%, ${palette.spine} 100%)`,
        color: palette.ink,
      }}
    >
      <span className="absolute inset-y-0 left-0 w-2.5 opacity-90" style={{ background: palette.spine }} />
      <span
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 46%, transparent 72%)" }}
      />
      <div className="relative pl-2">
        <p className="font-serif text-3xl leading-none opacity-80">{letter}</p>
        <span className="mt-3 block h-px w-8" style={{ background: palette.rule }} />
      </div>
      <div className="relative pl-2">
        <p className="line-clamp-5 font-sans text-[13px] font-semibold leading-4 tracking-tight sm:text-sm sm:leading-5">
          {title || "Untitled"}
        </p>
        {author ? <p className="mt-2 line-clamp-2 text-[10px] leading-4 opacity-80 sm:text-xs">{author}</p> : null}
        <div className="mt-3 flex items-center justify-between gap-2 text-[9px] tracking-[0.16em] uppercase opacity-70">
          <span>Omni Library</span>
          {year ? <span>{year}</span> : null}
        </div>
      </div>
    </div>
  );
}

export function BookCover({
  book,
  src,
  fallbacks = [],
  title,
  author,
  alt,
  className,
  sizes = "(max-width: 640px) 40vw, 180px",
  priority = false,
}) {
  const displayTitle = title || book?.title || "Untitled";
  const displayAuthor = author || "";
  const candidates = useMemo(
    () => buildCoverList(book || {}, [src, ...(fallbacks || [])]),
    [book, src, fallbacks]
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [candidates.join("|")]);

  const current = candidates[index] || "";

  return (
    <div className={cn("relative aspect-[2/3] w-full overflow-hidden rounded-[14px] bg-accent-soft shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]", className)}>
      {current ? (
        <img
          src={current}
          alt={alt || displayTitle || "Book cover"}
          sizes={sizes}
          fetchPriority={priority ? "high" : "auto"}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={() => setIndex((value) => value + 1)}
        />
      ) : (
        <GeneratedCover title={displayTitle} author={displayAuthor} year={book?.firstPublishedYear} />
      )}
    </div>
  );
}

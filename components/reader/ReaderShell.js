"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bookmark, X } from "lucide-react";
import { ReaderControls, READER_CHROME } from "@/components/reader/ReaderControls";
import { ReaderSidebar } from "@/components/reader/ReaderSidebar";
import { Dropdown } from "@/components/ui/Dropdown";
import { cn } from "@/lib/utils/cn";

const WIDTHS = { narrow: "max-w-xl", medium: "max-w-2xl", wide: "max-w-4xl" };

function storageKey(id) {
  return `bookverse:reader:${id}`;
}

export function ReaderShell({ book, chapters }) {
  const frameRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState({
    fontSize: 18,
    lineHeight: 1.8,
    width: "medium",
    serif: true,
    theme: "sepia",
  });
  const [bookmarks, setBookmarks] = useState([]);

  const chapter = chapters[index] || chapters[0];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(storageKey(book.id));
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (Number.isInteger(saved.index)) setIndex(Math.min(saved.index, chapters.length - 1));
        if (saved.settings) setSettings((current) => ({ ...current, ...saved.settings }));
        if (saved.bookmarks) setBookmarks(saved.bookmarks);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [book.id, chapters.length]);

  useEffect(() => {
    localStorage.setItem(
      storageKey(book.id),
      JSON.stringify({ index, settings, bookmarks, updatedAt: Date.now() })
    );
  }, [book.id, index, settings, bookmarks]);

  const onScroll = useCallback((event) => {
    const el = event.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 0);
  }, []);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "ArrowRight") setIndex((value) => Math.min(value + 1, chapters.length - 1));
      if (event.key === "ArrowLeft") setIndex((value) => Math.max(value - 1, 0));
      if (event.key === "Escape" && fullscreen) document.exitFullscreen?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapters.length, fullscreen]);

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await frameRef.current?.requestFullscreen?.();
      setFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setFullscreen(false);
    }
  }

  function addBookmark() {
    setBookmarks((current) => [
      ...current,
      { id: Date.now(), chapter: index, title: chapter?.title, progress },
    ]);
  }

  const overall = useMemo(() => {
    if (!chapters.length) return 0;
    return (index + progress) / chapters.length;
  }, [chapters.length, index, progress]);

  if (!chapters.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-sans text-xl font-semibold tracking-tight">This book is not available in the reader yet.</p>
        <Link href={`/book/${book.id}`} className="mt-4 inline-block text-accent">
          Return to book page
        </Link>
      </div>
    );
  }

  const chrome = READER_CHROME[settings.theme];

  return (
    <div ref={frameRef} className={cn("fixed inset-0 z-40 flex flex-col", chrome.page)}>
      <header className={cn("relative z-[80] shrink-0 shadow-[0_8px_24px_rgba(42,33,24,0.18)]", chrome.header)}>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-sans text-lg font-semibold tracking-tight sm:text-xl">{book.title}</p>
            <p className="truncate text-xs opacity-75">
              {chapter?.title} · {Math.round(overall * 100)}% read
            </p>
          </div>
          <div className="flex items-center gap-2">
            {bookmarks.length ? (
              <Dropdown
                size="sm"
                align="right"
                variant="ghost"
                ariaLabel="Bookmarks"
                placeholder="Bookmarks"
                value=""
                onChange={(value) => setIndex(Number(value))}
                options={bookmarks.map((item) => ({ value: item.chapter, label: item.title }))}
                triggerClassName={chrome.button}
                menuClassName={chrome.menu}
              />
            ) : null}
            <button
              type="button"
              onClick={addBookmark}
              className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full border", chrome.button)}
              aria-label="Bookmark"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <Link
              href={`/book/${book.id}`}
              className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full border", chrome.button)}
              aria-label="Close reader"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <ReaderControls
          settings={settings}
          chrome={chrome}
          onChange={(patch) => setSettings((current) => ({ ...current, ...patch }))}
          onPrev={() => setIndex((value) => Math.max(value - 1, 0))}
          onNext={() => setIndex((value) => Math.min(value + 1, chapters.length - 1))}
          canPrev={index > 0}
          canNext={index < chapters.length - 1}
          onToggleToc={() => setTocOpen((value) => !value)}
          onToggleFullscreen={toggleFullscreen}
          fullscreen={fullscreen}
          progress={overall}
        />
      </header>

      <div className="relative z-0 flex min-h-0 flex-1">
        <ReaderSidebar
          chapters={chapters}
          current={index}
          open={tocOpen}
          onSelect={(value) => {
            setIndex(value);
            setTocOpen(false);
          }}
        />
        <article onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto px-4 py-10 sm:px-8">
          <div
            className={cn("mx-auto", WIDTHS[settings.width], settings.serif ? "font-serif" : "font-sans")}
            style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeight }}
          >
            <h2 className="mb-6 font-serif text-3xl">{chapter.title}</h2>
            {chapter.content.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className="mb-5 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

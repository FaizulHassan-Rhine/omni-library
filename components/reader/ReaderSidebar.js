"use client";

import { cn } from "@/lib/utils/cn";

export function ReaderSidebar({ chapters, current, onSelect, open }) {
  return (
    <aside
      className={cn(
        "border-border bg-card-elevated lg:static lg:block lg:w-72 lg:border-r",
        open ? "absolute inset-y-0 left-0 z-20 w-72 border-r" : "hidden"
      )}
    >
      <div className="h-full overflow-y-auto p-4 scrollbar-thin">
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-accent uppercase">Contents</p>
        <nav className="space-y-1">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                "block w-full rounded-xl px-3 py-2 text-left text-sm leading-5 transition-colors",
                current === index ? "bg-accent-soft text-foreground" : "text-foreground-secondary hover:bg-background-secondary"
              )}
            >
              {chapter.title}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

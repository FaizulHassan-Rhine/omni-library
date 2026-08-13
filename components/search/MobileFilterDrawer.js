"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar } from "@/components/search/FilterSidebar";

export function MobileFilterDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-[rgba(16,21,18,0.45)]" aria-label="Close filters" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[min(100%,360px)] overflow-y-auto border-l border-border bg-background p-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-sans text-xl font-semibold tracking-tight">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      ) : null}
    </>
  );
}

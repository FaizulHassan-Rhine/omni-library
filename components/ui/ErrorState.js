"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ErrorState({
  title = "We could not load this page",
  description = "One of the library sources may be temporarily unavailable. Please try again in a moment.",
  onRetry,
  className,
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card px-6 py-14 text-center", className)}>
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h2 className="font-sans text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

import { cn } from "@/lib/utils/cn";

export function BookSkeleton({ className }) {
  return (
    <div className={cn("w-[138px] sm:w-[160px] md:w-[176px]", className)}>
      <div className="aspect-[2/3] animate-pulse rounded-[14px] bg-background-secondary" />
      <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-background-secondary" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-background-secondary" />
    </div>
  );
}

export function BookRowSkeleton({ count = 8 }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <BookSkeleton key={index} />
      ))}
    </div>
  );
}

export function BookGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <BookSkeleton key={index} className="w-full" />
      ))}
    </div>
  );
}

export function AuthorSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="h-16 w-16 animate-pulse rounded-full bg-background-secondary" />
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-background-secondary" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-background-secondary" />
    </div>
  );
}

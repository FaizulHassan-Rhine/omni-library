import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  icon: Icon = BookOpen,
  title = "Nothing here yet",
  description = "Try another search, or browse categories and languages.",
  action,
  className,
}) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center", className)}>
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-sans text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-secondary">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

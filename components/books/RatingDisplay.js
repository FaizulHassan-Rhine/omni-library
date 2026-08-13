import { Star } from "lucide-react";
import { formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function RatingDisplay({ average = 0, count = 0, className }) {
  if (!average && !count) return null;

  return (
    <div className={cn("flex items-center gap-1.5 text-sm text-foreground-secondary", className)}>
      <Star className="h-3.5 w-3.5 fill-accent-secondary text-accent-secondary" />
      <span className="font-medium text-foreground">{average ? average.toFixed(1) : "—"}</span>
      {count ? <span className="text-foreground-muted">({formatNumber(count)})</span> : null}
    </div>
  );
}

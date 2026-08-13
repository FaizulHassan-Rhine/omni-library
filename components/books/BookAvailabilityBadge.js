import { cn } from "@/lib/utils/cn";

const STYLES = {
  free: "bg-success/12 text-success",
  preview: "bg-accent-secondary/15 text-accent-secondary",
  discover: "bg-background-secondary text-foreground-secondary",
};

export function BookAvailabilityBadge({ availability, className }) {
  if (!availability) return null;
  const status = availability.status || "discover";

  return (
    <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium tracking-wide", STYLES[status], className)}>
      {availability.label || "Discover Only"}
    </span>
  );
}

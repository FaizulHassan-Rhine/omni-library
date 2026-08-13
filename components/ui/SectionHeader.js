import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function SectionHeader({ eyebrow, title, description, href, actionLabel = "View all", className }) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">{eyebrow}</p>
        ) : null}
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-xl text-sm leading-6 text-foreground-secondary">{description}</p> : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

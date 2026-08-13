import Link from "next/link";
import { BookOpen, Hash, Tag, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ICONS = {
  book: BookOpen,
  author: User,
  isbn: Hash,
  subject: Tag,
};

export function SearchSuggestions({ suggestions, active, onSelect, id }) {
  return (
    <ul
      id={id}
      role="listbox"
      className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card py-2 shadow-soft"
    >
      {suggestions.map((item, index) => {
        const Icon = ICONS[item.type] || BookOpen;
        return (
          <li key={`${item.type}-${item.href}`} role="option" aria-selected={index === active}>
            <Link
              href={item.href}
              onClick={onSelect}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                index === active ? "bg-accent-soft text-foreground" : "text-foreground-secondary hover:bg-background-secondary"
              )}
            >
              <Icon className="h-4 w-4 text-accent" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <span className="text-[11px] tracking-wide text-foreground-muted uppercase">{item.type}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

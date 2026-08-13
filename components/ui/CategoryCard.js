import Link from "next/link";
import {
  Atom,
  Baby,
  BookOpen,
  Brain,
  Cpu,
  Heart,
  Landmark,
  Rocket,
  ScrollText,
  Search,
  Sparkles,
  User,
} from "lucide-react";

const ICONS = {
  "book-open": BookOpen,
  sparkles: Sparkles,
  rocket: Rocket,
  search: Search,
  heart: Heart,
  landmark: Landmark,
  brain: Brain,
  atom: Atom,
  cpu: Cpu,
  user: User,
  baby: Baby,
  scroll: ScrollText,
};

export function CategoryCard({ category }) {
  const Icon = ICONS[category.icon] || BookOpen;

  return (
    <Link
      href={`/subject/${category.slug}`}
      className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-[1.03]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-medium text-foreground">{category.name}</h3>
      <p className="mt-1 text-sm leading-6 text-foreground-secondary">{category.description}</p>
    </Link>
  );
}

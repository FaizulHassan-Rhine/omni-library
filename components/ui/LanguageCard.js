import Link from "next/link";
import { languageName } from "@/lib/utils/languages";

export function LanguageCard({ language }) {
  const item = typeof language === "string" ? { code: language, name: languageName(language), native: languageName(language) } : language;

  return (
    <Link
      href={`/language/${item.code}`}
      className="group flex min-w-[160px] flex-col rounded-2xl border border-border bg-card px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
    >
      <span className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">{item.code}</span>
      <span className="mt-2 font-sans text-xl font-semibold tracking-tight text-foreground">{item.name}</span>
      <span className="mt-1 text-sm text-foreground-secondary">{item.native}</span>
    </Link>
  );
}

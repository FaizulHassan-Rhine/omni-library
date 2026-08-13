"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/lib/utils/format";

export function AuthorCard({ author }) {
  const [failed, setFailed] = useState(false);
  if (!author) return null;
  const initial = (author.name || "A")[0].toUpperCase();
  const lifespan = [author.birthDate, author.deathDate].filter(Boolean).join(" – ");

  return (
    <Link
      href={`/author/${encodeURIComponent(author.id)}`}
      className="group flex min-w-[220px] items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-accent-soft">
        {author.photo && !failed ? (
          <Image
            src={author.photo}
            alt={author.name}
            fill
            sizes="64px"
            unoptimized
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-2xl text-accent">{initial}</div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-medium text-foreground">{author.name}</h3>
        {lifespan ? <p className="mt-0.5 text-xs text-foreground-muted">{lifespan}</p> : null}
        {author.workCount ? (
          <p className="mt-1 text-sm text-foreground-secondary">{formatNumber(author.workCount)} discovered works</p>
        ) : null}
      </div>
    </Link>
  );
}

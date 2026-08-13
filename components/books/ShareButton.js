"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      <Share2 className="h-4 w-4" />
      {copied ? "Copied" : "Share"}
    </button>
  );
}

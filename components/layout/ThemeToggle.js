"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils/cn";
import { useHydrated } from "@/lib/hooks/useHydrated";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemeToggle({ compact = false }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useHydrated();
  const current = theme === "dark" || resolvedTheme === "dark" ? "dark" : "light";

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full border border-border bg-card" aria-hidden />;
  }

  if (compact) {
    const next = current === "dark" ? "light" : "dark";
    const Icon = current === "dark" ? Moon : Sun;
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground-secondary transition-colors hover:border-accent hover:text-accent"
        aria-label={`Theme: ${current}. Click to switch`}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1" role="group" aria-label="Theme">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = current === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
              active ? "bg-accent-soft text-accent" : "text-foreground-secondary hover:text-foreground"
            )}
            aria-pressed={active}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

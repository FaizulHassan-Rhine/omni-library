"use client";

import { AlignLeft, ChevronLeft, ChevronRight, List, Maximize, Minimize, Type } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { cn } from "@/lib/utils/cn";

const THEMES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "sepia", label: "Sepia" },
];

const SPACING = [
  { value: 1.5, label: "Tight" },
  { value: 1.8, label: "Comfortable" },
  { value: 2.05, label: "Roomy" },
];

const FONT_SIZES = [
  { value: 16, label: "Small" },
  { value: 18, label: "Medium" },
  { value: 21, label: "Large" },
  { value: 24, label: "XL" },
];

const WIDTHS = [
  { value: "narrow", label: "Narrow" },
  { value: "medium", label: "Medium" },
  { value: "wide", label: "Wide" },
];

export const READER_CHROME = {
  light: {
    page: "bg-[#f7f3ea] text-[#241f19]",
    header: "bg-[#d9d0bd] text-[#1f1b16]",
    controls: "bg-[#cfc6b3] text-[#1f1b16]",
    button: "border-[#7d7464] bg-[#fbf7ee] text-[#1f1b16] hover:bg-white",
    menu: "border-[#7d7464] bg-[#fbf7ee] text-[#1f1b16]",
    active: "bg-[#365747] text-white",
    progress: "bg-[#365747]",
    track: "bg-[#1f1b16]/20",
  },
  dark: {
    page: "bg-[#12110f] text-[#ece6da]",
    header: "bg-[#2a2621] text-[#f3eee4]",
    controls: "bg-[#35302a] text-[#f3eee4]",
    button: "border-[#8a8072] bg-[#454038] text-[#f3eee4] hover:bg-[#524c43]",
    menu: "border-[#8a8072] bg-[#2f2b26] text-[#f3eee4]",
    active: "bg-[#c89b68] text-[#161512]",
    progress: "bg-[#c89b68]",
    track: "bg-white/15",
  },
  sepia: {
    page: "bg-[#eddfc4] text-[#3d3226]",
    header: "bg-[#c4a574] text-[#2a2118]",
    controls: "bg-[#b3915f] text-[#2a2118]",
    button: "border-[#5c4328] bg-[#f6edd8] text-[#2a2118] hover:bg-[#fff8ea]",
    menu: "border-[#5c4328] bg-[#f6edd8] text-[#2a2118]",
    active: "bg-[#4a331c] text-[#f6edd8]",
    progress: "bg-[#4a331c]",
    track: "bg-[#2a2118]/25",
  },
};

function IconButton({ children, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-35",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ReaderControls({
  settings,
  onChange,
  onPrev,
  onNext,
  canPrev,
  canNext,
  onToggleToc,
  onToggleFullscreen,
  fullscreen,
  progress,
  chrome,
}) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-2.5 sm:px-4", chrome.controls)}>
      <IconButton className={chrome.button} onClick={onToggleToc} aria-label="Table of contents">
        <List className="h-4 w-4" />
      </IconButton>
      <IconButton className={chrome.button} onClick={onPrev} disabled={!canPrev} aria-label="Previous chapter">
        <ChevronLeft className="h-4 w-4" />
      </IconButton>
      <IconButton className={chrome.button} onClick={onNext} disabled={!canNext} aria-label="Next chapter">
        <ChevronRight className="h-4 w-4" />
      </IconButton>

      <div className={cn("mx-1 hidden h-1.5 min-w-[80px] flex-1 overflow-hidden rounded-full sm:block", chrome.track)} aria-hidden>
        <div className={cn("h-full rounded-full", chrome.progress)} style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>

      <label className="hidden items-center gap-2 text-xs md:flex">
        <Type className="h-3.5 w-3.5" />
        <input
          type="range"
          min="16"
          max="24"
          value={settings.fontSize}
          onChange={(event) => onChange({ fontSize: Number(event.target.value) })}
          aria-label="Font size"
          className="reader-range w-24"
        />
      </label>

      <Dropdown
        size="sm"
        align="right"
        variant="ghost"
        ariaLabel="Font size"
        value={settings.fontSize}
        onChange={(value) => onChange({ fontSize: Number(value) })}
        options={FONT_SIZES}
        className="md:hidden"
        triggerClassName={chrome.button}
        menuClassName={chrome.menu}
      />
      <Dropdown
        size="sm"
        align="right"
        variant="ghost"
        ariaLabel="Line height"
        value={settings.lineHeight}
        onChange={(value) => onChange({ lineHeight: Number(value) })}
        options={SPACING}
        triggerClassName={chrome.button}
        menuClassName={chrome.menu}
      />
      <Dropdown
        size="sm"
        align="right"
        variant="ghost"
        ariaLabel="Reading width"
        value={settings.width}
        onChange={(value) => onChange({ width: value })}
        options={WIDTHS}
        className="hidden md:block"
        triggerClassName={chrome.button}
        menuClassName={chrome.menu}
      />

      <button
        type="button"
        onClick={() => onChange({ serif: !settings.serif })}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs", chrome.button)}
        aria-label="Toggle serif font"
      >
        <AlignLeft className="h-3.5 w-3.5" />
        {settings.serif ? "Serif" : "Sans"}
      </button>

      <div className={cn("ml-auto flex rounded-full border p-0.5", chrome.button)}>
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange({ theme: theme.id })}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs transition-colors",
              settings.theme === theme.id ? chrome.active : "opacity-80 hover:opacity-100"
            )}
          >
            {theme.label}
          </button>
        ))}
      </div>

      <IconButton className={chrome.button} onClick={onToggleFullscreen} aria-label="Fullscreen">
        {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </IconButton>
    </div>
  );
}

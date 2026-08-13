"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  ariaLabel,
  className,
  size = "md",
  align = "left",
  fullWidth = false,
  variant = "default",
  menuClassName,
  triggerClassName,
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [coords, setCoords] = useState(null);
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const listId = useId();
  const selected = options.find((option) => String(option.value) === String(value));

  useEffect(() => {
    if (!open || !rootRef.current) return undefined;

    function updateCoords() {
      const rect = rootRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, size === "sm" ? 148 : 180);
      setCoords({
        top: rect.bottom + 6,
        left: align === "right" ? rect.right - width : rect.left,
        width,
      });
    }

    updateCoords();
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, true);
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [open, align, size]);

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event) {
      const target = event.target;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function select(option) {
    onChange(option.value);
    setOpen(false);
  }

  function onTriggerKeyDown(event) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      const index = Math.max(0, options.findIndex((option) => String(option.value) === String(value)));
      setActive(index);
    }
  }

  function onListKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(options.length - 1, current + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(0, current - 1));
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      select(options[active]);
    }
  }

  const menu = open && coords ? (
    <ul
      ref={menuRef}
      id={listId}
      role="listbox"
      tabIndex={-1}
      onKeyDown={onListKeyDown}
      style={{ top: coords.top, left: coords.left, minWidth: coords.width, zIndex: 10000 }}
      className={cn(
        "fixed max-h-64 overflow-auto rounded-2xl py-1 shadow-[0_12px_40px_rgba(24,32,27,0.22)] scrollbar-thin",
        variant === "ghost"
          ? "border border-black/15"
          : "border border-border bg-card text-foreground",
        menuClassName
      )}
    >
      {options.map((option, index) => {
        const isSelected = String(option.value) === String(value);
        return (
          <li key={String(option.value)} role="option" aria-selected={isSelected}>
            <button
              type="button"
              onClick={() => select(option)}
              onMouseEnter={() => setActive(index)}
              className={cn(
                "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors",
                isSelected || index === active
                  ? variant === "ghost"
                    ? "bg-black/10"
                    : "bg-accent-soft text-foreground"
                  : variant === "ghost"
                    ? "hover:bg-black/5"
                    : "text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
              )}
            >
              <span className="truncate">{option.label}</span>
              {isSelected ? <Check className={cn("h-3.5 w-3.5 shrink-0", variant === "default" && "text-accent")} /> : null}
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div ref={rootRef} className={cn("relative", fullWidth && "w-full", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "inline-flex items-center justify-between gap-2 text-left transition-colors",
          variant === "ghost"
            ? "border bg-black/5 hover:bg-black/10"
            : "border border-border bg-card text-foreground hover:border-accent",
          triggerClassName,
          fullWidth ? "w-full" : "min-w-[8.5rem]",
          size === "sm" ? "h-8 rounded-full px-3 text-xs" : "h-10 rounded-xl px-3.5 text-sm"
        )}
      >
        <span className={cn("truncate", !selected && "text-foreground-muted")}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 opacity-70 transition-transform", open && "rotate-180")} />
      </button>
      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}

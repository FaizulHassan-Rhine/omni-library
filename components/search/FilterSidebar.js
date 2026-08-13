"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LANGUAGES } from "@/lib/utils/languages";
import { Dropdown } from "@/components/ui/Dropdown";
import { cn } from "@/lib/utils/cn";

const TYPES = [
  { value: "book", label: "Book" },
  { value: "author", label: "Author" },
  { value: "subject", label: "Subject" },
];

const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title A-Z" },
];

function setParam(params, key, value) {
  if (!value) params.delete(key);
  else params.set(key, value);
}

export function FilterSidebar({ className }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(updates) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => setParam(params, key, value));
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  const type = searchParams.get("type") || "book";
  const language = searchParams.get("language") || "";
  const sort = searchParams.get("sort") || "relevance";
  const free = searchParams.get("free") === "1";
  const preview = searchParams.get("preview") === "1";
  const hasCover = searchParams.get("hasCover") === "1";
  const yearMin = searchParams.get("yearMin") || "";
  const yearMax = searchParams.get("yearMax") || "";

  return (
    <aside className={cn("space-y-7", className)}>
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-foreground">Search type</legend>
        <div className="space-y-2">
          {TYPES.map((item) => (
            <label key={item.value} className="flex items-center gap-2 text-sm text-foreground-secondary">
              <input
                type="radio"
                name="type"
                checked={type === item.value}
                onChange={() => update({ type: item.value === "book" ? "" : item.value })}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Language</p>
        <Dropdown
          fullWidth
          ariaLabel="Language"
          placeholder="Any language"
          value={language}
          onChange={(value) => update({ language: value })}
          options={[{ value: "", label: "Any language" }, ...LANGUAGES.map((item) => ({ value: item.code, label: item.name }))]}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Publication year</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="From"
            defaultValue={yearMin}
            onBlur={(event) => update({ yearMin: event.target.value })}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none ring-0 focus:border-accent focus:outline-none focus:ring-0"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="To"
            defaultValue={yearMax}
            onBlur={(event) => update({ yearMax: event.target.value })}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none ring-0 focus:border-accent focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-3 text-sm font-medium text-foreground">Availability</legend>
        <label className="flex items-center gap-2 text-sm text-foreground-secondary">
          <input type="checkbox" checked={free} onChange={(event) => update({ free: event.target.checked ? "1" : "" })} />
          Free to read
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground-secondary">
          <input type="checkbox" checked={preview} onChange={(event) => update({ preview: event.target.checked ? "1" : "" })} />
          Preview available
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground-secondary">
          <input type="checkbox" checked={hasCover} onChange={(event) => update({ hasCover: event.target.checked ? "1" : "" })} />
          Has cover
        </label>
      </fieldset>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Sort</p>
        <Dropdown
          fullWidth
          ariaLabel="Sort"
          value={sort}
          onChange={(value) => update({ sort: value === "relevance" ? "" : value })}
          options={SORTS}
        />
      </div>
    </aside>
  );
}

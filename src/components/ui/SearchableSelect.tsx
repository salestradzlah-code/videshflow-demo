"use client";

import { useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type SelectItem = { key: string; label: string };

export function SearchableSelect({
  label,
  placeholder = "Search a country",
  items,
  quickPicks,
  selectedKey,
  onSelect,
}: {
  label: string;
  placeholder?: string;
  items: readonly SelectItem[];
  quickPicks?: readonly string[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = items.find((item) => item.key === selectedKey) ?? null;

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const quickItems = (quickPicks ?? [])
    .map((key) => items.find((item) => item.key === key))
    .filter((item): item is SelectItem => Boolean(item));

  return (
    <div ref={containerRef} className="relative">
      <p className="mb-2 text-sm font-semibold text-zinc-900">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-700 transition-all duration-200 ease-in-out hover:border-zinc-300 focus:ring-2 focus:ring-emerald-500/20"
      >
        <span className={selected ? "text-zinc-900" : "text-zinc-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-zinc-200/80 bg-white p-3 shadow-lg">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50 px-3 py-2">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search countries"
              className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />
          </div>

          {!query && quickItems.length > 0 && (
            <div className="mt-3">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Quick picks</p>
              <div className="mt-2 flex flex-wrap gap-2 px-1">
                {quickItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      onSelect(item.key);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="rounded-full border border-zinc-200/80 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all duration-200 ease-in-out hover:border-emerald-300 hover:text-emerald-700"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 max-h-56 overflow-auto">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-sm text-zinc-400">No matches</p>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    onSelect(item.key);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  {item.label}
                  {selectedKey === item.key && <Check className="h-4 w-4 text-emerald-600" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

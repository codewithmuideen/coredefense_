"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Command {
  label: string;
  hint: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function CommandPalette({ open, onClose, commands }: { open: boolean; onClose: () => void; commands: Command[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  if (!open) return null;

  function go(c: Command | undefined) {
    if (!c) return;
    onClose();
    router.push(c.href);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label="Search" className="animate-toast-in relative w-full max-w-xl overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-ink-900/[0.07] px-4">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => Math.min(results.length - 1, i + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)); }
              if (e.key === "Enter") go(results[index]);
            }}
            placeholder="Jump to a page or action…"
            className="h-14 flex-1 bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-slate-400"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
          />
          <kbd className="rounded border border-ink-900/10 px-1.5 py-0.5 text-[11px] font-semibold text-slate-400">Esc</kbd>
        </div>
        <ul id="palette-results" role="listbox" className="scroll-slim max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-slate-500">No matches for &ldquo;{query}&rdquo;</li>}
          {results.map((c, i) => (
            <li key={c.label} role="option" aria-selected={i === index}>
              <button
                onMouseEnter={() => setIndex(i)}
                onClick={() => go(c)}
                className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm", i === index ? "bg-primary-50 text-primary-800" : "text-ink-700")}
              >
                <c.icon className={cn("h-4 w-4", i === index ? "text-primary-600" : "text-slate-400")} />
                <span className="flex-1 font-medium">{c.label}</span>
                <span className="text-xs text-slate-400">{c.hint}</span>
                {i === index && <CornerDownLeft className="h-3.5 w-3.5 text-primary-500" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

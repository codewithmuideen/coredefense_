"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { searchIndex } from "@/lib/search-data";
import { cn } from "@/lib/utils";

const RECENT_KEY = "coredefense_recent_searches";
const SUGGESTED = ["Cloud security", "Vulnerability management", "AI automation", "Compliance mapping", "Business transformation"];

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      try {
        const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
        setRecent(Array.isArray(stored) ? stored.slice(0, 5) : []);
      } catch {
        setRecent([]);
      }
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex
      .filter((item) => item.title.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q))
      .slice(0, 20);
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof results> = {};
    for (const r of results) {
      groups[r.category] = groups[r.category] ? [...groups[r.category], r] : [r];
    }
    return groups;
  }, [results]);

  function saveRecent(term: string) {
    try {
      const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable — ignore
    }
  }

  function goTo(href: string, term: string) {
    saveRecent(term);
    onClose();
    router.push(href);
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            className="relative max-h-[75vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-ink-900/10 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-ink-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services, industries, resources…"
                className="focus-ring w-full flex-1 bg-transparent text-base text-ink-900 placeholder:text-ink-400 outline-none"
                aria-label="Search"
              />
              <button onClick={onClose} aria-label="Close search" className="focus-ring rounded-md p-1.5 text-ink-400 hover:text-ink-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(75vh-64px)] overflow-y-auto p-5">
              {!query.trim() && (
                <div className="space-y-6">
                  {recent.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-400">Recent searches</p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQuery(r)}
                            className="focus-ring rounded-full border border-ink-900/10 px-3 py-1.5 text-xs text-ink-600 hover:border-primary-300 hover:text-primary-600"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ink-400">
                      <Sparkles className="h-3.5 w-3.5" /> Suggested searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="focus-ring rounded-full bg-surface px-3 py-1.5 text-xs text-ink-600 hover:bg-primary-50 hover:text-primary-600"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <p className="py-8 text-center text-sm text-ink-500">
                  No results for &ldquo;{query}&rdquo;. Try a different term, or{" "}
                  <button onClick={() => goTo("/contact", query)} className="font-semibold text-primary-500 hover:underline">
                    contact our team
                  </button>
                  .
                </p>
              )}

              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-5 last:mb-0">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-400">{category}</p>
                  <ul className="space-y-0.5">
                    {items.map((item) => (
                      <li key={item.href + item.title}>
                        <button
                          onClick={() => goTo(item.href, query)}
                          className={cn(
                            "focus-ring group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-primary-50"
                          )}
                        >
                          <span>
                            <span className="block text-sm font-semibold text-ink-900 group-hover:text-primary-600">
                              {item.title}
                            </span>
                            {item.description && (
                              <span className="mt-0.5 line-clamp-1 block text-xs text-ink-500">{item.description}</span>
                            )}
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 group-hover:text-primary-500" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

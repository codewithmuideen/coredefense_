"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, Lightbulb, BookOpenText, FileBarChart2 } from "lucide-react";
import { resourceItems, type ResourceItem } from "@/lib/resources-data";

const CATEGORIES: Array<ResourceItem["category"] | "All"> = ["All", "Insight", "Guide", "Case Study"];

const categoryIcon: Record<ResourceItem["category"], typeof Lightbulb> = {
  Insight: Lightbulb,
  Guide: BookOpenText,
  "Case Study": FileBarChart2,
};

export default function ResourceListPage({ defaultCategory }: { defaultCategory?: ResourceItem["category"] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceItem["category"] | "All">(defaultCategory ?? "All");

  const filtered = useMemo(() => {
    return resourceItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery =
        !query.trim() ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/15 blur-[120px]" aria-hidden />

      <div className="container-page relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources…"
              className="focus-ring w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`focus-ring rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  category === c
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-white/15 text-white/60 hover:border-primary-400/50 hover:text-primary-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-white/50">No resources match your search yet.</p>
        )}

        {featured && (
          <Link
            href={featured.href}
            className="focus-ring group relative mt-10 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary-400/40 hover:bg-white/[0.06] sm:flex-row sm:items-center sm:gap-10"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "radial-gradient(320px circle at 0% 0%, rgba(82,139,255,0.16), transparent 70%)" }}
              aria-hidden
            />
            <div className="relative">
              <span className="inline-flex w-fit rounded-full bg-primary-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                Featured &middot; {featured.category}
              </span>
              <h2 className="mt-4 text-xl font-bold text-white">{featured.title}</h2>
              <p className="mt-2 max-w-xl text-sm text-white/60">{featured.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400">
                Read more
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item) => {
              const Icon = categoryIcon[item.category];
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="focus-ring group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40 hover:bg-white/[0.06]"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "radial-gradient(160px circle at 30% 0%, rgba(82,139,255,0.18), transparent 70%)" }}
                    aria-hidden
                  />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400 ring-1 ring-inset ring-primary-400/20 transition-all duration-300 group-hover:bg-primary-500/20 group-hover:shadow-[0_0_18px_rgba(82,139,255,0.45)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="relative mt-4 inline-flex w-fit rounded-full bg-primary-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-400 ring-1 ring-inset ring-primary-400/20">
                    {item.category}
                  </span>
                  <h3 className="relative mt-3 text-sm font-bold text-white">{item.title}</h3>
                  <p className="relative mt-2 flex-1 text-xs leading-relaxed text-white/55">{item.excerpt}</p>
                  <div className="relative mt-4 flex items-center justify-between text-xs text-white/40">
                    <span>{item.readTime}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary-400/60 to-transparent transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

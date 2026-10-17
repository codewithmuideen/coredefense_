"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowUpRight, Clock, CalendarDays } from "lucide-react";
import { articles, articleHref, type Article, type ArticleCategory } from "@/lib/articles-data";
import { cn } from "@/lib/utils";

type Filter = ArticleCategory | "All";

// Only offer filters that actually have articles behind them.
const FILTERS: Filter[] = ["All", ...(["Insight", "Guide"] as ArticleCategory[]).filter((c) => articles.some((a) => a.category === c))];

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export function ArticleCover({ article, className, sizes }: { article: Article; className?: string; sizes: string }) {
  if (article.image) {
    return (
      <div className={cn("relative overflow-hidden bg-white", className)}>
        <Image src={article.image} alt="" width={0} height={0} sizes={sizes} className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
    );
  }
  return (
    <div className={cn("relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-500 via-primary-700 to-ink-900", className)}>
      <div className="absolute inset-0 bg-grid-dark opacity-50" aria-hidden />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-300/30 blur-3xl" aria-hidden />
      <article.icon className="relative h-14 w-14 text-white/90 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.25} />
      <span className="absolute bottom-4 left-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">{article.topic}</span>
    </div>
  );
}

function Meta({ article, dark = true }: { article: Article; dark?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs", dark ? "text-white/45" : "text-ink-400")}>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" /> {formatDate(article.date)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" /> {article.readTime}
      </span>
    </div>
  );
}

export default function ResourceListPage({ defaultCategory }: { defaultCategory?: ArticleCategory }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>(defaultCategory ?? "All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesCategory = category === "All" || a.category === category;
      const matchesQuery =
        !q || [a.title, a.excerpt, a.topic, ...a.takeaways].some((text) => text.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const [featured, ...rest] = filtered;

  return (
    <section className="relative overflow-hidden bg-ink-900 py-16 sm:py-24">
      <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/15 blur-[120px]" aria-hidden />

      <div className="container-page relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, topics and takeaways…"
              aria-label="Search articles"
              className="focus-ring w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((c) => {
              const count = c === "All" ? articles.length : articles.filter((a) => a.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "focus-ring rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                    category === c
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-white/15 text-white/60 hover:border-primary-400/50 hover:text-primary-400"
                  )}
                >
                  {c === "All" ? "All" : `${c}s`} <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-white/50">No articles match your search. Try a different keyword.</p>
        )}

        {featured && (
          <Link
            href={articleHref(featured)}
            className="focus-ring group mt-10 grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-primary-400/40 lg:grid-cols-2"
          >
            <ArticleCover article={featured} sizes="(min-width: 1024px) 50vw, 100vw" className="self-center" />
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <span className="inline-flex w-fit rounded-full bg-primary-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                Featured · {featured.category}
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary-400">{featured.topic}</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-primary-300 sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">{featured.excerpt}</p>
              <ul className="mt-5 space-y-2">
                {featured.takeaways.slice(0, 3).map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm text-white/70">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Meta article={featured} />
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400">
                  Read the {featured.category.toLowerCase()}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={articleHref(article)}
                className="focus-ring group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40 hover:bg-white/[0.06]"
              >
                <ArticleCover article={article} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-400 ring-1 ring-inset ring-primary-400/20">
                      {article.category}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{article.topic}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug text-white transition-colors group-hover:text-primary-300">
                    {article.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{article.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <Meta article={article} />
                    <ArrowUpRight className="h-4 w-4 text-primary-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

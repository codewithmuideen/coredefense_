"use client";

/* eslint-disable @next/next/no-img-element -- thumbnails come from many publisher CDNs, so plain <img> avoids a remote-host allowlist */

import { useMemo, useState } from "react";
import { Search, ArrowUpRight, Radio, Clock, Newspaper } from "lucide-react";
import type { BlogPost } from "@/lib/rss";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function timeAgo(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return formatDate(iso);
}

function Thumbnail({ post, className, sizes = "md" }: { post: BlogPost; className?: string; sizes?: "sm" | "md" | "lg" }) {
  const [failed, setFailed] = useState(false);
  const showImage = post.image && !failed;

  return (
    <div className={cn("relative overflow-hidden bg-ink-900", className)}>
      {showImage ? (
        <img
          src={post.image}
          alt=""
          loading={sizes === "lg" ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-600 via-primary-800 to-ink-900">
          <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
          <Newspaper className={cn("relative text-white/80", sizes === "sm" ? "h-5 w-5" : "h-9 w-9")} strokeWidth={1.25} />
          {sizes !== "sm" && (
            <span className="relative text-[11px] font-semibold uppercase tracking-widest text-white/70">{post.source}</span>
          )}
        </div>
      )}
    </div>
  );
}

function SourceBadge({ source, solid = false }: { source: string; solid?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
        solid ? "bg-primary-500 text-white" : "bg-primary-50 text-primary-600"
      )}
    >
      {source}
    </span>
  );
}

export default function NewsFeed({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sources = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.source)))], [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSource = source === "All" || post.source === source;
      const matchesQuery = !q || post.title.toLowerCase().includes(q) || post.summary.toLowerCase().includes(q);
      return matchesSource && matchesQuery;
    });
  }, [posts, query, source]);

  const featured = filtered[0];
  const sideList = filtered.slice(1, 5);
  const grid = filtered.slice(5);
  const shownGrid = grid.slice(0, visible);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col gap-5 border-b border-ink-900/8 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700">
            <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden />
            Live from the security newsrooms, refreshed hourly
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search headlines…"
              aria-label="Search headlines"
              className="focus-ring w-full rounded-lg border border-ink-900/15 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400"
            />
          </div>
        </div>

        {/* Horizontal scroll on small screens keeps the filter row to a single line */}
        <div className="-mx-6 mt-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSource(s);
                setVisible(PAGE_SIZE);
              }}
              className={cn(
                "focus-ring shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                source === s
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-ink-900/10 text-ink-600 hover:border-primary-300 hover:text-primary-600"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-ink-500">
            No headlines match right now. The feed refreshes hourly, so check back shortly.
          </p>
        )}

        {featured && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-10">
            {/* Featured story (left) */}
            <a
              href={featured.link}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group flex flex-col overflow-hidden rounded-2xl"
            >
              <Thumbnail post={featured} sizes="lg" className="aspect-[16/9] w-full rounded-2xl" />
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-3">
                  <SourceBadge source={`Latest · ${featured.source}`} solid />
                  <span className="inline-flex items-center gap-1 text-xs text-ink-400" suppressHydrationWarning>
                    <Clock className="h-3.5 w-3.5" /> {timeAgo(featured.publishedAt)}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink-900 transition-colors group-hover:text-primary-600 sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-600 sm:text-base">{featured.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                  Read the full story
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>

            {/* Latest list (right) */}
            {sideList.length > 0 && (
              <div className="lg:border-l lg:border-ink-900/8 lg:pl-10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">More top stories</p>
                <ul className="mt-4 divide-y divide-ink-900/8">
                  {sideList.map((post) => (
                    <li key={post.link}>
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring group flex gap-4 py-4"
                      >
                        <Thumbnail post={post} sizes="sm" className="aspect-[4/3] w-28 shrink-0 rounded-xl sm:w-32" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-600">{post.source}</p>
                          <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-ink-900 transition-colors group-hover:text-primary-600">
                            {post.title}
                          </h3>
                          <p className="mt-1.5 text-xs text-ink-400" suppressHydrationWarning>{timeAgo(post.publishedAt)}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {shownGrid.length > 0 && (
          <>
            <div className="mt-16 flex items-center gap-4">
              <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">Earlier news</h2>
              <span className="h-px flex-1 bg-ink-900/8" />
            </div>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {shownGrid.map((post) => (
                <a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group flex h-full flex-col"
                >
                  <Thumbnail post={post} className="aspect-[16/10] w-full rounded-2xl" />
                  <div className="mt-4 flex items-center gap-3">
                    <SourceBadge source={post.source} />
                    <span className="text-xs text-ink-400">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-ink-900 transition-colors group-hover:text-primary-600">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-600">{post.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                    Read more
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </>
        )}

        {grid.length > visible && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="focus-ring rounded-lg border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-700 transition-colors hover:border-primary-400 hover:text-primary-600"
            >
              Load more stories
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

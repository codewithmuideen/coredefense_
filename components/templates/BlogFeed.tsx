"use client";

import { useMemo, useState } from "react";
import { Search, ArrowUpRight, Radio } from "lucide-react";
import type { BlogPost } from "@/lib/rss";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export default function BlogFeed({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const sources = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.source)))], [posts]);
  const [source, setSource] = useState("All");

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesSource = source === "All" || post.source === source;
      const matchesQuery =
        !query.trim() ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.summary.toLowerCase().includes(query.toLowerCase());
      return matchesSource && matchesQuery;
    });
  }, [posts, query, source]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700">
          <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden />
          Live feed — refreshed automatically from trusted security news sources
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headlines…"
              className="focus-ring w-full rounded-lg border border-ink-900/15 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`focus-ring rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  source === s
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-ink-900/10 text-ink-600 hover:border-primary-300 hover:text-primary-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-ink-500">
            No headlines match right now — the feed refreshes hourly, so check back shortly.
          </p>
        )}

        {featured && (
          <a
            href={featured.link}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring group mt-10 flex flex-col overflow-hidden rounded-2xl border border-ink-900/8 bg-surface-near p-8 transition-shadow hover:shadow-lg sm:flex-row sm:items-center sm:gap-10"
          >
            <div>
              <span className="inline-flex w-fit rounded-full bg-primary-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                Latest &middot; {featured.source}
              </span>
              <h2 className="mt-4 text-xl font-bold text-ink-900">{featured.title}</h2>
              <p className="mt-2 max-w-xl text-sm text-ink-600">{featured.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                Read the full story
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </a>
        )}

        {rest.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group flex h-full flex-col rounded-2xl border border-ink-900/8 p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <span className="inline-flex w-fit rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-600">
                  {post.source}
                </span>
                <h3 className="mt-4 text-sm font-bold text-ink-900">{post.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-600">{post.summary}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                  <span>{formatDate(post.publishedAt)}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-primary-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

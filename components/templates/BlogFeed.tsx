"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, CalendarDays, Clock, Sparkles } from "lucide-react";
import { articleHref, type Article } from "@/lib/articles-data";
import { articleIcon } from "@/lib/article-icons";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function Cover({ post, size = "md", className }: { post: Article; size?: "sm" | "md" | "lg"; className?: string }) {
  const Icon = articleIcon(post.icon);
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-500 via-primary-700 to-ink-900", className)}>
      <div className="absolute inset-0 bg-grid-dark opacity-50" aria-hidden />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-300/30 blur-3xl" aria-hidden />
      <Icon
        className={cn("relative text-white/90 transition-transform duration-500 group-hover:scale-110", size === "sm" ? "h-7 w-7" : size === "lg" ? "h-20 w-20" : "h-12 w-12")}
        strokeWidth={1.25}
      />
      {size !== "sm" && (
        <span className="absolute bottom-4 left-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">{post.topic}</span>
      )}
    </div>
  );
}

function Meta({ post }: { post: Article }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-400">
      <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.date)}</span>
      <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
    </div>
  );
}

export default function BlogFeed({ posts, today }: { posts: Article[]; today: string }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const topics = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.topic)))], [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesTopic = topic === "All" || p.topic === topic;
      const matchesQuery = !q || [p.title, p.excerpt, p.topic, ...p.takeaways].some((t) => t.toLowerCase().includes(q));
      return matchesTopic && matchesQuery;
    });
  }, [posts, query, topic]);

  const featured = filtered[0];
  const sideList = filtered.slice(1, 5);
  const grid = filtered.slice(5);

  return (
    <section id="briefs" className="border-t border-ink-900/8 bg-surface py-16 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col gap-5 border-b border-ink-900/8 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            CoreDefense briefs: our own take on the stories that matter
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search posts…"
              aria-label="Search posts"
              className="focus-ring w-full rounded-lg border border-ink-900/15 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400"
            />
          </div>
        </div>

        <div className="-mx-6 mt-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTopic(t);
                setVisible(PAGE_SIZE);
              }}
              className={cn(
                "focus-ring shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                topic === t ? "border-primary-500 bg-primary-500 text-white" : "border-ink-900/10 text-ink-600 hover:border-primary-300 hover:text-primary-600"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-ink-500">
            {posts.length === 0 ? "Today's posts are being prepared. Check back shortly." : "No posts match your search."}
          </p>
        )}

        {featured && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-10">
            <Link href={articleHref(featured)} className="focus-ring group flex flex-col">
              <Cover post={featured} size="lg" className="aspect-[16/9] w-full rounded-2xl" />
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {featured.date === today ? "Today's Brief" : "Featured Brief"}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-600">{featured.topic}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink-900 transition-colors group-hover:text-primary-600 sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">{featured.excerpt}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <Meta post={featured} />
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                    Read the brief
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            {sideList.length > 0 && (
              <div className="lg:border-l lg:border-ink-900/8 lg:pl-10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">More briefs</p>
                <ul className="mt-4 divide-y divide-ink-900/8">
                  {sideList.map((post) => (
                    <li key={post.slug}>
                      <Link href={articleHref(post)} className="focus-ring group flex gap-4 py-4">
                        <Cover post={post} size="sm" className="aspect-square w-20 shrink-0 rounded-xl sm:w-24" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-600">
                            {post.date === today ? "Today · " : ""}
                            {post.topic}
                          </p>
                          <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-ink-900 transition-colors group-hover:text-primary-600">
                            {post.title}
                          </h3>
                          <p className="mt-1.5 text-xs text-ink-400">
                            {formatDate(post.date)} · {post.readTime}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {grid.length > 0 && (
          <>
            <div className="mt-16 flex items-center gap-4">
              <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">Earlier briefs</h2>
              <span className="h-px flex-1 bg-ink-900/8" />
            </div>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {grid.slice(0, visible).map((post) => (
                <Link key={post.slug} href={articleHref(post)} className="focus-ring group flex h-full flex-col">
                  <Cover post={post} className="aspect-[16/10] w-full rounded-2xl" />
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-primary-600">{post.topic}</p>
                  <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-ink-900 transition-colors group-hover:text-primary-600">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>
                  <div className="mt-4">
                    <Meta post={post} />
                  </div>
                </Link>
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
              Load more briefs
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

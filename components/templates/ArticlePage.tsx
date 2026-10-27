import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock, Lightbulb, Quote, ChevronRight, ExternalLink } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import { articleHref, type Article } from "@/lib/articles-data";
import { articleIcon } from "@/lib/article-icons";
import { getArticles, getBlogPosts } from "@/lib/daily-content";
import JsonLd, { SITE_URL, breadcrumbSchema } from "@/components/seo/JsonLd";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function IconFor({ name, className }: { name: string; className?: string }) {
  const Icon = articleIcon(name);
  return <Icon className={className} />;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

export default function ArticlePage({ article }: { article: Article }) {
  const isBlog = article.category === "Blog";
  const listHref = isBlog ? "/blog" : article.category === "Guide" ? "/resources/guides" : "/resources/insights";
  const listLabel = isBlog ? "Blog" : article.category === "Guide" ? "Guides" : "Insights";
  const kind = isBlog ? "post" : article.category.toLowerCase();
  const pool = isBlog ? getBlogPosts() : getArticles(article.category as "Insight" | "Guide");
  const related = pool.filter((a) => a.slug !== article.slug).slice(0, 3);
  const Icon = articleIcon(article.icon);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": isBlog ? "BlogPosting" : "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.date,
          dateModified: article.date,
          mainEntityOfPage: `${SITE_URL}${articleHref(article)}`,
          image: `${SITE_URL}/opengraph-image`,
          author: { "@type": "Organization", name: "CoreDefense", url: SITE_URL },
          publisher: { "@type": "Organization", name: "CoreDefense", logo: { "@type": "ImageObject", url: `${SITE_URL}/images/brand/logo-full.png` } },
          articleSection: article.topic,
        }}
      />
      <JsonLd data={breadcrumbSchema([{ label: listLabel, href: listHref }, { label: article.title, href: articleHref(article) }])} />
      <header className="relative overflow-hidden bg-ink-900 pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/20 blur-[110px]" aria-hidden />
        <div className="container-page relative max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-white/40">
            <Link href="/" className="hover:text-white/70">Home</Link>
            <ChevronRight className="h-3 w-3" />
            {!isBlog && (
              <>
                <Link href="/resources" className="hover:text-white/70">Resources</Link>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <Link href={listHref} className="hover:text-white/70">{listLabel}</Link>
          </nav>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-400 ring-1 ring-inset ring-primary-400/30">
            <Icon className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {isBlog ? "Daily Brief" : article.category}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-400">{article.topic}</span>
          </div>
          <h1 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-balance text-base leading-relaxed text-white/65 sm:text-lg">{article.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/50">
            <span className="font-semibold text-white/80">CoreDefense Team</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {formatDate(article.date)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.readTime}</span>
          </div>
        </div>
      </header>

      <div className="bg-white py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">In this {kind}</p>
            <ol className="mt-3 space-y-1 border-l border-ink-900/10">
              {article.sections.map((s) => (
                <li key={s.heading}>
                  <a href={`#${slugify(s.heading)}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-ink-600 transition-colors hover:border-primary-500 hover:text-primary-600">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
            <Link href={listHref} className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-4 w-4" /> All {listLabel.toLowerCase()}
            </Link>
          </aside>

          <div className="max-w-3xl">
            <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-6 sm:p-8">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                <Lightbulb className="h-4 w-4" /> Key takeaways
              </p>
              <ul className="mt-4 space-y-3">
                {article.takeaways.map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-ink-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 space-y-12">
              {article.sections.map((section) => (
                <section key={section.heading} id={slugify(section.heading)} className="scroll-mt-28">
                  <h2 className="text-2xl font-bold tracking-tight text-ink-900">{section.heading}</h2>
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="mt-4 text-[17px] leading-[1.75] text-ink-600">{p}</p>
                  ))}
                  {section.list && (
                    <ul className="mt-5 space-y-3">
                      {section.list.map((item) => (
                        <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ink-600">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.callout && (
                    <blockquote className="mt-6 flex gap-4 rounded-r-xl border-l-4 border-primary-500 bg-surface p-5">
                      <Quote className="h-5 w-5 shrink-0 text-primary-500" aria-hidden />
                      <p className="text-[16px] font-medium leading-relaxed text-ink-800">{section.callout}</p>
                    </blockquote>
                  )}
                </section>
              ))}
            </div>

            {article.sources && article.sources.length > 0 && (
              <div className="mt-14 rounded-2xl border border-ink-900/10 p-6 sm:p-8">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-500">Sources and further reading</h2>
                <p className="mt-2 text-sm text-ink-500">
                  This {kind} is CoreDefense&apos;s own analysis. The original reporting it draws on is credited below.
                </p>
                <ul className="mt-4 space-y-3">
                  {article.sources.map((src) => (
                    <li key={src.url}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-start gap-2 text-sm text-ink-700 hover:text-primary-600"
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-ink-400 group-hover:text-primary-500" />
                        <span>
                          {src.title} <span className="text-ink-400">· {src.publisher}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-16 overflow-hidden rounded-2xl bg-ink-900 p-8 sm:p-10">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Want help applying this to your organisation?</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Talk to CoreDefense about {article.topic}. We&apos;ll give you a practical view of where you stand and what to do next.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <CTAButton href="/contact">Talk to an Expert</CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-ink-900/8 bg-surface py-16 sm:py-20">
          <div className="container-page">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">More from the {listLabel.toLowerCase()}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={articleHref(r)}
                  className="focus-ring group flex h-full flex-col rounded-2xl border border-ink-900/8 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                    <IconFor name={r.icon} className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-primary-600">{r.topic}</p>
                  <h3 className="mt-1.5 font-bold leading-snug text-ink-900">{r.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-600">{r.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                    Read · {r.readTime}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

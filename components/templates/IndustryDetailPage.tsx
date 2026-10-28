import Link from "next/link";
import { ArrowUpRight, Check, Scale, Siren } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { industryDetails, type IndustryDetail } from "@/lib/industry-detail-data";
import { serviceDetails } from "@/lib/service-detail-data";
import { cyberCapabilities } from "@/lib/capabilities-data";

const cyberIcons = Object.fromEntries(cyberCapabilities.map((c) => [c.slug, c.icon]));

export default function IndustryDetailPage({ industry }: { industry: IndustryDetail }) {
  const others = Object.values(industryDetails).filter((i) => i.slug !== industry.slug);

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={industry.title}
        description={industry.summary}
        breadcrumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.title, href: industry.slug },
        ]}
      />

      {/* Approach and focus areas */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading title="How CoreDefense helps" description={industry.approach} />
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 sm:p-10">
            <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
            <industry.icon className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 text-white/[0.05]" strokeWidth={1} aria-hidden />
            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Where we focus</p>
            <ul className="relative mt-6 space-y-4">
              {industry.focusAreas.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Threats */}
      <section className="border-t border-ink-900/8 bg-surface py-20 sm:py-24">
        <div className="container-page">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            <Siren className="h-4 w-4" /> Threat picture
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">What we see in {industry.title.toLowerCase()}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {industry.threats.map((t, i) => (
              <article key={t.title} className="group relative overflow-hidden rounded-2xl border border-ink-900/8 bg-white p-7 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 to-primary-300 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                <span className="text-xs font-bold text-primary-500">Threat 0{i + 1}</span>
                <h3 className="mt-3 text-lg font-bold text-ink-900">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Regulation and services */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
              <Scale className="h-4 w-4" /> Regulation
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">The rules behind the work</h2>
            <dl className="mt-8 divide-y divide-ink-900/8 rounded-2xl border border-ink-900/8">
              {industry.regulations.map((r) => (
                <div key={r.name} className="grid gap-1 p-5 sm:grid-cols-[170px_1fr] sm:gap-6">
                  <dt className="text-sm font-bold text-ink-900">{r.name}</dt>
                  <dd className="text-sm leading-relaxed text-ink-600">{r.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Services</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">Where most {industry.title.toLowerCase()} clients start</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {industry.services.map((key) => {
                const s = serviceDetails[key];
                const Icon = s.icon ?? cyberIcons[s.slug];
                return (
                  <Link
                    key={key}
                    href={s.slug}
                    className="focus-ring group flex items-center gap-3 rounded-2xl border border-ink-900/8 bg-surface-near p-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
                  >
                    {Icon && (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                    )}
                    <span className="flex-1 text-sm font-semibold leading-snug text-ink-900">{s.title}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-400 group-hover:text-primary-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Other sectors */}
      <section className="border-t border-ink-900/8 bg-surface py-14">
        <div className="container-page flex flex-wrap items-center gap-3">
          <span className="mr-2 text-sm font-semibold text-ink-500">Other sectors:</span>
          {others.map((o) => (
            <Link
              key={o.slug}
              href={o.slug}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:border-primary-300 hover:text-primary-600"
            >
              <o.icon className="h-4 w-4 text-primary-500" /> {o.title}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

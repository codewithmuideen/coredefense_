import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown, MessageSquareWarning } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import BpmnDiagram from "@/components/visuals/BpmnDiagram";
import { serviceDetails, type ServiceDetail } from "@/lib/service-detail-data";
import { cyberCapabilities } from "@/lib/capabilities-data";
import { serviceDepth } from "@/lib/service-depth-data";
import JsonLd from "@/components/seo/JsonLd";

const cyberIcons = Object.fromEntries(cyberCapabilities.map((c) => [c.slug, c.icon]));

function Visual({ service }: { service: ServiceDetail }) {
  if (service.visual === "bpmn") return <BpmnDiagram />;
  if (service.image) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl bg-surface shadow-xl">
        <Image src={service.image} alt={service.title} width={0} height={0} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
      </div>
    );
  }
  return (
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-ink-900">
      <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />
      {service.icon && <service.icon className="relative h-20 w-20 text-white/90" strokeWidth={1.25} />}
    </div>
  );
}

function CheckList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-ink-900/8 bg-surface-near p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-600">{heading}</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  const related = Object.values(serviceDetails).filter((s) => s.categoryHref === service.categoryHref && s.slug !== service.slug);
  const key = Object.keys(serviceDetails).find((k) => serviceDetails[k].slug === service.slug) ?? "";
  const depth = serviceDepth[key];

  return (
    <>
      <PageHero
        eyebrow={service.category}
        title={service.title}
        description={service.description}
        breadcrumbs={[
          { label: service.category, href: service.categoryHref },
          { label: service.title, href: service.slug },
        ]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <CheckList heading="What we do" items={service.whatWeDo} />
            <CheckList heading="What you get" items={service.outcomes} />
          </div>
          <Visual service={service} />
        </div>
      </section>

      {depth && (
        <>
          {/* Problems this service solves, and how the engagement runs */}
          <section className="relative overflow-hidden bg-ink-900 py-20 sm:py-24">
            <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
            <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-500/20 blur-[120px]" aria-hidden />
            <div className="container-page relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
                  <MessageSquareWarning className="h-4 w-4" /> Sound familiar?
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">When teams call us about {service.title.toLowerCase()}</h2>
                <ul className="mt-8 space-y-4">
                  {depth.challenges.map((c) => (
                    <li key={c} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-white/75">
                      &ldquo;{c}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">How the engagement runs</p>
                <ol className="relative mt-8 space-y-8 border-l border-white/10 pl-8">
                  {depth.steps.map((step, i) => (
                    <li key={step.title} className="relative">
                      <span className="absolute -left-[49px] flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white ring-4 ring-ink-900">
                        {i + 1}
                      </span>
                      <h3 className="text-lg font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{step.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Service FAQs */}
          <section className="bg-white py-20 sm:py-24">
            <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">Questions</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Asked before we start</h2>
              </div>
              <div className="divide-y divide-ink-900/8 rounded-2xl border border-ink-900/8">
                {depth.faqs.map((f) => (
                  <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink-900">
                      {f.q}
                      <ChevronDown className="h-5 w-5 shrink-0 text-primary-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-ink-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: depth.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
              }}
            />
          </section>
        </>
      )}

      {related.length > 0 && (
        <section className="border-t border-ink-900/8 bg-surface py-16 sm:py-20">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-ink-900">Also in {service.category}</h2>
              <Link href={service.categoryHref} className="focus-ring rounded-md text-sm font-semibold text-primary-600 hover:text-primary-700">
                View the practice
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => {
                const Icon = r.icon ?? cyberIcons[r.slug];
                return (
                  <Link
                    key={r.slug}
                    href={r.slug}
                    className="focus-ring group flex items-center gap-3 rounded-2xl border border-ink-900/8 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
                  >
                    {Icon && (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                    )}
                    <span className="flex-1 text-sm font-semibold leading-snug text-ink-900">{r.title}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-400 transition-colors group-hover:text-primary-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

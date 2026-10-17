import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import { industryDetails } from "@/lib/industry-detail-data";
import { industries } from "@/lib/industries-data";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "CoreDefense supports financial services, healthcare, manufacturing, technology and more with cybersecurity and technology built for sector-specific risk.",
};

const alsoSupported = industries.filter((i) => i.slug === "/industries");

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Built around the risks your sector actually faces"
        description="Regulators, attackers and operating constraints differ by industry. Here's how CoreDefense adapts its four practices to each one."
        breadcrumbs={[{ label: "Industries", href: "/industries" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {Object.values(industryDetails).map((industry, i) => (
            <ScrollReveal key={industry.slug} delay={(i % 2) * 0.08} className="h-full">
              <article className="group flex h-full flex-col rounded-3xl border border-ink-900/8 bg-surface-near p-8 transition-all duration-300 hover:border-primary-200 hover:shadow-xl sm:p-10">
                <div className="flex items-center gap-4">
                  {industry.icon && (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-primary-400 transition-colors duration-300 group-hover:bg-primary-500 group-hover:text-white">
                      <industry.icon className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">{industry.title}</h2>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-ink-600">{industry.description}</p>
                <p className="mt-4 flex-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                  {industry.focusAreas.length} focus areas
                </p>
                <Link
                  href={industry.slug}
                  className="focus-ring mt-8 inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  See how we help
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-page">
          <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Also supported</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-600">
            We regularly work with organisations in these sectors too. Talk to us about your specific requirements.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {alsoSupported.map((item) => (
              <div key={item.title} className="rounded-2xl border border-ink-900/8 bg-white p-6">
                <item.icon className="h-6 w-6 text-primary-500" />
                <h3 className="mt-4 font-bold text-ink-900">{item.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}

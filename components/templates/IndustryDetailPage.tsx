import Image from "next/image";
import { Check } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import type { IndustryDetail } from "@/lib/industry-detail-data";

export default function IndustryDetailPage({ industry }: { industry: IndustryDetail }) {
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

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className={`relative w-full overflow-hidden rounded-2xl bg-surface lg:order-2 ${industry.image ? "" : "aspect-square"}`}>
            {industry.image ? (
              <Image src={industry.image} alt={industry.title} width={0} height={0} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-500 to-ink-900">
                <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />
                {industry.icon && <industry.icon className="relative h-20 w-20 text-white/90" strokeWidth={1.25} />}
              </div>
            )}
          </div>
          <div className="lg:order-1">
            <SectionHeading title="How CoreDefense helps" description={industry.description} />
            <ul className="mt-8 space-y-3">
              {industry.focusAreas.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}

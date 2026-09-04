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
          <div className="relative overflow-hidden rounded-2xl bg-surface p-10 lg:order-2">
            <div className="relative aspect-square w-full">
              <Image src={industry.image} alt={industry.title} fill className="object-contain" />
            </div>
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

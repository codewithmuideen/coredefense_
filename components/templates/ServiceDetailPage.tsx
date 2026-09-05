import Image from "next/image";
import { Check } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import type { ServiceDetail } from "@/lib/service-detail-data";

export default function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  return (
    <>
      <PageHero
        eyebrow={service.category}
        title={service.title}
        description={service.summary}
        breadcrumbs={[
          { label: service.category, href: service.categoryHref },
          { label: service.title, href: service.slug },
        ]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading title="Overview" description={service.description} />

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-400">What we do</p>
                <ul className="space-y-2.5">
                  {service.whatWeDo.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-400">Outcomes</p>
                <ul className="space-y-2.5">
                  {service.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface">
            <Image src={service.image} alt={service.title} fill className="object-cover" />
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}

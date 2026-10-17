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

          <div className={`relative w-full overflow-hidden rounded-2xl bg-surface ${service.image ? "" : "aspect-square"}`}>
            {service.image ? (
              <Image src={service.image} alt={service.title} width={0} height={0} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-500 to-ink-900">
                <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />
                {service.icon && <service.icon className="relative h-20 w-20 text-white/90" strokeWidth={1.25} />}
              </div>
            )}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}

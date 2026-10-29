import type { Metadata } from "next";
import { BookOpenCheck, Crosshair, Gauge } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import IndustryExplorer from "@/components/sections/IndustryExplorer";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  alternates: { canonical: "/industries" },
  title: "Industries",
  description:
    "Sector briefs for financial services, healthcare, manufacturing, technology, professional services, critical infrastructure, retail and education.",
};

const tailoring = [
  {
    icon: BookOpenCheck,
    title: "We speak your regulator's language",
    detail: "Findings are mapped to the framework your supervisor already uses, whether that's the CAF, the DSPT or PS21/3, so evidence drops straight into your next return.",
  },
  {
    icon: Crosshair,
    title: "We test against the attackers who target you",
    detail: "A retailer's help desk and a water company's telemetry face very different adversaries. Test plans start from the techniques seen in your sector this year.",
  },
  {
    icon: Gauge,
    title: "We work inside your operating limits",
    detail: "Change freezes, clinical windows, peak trading and plant shutdowns are planned in from the first week, not discovered halfway through.",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Built around the risks your sector faces"
        description="Pick your sector to see the rules you answer to, the services we usually lead with and a link to the full brief."
        breadcrumbs={[{ label: "Industries", href: "/industries" }]}
      />

      <IndustryExplorer />

      <section className="border-t border-ink-900/8 bg-surface py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Sector fit"
            title="Three ways we adapt to your industry"
            description="The practices stay the same; how we apply them changes with the sector."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {tailoring.map((t, i) => (
              <div key={t.title} className="relative overflow-hidden rounded-2xl border border-ink-900/8 bg-white p-7">
                <span className="absolute right-6 top-5 text-5xl font-bold text-ink-900/[0.05]">0{i + 1}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <t.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink-900">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

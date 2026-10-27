import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import MissionSection from "@/components/sections/MissionSection";
import TechStack from "@/components/sections/TechStack";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description: "Meet CoreDefense: a small, senior UK team covering security, process design, software and AI, and the principles behind how we work.",
};

const principles = [
  {
    title: "Start with the business, not the tool",
    description: "Every engagement opens by understanding how your organisation runs day to day, so recommendations fit real processes and budgets.",
  },
  {
    title: "Pull in the right practice at the right time",
    description: "A security review that uncovers a broken process brings in our transformation team; an automation project gets a security check before go-live.",
  },
  {
    title: "Leave you more capable",
    description: "We document, hand over and train as we go, so your team understands what was done and can run it without us.",
  },
];


export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About CoreDefense"
        title="Senior specialists, no hand-offs"
        description="Who we are, how we work and the principles behind every engagement, from a first security review to a full platform build."
        breadcrumbs={[{ label: "About", href: "/about" }]}
      />

      <section id="approach" className="bg-surface py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Approach"
              title="How an engagement with us runs"
              description="We're deliberately small and senior. That shapes how we work with every client."
            />
            <ol className="mt-10 space-y-6">
              {principles.map((p, i) => (
                <li key={p.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-ink-900">{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">{p.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-sm">
            <video
              src="/video/brand-spinning.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="aspect-[4/5] w-full object-contain"
            />
          </div>
        </div>
      </section>

      <MissionSection />
      <TechStack />

    </>
  );
}

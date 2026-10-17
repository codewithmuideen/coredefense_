import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Mail, UserRound, Users } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import MissionSection from "@/components/sections/MissionSection";
import TechStack from "@/components/sections/TechStack";
import ConsultationCTA from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "About",
  description: "CoreDefense is a UK technology company delivering cybersecurity, business transformation, digital engineering and AI & automation.",
};

const principles = [
  {
    title: "Start with the business, not the tool",
    description: "Every engagement opens by understanding how your organisation actually runs, so recommendations fit real processes and budgets.",
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

const companyLinks = [
  { icon: UserRound, label: "Team", description: "Meet the people leading CoreDefense.", href: "/team" },
  { icon: Briefcase, label: "Careers", description: "How we work and who we look for.", href: "/careers" },
  { icon: Users, label: "Talent Hub", description: "Introduce yourself for future roles.", href: "/careers/talent-hub" },
  { icon: Mail, label: "Contact", description: "Talk to us about your organisation.", href: "/contact" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About CoreDefense"
        title="A UK technology partner built around four connected practices"
        description="CoreDefense simplifies cybersecurity through AI-powered, compliance-ready solutions that detect, prioritise and remediate threats faster, alongside business transformation, digital engineering and AI & automation."
        breadcrumbs={[{ label: "About", href: "/about" }]}
      />

      <section id="approach" className="bg-surface py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our Approach"
              title="How an engagement with us actually works"
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

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="The Company" title="Get to know CoreDefense" align="center" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {companyLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring group flex h-full flex-col rounded-2xl border border-ink-900/8 bg-surface-near p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-ink-900">{item.label}</h3>
                <p className="mt-1 flex-1 text-sm text-ink-600">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                  Visit
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}

import type { Metadata } from "next";
import { Linkedin } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import TeamGrid from "@/components/sections/TeamGrid";
import CTAButton from "@/components/ui/CTAButton";

export const metadata: Metadata = {
  title: "Leadership Team",
  description: "Meet the people leading CoreDefense across cybersecurity, AI research and technology delivery.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our People"
        title="Meet the people behind CoreDefense"
        description="A small, hands-on leadership team bringing together security engineering, analysis and AI research. Hover a profile to connect with any of us on LinkedIn."
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Leadership Team", href: "/team" },
        ]}
      />

      <section className="relative overflow-hidden bg-black py-24 sm:py-32">
        <div className="absolute inset-0 bg-grid-dark opacity-25" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[900px] -translate-x-1/2 rounded-full bg-primary-500/15 blur-[140px]" aria-hidden />

        <div className="container-page relative">
          <div className="mb-16 grid gap-6 lg:grid-cols-2 lg:items-end">
            <h2 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Honest leadership, <span className="text-primary-400">hands-on expertise</span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-white/60 lg:justify-self-end">
              To safeguard the digital world by delivering innovative security solutions and promoting
              cybersecurity awareness, with every engagement led by the people you see here.
            </p>
          </div>

          <TeamGrid />
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-14 sm:px-14">
            <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-500/25 blur-3xl" aria-hidden />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
                  <Linkedin className="h-4 w-4" /> Grow with us
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Want to build CoreDefense with us?</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  We&apos;re always keen to hear from security engineers, analysts and AI researchers who care about
                  doing the work properly.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <CTAButton href="/careers" size="lg">
                  View careers
                </CTAButton>
                <CTAButton href="/contact" variant="ghost" size="lg" icon={false}>
                  Contact the team
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

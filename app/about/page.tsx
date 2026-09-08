import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import StatCounter from "@/components/ui/StatCounter";
import Difference from "@/components/sections/Difference";
import SecurityProcess from "@/components/sections/SecurityProcess";
import ConsultationCTA from "@/components/sections/ConsultationCTA";
import { teamPhotos } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "About",
  description: "CoreDefense is a UK technology company delivering cybersecurity, business transformation, digital engineering and AI & automation.",
};

const stats = [
  { value: 18750, suffix: "+", label: "Threats Resolved" },
  { value: 3784, suffix: "+", label: "Jobs Completed" },
  { value: 99, suffix: "%", label: "Platform Uptime" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About CoreDefense"
        title="A UK technology partner built around four connected practices"
        description="CoreDefense simplifies cybersecurity through AI-powered, compliance-ready solutions that detect, prioritise and remediate threats faster — alongside business transformation, digital engineering and AI & automation."
        breadcrumbs={[{ label: "About", href: "/about" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-10 sm:grid-cols-3">
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} dark={false} />
          ))}
        </div>
      </section>

      <section id="approach" className="bg-surface py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Our Approach"
            title="Four practices. One way of working."
            description="Cybersecurity, business transformation, digital engineering and AI & automation aren't run as separate businesses at CoreDefense — every engagement draws on the practice that fits, informed by the others."
          />
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

      <Difference />
      <SecurityProcess />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Our People" title="The people behind CoreDefense" align="center" />
          <div className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {teamPhotos.map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover grayscale transition-all duration-300 hover:grayscale-0"
                  style={{ objectPosition: "top" }}
                  priority={i < 3}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}

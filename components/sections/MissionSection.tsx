"use client";

import { motion } from "framer-motion";
import { Target, Layers, ShieldCheck, FileCheck2 } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";

const pillars = [
  {
    icon: Layers,
    title: "Led by practitioners",
    description: "The people who scope your engagement are the people who do the work, with no hand-off to an anonymous delivery team.",
  },
  {
    icon: ShieldCheck,
    title: "Security that keeps pace",
    description: "AI-powered and compliance-ready, built to run continuously rather than as a once-a-year scramble.",
  },
  {
    icon: FileCheck2,
    title: "Compliance as a by-product",
    description: "Not a separate project. Governance and control mapping built into everyday security operations.",
  },
];

export default function MissionSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <div className="grid overflow-hidden rounded-3xl border border-ink-900/8 shadow-sm lg:grid-cols-2">
          <div className="relative overflow-hidden bg-ink-900 p-10 sm:p-14">
            <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary-500/20 blur-[100px]" aria-hidden />

            <div className="relative">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-primary-400/30" aria-hidden />
                <div className="absolute inset-2 rounded-full border border-primary-400/20" aria-hidden />
                <Target className="relative h-6 w-6 text-primary-400" />
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
                <span className="h-px w-6 bg-primary-400" />
                Our Mission
              </p>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                One technology partner, built for how businesses actually run
              </h2>
              <p className="mt-4 max-w-md text-balance text-base leading-relaxed text-white/60">
                CoreDefense exists because cybersecurity, transformation, engineering and AI are usually sold as
                separate products from separate vendors. We connect them into one partnership, so your security
                strategy keeps pace with how your business actually operates.
              </p>
              <div className="mt-8">
                <CTAButton href="/about#approach" variant="ghost">
                  Our approach
                </CTAButton>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 bg-surface p-8 sm:p-10">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-start gap-4 rounded-2xl border border-ink-900/8 bg-white p-5 shadow-sm ${i === 1 ? "sm:ml-6" : ""}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-900">{pillar.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-600">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

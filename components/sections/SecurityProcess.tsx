"use client";

import { motion } from "framer-motion";
import { Search, ListOrdered, Zap, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    duration: "1–2 Weeks",
    description: "Identify assets, vulnerabilities, risks and operational gaps across IT, cloud and OT.",
  },
  {
    number: "02",
    icon: ListOrdered,
    title: "Prioritise",
    duration: "3–5 Days",
    description: "Use intelligence and business context to identify what matters most, not just CVSS scores.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Respond",
    duration: "Ongoing",
    description: "Turn security findings into actionable, tracked remediation with clear ownership.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Strengthen",
    duration: "Continuous",
    description: "Improve resilience through continuous monitoring, governance and optimisation.",
  },
];

export default function SecurityProcess() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="How We Work"
          title="A continuous cycle, not a one-off audit"
          align="center"
          description="CoreDefense's security process is designed to repeat, because risk isn't static. Typical phase durations below, adapted to the scope of your environment."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i > 0 && (
                <div className="ml-[27px] h-10 w-px border-l-2 border-dashed border-primary-200" aria-hidden />
              )}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-stretch gap-5 ${i % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""}`}
              >
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary-200 bg-white shadow-sm">
                  <step.icon className="h-6 w-6 text-primary-500" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-[10px] font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <div
                  className={`mb-6 flex flex-1 items-stretch gap-3 overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-sm ${i % 2 === 1 ? "sm:flex-row-reverse" : ""}`}
                >
                  <div
                    className="flex shrink-0 items-center justify-center bg-primary-500 px-2.5 py-4 text-[11px] font-bold uppercase tracking-widest text-white"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    {step.duration}
                  </div>
                  <div className="flex-1 py-4 pr-5">
                    <h3 className="text-base font-bold text-ink-900">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

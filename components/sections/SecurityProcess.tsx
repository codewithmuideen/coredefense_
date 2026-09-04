"use client";

import { motion } from "framer-motion";
import { Search, ListOrdered, Zap, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  { number: "01", icon: Search, title: "Discover", description: "Identify assets, vulnerabilities, risks and operational gaps across IT, cloud and OT." },
  { number: "02", icon: ListOrdered, title: "Prioritise", description: "Use intelligence and business context to identify what matters most — not just CVSS scores." },
  { number: "03", icon: Zap, title: "Respond", description: "Turn security findings into actionable, tracked remediation with clear ownership." },
  { number: "04", icon: TrendingUp, title: "Strengthen", description: "Improve resilience through continuous monitoring, governance and optimisation." },
];

export default function SecurityProcess() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="How We Work"
          title="A continuous cycle, not a one-off audit"
          align="center"
          description="CoreDefense's security process is designed to repeat — because risk isn't static."
        />

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent lg:block" aria-hidden />
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-start"
            >
              <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-primary-200 bg-white shadow-sm">
                <step.icon className="h-7 w-7 text-primary-500" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 text-[10px] font-bold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

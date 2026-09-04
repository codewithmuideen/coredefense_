"use client";

import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Workflow, TrendingUp, ArrowDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";

const flow = [
  { icon: Sparkles, label: "AI" },
  { icon: BrainCircuit, label: "Decision Intelligence" },
  { icon: Workflow, label: "Automation" },
  { icon: TrendingUp, label: "Business Outcomes" },
];

export default function AIAutomationSection() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="AI & Automation"
          title="Turn intelligence into action"
          align="center"
          description="We help organisations use AI, machine learning and automation to improve operations, intelligence, productivity and decision-making."
        />

        <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-0">
          {flow.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center gap-2 sm:flex-1"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-ink-900/5">
                <item.icon className="h-7 w-7 text-primary-500" />
              </div>
              <p className="text-center text-sm font-semibold text-ink-800">{item.label}</p>
              {i < flow.length - 1 && (
                <ArrowDown className="h-4 w-4 rotate-[-90deg] text-primary-300 sm:mx-2 sm:mt-6" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <CTAButton href="/ai-automation" variant="secondary">
            Explore AI &amp; automation
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

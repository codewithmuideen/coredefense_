"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  ShieldCheck,
  Workflow,
  Boxes,
  Code2,
  Terminal,
  Radar,
  FileCheck2,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const stack = [
  { icon: Cloud, label: "AWS, Azure & GCP" },
  { icon: FileCheck2, label: "ISO 27001 & NIST" },
  { icon: ShieldCheck, label: "PCI DSS & GDPR" },
  { icon: Workflow, label: "BPMN Process Modelling" },
  { icon: Boxes, label: "Kubernetes & Docker" },
  { icon: Radar, label: "SIEM & SOAR" },
  { icon: Code2, label: "React & Next.js" },
  { icon: Terminal, label: "Python & TypeScript" },
];

export default function TechStack() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Tools & Standards"
          title="Built on the technologies and frameworks that matter"
          description="From cloud platforms to compliance frameworks, these are the tools and standards CoreDefense works with every day, across all four practices."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stack.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-900/8 bg-surface-near px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-ink-800">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

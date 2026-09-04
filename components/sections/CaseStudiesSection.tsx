"use client";

import { motion } from "framer-motion";
import { FileBarChart2 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { caseStudyPlaceholders } from "@/lib/resources-data";

export default function CaseStudiesSection() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Case Studies"
          title="Real work, coming soon"
          description="We're preparing detailed case studies from CoreDefense engagements. Check back soon, or ask us directly about relevant experience in your sector."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {caseStudyPlaceholders.map((cs, i) => (
            <motion.div
              key={cs.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col items-start rounded-2xl border border-dashed border-ink-900/15 bg-white/50 p-6"
            >
              <FileBarChart2 className="h-6 w-6 text-ink-300" />
              <h3 className="mt-4 text-sm font-bold text-ink-900">{cs.title}</h3>
              <p className="mt-2 text-xs font-medium text-ink-400">{cs.status}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

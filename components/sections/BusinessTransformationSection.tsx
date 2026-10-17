"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";

const stages = ["Current State", "Analysis", "Optimisation", "Future State"];

export default function BusinessTransformationSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-hidden rounded-2xl bg-surface"
        >
          <Image src="/images/illustrations/transformation.jpg" alt="Business transformation" width={0} height={0} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
        </motion.div>

        <div>
          <SectionHeading
            eyebrow="Business Transformation & Process Modelling"
            title="Understand how your business really operates"
            description="We map current-state processes, surface inefficiency and risk, and design future-state operating models that are ready for automation, grounded in business analysis, not guesswork."
          />

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {stages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <span className="rounded-full border border-ink-900/10 bg-surface px-4 py-2 text-xs font-semibold text-ink-700">
                  {stage}
                </span>
                {i < stages.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-primary-400" />}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <CTAButton href="/business-transformation" variant="secondary">
              Explore business transformation
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

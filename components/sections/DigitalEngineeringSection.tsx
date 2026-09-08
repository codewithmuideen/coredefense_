"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Code2, Boxes, Cloud, LayoutTemplate } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";

const services = [
  { icon: LayoutTemplate, label: "Websites" },
  { icon: Code2, label: "Web Applications" },
  { icon: Boxes, label: "Digital Platforms" },
  { icon: Cloud, label: "Cloud Systems" },
];

export default function DigitalEngineeringSection() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
      <div className="container-page relative grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            dark
            eyebrow="Digital Engineering & Website Development"
            title="Engineered digital products, not just websites"
            description="We design and build modern websites, web applications and digital platforms — engineered to the same rigour as our cybersecurity practice, from architecture through to deployment."
          />

          <div className="mt-8 grid grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <s.icon className="h-4 w-4 text-primary-400" />
                <span className="text-sm font-medium text-white/80">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <CTAButton href="/digital-engineering" variant="ghost">
              Explore digital engineering
            </CTAButton>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-800 shadow-2xl">
            <Image src="/images/illustrations/automation.jpg" alt="AI and automation" fill className="object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

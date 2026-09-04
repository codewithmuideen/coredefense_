"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { practices } from "@/lib/practices-data";

export default function Difference() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="The CoreDefense Difference"
          title="One technology partner. Four connected practices."
          description="Cybersecurity, transformation, engineering and AI don't operate in isolation at CoreDefense — each practice strengthens the others."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {practices.map((practice, i) => (
            <motion.div
              key={practice.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-ink-900/8 bg-white p-8 transition-shadow hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-sm font-bold text-primary-400">{practice.number}</span>
                <div className="relative h-16 w-16 shrink-0 opacity-90 transition-transform duration-300 group-hover:scale-110">
                  <Image src={practice.image} alt="" fill sizes="64px" className="object-contain" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink-900">{practice.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{practice.description}</p>
              <ul className="mt-5 space-y-2">
                {practice.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-xs font-medium text-ink-600">
                    <Check className="h-3.5 w-3.5 text-primary-500" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={practice.slug}
                className="focus-ring group/link mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600"
              >
                Learn more
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </Link>
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-500/5 transition-transform duration-500 group-hover:scale-150" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

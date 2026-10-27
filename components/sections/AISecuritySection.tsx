"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

// Fixed positions for 6 items evenly spaced around a 150px-radius circle.
// Precomputed (not derived from Math.cos/sin at render time) because trig
// results can differ by a few ULPs between the server and client V8 builds,
// which was causing a hydration mismatch on the inline transform style.
const orbit = [
  { label: "Cybersecurity", x: 150, y: 0 },
  { label: "Automation", x: 75, y: 129.9 },
  { label: "Cloud", x: -75, y: 129.9 },
  { label: "Data", x: -150, y: 0 },
  { label: "Identity", x: -75, y: -129.9 },
  { label: "Applications", x: 75, y: -129.9 },
];

export default function AISecuritySection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          eyebrow="AI & Security"
          title="Where AI, security and the rest of the business meet"
          description="Every AI project touches identity, data, cloud and applications at the same time. That's why our AI work is reviewed by the people who secure those systems, so new capability never opens a new hole."
        />

        <div className="mx-auto scale-[0.68] sm:scale-100">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-80 w-80 items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full border border-dashed border-primary-200" />
            <div className="absolute inset-8 rounded-full border border-dashed border-primary-200" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white shadow-lg shadow-primary-500/30">
              AI
            </div>
            {orbit.map((item, i) => (
              <motion.span
                key={item.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
                className="absolute whitespace-nowrap rounded-full border border-ink-900/10 bg-surface-near px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-sm"
              >
                {item.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

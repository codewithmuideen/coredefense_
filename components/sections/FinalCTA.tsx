"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import BrandCanvas from "@/components/visuals/BrandCanvas";
import LiquidGlass from "@/components/ui/LiquidGlass";
import CTAButton from "@/components/ui/CTAButton";
import { Mail } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  // Light rises with the visitor as the section scrolls into place; copy settles at a slower rate.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 90, reduceMotion ? 0 : -90]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/15 blur-[160px]" aria-hidden />
      <BrandCanvas containerRef={sectionRef} scroll={scrollYProgress} focus={[0.5, 0.45]} intensity={0.95} />
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,13,22,0.7),transparent_70%)]" aria-hidden />

      <motion.div style={{ y: copyY }} className="container-page relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          Build with confidence.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-5 max-w-xl text-balance text-base text-white/60 sm:text-lg"
        >
          Tell us what you&apos;re working on and a specialist will come back with a straight answer, usually within one working day.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <LiquidGlass tone="dark" radius={8} bezel={14} refraction={26} blur={6} className="rounded-lg">
            <CTAButton href={`mailto:${CONTACT.email}`} variant="ghost" size="lg" icon={false} className="bg-white/[0.07]">
              <Mail className="h-5 w-5" /> {CONTACT.email}
            </CTAButton>
          </LiquidGlass>
        </motion.div>
      </motion.div>
    </section>
  );
}

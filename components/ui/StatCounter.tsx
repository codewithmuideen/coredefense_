"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion, animate } from "framer-motion";
import { formatNumber } from "@/lib/utils";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  dark?: boolean;
}

export default function StatCounter({ value, suffix = "", prefix = "", label, dark = true }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="text-center sm:text-left"
    >
      <span
        ref={ref}
        className={`block text-4xl font-bold tracking-tight sm:text-5xl ${dark ? "text-white" : "text-ink-900"}`}
      >
        {prefix}
        {formatNumber(display)}
        {suffix}
      </span>
      <span className={`mt-2 block text-sm font-medium ${dark ? "text-white/60" : "text-ink-600/70"}`}>{label}</span>
    </motion.div>
  );
}

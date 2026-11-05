"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-linked entrance: the block opens from slightly inset to full size as it rises into view,
 * then stays put. Tied to scroll position (not time), so it tracks the visitor's own pace.
 */
export default function ScrollScaleIn({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.55"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.78, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [160, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ scale, y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { practices } from "@/lib/practices-data";
import type { Practice } from "@/types";

const STICKY_TOP = 96;
const STACK_OFFSET = 20;

function StackCard({ practice, index, total }: { practice: Practice; index: number; total: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isLast = index === total - 1;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.55]);
  const imageFirst = index % 2 === 0;

  return (
    <div ref={trackRef} className={cn("relative", !isLast && "md:h-[115vh]")}>
      <div className="sticky flex items-center" style={{ top: STICKY_TOP + index * STACK_OFFSET }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ scale, opacity, zIndex: index + 1 }}
          className={cn(
            "flex w-full origin-top flex-col overflow-hidden rounded-3xl border border-ink-900/8 bg-white shadow-2xl md:flex-row",
            !imageFirst && "md:flex-row-reverse"
          )}
        >
          <div className="relative flex w-full shrink-0 items-center overflow-hidden bg-white md:w-1/2">
            <Image
              src={practice.image}
              alt=""
              width={0}
              height={0}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
            <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 font-mono text-sm font-bold text-primary-600 shadow-sm">
              {practice.number}
            </span>
          </div>

          <div className="flex w-full flex-col justify-center p-8 sm:p-10 md:w-1/2 md:p-14">
            <h3 className="text-2xl font-bold leading-tight text-ink-900 sm:text-3xl">{practice.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-ink-600">{practice.description}</p>
            <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {practice.points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm font-medium text-ink-600">
                  <Check className="h-4 w-4 shrink-0 text-primary-500" />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={practice.slug}
              className="focus-ring group/link mt-9 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary-600"
            >
              Learn more
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Difference() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="The CoreDefense Difference"
          title="One technology partner. Four connected practices."
          description="Cybersecurity, transformation, engineering and AI don't operate in isolation at CoreDefense. Each practice strengthens the others."
        />

        <div className="mt-14">
          {practices.map((practice, i) => (
            <StackCard key={practice.slug} practice={practice} index={i} total={practices.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

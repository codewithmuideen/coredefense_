"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { MegaMenuSection } from "@/types";

interface MegaMenuPanelProps {
  menu: MegaMenuSection;
  onNavigate: () => void;
}

export default function MegaMenuPanel({ menu, onNavigate }: MegaMenuPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-0 top-full w-full border-t border-ink-900/5 bg-white shadow-2xl"
    >
      <div
        className="container-page grid gap-10 py-10"
        style={{ gridTemplateColumns: `repeat(${menu.columns.length}, minmax(0, 1fr)) 320px` }}
      >
        {menu.columns.map((column) => (
          <div key={column.heading}>
            <Link
              href={column.href ?? "#"}
              onClick={onNavigate}
              className="focus-ring mb-4 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-ink-500 hover:text-primary-500"
            >
              {column.heading}
            </Link>
            <ul className="space-y-1">
              {column.links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className="focus-ring group flex items-start gap-3 rounded-lg px-2 py-2 text-sm text-ink-700 transition-colors hover:bg-primary-50 hover:text-primary-600"
                    >
                      {Icon && (
                        <Icon
                          className="mt-0.5 h-4 w-4 shrink-0 text-ink-400 transition-colors group-hover:text-primary-500"
                          aria-hidden
                        />
                      )}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="relative overflow-hidden rounded-2xl bg-ink-900 p-6">
          <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/30 blur-3xl" aria-hidden />
          <div className="relative">
            <div className="relative mb-4 h-28 w-full overflow-hidden rounded-lg bg-white/5">
              <Image
                src={menu.featured.image}
                alt=""
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
            <h3 className="text-sm font-bold text-white">{menu.featured.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/60">{menu.featured.description}</p>
            <Link
              href={menu.featured.href}
              onClick={onNavigate}
              className="focus-ring group mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300"
            >
              {menu.featured.ctaLabel}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

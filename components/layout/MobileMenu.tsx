"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogIn, X } from "lucide-react";
import { megaMenus } from "@/lib/nav-data";
import CTAButton from "@/components/ui/CTAButton";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-white lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-ink-900/10 px-6 py-4">
            <Link href="/" onClick={onClose} className="flex items-center">
              <Logo />
            </Link>
            <button onClick={onClose} aria-label="Close menu" className="focus-ring rounded-md p-2 text-ink-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="h-[calc(100vh-72px)] overflow-y-auto px-6 py-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-400">Main pages</p>
            <nav className="mb-6 flex flex-col divide-y divide-ink-900/5">
              {[
                { label: "Home", href: "/" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="focus-ring py-3 text-lg font-semibold text-ink-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-400">Explore</p>
            <div className="flex flex-col divide-y divide-ink-900/5">
              {megaMenus.map((menu) => (
                <div key={menu.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={menu.href}
                      onClick={onClose}
                      className="focus-ring flex-1 py-3 text-base font-semibold text-ink-900 hover:text-primary-600"
                    >
                      {menu.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setExpanded((cur) => (cur === menu.label ? null : menu.label))}
                      className="focus-ring -mr-2 rounded-md p-3 text-ink-400"
                      aria-expanded={expanded === menu.label}
                      aria-label={`Show ${menu.label} links`}
                    >
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", expanded === menu.label && "rotate-180")}
                      />
                    </button>
                  </div>
                  <AnimatePresence>
                    {expanded === menu.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 pb-4 pl-2">
                          {menu.columns.map((col) => (
                            <div key={col.heading}>
                              <p className="mb-1.5 text-xs font-semibold text-ink-400">{col.heading}</p>
                              <ul className="space-y-1">
                                {col.links.map((link) => (
                                  <li key={link.label}>
                                    <Link
                                      href={link.href}
                                      onClick={onClose}
                                      className="focus-ring block py-1.5 text-sm text-ink-700 hover:text-primary-600"
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <CTAButton href="/contact" className="w-full justify-center" icon={false} onClick={onClose}>
                Talk to an Expert
              </CTAButton>
              <Link
                href="/login"
                onClick={onClose}
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-800 hover:border-primary-300 hover:text-primary-600"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

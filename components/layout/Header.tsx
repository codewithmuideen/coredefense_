"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Menu, Search } from "lucide-react";
import { megaMenus } from "@/lib/nav-data";
import MegaMenuPanel from "@/components/layout/MegaMenuPanel";
import MobileMenu from "@/components/layout/MobileMenu";
import GlobalSearch from "@/components/layout/GlobalSearch";
import CTAButton from "@/components/ui/CTAButton";
import Logo from "@/components/ui/Logo";
import BookingModal from "@/components/forms/BookingModal";
import { cn } from "@/lib/utils";

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function openMenu(label: string) {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveMenu(label);
  }

  function scheduleClose() {
    closeTimeout.current = setTimeout(() => setActiveMenu(null), 150);
  }

  const activeMegaMenu = megaMenus.find((m) => m.label === activeMenu);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-colors duration-300",
          scrolled || activeMenu ? "bg-white shadow-sm" : "bg-white"
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="container-page flex h-[72px] items-center justify-between py-3">
          <Link href="/" className="focus-ring flex shrink-0 items-center rounded-md" aria-label="CoreDefense home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {megaMenus.map((menu) => (
              <div key={menu.label} onMouseEnter={() => openMenu(menu.label)}>
                <button
                  type="button"
                  onClick={() => setActiveMenu((cur) => (cur === menu.label ? null : menu.label))}
                  className={cn(
                    "focus-ring flex items-center rounded-md px-3.5 py-2 text-sm font-semibold transition-colors",
                    activeMenu === menu.label ? "text-primary-600" : "text-ink-700 hover:text-primary-600"
                  )}
                  aria-expanded={activeMenu === menu.label}
                >
                  {menu.label}
                </button>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="focus-ring hidden items-center gap-2 rounded-md border border-ink-900/10 px-3 py-2 text-sm text-ink-500 transition-colors hover:border-primary-300 hover:text-primary-600 lg:flex"
              aria-label="Search CoreDefense"
            >
              <Search className="h-4 w-4" />
              <span className="text-xs text-ink-400">
                <kbd className="rounded border border-ink-900/10 bg-surface px-1.5 py-0.5 text-[10px]">⌘K</kbd>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="focus-ring rounded-md p-2 text-ink-600 hover:text-primary-600 lg:hidden"
              aria-label="Search CoreDefense"
            >
              <Search className="h-5 w-5" />
            </button>

            <CTAButton
              href="/platform/features"
              variant="secondary"
              size="md"
              icon={false}
              className="hidden xl:inline-flex"
            >
              Explore Our Capabilities
            </CTAButton>
            <BookingModal
              trigger={
                <CTAButton variant="primary" size="md" icon={false} className="hidden sm:inline-flex">
                  Book a Consultation
                </CTAButton>
              }
            />

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="focus-ring rounded-md p-2 text-ink-700 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeMegaMenu && (
            <div onMouseEnter={() => openMenu(activeMegaMenu.label)}>
              <MegaMenuPanel menu={activeMegaMenu} onNavigate={() => setActiveMenu(null)} />
            </div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

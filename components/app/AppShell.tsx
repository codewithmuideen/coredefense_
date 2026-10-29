"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, BookOpen, ChevronDown, ClipboardList, FileClock, LayoutDashboard, LifeBuoy, LogOut, Megaphone, Menu, Search,
  ShieldAlert, ShieldCheck, UserRound, Users, X, ArrowLeftRight,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Avatar } from "@/components/app/ui";
import { ToastProvider } from "@/components/app/Toaster";
import NotificationBell from "@/components/app/NotificationBell";
import CommandPalette, { type Command } from "@/components/app/CommandPalette";
import { cn } from "@/lib/utils";

export interface ShellUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  jobTitle: string | null;
  isAdmin: boolean;
}

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number };

export default function AppShell({ variant, user, unread, openFindings, openTickets, children }: {
  variant: "user" | "admin";
  user: ShellUser;
  unread: number;
  openFindings?: number;
  openTickets?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const nav: { section: string; items: NavItem[] }[] =
    variant === "admin"
      ? [
          { section: "Admin", items: [
            { href: "/admin", label: "Overview", icon: LayoutDashboard },
            { href: "/admin/users", label: "Users", icon: Users },
            { href: "/admin/tickets", label: "Support tickets", icon: LifeBuoy, badge: openTickets },
            { href: "/admin/broadcast", label: "Broadcast", icon: Megaphone },
            { href: "/admin/audit", label: "Audit log", icon: FileClock },
          ] },
        ]
      : [
          { section: "Workspace", items: [
            { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
            { href: "/dashboard/findings", label: "Findings", icon: ShieldAlert, badge: openFindings },
            { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: unread || undefined },
            { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
          ] },
          { section: "Account", items: [
            { href: "/dashboard/profile", label: "Profile", icon: UserRound },
            { href: "/dashboard/security", label: "Security", icon: ShieldCheck },
          ] },
        ];

  const isActive = (href: string) => (href === "/dashboard" || href === "/admin" ? pathname === href : pathname.startsWith(href));

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/login?signed-out=1");
    router.refresh();
  }

  const commands: Command[] = [
    ...nav.flatMap((g) => g.items.map((i) => ({ label: i.label, hint: g.section, href: i.href, icon: i.icon }))),
    ...(variant === "admin"
      ? [{ label: "Switch to my workspace", hint: "Navigate", href: "/dashboard", icon: ArrowLeftRight }]
      : user.isAdmin
        ? [{ label: "Open admin console", hint: "Navigate", href: "/admin", icon: ArrowLeftRight }]
        : []),
    { label: "Change password", hint: "Security", href: "/dashboard/security#password", icon: ShieldCheck },
    { label: "Set up authenticator app", hint: "Security", href: "/dashboard/security#two-factor", icon: ShieldCheck },
    { label: "Upload profile photo", hint: "Profile", href: "/dashboard/profile", icon: UserRound },
    { label: "Open a support request", hint: "Support", href: "/dashboard/support?new=1", icon: LifeBuoy },
    { label: "Read security guides", hint: "Resources", href: "/resources/guides", icon: BookOpen },
  ];

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href={variant === "admin" ? "/admin" : "/dashboard"} className="focus-ring rounded-md" aria-label="CoreDefense home">
          <Logo dark />
        </Link>
        <button className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      {variant === "admin" && (
        <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200">
          <ShieldCheck className="h-4 w-4" /> Admin console
        </div>
      )}

      <nav className="scroll-slim flex-1 overflow-y-auto px-3 py-3" aria-label="Main">
        {nav.map((group) => (
          <div key={group.section} className="mb-6">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">{group.section}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "focus-ring group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                      )}
                    >
                      {active && <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary-400" />}
                      <item.icon className={cn("h-[18px] w-[18px]", active ? "text-primary-300" : "text-white/45 group-hover:text-white/80")} />
                      <span className="flex-1">{item.label}</span>
                      {!!item.badge && (
                        <span className="rounded-full bg-primary-500/90 px-1.5 py-px text-[11px] font-semibold text-white">{item.badge > 99 ? "99+" : item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/[0.07] p-3">
        {(variant === "admin" || user.isAdmin) && (
          <Link
            href={variant === "admin" ? "/dashboard" : "/admin"}
            className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeftRight className="h-[18px] w-[18px] text-white/45" />
            {variant === "admin" ? "My workspace" : "Admin console"}
          </Link>
        )}
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-2.5">
          <Avatar src={user.avatarUrl} name={user.name} size={34} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-white/45">{user.email}</p>
          </div>
          <button onClick={signOut} disabled={signingOut} className="focus-ring rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white" aria-label="Sign out" title="Sign out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F5F7FB]">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink-900 lg:block">
          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary-500/15 blur-[90px]" aria-hidden />
          <div className="relative h-full">{sidebar}</div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden />
            <aside className="animate-fade-up absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-ink-900 shadow-2xl">{sidebar}</aside>
          </div>
        )}

        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-900/[0.06] bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <button className="focus-ring-light -ml-1 rounded-md p-2 text-ink-700 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={() => setPaletteOpen(true)}
              className="focus-ring-light flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-ink-900/10 bg-slate-50/80 px-3 text-sm text-slate-400 transition-colors hover:border-ink-900/20 sm:max-w-sm"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate">Search pages and actions…</span>
              <kbd className="ml-auto hidden rounded border border-ink-900/10 bg-white px-1.5 py-0.5 font-sans text-[11px] font-semibold text-slate-500 sm:inline">Ctrl K</kbd>
            </button>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <NotificationBell userId={user.id} initialUnread={unread} />

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="focus-ring-light flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-ink-900/5"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <Avatar src={user.avatarUrl} name={user.name} size={34} />
                  <span className="hidden max-w-[140px] truncate text-sm font-semibold text-ink-800 md:block">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden />
                    <div role="menu" className="animate-toast-in absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-xl shadow-ink-900/10">
                      <div className="flex items-center gap-3 border-b border-ink-900/[0.06] p-4">
                        <Avatar src={user.avatarUrl} name={user.name} size={40} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                          <p className="truncate text-xs text-slate-500">{user.jobTitle || user.email}</p>
                        </div>
                      </div>
                      <div className="p-1.5">
                        {[
                          { href: "/dashboard/profile", label: "Profile", icon: UserRound },
                          { href: "/dashboard/security", label: "Security", icon: ShieldCheck },
                          { href: "/dashboard/support", label: "Support", icon: ClipboardList },
                          ...(user.isAdmin ? [{ href: variant === "admin" ? "/dashboard" : "/admin", label: variant === "admin" ? "My workspace" : "Admin console", icon: ArrowLeftRight }] : []),
                        ].map((i) => (
                          <Link key={i.href} href={i.href} role="menuitem" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-slate-50">
                            <i.icon className="h-4 w-4 text-slate-400" /> {i.label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-ink-900/[0.06] p-1.5">
                        <button onClick={signOut} disabled={signingOut} role="menuitem" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                          <LogOut className="h-4 w-4" /> {signingOut ? "Signing out…" : "Sign out"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <main id="main-content" className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
        </div>

        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      </div>
    </ToastProvider>
  );
}

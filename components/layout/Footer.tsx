import Link from "next/link";
import { Linkedin, Twitter, Github } from "lucide-react";
import { footerColumns } from "@/lib/nav-data";
import NewsletterForm from "@/components/forms/NewsletterForm";
import CookieSettingsLink from "@/components/layout/CookieSettingsLink";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link href="/" className="focus-ring inline-flex items-center rounded-md">
              <Logo dark />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              A UK technology partner delivering AI-powered cybersecurity, business transformation, digital
              engineering and AI &amp; automation for enterprise organisations.
            </p>
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">Stay informed</p>
              <NewsletterForm dark />
            </div>
            <div className="mt-8 flex items-center gap-3">
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://twitter.com" label="X (Twitter)">
                <Twitter className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://github.com" label="GitHub">
                <Github className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerColumns.map((col) => (
              <div key={col.heading}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">{col.heading}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="focus-ring text-sm text-white/70 transition-colors hover:text-primary-400">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} CoreDefense Limited. United Kingdom.</p>
          <div className="flex items-center gap-4">
            <span>
              Cybersecurity platform features described on this site are in development.{" "}
              <Link href="/faq" className="underline hover:text-primary-400">
                Learn more
              </Link>
            </span>
            <CookieSettingsLink />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-primary-400 hover:text-primary-400"
    >
      {children}
    </a>
  );
}

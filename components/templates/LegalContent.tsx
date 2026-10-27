import Link from "next/link";
import { Mail } from "lucide-react";

export interface LegalSection {
  heading: string;
  body: string | string[];
  list?: string[];
  table?: { headers: string[]; rows: string[][] };
}

interface LegalContentProps {
  sections: LegalSection[];
  updated?: string;
  children?: React.ReactNode;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function LegalContent({ sections, updated, children }: LegalContentProps) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="On this page" className="rounded-2xl border border-ink-900/8 bg-surface-near p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">On this page</p>
            <ol className="mt-3 space-y-1">
              {sections.map((section, i) => (
                <li key={section.heading}>
                  <a
                    href={`#${slugify(section.heading)}`}
                    className="focus-ring flex gap-2 rounded-md px-2 py-1.5 text-sm text-ink-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
                  >
                    <span className="w-5 shrink-0 text-ink-300">{i + 1}.</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          {updated && <p className="mt-4 px-1 text-xs text-ink-400">Last updated: {updated}</p>}
        </aside>

        <div className="max-w-3xl">
          <div className="space-y-12">
            {sections.map((section, i) => (
              <article key={section.heading} id={slugify(section.heading)} className="scroll-mt-28">
                <h2 className="flex items-baseline gap-3 text-xl font-bold text-ink-900 sm:text-2xl">
                  <span className="text-sm font-semibold text-primary-500">{String(i + 1).padStart(2, "0")}</span>
                  {section.heading}
                </h2>
                {(Array.isArray(section.body) ? section.body : [section.body]).map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mt-4 text-[15px] leading-relaxed text-ink-600">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-4 space-y-2 pl-1">
                    {section.list.map((item) => (
                      <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink-600">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.table && (
                  <div className="mt-5 overflow-x-auto rounded-xl border border-ink-900/10">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead className="bg-surface text-xs uppercase tracking-wide text-ink-500">
                        <tr>
                          {section.table.headers.map((h) => (
                            <th key={h} className="px-4 py-3 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink-900/8">
                        {section.table.rows.map((row) => (
                          <tr key={row.join("|")}>
                            {row.map((cell, ci) => (
                              <td key={ci} className={ci === 0 ? "px-4 py-3 font-mono text-xs text-ink-900" : "px-4 py-3 text-ink-600"}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            ))}
          </div>

          {children}

          <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-primary-100 bg-primary-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
              <div>
                <p className="font-semibold text-ink-900">Questions about this policy?</p>
                <p className="mt-0.5 text-sm text-ink-600">
                  Email{" "}
                  <a href="mailto:info@coredefense.co.uk" className="font-semibold text-primary-600 underline-offset-2 hover:underline">
                    info@coredefense.co.uk
                  </a>{" "}
                  and we&apos;ll get back to you.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <Link href="/privacy" className="text-ink-600 hover:text-primary-600">Privacy</Link>
              <Link href="/cookies" className="text-ink-600 hover:text-primary-600">Cookies</Link>
              <Link href="/terms" className="text-ink-600 hover:text-primary-600">Terms</Link>
              <Link href="/accessibility" className="text-ink-600 hover:text-primary-600">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

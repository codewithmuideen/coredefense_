import Link from "next/link";
import { ArrowRight, X, Check } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Home: why a passed audit isn't the same as being hard to breach. Figures are from named public reports.
const stats = [
  {
    value: "50%",
    label: "of UK businesses reported a cyber breach or attack in the past year",
    source: "UK Cyber Security Breaches Survey 2024",
  },
  {
    value: "$4.88m",
    label: "global average cost of a data breach, the highest on record",
    source: "IBM Cost of a Data Breach Report 2024",
  },
  {
    value: "68%",
    label: "of breaches involved a non-malicious human element, such as a mistake or a phishing click",
    source: "Verizon Data Breach Investigations Report 2024",
  },
];

const contrast = [
  { checkbox: "A policy says MFA is enforced", reality: "Every account is tested to prove it is" },
  { checkbox: "An annual scan was run", reality: "Exploitable issues are fixed and re-verified" },
  { checkbox: "Staff completed training", reality: "Staff report phishing faster than they click it" },
];

export default function WhyItMatters() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <ScrollReveal>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            <span className="h-px w-6 bg-primary-500" /> Beyond the checklist
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Passing an audit and being hard to breach are not the same thing
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600">
            Certificates prove a control was written down. Attackers test whether it holds. We close the gap between the two,
            so the evidence you hand an auditor describes a business that is genuinely difficult to get into.
          </p>

          <div className="mt-9 overflow-hidden rounded-2xl border border-ink-900/8">
            <div className="grid grid-cols-2 bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink-400">
              <span>Ticks the box</span>
              <span>Stops the attacker</span>
            </div>
            {contrast.map((row) => (
              <div key={row.checkbox} className="grid grid-cols-2 gap-4 border-t border-ink-900/8 px-5 py-4 text-sm">
                <span className="flex items-start gap-2 text-ink-500">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> {row.checkbox}
                </span>
                <span className="flex items-start gap-2 font-medium text-ink-800">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {row.reality}
                </span>
              </div>
            ))}
          </div>

          <Link href="/cybersecurity" className="focus-ring group mt-8 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-600">
            See our security practice <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </ScrollReveal>

        <div className="grid gap-4">
          {stats.map((s, i) => (
            <ScrollReveal key={s.value} delay={i * 0.08}>
              <figure className="group relative overflow-hidden rounded-2xl bg-ink-900 p-7 sm:p-8">
                <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/25 blur-3xl transition-opacity group-hover:opacity-100" aria-hidden />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                  <p className="shrink-0 text-5xl font-bold tracking-tight text-white sm:w-40">{s.value}</p>
                  <div>
                    <p className="text-base leading-relaxed text-white/80">{s.label}</p>
                    <figcaption className="mt-2 text-xs font-medium text-primary-300">Source: {s.source}</figcaption>
                  </div>
                </div>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

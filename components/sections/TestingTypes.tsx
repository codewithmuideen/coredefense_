import Link from "next/link";
import { ArrowRight, Cloud, Code2, Factory, Globe2, Network, UserRoundSearch } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Home: the kinds of hands-on testing we run, each framed as the attacker question it answers.
const tests = [
  { icon: Globe2, name: "External network", question: "What can someone on the internet reach, and how far can they get from there?" },
  { icon: Network, name: "Internal network & Active Directory", question: "If one laptop is compromised, how long until an intruder owns the domain?" },
  { icon: Code2, name: "Web application & API", question: "Can a logged-in user see, change or delete data that belongs to someone else?" },
  { icon: Cloud, name: "Cloud configuration", question: "Which storage, roles or keys would hand an attacker your tenancy?" },
  { icon: UserRoundSearch, name: "Social engineering", question: "Would your help desk reset a password for a convincing stranger on the phone?" },
  { icon: Factory, name: "OT & industrial systems", question: "Could a breach on the office network ever reach the controllers that run the plant?" },
];

export default function TestingTypes() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Attacker's-eye testing"
            title="Find what automated scans miss"
            description="Scanners spot known weaknesses one at a time. Our testers think in attack paths, combining small issues into the routes a real intruder would take."
            className="max-w-2xl"
          />
          <Link
            href="/cybersecurity/security-assessment"
            className="focus-ring group inline-flex w-fit shrink-0 items-center gap-1.5 rounded text-sm font-semibold text-primary-600"
          >
            How an assessment works <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink-900/8 bg-ink-900/8 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((t, i) => (
            <ScrollReveal key={t.name} delay={(i % 3) * 0.06} className="h-full">
              <div className="group relative h-full bg-white p-8 transition-colors hover:bg-primary-50/40">
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary-500 transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
                <t.icon className="h-7 w-7 text-primary-500" strokeWidth={1.5} />
                <h3 className="mt-5 text-base font-bold text-ink-900">{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.question}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

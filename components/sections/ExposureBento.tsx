import Link from "next/link";
import { ArrowUpRight, Boxes, Crosshair, FileCheck2, Gauge, Siren } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

// Home: the security lifecycle as a bento grid, each tile with a small drawn visual instead of a photo.

function AssetVisual() {
  const nodes = [
    [20, 30], [60, 18], [100, 34], [140, 20], [40, 70], [85, 62], [125, 76], [165, 58],
  ];
  return (
    <svg viewBox="0 0 185 95" preserveAspectRatio="xMidYMid meet" className="h-full w-full" aria-hidden>
      {nodes.slice(1).map(([x, y], i) => (
        <line key={i} x1={nodes[i][0]} y1={nodes[i][1]} x2={x} y2={y} stroke="rgba(127,169,255,0.35)" strokeWidth={1} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 5 ? 6 : 4} fill={i === 5 ? "#F59E0B" : "#528BFF"} className={i === 5 ? "animate-pulse" : undefined} />
      ))}
    </svg>
  );
}

function PriorityVisual() {
  const bars = [
    { w: "92%", c: "bg-red-500", l: "Exploited in the wild" },
    { w: "64%", c: "bg-amber-500", l: "Internet-facing" },
    { w: "28%", c: "bg-primary-400", l: "Internal only" },
  ];
  return (
    <div className="space-y-2.5">
      {bars.map((b) => (
        <div key={b.l}>
          <div className="mb-1 flex justify-between text-[10px] font-medium text-white/50">
            <span>{b.l}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className={cn("h-full rounded-full", b.c)} style={{ width: b.w }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AttackPathVisual() {
  const hops = ["Phishing email", "Staff laptop", "File server", "Domain admin"];
  return (
    <div className="flex flex-col gap-1.5" aria-hidden>
      {hops.map((hop, i) => (
        <div key={hop} className="flex items-center gap-2" style={{ paddingLeft: `${i * 14}px` }}>
          <span className={cn("h-2 w-2 shrink-0 rounded-full", i === hops.length - 1 ? "bg-red-500" : "bg-primary-400")} />
          <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold", i === hops.length - 1 ? "bg-red-500/20 text-red-200" : "bg-white/10 text-white/70")}>
            {hop}
          </span>
        </div>
      ))}
    </div>
  );
}

function PlaybookVisual() {
  const steps = [
    { t: "T+0", l: "Isolate host" },
    { t: "T+15m", l: "Call incident lead" },
    { t: "T+1h", l: "Brief executives" },
    { t: "T+72h", l: "ICO deadline" },
  ];
  return (
    <div className="relative space-y-2 border-l border-white/15 pl-4" aria-hidden>
      {steps.map((s) => (
        <div key={s.t} className="relative flex items-center gap-2 text-[10px]">
          <span className="absolute -left-[21px] h-2 w-2 rounded-full bg-amber-400" />
          <span className="w-10 font-bold text-amber-300">{s.t}</span>
          <span className="text-white/65">{s.l}</span>
        </div>
      ))}
    </div>
  );
}

function EvidenceVisual() {
  return (
    <div className="grid grid-cols-5 gap-1.5" aria-hidden>
      {Array.from({ length: 15 }, (_, i) => (
        <span key={i} className={cn("h-4 rounded", i % 7 === 3 ? "bg-amber-400/80" : i % 4 === 1 ? "bg-white/15" : "bg-emerald-400/80")} />
      ))}
    </div>
  );
}

const tiles = [
  {
    icon: Boxes,
    title: "See every asset",
    body: "Laptops, cloud workloads, SaaS apps and plant controllers in one inventory, each with a named owner.",
    href: "/cybersecurity/vulnerability-management",
    visual: <AssetVisual />,
    className: "lg:col-span-2",
  },
  {
    icon: Gauge,
    title: "Fix what attackers will use",
    body: "Known-exploited and internet-facing weaknesses jump the queue; theoretical ones wait.",
    href: "/cybersecurity/vulnerability-management",
    visual: <PriorityVisual />,
    className: "",
  },
  {
    icon: Crosshair,
    title: "Prove it under attack",
    body: "Hands-on testing that chains small weaknesses together the way real intruders do.",
    href: "/cybersecurity/security-assessment",
    visual: <AttackPathVisual />,
    className: "",
  },
  {
    icon: Siren,
    title: "Rehearse the bad day",
    body: "Playbooks and exercises so the first ransomware decision isn't made at 2am in a panic.",
    href: "/cybersecurity/incident-readiness",
    visual: <PlaybookVisual />,
    className: "",
  },
  {
    icon: FileCheck2,
    title: "Hand auditors the answer",
    body: "Each fix is logged against the controls it satisfies, ready to export by framework.",
    href: "/platform/compliance-mapping",
    visual: <EvidenceVisual />,
    className: "",
  },
];

export default function ExposureBento() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[800px] -translate-x-1/2 rounded-full bg-primary-500/15 blur-[140px]" aria-hidden />
      <div className="container-page relative">
        <SectionHeading
          dark
          eyebrow="From exposure to evidence"
          title="The whole security lifecycle, handled by one team"
          description="Most breaches exploit something an organisation already knew about. These five stages make sure what you know gets fixed, and that you can prove it."
          className="max-w-3xl"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <ScrollReveal key={t.title} delay={(i % 3) * 0.06} className={cn("h-full", t.className)}>
              <Link
                href={t.href}
                className="focus-ring group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold text-white/25">0{i + 1}</span>
                </div>
                {t.visual && <div className="mt-6 h-24">{t.visual}</div>}
                <h3 className="mt-6 text-lg font-bold text-white">{t.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{t.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-300">
                  Explore <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

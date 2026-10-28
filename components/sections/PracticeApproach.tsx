"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

interface PracticeContent {
  eyebrow: string;
  title: string;
  description: string;
  steps: { title: string; description: string }[];
  deliverablesTitle: string;
  deliverables: string[];
}

// Practice-specific "how we run it" content. Kept separate from the home-page practice teasers so each
// practice page says something the home page doesn't.
const content: Record<"business-transformation" | "digital-engineering" | "ai-automation", PracticeContent> = {
  "business-transformation": {
    eyebrow: "Engagement Model",
    title: "From workshop to working process in four moves",
    description:
      "Transformation stalls when it stays on whiteboards. Our engagements are built to end with a process your teams actually run.",
    steps: [
      { title: "Uncover", description: "Stakeholder interviews and shadowing to capture how work really flows today, including the workarounds." },
      { title: "Model", description: "BPMN current-state maps that expose hand-offs, delays, duplicated effort and control gaps." },
      { title: "Redesign", description: "Future-state options scored on effort, risk and value, agreed with the people who'll operate them." },
      { title: "Embed", description: "Roadmaps, RACI, training and automation-ready requirements so the change sticks." },
    ],
    deliverablesTitle: "What you walk away with",
    deliverables: [
      "Benefits tracking for 90 days after go-live",
      "Gap analysis with prioritised improvement backlog",
      "Target operating model and RACI matrix",
      "Automation candidate shortlist with business cases",
      "Phased implementation roadmap",
      "Control and risk notes aligned to your security posture",
    ],
  },
  "digital-engineering": {
    eyebrow: "Delivery Model",
    title: "Secure by design, shipped in short cycles",
    description:
      "We build the way a security company should: threat-modelled from the start, tested continuously and released in small, reviewable increments.",
    steps: [
      { title: "Shape", description: "Product discovery, user journeys and a lightweight threat model before a line of code is written." },
      { title: "Architect", description: "Cloud-native architecture, data design and an agreed definition of done that includes security." },
      { title: "Build", description: "Two-week sprints with code review, automated tests and dependency scanning in every pipeline." },
      { title: "Launch & run", description: "Performance and accessibility checks, a hardened go-live and optional ongoing support." },
    ],
    deliverablesTitle: "Built into every project",
    deliverables: [
      "Responsive, accessible (WCAG 2.2 AA) front ends",
      "CI/CD pipelines with security scanning",
      "A living threat model kept alongside the code",
      "Performance budgets and Core Web Vitals monitoring",
      "Documentation and handover for your team",
      "Post-launch support and iteration options",
    ],
  },
  "ai-automation": {
    eyebrow: "Adoption Path",
    title: "AI that earns its place before it scales",
    description:
      "We start with a measurable problem, prove value on a small scope and only then automate at scale, with governance built in.",
    steps: [
      { title: "Assess", description: "Map processes and data to find where AI or automation will genuinely move a metric." },
      { title: "Prototype", description: "A time-boxed proof of value against real data, with success criteria agreed up front." },
      { title: "Productionise", description: "Hardened pipelines, monitoring, human-in-the-loop controls and secure integration." },
      { title: "Govern", description: "Model risk, data protection and usage policies so AI stays safe as adoption grows." },
    ],
    deliverablesTitle: "What good AI adoption includes",
    deliverables: [
      "AI opportunity assessment with ROI estimates",
      "Data readiness and quality review",
      "Working proof of value on your own data",
      "Model monitoring and drift alerting",
      "AI usage and governance policy",
      "Team enablement and prompt/playbook libraries",
    ],
  },
};

export default function PracticeApproach({ practice }: { practice: keyof typeof content }) {
  const c = content[practice];

  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary-500/15 blur-[120px]" aria-hidden />

      <div className="container-page relative">
        <SectionHeading dark eyebrow={c.eyebrow} title={c.title} description={c.description} />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="text-4xl font-bold text-primary-500/40">0{i + 1}</span>
              <h3 className="mt-3 text-base font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{step.description}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-14 rounded-2xl border border-primary-400/20 bg-primary-500/[0.06] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-400">{c.deliverablesTitle}</p>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm text-white/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

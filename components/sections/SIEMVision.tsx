"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, ListTree, ShieldQuestion } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";

const timeline = [
  { time: "09:41", label: "Anomalous login flagged", severity: "Medium" },
  { time: "09:52", label: "AI triage: credential stuffing pattern", severity: "High" },
  { time: "10:03", label: "Account access suspended", severity: "Resolved" },
  { time: "10:18", label: "Incident report generated", severity: "Resolved" },
];

const severityColor: Record<string, string> = {
  Medium: "bg-yellow-400",
  High: "bg-red-400",
  Resolved: "bg-primary-400",
};

export default function SIEMVision() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <SectionHeading
            eyebrow="Security Operations Vision"
            title="Toward unified security operations and SIEM"
            description="CoreDefense is not currently operating a full SIEM platform. This is a technology vision for how AI-assisted security operations will work as our platform matures. Speak to our team about your current SOC and SIEM requirements today."
          />
          <div className="mt-8">
            <CTAButton href="/contact" variant="secondary">
              Talk to our security team
            </CTAButton>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 overflow-hidden rounded-2xl border border-ink-900/10 bg-surface-near shadow-xl lg:order-2"
        >
          <div className="flex items-center justify-between border-b border-ink-900/8 px-5 py-3.5">
            <p className="text-xs font-semibold text-ink-500">Incident Timeline (concept)</p>
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-semibold text-primary-600">AI-assisted</span>
          </div>
          <ul className="divide-y divide-ink-900/6">
            {timeline.map((event, i) => (
              <motion.li
                key={event.time}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-4 px-5 py-4"
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${severityColor[event.severity]}`} />
                <span className="w-12 shrink-0 text-xs font-mono text-ink-400">{event.time}</span>
                <span className="flex-1 text-sm text-ink-800">{event.label}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">{event.severity}</span>
              </motion.li>
            ))}
          </ul>
          <div className="grid grid-cols-3 divide-x divide-ink-900/6 border-t border-ink-900/8">
            <MiniStat icon={AlertTriangle} label="Open alerts" value="6" />
            <MiniStat icon={Clock} label="Avg. response" value="11m" />
            <MiniStat icon={ListTree} label="Log sources" value="42" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof ShieldQuestion; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-4 text-center">
      <Icon className="h-4 w-4 text-primary-500" />
      <span className="text-lg font-bold text-ink-900">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-ink-400">{label}</span>
    </div>
  );
}

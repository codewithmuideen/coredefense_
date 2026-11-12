import Image from "next/image";
import { ShieldCheck, Briefcase, Activity } from "lucide-react";
import StatCounter from "@/components/ui/StatCounter";
import { cn } from "@/lib/utils";

const stats = [
  { value: 18750, suffix: "+", label: "Threats Resolved", icon: ShieldCheck },
  { value: 3784, suffix: "+", label: "Jobs Completed", icon: Briefcase },
  { value: 99, suffix: "%", label: "Platform Uptime", icon: Activity },
];

const partners = [
  { src: "/images/partners/badge-ukc3.png", alt: "UK Cyber Cluster Collaboration", invert: false },
  { src: "/images/partners/partner-famasi.png", alt: "Famasi", invert: true },
  { src: "/images/partners/partner-meet.png", alt: "meet", invert: true },
  { src: "/images/partners/partner-creditcliq.png", alt: "Creditcliq", invert: true },
  { src: "/images/partners/partner-acadia.png", alt: "Acadia Support", invert: true },
  { src: "/images/partners/partner-tradelenda.png", alt: "Trade Lenda", invert: true },
];

export default function TrustStats() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-ink-900">
          <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-primary-500/20 blur-[110px]" aria-hidden />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-primary-400/10 blur-[100px]" aria-hidden />

          <div className="relative grid gap-10 p-8 sm:grid-cols-3 sm:gap-6 sm:p-12 lg:p-14">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={
                  i > 0
                    ? "border-t border-white/10 pt-8 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0"
                    : ""
                }
              >
                <s.icon className="h-5 w-5 text-primary-400" aria-hidden />
                <div className="mt-3">
                  <StatCounter value={s.value} suffix={s.suffix} label={s.label} dark />
                </div>
              </div>
            ))}
          </div>

          <div className="relative border-t border-white/10 py-8 sm:py-10">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-white/40">
              Trusted alongside recognised UK security &amp; industry bodies
            </p>
            <div
              className="flex overflow-hidden"
              style={{ maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)" }}
            >
              <div className="flex shrink-0 animate-marquee items-center gap-14 pr-14">
                {[...partners, ...partners].map((p, i) => (
                  <Image
                    key={`${p.alt}-${i}`}
                    src={p.src}
                    alt={p.alt}
                    width={140}
                    height={48}
                    className={cn(
                      "w-auto shrink-0 object-contain opacity-60 transition-opacity hover:opacity-100",
                      p.invert ? "h-7 brightness-0 invert" : "h-10 rounded-md"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

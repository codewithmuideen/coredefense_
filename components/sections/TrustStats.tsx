import Image from "next/image";
import StatCounter from "@/components/ui/StatCounter";

const stats = [
  { value: 18750, suffix: "+", label: "Threats Resolved" },
  { value: 3784, suffix: "+", label: "Jobs Completed" },
  { value: 99, suffix: "%", label: "Platform Uptime" },
];

const partners = [
  { src: "/images/partners/partner-famasi.png", alt: "Famasi" },
  { src: "/images/partners/partner-meet.png", alt: "meet" },
  { src: "/images/partners/partner-creditcliq.png", alt: "Creditcliq" },
  { src: "/images/partners/partner-acadia.png", alt: "Acadia Support" },
  { src: "/images/partners/partner-tradelenda.png", alt: "Trade Lenda" },
];

export default function TrustStats() {
  return (
    <section className="border-b border-ink-900/5 bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-3">
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} dark={false} />
          ))}
        </div>

        <div className="mt-16 border-t border-ink-900/5 pt-10">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-ink-400">
            Trusted alongside recognised UK security &amp; industry bodies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70 grayscale">
            <Image src="/images/partners/badge-ukc3.png" alt="UK Cyber Cluster Collaboration" width={140} height={70} className="h-10 w-auto object-contain" />
            {partners.map((p) => (
              <Image key={p.alt} src={p.src} alt={p.alt} width={130} height={40} className="h-6 w-auto object-contain sm:h-7" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

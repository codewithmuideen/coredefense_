import type { Metadata } from "next";
import { Users, Network, Send } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Talent Hub",
  description: "Join the CoreDefense Talent Hub to stay connected for future opportunities across cybersecurity, transformation, engineering and AI.",
};

const points = [
  { icon: Users, title: "One community", description: "Cybersecurity, transformation, engineering and AI talent, in one place." },
  { icon: Network, title: "Stay connected", description: "We'll reach out when a relevant opportunity comes up — no spam, no noise." },
  { icon: Send, title: "Low commitment", description: "Introducing yourself here doesn't commit you to anything." },
];

export default function TalentHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="CoreDefense Talent Hub"
        description="A single place to introduce yourself to CoreDefense — whether you're interested in cybersecurity, transformation, engineering or AI & automation."
        breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: "Talent Hub", href: "/careers/talent-hub" }]}
        primaryCta="trial"
        primaryLabel="Start Free Trial"
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading title="How the Talent Hub works" />
            <div className="mt-8 space-y-6">
              {points.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <p.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="font-bold text-ink-900">{p.title}</p>
                    <p className="mt-1 text-sm text-ink-600">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-surface-near p-6 sm:p-8">
            <h3 className="mb-4 text-sm font-bold text-ink-900">Introduce yourself</h3>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

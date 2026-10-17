import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles, Users, Rocket, HeartHandshake } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join CoreDefense, a UK technology company working across cybersecurity, transformation, engineering and AI & automation.",
};

const values = [
  { icon: Sparkles, title: "Curiosity", description: "We work across four disciplines, and curiosity about how they connect is part of the job." },
  { icon: Users, title: "Ownership", description: "Small, connected teams that own outcomes rather than tickets." },
  { icon: Rocket, title: "Craft", description: "We care about doing the work properly, not just shipping something that works." },
  { icon: HeartHandshake, title: "Trust", description: "Clients trust us with sensitive systems and data, and we take that seriously." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Work across cybersecurity, transformation, engineering and AI"
        description="CoreDefense brings together people who care about doing security, transformation and engineering properly, not just quickly."
        breadcrumbs={[{ label: "Careers", href: "/careers" }]}
        primaryLabel="View Talent Hub"
        primaryHref="/careers/talent-hub"
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Why CoreDefense" title="What it's like to work here" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {values.map((v) => (
                <div key={v.title} className="flex gap-3">
                  <v.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
                  <div>
                    <p className="font-bold text-ink-900">{v.title}</p>
                    <p className="mt-1 text-sm text-ink-600">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <CTAButton href="/careers/talent-hub" variant="secondary">
                Visit our Talent Hub
              </CTAButton>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 via-white to-surface ring-1 ring-ink-900/5">
            <div
              className="absolute inset-0 opacity-60"
              style={{ backgroundImage: "radial-gradient(circle, rgba(30,106,255,0.18) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
              aria-hidden
            />
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
              <Image
                src="/images/photos/IMG_9547.PNG"
                alt="CoreDefense defender character"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page rounded-2xl border border-dashed border-ink-900/15 bg-white p-10 text-center">
          <h2 className="text-lg font-bold text-ink-900">No open roles listed right now</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
            We&apos;re not actively advertising specific vacancies at the moment. If you&apos;d like to introduce
            yourself for future opportunities, get in touch via our contact form.
          </p>
          <div className="mt-6">
            <CTAButton href="/contact" variant="primary" icon={false}>
              Get in touch
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}

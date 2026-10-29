import type { Metadata } from "next";
import { Sparkles, Users, Rocket, HeartHandshake, Send, BellRing, ShieldCheck } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Talent Hub",
  description:
    "Careers at CoreDefense: how we work, who we look for, and how to introduce yourself for future roles in security, transformation, engineering and AI.",
};

const values = [
  { icon: Sparkles, title: "Curiosity", description: "We work across four disciplines, and curiosity about how they connect is part of the job." },
  { icon: Users, title: "Ownership", description: "Small, connected teams that own outcomes rather than tickets." },
  { icon: Rocket, title: "Craft", description: "We care about doing the work properly, not just shipping something that works." },
  { icon: HeartHandshake, title: "Trust", description: "Clients trust us with sensitive systems and data, and we take that seriously." },
];

const roles = [
  "Security engineers & penetration testers",
  "GRC and compliance analysts",
  "Business analysts & BPMN process modellers",
  "Full-stack & cloud engineers",
  "Data scientists & ML engineers",
  "Graduates and career changers with a security interest",
];

const steps = [
  { icon: Send, title: "Introduce yourself", description: "Share your background and the kind of work you're after using the form." },
  { icon: BellRing, title: "We keep you in mind", description: "When a relevant role or project opens, you hear about it before we advertise." },
  { icon: ShieldCheck, title: "No strings", description: "Joining the hub commits you to nothing, and we never share your details." },
];

export default function TalentHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Talent Hub"
        title="Do your best work across security, engineering and AI"
        description="CoreDefense is a small team where one person might threat-model an app in the morning and map a client process in the afternoon. If that sounds like you, we'd like to hear from you."
        breadcrumbs={[{ label: "Talent Hub", href: "/careers" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Why CoreDefense" title="What it's like to work here" align="center" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-ink-900/8 bg-surface-near p-6 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <v.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-bold text-ink-900">{v.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{v.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-ink-900 p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">Who we look for</p>
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">No open vacancies right now, but we&apos;re always listening</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  We hire when the right person and the right project meet. These are the skills we bring in most often.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {roles.map((r) => (
                  <li key={r} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="scroll-mt-24 bg-surface py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Join the hub" title="How the Talent Hub works" />
            <ol className="mt-10 space-y-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-bold text-ink-900">
                      <s.icon className="h-4 w-4 text-primary-500" /> {s.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-600">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-white p-6 sm:p-8">
            <h3 className="mb-4 text-sm font-bold text-ink-900">Introduce yourself</h3>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

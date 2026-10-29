import type { Metadata } from "next";
import { ArrowUpRight, CalendarDays, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import BookingModal from "@/components/forms/BookingModal";
import CTAButton from "@/components/ui/CTAButton";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description: "Email, call or book a consultation with CoreDefense. We reply within one working day.",
};

const channels = [
  { icon: Mail, label: "Email us", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Phone, label: "Call us", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { icon: MapPin, label: "Based in", value: CONTACT.location },
];

const steps = [
  { title: "We read it", body: "A member of the team reads every message, never a bot." },
  { title: "We match you", body: "Your enquiry goes to the specialist who knows the area best." },
  { title: "We reply", body: "Expect a considered answer within one working day." },
];

const topics = ["Security assessment", "Process modelling", "New website or platform", "AI & automation"];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        description="Send a message, give us a call or book a consultation. A real person reads everything and replies within one working day."
        breadcrumbs={[{ label: "Contact", href: "/contact" }]}
      />

      <section className="bg-surface py-20 sm:py-28">
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_1.35fr] lg:gap-8">
          {/* Direct channels */}
          <aside className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 text-white sm:p-10">
            <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary-700/30 blur-3xl" aria-hidden />

            <div className="relative flex h-full flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Reach us directly</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Talk to a specialist</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                Whether it&apos;s an urgent security concern or an early idea, we&apos;ll point you to the right person.
              </p>

              <ul className="mt-8 space-y-3">
                {channels.map((c) => {
                  const body = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300 ring-1 ring-primary-400/25 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-medium uppercase tracking-widest text-white/45">{c.label}</span>
                        <span className="mt-0.5 block break-words text-base font-semibold">{c.value}</span>
                      </span>
                      {c.href && <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-primary-300" />}
                    </>
                  );
                  const rowClass = "flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4";
                  return (
                    <li key={c.label}>
                      {c.href ? (
                        <a href={c.href} className={`focus-ring group ${rowClass} transition-colors hover:border-primary-400/50 hover:bg-white/[0.07]`}>
                          {body}
                        </a>
                      ) : (
                        <div className={`group ${rowClass}`}>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">What happens next</p>
                <ol className="mt-5 space-y-5">
                  {steps.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-400/40 text-sm font-bold text-primary-300">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{s.title}</p>
                        <p className="mt-0.5 text-sm text-white/55">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="rounded-3xl border border-ink-900/8 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(10,13,22,0.25)] sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Send us a message</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-600">
              A few lines is plenty. The more context you share about your organisation and timeline, the more useful
              our first reply will be.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink-600">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary-500" /> Reply within one working day
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary-500" /> Details used only for your enquiry
              </span>
            </div>
            <div className="mt-8 border-t border-ink-900/8 pt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Consultation */}
      <section className="bg-surface pb-20 sm:pb-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 p-8 text-white sm:p-12">
            <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" aria-hidden />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div className="flex items-start gap-5">
                <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 sm:flex">
                  <CalendarDays className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Prefer a proper conversation?</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                    Book a 30-minute consultation. Tell us the topic and the right specialist joins the call.
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <li key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="lg:justify-self-end">
                <BookingModal
                  trigger={
                    <CTAButton size="lg" className="!bg-white !text-primary-600 hover:!bg-primary-50">
                      Book a Consultation
                    </CTAButton>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { CalendarDays, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import WhatsAppQR from "@/components/ui/WhatsAppQR";
import BookingModal from "@/components/forms/BookingModal";
import CTAButton from "@/components/ui/CTAButton";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description: "Email, call, WhatsApp or book a consultation with CoreDefense. We reply within one working day.",
};

const channels = [
  { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Phone, label: "Phone", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { icon: MapPin, label: "Location", value: CONTACT.location },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        description="Pick whichever route suits you: a message, a call, a WhatsApp chat or a scheduled consultation. A real person reads everything and replies within one working day."
        breadcrumbs={[{ label: "Contact", href: "/contact" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {/* WhatsApp */}
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-8 text-white lg:row-span-2">
            <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/25 blur-3xl" aria-hidden />
            <div className="relative">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </p>
              <h2 className="mt-3 text-2xl font-bold">Scan to start a chat</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Open your phone camera, point it at the code and WhatsApp opens with CoreDefense ready to message.
              </p>
              <WhatsAppQR size={196} scanner className="mx-auto mt-9" />
              <p className="mt-6 text-center text-lg font-bold tracking-wide">{CONTACT.phoneDisplay}</p>
              <div className="mt-6">
                <CTAButton href={CONTACT.whatsappHref} icon={false} className="w-full justify-center !bg-emerald-500 hover:!bg-emerald-600">
                  <MessageCircle className="h-4 w-4" /> Open WhatsApp
                </CTAButton>
              </div>
            </div>
          </div>

          {/* Consultation */}
          <div className="flex flex-col justify-between rounded-3xl border border-primary-200 bg-primary-50/60 p-8 lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-500 text-white">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink-900">Prefer a proper conversation?</h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-600">
                  Book a 30-minute consultation. Tell us the topic, whether that&apos;s a security assessment, a
                  process problem, a new build or an AI idea, and the right specialist joins the call.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <BookingModal trigger={<CTAButton size="lg">Book a Consultation</CTAButton>} />
            </div>
          </div>

          {/* Direct channels */}
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
            {channels.map((c) => {
              const body = (
                <>
                  <c.icon className="h-5 w-5 text-primary-500" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-ink-400">{c.label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-ink-900">{c.value}</p>
                </>
              );
              return c.href ? (
                <a key={c.label} href={c.href} className="focus-ring rounded-2xl border border-ink-900/8 bg-surface-near p-6 transition-colors hover:border-primary-300">
                  {body}
                </a>
              ) : (
                <div key={c.label} className="rounded-2xl border border-ink-900/8 bg-surface-near p-6">
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">Send us a message</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              A few lines is plenty. The more context you share about your organisation and timeline, the more
              useful our first reply will be.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ink-600">
              <li>• Replies within one working day</li>
              <li>• No sales sequences or automated follow-ups</li>
              <li>• Your details are used only to answer your enquiry</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-ink-900/8 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

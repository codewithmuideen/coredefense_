import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with CoreDefense about cybersecurity, business transformation, digital engineering or AI & automation.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        description="Tell us about your organisation and what you're looking to achieve — a member of the CoreDefense team will respond promptly."
        breadcrumbs={[{ label: "Contact", href: "/contact" }]}
        primaryCta="trial"
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Get in touch</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Whether you have a specific project in mind or just want to understand how CoreDefense could help,
              we&apos;re happy to talk it through.
            </p>
            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary-500" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Email</p>
                  <a href="mailto:hello@coredefense.co.uk" className="text-sm text-ink-600 hover:text-primary-600">
                    hello@coredefense.co.uk
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary-500" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Location</p>
                  <p className="text-sm text-ink-600">United Kingdom</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary-500" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Prefer to talk?</p>
                  <p className="text-sm text-ink-600">Book a consultation directly via our calendar.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-surface-near p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

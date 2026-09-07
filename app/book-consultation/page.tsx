import type { Metadata } from "next";
import { ShieldCheck, Workflow, Cpu, Sparkles } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import CTAButton from "@/components/ui/CTAButton";
import BookingModal from "@/components/forms/BookingModal";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Book a consultation with CoreDefense about cybersecurity, business transformation, digital engineering or AI & automation.",
};

const topics = [
  { icon: ShieldCheck, label: "Cybersecurity Consultation" },
  { icon: Workflow, label: "Security Assessment" },
  { icon: Cpu, label: "Digital Transformation Consultation" },
  { icon: Sparkles, label: "AI & Automation Consultation" },
];

export default function BookConsultationPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Started"
        title="Book a CoreDefense consultation"
        description="Pick a time that works for you. Tell us what you'd like to discuss and we'll make sure the right person from CoreDefense joins the call."
        breadcrumbs={[{ label: "Book a Consultation", href: "/book-consultation" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-ink-900">What would you like to talk about?</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {topics.map((t) => (
                <div key={t.label} className="flex items-center gap-3 rounded-xl border border-ink-900/8 bg-surface-near px-4 py-3.5">
                  <t.icon className="h-4 w-4 shrink-0 text-primary-500" />
                  <span className="text-sm font-medium text-ink-700">{t.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-ink-400">
              Not sure which fits? Book a general consultation — we&apos;ll help direct the conversation once we know
              more.
            </p>
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-surface-near p-8 text-center">
            <h3 className="text-lg font-bold text-ink-900">Book your consultation</h3>
            <p className="mt-2 text-sm text-ink-600">Opens our booking calendar in a few clicks.</p>
            <div className="mt-6">
              <BookingModal trigger={<CTAButton size="lg" className="w-full justify-center">Book a Consultation</CTAButton>} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

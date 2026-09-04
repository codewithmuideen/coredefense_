import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import CTAButton from "@/components/ui/CTAButton";
import TrialModal from "@/components/forms/TrialModal";

export const metadata: Metadata = {
  title: "Start Free Trial",
  description: "Request early access to the CoreDefense cybersecurity platform, currently in development.",
};

const steps = [
  { title: "Personal information", description: "Tell us who you are and how to reach you." },
  { title: "Company information", description: "A little about your organisation and role." },
  { title: "Security requirements", description: "Your primary security concern, so we can prepare." },
  { title: "Confirmation", description: "Review and submit your request for access." },
];

export default function FreeTrialPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Started"
        title="Start your CoreDefense journey"
        description="CoreDefense's cybersecurity platform is currently in active development. Starting a free trial here begins a request-for-access process — our team will follow up about onboarding and timelines."
        breadcrumbs={[{ label: "Start Free Trial", href: "/free-trial" }]}
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-ink-900">What happens next</h2>
            <ol className="mt-6 space-y-5">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">{step.title}</p>
                    <p className="mt-0.5 text-sm text-ink-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-surface-near p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary-500" />
            <h3 className="mt-4 text-lg font-bold text-ink-900">Ready to request access?</h3>
            <p className="mt-2 text-sm text-ink-600">
              The form takes about two minutes. We&apos;ll never expose your data or contact you outside of what you
              consent to.
            </p>
            <div className="mt-6">
              <TrialModal trigger={<CTAButton size="lg" className="w-full justify-center">Start Free Trial</CTAButton>} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

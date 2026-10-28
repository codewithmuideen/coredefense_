import { AlertTriangle, ExternalLink, Phone } from "lucide-react";
import { CONTACT } from "@/lib/contact";

// Home: what to do in the first hour of a suspected breach. Points to our phone line and the official NCSC route.
const firstSteps = [
  "Don't switch infected machines off; disconnect them from the network instead, so evidence survives.",
  "Change credentials from a device you know is clean, starting with email and admin accounts.",
  "Write down what you saw and when. Times and screenshots save hours later.",
];

export default function BreachPanel() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-white p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-200/40 blur-3xl" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
                <AlertTriangle className="h-3.5 w-3.5" /> Suspect a breach?
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">The first hour matters most</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-600">
                Call us and we&apos;ll help you take the right first decisions. If you need a full forensic investigation, we&apos;ll
                bring in an NCSC-assured responder or work with your insurer&apos;s panel.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={CONTACT.phoneHref}
                  className="focus-ring inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  <Phone className="h-4 w-4" /> Call {CONTACT.phoneDisplay}
                </a>
                <a
                  href="https://report.ncsc.gov.uk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-lg border border-ink-900/15 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:border-ink-900/30"
                >
                  Report to the NCSC <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            <ol className="space-y-3">
              {firstSteps.map((step, i) => (
                <li key={step} className="flex gap-4 rounded-2xl border border-ink-900/8 bg-white p-5 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">{i + 1}</span>
                  <p className="text-sm leading-relaxed text-ink-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

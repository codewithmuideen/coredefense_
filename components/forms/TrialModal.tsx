"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import CTAButton from "@/components/ui/CTAButton";
import { trialSchema, type TrialInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

const EMPLOYEE_BANDS = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];
const CONCERNS = [
  "Vulnerability management",
  "Cloud & DevOps security",
  "IT/OT security",
  "Compliance & governance",
  "Incident readiness",
  "Not sure yet",
];

const steps = ["Your details", "Your company", "Security needs", "Confirmation"] as const;

interface TrialModalProps {
  trigger: React.ReactNode;
  triggerClassName?: string;
}

export default function TrialModal({ trigger, triggerClassName }: TrialModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    trigger: triggerValidation,
    formState: { errors },
    reset,
  } = useForm<TrialInput>({
    resolver: zodResolver(trialSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      workEmail: "",
      company: "",
      jobTitle: "",
      phone: "",
      employees: "",
      concern: "",
      consent: undefined,
      website: "",
    },
  });

  const stepFields: Record<number, (keyof TrialInput)[]> = {
    0: ["firstName", "lastName", "workEmail"],
    1: ["company", "jobTitle", "phone"],
    2: ["employees", "concern"],
  };

  async function handleNext() {
    const fields = stepFields[step];
    const valid = await triggerValidation(fields);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data: TrialInput) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function closeAndReset() {
    setOpen(false);
    setTimeout(() => {
      setStep(0);
      setStatus("idle");
      reset();
    }, 300);
  }

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        className={cn("contents cursor-pointer", triggerClassName)}
      >
        {trigger}
      </span>
      <Modal open={open} onClose={closeAndReset} title="Start Your Free Trial" size="lg">
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-primary-500" />
            <h3 className="text-xl font-bold text-ink-900">Request received</h3>
            <p className="max-w-sm text-sm text-ink-600">
              Thanks — CoreDefense&apos;s cybersecurity platform is currently in active development. A member
              of our team will be in touch shortly to discuss access and onboarding.
            </p>
            <CTAButton variant="secondary" onClick={closeAndReset} icon={false}>
              Close
            </CTAButton>
          </div>
        ) : (
          <>
            <ol className="mb-8 flex items-center gap-2">
              {steps.map((label, i) => (
                <li key={label} className="flex flex-1 items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      i <= step ? "bg-primary-500 text-white" : "bg-ink-900/10 text-ink-500"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn("hidden text-xs font-medium sm:block", i <= step ? "text-ink-900" : "text-ink-400")}>
                    {label}
                  </span>
                  {i < steps.length - 1 && <span className="h-px flex-1 bg-ink-900/10" />}
                </li>
              ))}
            </ol>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name" error={errors.firstName?.message}>
                    <input className={inputClass} {...register("firstName")} />
                  </Field>
                  <Field label="Last name" error={errors.lastName?.message}>
                    <input className={inputClass} {...register("lastName")} />
                  </Field>
                  <Field label="Work email" error={errors.workEmail?.message} full>
                    <input type="email" className={inputClass} {...register("workEmail")} />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Company" error={errors.company?.message}>
                    <input className={inputClass} {...register("company")} />
                  </Field>
                  <Field label="Job title" error={errors.jobTitle?.message}>
                    <input className={inputClass} {...register("jobTitle")} />
                  </Field>
                  <Field label="Phone number" error={errors.phone?.message} full>
                    <input type="tel" className={inputClass} {...register("phone")} />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4">
                  <Field label="Number of employees" error={errors.employees?.message}>
                    <select className={inputClass} {...register("employees")}>
                      <option value="">Select…</option>
                      {EMPLOYEE_BANDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Primary security concern" error={errors.concern?.message}>
                    <select className={inputClass} {...register("concern")}>
                      <option value="">Select…</option>
                      {CONCERNS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-ink-600">
                    CoreDefense&apos;s cybersecurity platform is currently in development. By submitting this
                    form you&apos;re requesting early access — our team will contact you about onboarding and
                    timelines. This is not an instant sign-up to a live product.
                  </p>
                  <label className="flex items-start gap-3 text-sm text-ink-700">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-ink-300 text-primary-500 focus:ring-primary-400" {...register("consent")} />
                    <span>I agree to be contacted by CoreDefense about my request and understand my data will be handled per the Privacy Policy.</span>
                  </label>
                  {errors.consent && <p className="text-xs text-red-600">{errors.consent.message}</p>}
                  {status === "error" && (
                    <p className="text-xs text-red-600">Something went wrong sending your request. Please try again.</p>
                  )}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                {step > 0 ? (
                  <CTAButton type="button" variant="secondary" icon={false} onClick={handleBack}>
                    Back
                  </CTAButton>
                ) : (
                  <span />
                )}
                {step < steps.length - 1 ? (
                  <CTAButton type="button" onClick={handleNext}>
                    Continue
                  </CTAButton>
                ) : (
                  <CTAButton type="submit" disabled={status === "submitting"} icon={false}>
                    {status === "submitting" ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </span>
                    ) : (
                      "Request Access"
                    )}
                  </CTAButton>
                )}
              </div>
            </form>
          </>
        )}
      </Modal>
    </>
  );
}

function Field({
  label,
  error,
  children,
  full,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-1.5 block text-xs font-semibold text-ink-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

const inputClass =
  "focus-ring w-full rounded-lg border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400";

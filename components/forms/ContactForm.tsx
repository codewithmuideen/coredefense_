"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import { contactSchema, type ContactInput } from "@/lib/validations";

const SERVICES = [
  "Cybersecurity",
  "Business Transformation & Process Modelling",
  "Digital Engineering & Website Development",
  "AI & Automation",
  "Something else",
];

const inputClass =
  "focus-ring w-full rounded-lg border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-400";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink-900/10 bg-surface-near p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary-500" />
        <h3 className="text-xl font-bold text-ink-900">Message sent</h3>
        <p className="max-w-sm text-sm text-ink-600">
          Thanks for reaching out. A member of the CoreDefense team will respond shortly.
        </p>
        <CTAButton variant="secondary" icon={false} onClick={() => setStatus("idle")}>
          Send another message
        </CTAButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-ink-700">Full name</span>
        <input className={inputClass} {...register("name")} />
        {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-ink-700">Company</span>
        <input className={inputClass} {...register("company")} />
        {errors.company && <span className="mt-1 block text-xs text-red-600">{errors.company.message}</span>}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-ink-700">Email</span>
        <input type="email" className={inputClass} {...register("email")} />
        {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-ink-700">Phone</span>
        <input type="tel" className={inputClass} {...register("phone")} />
        {errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone.message}</span>}
      </label>

      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink-700">Service interest</span>
        <select className={inputClass} {...register("service")}>
          <option value="">Select a service…</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.service && <span className="mt-1 block text-xs text-red-600">{errors.service.message}</span>}
      </label>

      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-ink-700">Message</span>
        <textarea rows={5} className={inputClass} {...register("message")} />
        {errors.message && <span className="mt-1 block text-xs text-red-600">{errors.message.message}</span>}
      </label>

      {status === "error" && (
        <p className="text-sm text-red-600 sm:col-span-2">
          Something went wrong sending your message. Please try again or email us directly.
        </p>
      )}

      <div className="sm:col-span-2">
        <CTAButton type="submit" disabled={status === "submitting"} icon={false}>
          {status === "submitting" ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </span>
          ) : (
            "Send message"
          )}
        </CTAButton>
      </div>
    </form>
  );
}

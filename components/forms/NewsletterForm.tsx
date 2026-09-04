"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

export default function NewsletterForm({ dark = true }: { dark?: boolean }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(data: NewsletterInput) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
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
      <p className={cn("flex items-center gap-2 text-sm font-medium", dark ? "text-white" : "text-ink-900")}>
        <CheckCircle2 className="h-4 w-4 text-primary-400" /> You&apos;re subscribed — thank you.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm">
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
      <div
        className={cn(
          "flex items-center gap-1 rounded-lg border p-1",
          dark ? "border-white/15 bg-white/5" : "border-ink-900/15 bg-white"
        )}
      >
        <input
          type="email"
          placeholder="Work email"
          aria-label="Email address"
          className={cn(
            "focus-ring w-full flex-1 rounded-md bg-transparent px-3 py-2 text-sm outline-none",
            dark ? "text-white placeholder:text-white/40" : "text-ink-900 placeholder:text-ink-400"
          )}
          {...register("email")}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label="Subscribe"
          className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-500 text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
        >
          {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
      {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
      {status === "error" && <p className="mt-1.5 text-xs text-red-400">Something went wrong. Please try again.</p>}
    </form>
  );
}

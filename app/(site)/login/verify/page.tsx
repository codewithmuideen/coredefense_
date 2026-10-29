import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import VerifyCodeForm from "@/components/auth/VerifyCodeForm";

export const metadata: Metadata = {
  title: "Check your email",
  robots: { index: false, follow: false },
};

export default function VerifyPage() {
  return (
    <AuthShell
      title="Check your email"
      subtitle="Enter the sign-in code we just sent. This extra step keeps your account safe even if your password leaks."
      panel={{
        heading: "Two-step sign-in protects every CoreDefense workspace.",
        points: [
          { title: "Codes expire fast", detail: "Each code works once and lapses after 10 minutes." },
          { title: "Five tries, then locked", detail: "Wrong guesses end the attempt and are recorded in your sign-in history." },
          { title: "Alerts on every sign-in", detail: "You'll get an email with the device and location each time you sign in." },
        ],
      }}
    >
      <Suspense>
        <VerifyCodeForm mode="email" />
      </Suspense>
    </AuthShell>
  );
}

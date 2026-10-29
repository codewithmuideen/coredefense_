import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/PasswordResetForms";

export const metadata: Metadata = {
  alternates: { canonical: "/forgot-password" },
  title: "Reset your password",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your work email and we'll send you a secure link to choose a new one."
      panel={{
        heading: "Locked out? You'll be back in within a minute.",
        points: [
          { title: "One-time link", detail: "The reset link works once and expires after an hour." },
          { title: "Other devices signed out", detail: "Setting a new password ends every other session on your account." },
          { title: "You'll be told", detail: "We email you when your password changes, so you'd know if it wasn't you." },
        ],
      }}
    >
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  );
}

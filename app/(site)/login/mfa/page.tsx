import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import VerifyCodeForm from "@/components/auth/VerifyCodeForm";

export const metadata: Metadata = {
  title: "Authenticator code",
  robots: { index: false, follow: false },
};

export default function MfaPage() {
  return (
    <AuthShell
      title="Enter your authenticator code"
      subtitle="Your account is protected with an authenticator app."
      panel={{
        heading: "The strongest second factor, right on your phone.",
        points: [
          { title: "Works offline", detail: "Codes are generated on your device; nothing is sent over email or SMS." },
          { title: "Phishing-resistant", detail: "A fresh code every 30 seconds means a stolen code is useless moments later." },
          { title: "Recorded and alerted", detail: "Every sign-in shows in your security history and triggers an email alert." },
        ],
      }}
    >
      <Suspense>
        <VerifyCodeForm mode="totp" />
      </Suspense>
    </AuthShell>
  );
}

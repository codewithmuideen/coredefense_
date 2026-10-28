import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  alternates: { canonical: "/login" },
  title: "Log in",
  description: "Sign in to the CoreDefense platform.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in with your work email to reach your CoreDefense workspace."
      panel={{
        heading: "Your exposure, findings and evidence, waiting where you left them.",
        points: [
          { title: "Live risk picture", detail: "See which assets changed overnight and which findings moved up the queue." },
          { title: "Remediation in motion", detail: "Track every fix from ticket to verified close, owner by owner." },
          { title: "Audit-ready exports", detail: "Pull framework coverage reports the moment an auditor asks." },
        ],
      }}
    >
      <LoginForm />
    </AuthShell>
  );
}

import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  alternates: { canonical: "/signup" },
  title: "Create an account",
  description: "Create a CoreDefense platform account with your company email.",
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Company email addresses only. Personal inboxes such as Gmail, Yahoo or Outlook.com can't be used."
      panel={{
        heading: "Set up a workspace for your whole security team in minutes.",
        points: [
          { title: "Invite your team", detail: "Give engineers, analysts and leadership the views each of them needs." },
          { title: "Connect your tools", detail: "Bring in scanner results, cloud accounts and ticketing from day one." },
          { title: "Map to your frameworks", detail: "Choose ISO 27001, NIST CSF, PCI DSS or Cyber Essentials and start tracking coverage." },
        ],
      }}
    >
      <SignupForm />
    </AuthShell>
  );
}

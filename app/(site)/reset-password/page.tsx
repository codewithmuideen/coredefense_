import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/PasswordResetForms";
import { getViewer } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

// Reached from the emailed reset link, which has already signed the user in for this one purpose.
export default async function ResetPasswordPage() {
  if (!isSupabaseConfigured() || !(await getViewer())) redirect("/login?error=link-expired");
  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Pick something long and unique. You'll stay signed in on this device."
      panel={{
        heading: "A strong password is your first line of defence.",
        points: [
          { title: "Length beats complexity", detail: "A long passphrase is harder to crack than a short jumble." },
          { title: "Never reuse it", detail: "Reused passwords are the top cause of account takeover." },
          { title: "Add an authenticator", detail: "After this, turn on an authenticator app under Security." },
        ],
      }}
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}

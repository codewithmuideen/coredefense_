import type { Metadata } from "next";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/ui";
import SecuritySettings from "@/components/app/SecuritySettings";
import type { LoginEvent } from "@/types/app";

export const metadata: Metadata = { title: "Security" };

export default async function SecurityPage() {
  const { user } = await requireViewer();
  const supabase = await createClient();
  const [{ data: events }, { data: factors }] = await Promise.all([
    supabase.from("login_events").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    supabase.auth.mfa.listFactors(),
  ]);
  const totp = (factors?.totp ?? []).find((f) => f.status === "verified");

  return (
    <>
      <PageHeader eyebrow="Account" title="Security" description="Your password, two-step sign-in and a full record of every sign-in to your account." />
      <SecuritySettings
        email={user.email ?? ""}
        emailCodes={user.app_metadata?.email_2fa !== false}
        totp={totp ? { id: totp.id, name: totp.friendly_name ?? "Authenticator app", createdAt: totp.created_at } : null}
        events={(events ?? []) as LoginEvent[]}
        passwordUpdatedAt={user.updated_at ?? null}
      />
    </>
  );
}

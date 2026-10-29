import type { Metadata } from "next";
import { requireViewer } from "@/lib/auth/session";
import { PageHeader } from "@/components/app/ui";
import ProfileSettings from "@/components/app/ProfileSettings";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { user, profile, isAdmin } = await requireViewer();
  return (
    <>
      <PageHeader eyebrow="Account" title="Profile" description="How you appear to your team and to CoreDefense analysts, plus the emails you want from us." />
      <ProfileSettings profile={profile} isAdmin={isAdmin} emailConfirmed={!!user.email_confirmed_at} />
    </>
  );
}

import type { Metadata } from "next";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/ui";
import SupportCenter from "@/components/app/SupportCenter";
import type { Ticket } from "@/types/app";

export const metadata: Metadata = { title: "Support" };

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const params = await searchParams;
  const { user } = await requireViewer();
  const supabase = await createClient();
  const { data } = await supabase.from("tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Support" description="Ask our security team anything: a finding you don't understand, an incident, or help with your account. Urgent tickets page the on-call analyst." />
      <SupportCenter initial={(data ?? []) as Ticket[]} startOpen={params.new === "1"} />
    </>
  );
}

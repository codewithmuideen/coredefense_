import type { Metadata } from "next";
import { requireViewer } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/ui";
import FindingsBoard from "@/components/app/FindingsBoard";
import type { Finding } from "@/types/app";

export const metadata: Metadata = { title: "Findings" };

export default async function FindingsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const { user } = await requireViewer();
  const supabase = await createClient();
  const { data } = await supabase.from("findings").select("*").eq("user_id", user.id).order("detected_at", { ascending: false });

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Findings"
        description="Every vulnerability, misconfiguration and exposure in your estate. Filter, prioritise and move each one through to verified close."
      />
      <FindingsBoard userId={user.id} initial={(data ?? []) as Finding[]} openId={id} />
    </>
  );
}

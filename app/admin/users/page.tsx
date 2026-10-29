import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { listAllUsers } from "@/lib/app/admin-data";
import { PageHeader } from "@/components/app/ui";
import UsersTable from "@/components/app/UsersTable";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const { user } = await requireAdmin();
  const users = await listAllUsers();
  return (
    <>
      <PageHeader eyebrow="Admin console" title="Users" description="Everyone with a CoreDefense account. Change roles, suspend access, reset two-factor or send a password reset." />
      <UsersTable users={users} selfId={user.id} initialStatus={status} />
    </>
  );
}

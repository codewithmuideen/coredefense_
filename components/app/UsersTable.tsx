"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Search, Smartphone, Mail, ShieldOff, Users } from "lucide-react";
import { Avatar, Badge, Card, EmptyState, btn, field } from "@/components/app/ui";
import UserActions from "@/components/app/UserActions";
import { formatDate, timeAgo } from "@/lib/app/format";
import type { AdminUserRow } from "@/lib/app/admin-data";
import { cn } from "@/lib/utils";

const STATUS_BADGE = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  suspended: "bg-red-50 text-red-700 ring-red-600/15",
  unconfirmed: "bg-amber-50 text-amber-800 ring-amber-600/20",
};
const TWO_FA = {
  authenticator: { label: "Authenticator", icon: Smartphone, cls: "text-emerald-700" },
  email: { label: "Email codes", icon: Mail, cls: "text-primary-700" },
  none: { label: "Password only", icon: ShieldOff, cls: "text-red-600" },
};
const PAGE = 15;

export default function UsersTable({ users, selfId, initialStatus }: { users: AdminUserRow[]; selfId: string; initialStatus?: string }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState(initialStatus ?? "all");
  const [sort, setSort] = useState<"newest" | "active" | "name">("newest");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => role === "all" || u.role === role)
      .filter((u) => status === "all" || u.status === status)
      .filter((u) => !q || `${u.name} ${u.email} ${u.company ?? ""}`.toLowerCase().includes(q))
      .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "active" ? (b.lastSignInAt ?? "").localeCompare(a.lastSignInAt ?? "") : b.createdAt.localeCompare(a.createdAt)));
  }, [users, query, role, status, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice(page * PAGE, page * PAGE + PAGE);

  function exportCsv() {
    const csv = [["Name", "Email", "Company", "Role", "Status", "2FA", "Created", "Last sign-in"], ...filtered.map((u) => [u.name, u.email, u.company ?? "", u.role, u.status, u.twoFactor, u.createdAt, u.lastSignInAt ?? ""])]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "coredefense-users.csv" }).click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3 border-b border-ink-900/[0.06] p-3 sm:px-5">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder="Search name, email or company…" className={cn(field, "pl-9")} />
        </div>
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(0); }} className={cn(field, "w-auto py-2")} aria-label="Role">
          <option value="all">All roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} className={cn(field, "w-auto py-2")} aria-label="Status">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="unconfirmed">Unconfirmed</option>
          <option value="suspended">Suspended</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={cn(field, "w-auto py-2")} aria-label="Sort">
          <option value="newest">Newest first</option>
          <option value="active">Recently active</option>
          <option value="name">Name A–Z</option>
        </select>
        <button onClick={exportCsv} className={cn(btn.secondary, "py-2")}><Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span></button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users match" description="Clear the filters or search for something else." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/[0.06] text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">User</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Two-factor</th>
                <th className="px-3 py-3">Joined</th>
                <th className="px-3 py-3">Last active</th>
                <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/[0.05]">
              {rows.map((u) => {
                const tfa = TWO_FA[u.twoFactor];
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3">
                      <Link href={`/admin/users/${u.id}`} className="flex items-center gap-3">
                        <Avatar src={u.avatarUrl} name={u.name} size={36} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink-900 hover:text-primary-700">{u.name}{u.id === selfId && <span className="ml-1.5 text-xs font-medium text-slate-400">(you)</span>}</p>
                          <p className="truncate text-xs text-slate-500">{u.email}{u.company ? ` · ${u.company}` : ""}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3">{u.role === "admin" ? <Badge className="bg-amber-50 text-amber-800 ring-amber-600/20">Admin</Badge> : <span className="text-slate-600">User</span>}</td>
                    <td className="px-3 py-3"><Badge className={STATUS_BADGE[u.status]}>{u.status[0].toUpperCase() + u.status.slice(1)}</Badge></td>
                    <td className="px-3 py-3"><span className={cn("inline-flex items-center gap-1.5 text-[13px] font-medium", tfa.cls)}><tfa.icon className="h-3.5 w-3.5" />{tfa.label}</span></td>
                    <td className="whitespace-nowrap px-3 py-3 text-[13px] text-slate-600">{formatDate(u.createdAt)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-[13px] text-slate-600">{timeAgo(u.lastSignInAt)}</td>
                    <td className="px-5 py-3 text-right"><UserActions user={u} selfId={selfId} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-ink-900/[0.06] px-5 py-3 text-xs text-slate-500">
        <span>{filtered.length} {filtered.length === 1 ? "user" : "users"}</span>
        {pages > 1 && (
          <div className="flex items-center gap-2">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className={cn(btn.secondary, "px-3 py-1.5 text-xs")}>Previous</button>
            <span>Page {page + 1} of {pages}</span>
            <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className={cn(btn.secondary, "px-3 py-1.5 text-xs")}>Next</button>
          </div>
        )}
      </div>
    </Card>
  );
}

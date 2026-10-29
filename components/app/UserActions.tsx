"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, KeyRound, Mail, MoreHorizontal, ShieldCheck, ShieldOff, Trash2, UserCheck } from "lucide-react";
import { postJson, useToast } from "@/components/app/Toaster";
import { Spinner, btn } from "@/components/app/ui";
import type { AdminUserRow } from "@/lib/app/admin-data";
import { cn } from "@/lib/utils";

type Action = "make-admin" | "make-user" | "suspend" | "reactivate" | "reset-mfa" | "send-reset" | "delete";

const DONE: Record<Action, string> = {
  "make-admin": "Promoted to admin",
  "make-user": "Admin access removed",
  suspend: "Account suspended",
  reactivate: "Account reactivated",
  "reset-mfa": "Two-factor reset",
  "send-reset": "Password reset email sent",
  delete: "User deleted",
};

/** Row/menu of admin actions for one user. `variant="buttons"` renders them inline for the detail page. */
export default function UserActions({ user, selfId, variant = "menu", onDeleted }: { user: Pick<AdminUserRow, "id" | "email" | "role" | "status" | "name">; selfId: string; variant?: "menu" | "buttons"; onDeleted?: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<Action | null>(null);
  const isSelf = user.id === selfId;

  async function run(action: Action) {
    const confirmations: Partial<Record<Action, string>> = {
      suspend: `Suspend ${user.email}? They'll be signed out and blocked from signing in.`,
      delete: `Permanently delete ${user.email} and all their data? This can't be undone.`,
      "reset-mfa": `Remove ${user.email}'s authenticator app and turn email codes back on?`,
      "make-admin": `Give ${user.email} full admin access?`,
    };
    if (confirmations[action] && !confirm(confirmations[action])) return;
    setBusy(action);
    setOpen(false);
    try {
      if (action === "delete") await postJson(`/api/admin/users/${user.id}`, undefined, "DELETE");
      else await postJson(`/api/admin/users/${user.id}`, { action }, "PATCH");
      toast({ tone: "success", title: DONE[action], description: user.email });
      if (action === "delete") {
        if (onDeleted) onDeleted();
        else router.push("/admin/users");
      }
      router.refresh();
    } catch (err) {
      toast({ tone: "error", title: "Action failed", description: (err as Error).message });
    } finally {
      setBusy(null);
    }
  }

  const items: { action: Action; label: string; icon: React.ComponentType<{ className?: string }>; danger?: boolean; hidden?: boolean }[] = [
    { action: "make-admin", label: "Make admin", icon: ShieldCheck, hidden: user.role === "admin" },
    { action: "make-user", label: "Remove admin", icon: ShieldOff, hidden: user.role !== "admin" || isSelf },
    { action: "send-reset", label: "Send password reset", icon: Mail },
    { action: "reset-mfa", label: "Reset two-factor", icon: KeyRound },
    { action: "reactivate", label: "Reactivate", icon: UserCheck, hidden: user.status !== "suspended" },
    { action: "suspend", label: "Suspend", icon: Ban, danger: true, hidden: user.status === "suspended" || isSelf },
    { action: "delete", label: "Delete user", icon: Trash2, danger: true, hidden: isSelf },
  ];
  const visible = items.filter((i) => !i.hidden);

  if (variant === "buttons") {
    return (
      <div className="flex flex-wrap gap-2">
        {visible.map((i) => (
          <button key={i.action} onClick={() => run(i.action)} disabled={!!busy} className={cn(i.danger ? btn.secondary + " text-red-600 hover:border-red-200 hover:bg-red-50" : btn.secondary, "py-2")}>
            {busy === i.action ? <Spinner /> : <i.icon className="h-4 w-4" />} {i.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="focus-ring-light rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-ink-800" aria-label={`Actions for ${user.email}`} aria-expanded={open}>
        {busy ? <Spinner /> : <MoreHorizontal className="h-4 w-4" />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div role="menu" className="animate-toast-in absolute right-0 z-50 mt-1 w-52 overflow-hidden rounded-xl border border-ink-900/10 bg-white p-1.5 shadow-xl">
            {visible.map((i) => (
              <button key={i.action} role="menuitem" onClick={() => run(i.action)} className={cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm", i.danger ? "text-red-600 hover:bg-red-50" : "text-ink-700 hover:bg-slate-50")}>
                <i.icon className="h-4 w-4 opacity-70" /> {i.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


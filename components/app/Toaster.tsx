"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "success" | "error" | "info";
interface Toast {
  id: number;
  tone: Tone;
  title: string;
  description?: string;
}

const ToastContext = createContext<(t: Omit<Toast, "id">) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };
const TONES = { success: "text-emerald-600", error: "text-red-600", info: "text-primary-600" };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = (id: number) => setToasts((all) => all.filter((t) => t.id !== id));

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((all) => [...all.slice(-3), { ...t, id }]);
    setTimeout(() => dismiss(id), t.tone === "error" ? 7000 : 4500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <div key={t.id} role={t.tone === "error" ? "alert" : "status"} className="animate-toast-in pointer-events-auto flex gap-3 rounded-xl border border-ink-900/10 bg-white p-4 shadow-xl shadow-ink-900/10">
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", TONES[t.tone])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900">{t.title}</p>
                {t.description && <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{t.description}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="focus-ring-light -m-1 h-fit rounded p-1 text-slate-400 hover:text-ink-700" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/** POST JSON to one of our API routes; throws the server's message on failure. */
export async function postJson<T = Record<string, unknown>>(url: string, body?: unknown, method = "POST"): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error ?? `Request failed (${res.status})`), { data, status: res.status });
  return data as T;
}

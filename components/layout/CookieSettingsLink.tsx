"use client";

import { openCookieSettings } from "@/lib/cookie-consent";

export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={className ?? "focus-ring shrink-0 underline hover:text-primary-400"}
    >
      Cookie Settings
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import CTAButton from "@/components/ui/CTAButton";
import {
  type CookiePreferences,
  defaultPreferences,
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookiePreferences,
  writeCookiePreferences,
} from "@/lib/cookie-consent";

const TOGGLES: { key: keyof CookiePreferences; label: string; description: string; locked?: boolean }[] = [
  {
    key: "necessary",
    label: "Necessary Cookies",
    description: "Required for the site to function. Always active.",
    locked: true,
  },
  {
    key: "analytics",
    label: "Analytics Cookies",
    description: "Help us understand how visitors use the site so we can improve it.",
  },
  {
    key: "marketing",
    label: "Marketing Cookies",
    description: "Used to measure and improve the relevance of our communications.",
  },
  {
    key: "preferences",
    label: "Preference Cookies",
    description: "Remember choices you make, like region or previously viewed content.",
  },
];

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const stored = readCookiePreferences();
    if (!stored) {
      setVisible(true);
    } else {
      setPrefs(stored);
    }
    function handleOpenSettings() {
      setSettingsOpen(true);
      setVisible(true);
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
  }, []);

  function persist(next: CookiePreferences) {
    setPrefs(next);
    writeCookiePreferences(next);
    setVisible(false);
    setSettingsOpen(false);
  }

  function acceptAll() {
    persist({ necessary: true, analytics: true, marketing: true, preferences: true });
  }

  function rejectNonEssential() {
    persist({ necessary: true, analytics: false, marketing: false, preferences: false });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[80] p-4 sm:p-6"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-2xl">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex gap-3">
                <Cookie className="mt-0.5 h-6 w-6 shrink-0 text-primary-500" />
                <div>
                  <p className="text-sm font-bold text-ink-900">We value your privacy</p>
                  <p className="mt-1 max-w-xl text-sm text-ink-600">
                    We use cookies to run essential site features and, with your consent, to analyse traffic
                    and improve our communications. You can change your preferences at any time.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="focus-ring rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-600 hover:text-primary-600"
                >
                  Manage Preferences
                </button>
                <CTAButton variant="secondary" size="md" icon={false} onClick={rejectNonEssential}>
                  Reject Non-Essential
                </CTAButton>
                <CTAButton variant="primary" size="md" icon={false} onClick={acceptAll}>
                  Accept All
                </CTAButton>
              </div>
            </div>

            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-t border-ink-900/10 bg-surface-near"
                >
                  <div className="flex items-center justify-between px-5 pt-4 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-400">Cookie Settings</p>
                    <button
                      onClick={() => setSettingsOpen(false)}
                      aria-label="Close cookie settings"
                      className="focus-ring rounded-md p-1 text-ink-400 hover:text-ink-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    {TOGGLES.map((toggle) => (
                      <label
                        key={toggle.key}
                        className="flex items-start gap-3 rounded-xl border border-ink-900/10 bg-white p-4"
                      >
                        <input
                          type="checkbox"
                          checked={prefs[toggle.key]}
                          disabled={toggle.locked}
                          onChange={(e) =>
                            setPrefs((p) => ({ ...p, [toggle.key]: toggle.locked ? true : e.target.checked }))
                          }
                          className="mt-1 h-4 w-4 rounded border-ink-300 text-primary-500 focus:ring-primary-400 disabled:opacity-60"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-ink-900">{toggle.label}</span>
                          <span className="mt-1 block text-xs text-ink-500">{toggle.description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 border-t border-ink-900/10 px-5 py-4 sm:px-6">
                    <CTAButton variant="primary" size="md" icon={false} onClick={() => persist(prefs)}>
                      Save Preferences
                    </CTAButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

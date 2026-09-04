export interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const COOKIE_STORAGE_KEY = "coredefense_cookie_consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "coredefense:open-cookie-settings";

export const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

export function readCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...defaultPreferences, ...parsed, necessary: true };
  } catch {
    return null;
  }
}

export function writeCookiePreferences(prefs: CookiePreferences) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage unavailable — consent simply won't persist
  }
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT));
}

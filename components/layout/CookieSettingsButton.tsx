"use client";

import CTAButton from "@/components/ui/CTAButton";
import { openCookieSettings } from "@/lib/cookie-consent";

export default function CookieSettingsButton() {
  return (
    <CTAButton variant="primary" icon={false} onClick={openCookieSettings}>
      Manage Cookie Settings
    </CTAButton>
  );
}

import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LegalContent from "@/components/templates/LegalContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CoreDefense collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: September 2026. This policy explains how CoreDefense Limited handles personal data collected through this website."
        breadcrumbs={[{ label: "Privacy Policy", href: "/privacy" }]}
      />
      <LegalContent
        sections={[
          {
            heading: "Who we are",
            body: "CoreDefense Limited (\"CoreDefense\", \"we\", \"us\") is a UK-based technology company. This policy applies to personal data collected through www.coredefense.co.uk.",
          },
          {
            heading: "What we collect",
            body: "We collect information you provide directly — such as your name, company, email address, phone number and message content — when you submit a contact form, request platform access, book a consultation or subscribe to our newsletter. We do not collect payment information through this website.",
          },
          {
            heading: "How we use your data",
            body: "We use your data to respond to enquiries, process free trial / access requests, send confirmation emails, and — where you've consented — send occasional updates. We use Resend as our transactional email provider; your data is processed by Resend solely to deliver these emails on our behalf.",
          },
          {
            heading: "Cookies",
            body: "We use necessary, analytics, marketing and preference cookies as described in our Cookie Policy. You can manage your preferences at any time via the Cookie Settings link in our footer.",
          },
          {
            heading: "Your rights",
            body: "Under UK GDPR, you have the right to access, correct, delete or restrict processing of your personal data, and to withdraw consent at any time. To exercise these rights, contact us at hello@coredefense.co.uk.",
          },
          {
            heading: "Data retention",
            body: "We retain enquiry and form data only as long as necessary to respond to your request and maintain business records, after which it is securely deleted.",
          },
          {
            heading: "Contact us",
            body: "Questions about this policy can be sent to hello@coredefense.co.uk.",
          },
        ]}
      />
    </>
  );
}

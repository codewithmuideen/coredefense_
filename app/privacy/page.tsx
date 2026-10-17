import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import LegalContent from "@/components/templates/LegalContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CoreDefense collects, uses and protects your personal data under UK GDPR.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How CoreDefense Limited collects, uses and protects personal data submitted through this website, and the rights you have over it."
        breadcrumbs={[{ label: "Privacy Policy", href: "/privacy" }]}
        showActions={false}
      />
      <LegalContent
        updated="October 2026"
        sections={[
          {
            heading: "Who we are",
            body: [
              "CoreDefense Limited (\"CoreDefense\", \"we\", \"us\") is a UK-based technology company and the data controller for personal data collected through www.coredefense.co.uk.",
              "This policy applies only to this website. Client engagements are covered by the data processing terms in the relevant contract.",
            ],
          },
          {
            heading: "What we collect",
            body: "We only collect what you choose to give us through our forms:",
            list: [
              "Contact and consultation forms: name, company, email, phone number, the service you're interested in and your message.",
              "Platform access requests: name, work email, company, job title, phone, company size and your main security concern.",
              "Newsletter sign-up: your email address.",
              "Talent Hub submissions: the details you provide about your experience and interests.",
            ],
          },
          {
            heading: "How we use your data",
            body: "We use your information to:",
            list: [
              "Respond to your enquiry or consultation request.",
              "Assess and follow up on platform early-access requests.",
              "Send confirmation emails and, where you've opted in, occasional updates.",
              "Keep basic business records of our correspondence.",
            ],
          },
          {
            heading: "Lawful basis",
            body: "We rely on legitimate interests to respond to enquiries you send us, on steps prior to entering a contract when you request a consultation, and on your consent for newsletters. You can withdraw consent at any time using the unsubscribe link in any email.",
          },
          {
            heading: "Who we share it with",
            body: [
              "We don't sell your data. We use Resend as our transactional email provider; it processes your details solely to deliver emails on our behalf.",
              "We may disclose information if required by law or to protect our legal rights.",
            ],
          },
          {
            heading: "International transfers",
            body: "Some service providers may process data outside the UK. Where they do, we rely on UK adequacy regulations or the International Data Transfer Agreement to keep your data protected to UK standards.",
          },
          {
            heading: "Data retention",
            body: "We keep enquiry and form data only as long as needed to respond to you and maintain business records, after which it's securely deleted. Newsletter data is kept until you unsubscribe.",
          },
          {
            heading: "Your rights",
            body: "Under UK GDPR you have the right to:",
            list: [
              "Access the personal data we hold about you.",
              "Have inaccurate data corrected.",
              "Have your data erased or its processing restricted.",
              "Object to processing based on legitimate interests.",
              "Data portability, where applicable.",
              "Withdraw consent at any time.",
              "Complain to the Information Commissioner's Office (ico.org.uk).",
            ],
          },
          {
            heading: "Cookies",
            body: "How we use cookies and local storage is explained in our Cookie Policy. You can change your preferences at any time via the Cookie Settings link in the footer.",
          },
        ]}
      />
    </>
  );
}

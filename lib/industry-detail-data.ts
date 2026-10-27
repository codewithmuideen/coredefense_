import { Landmark, HeartPulse, Factory, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Each field appears in exactly one place, so no sentence repeats across the home page, /industries and the
// industry page. The home-page teaser lives in lib/industries-data.ts.
export interface IndustryDetail {
  slug: string;
  title: string;
  /** Industry page hero line. */
  summary: string;
  /** Card copy on /industries. */
  description: string;
  /** "How CoreDefense helps" body on the industry page. */
  approach: string;
  image?: string;
  icon?: LucideIcon;
  focusAreas: string[];
}

export const industryDetails: Record<string, IndustryDetail> = {
  "financial-services": {
    slug: "/industries/financial-services",
    title: "Financial Services",
    summary: "Meet FCA operational-resilience and DORA expectations without slowing your product teams down.",
    description:
      "Banks, lenders, insurers and fintechs answer to the FCA, the PRA and the card schemes at the same time. We help you evidence resilience to all of them from a single body of work.",
    approach:
      "We start from your important business services and impact tolerances, then work backwards: which systems support them, how they could fail and what a supervisor would expect to see. Security testing, supplier reviews and process redesign all feed the same resilience self-assessment, so nothing is done twice.",
    icon: Landmark,
    focusAreas: [
      "Resilience mapping for important business services",
      "PCI DSS v4.0 readiness for card-handling environments",
      "Penetration testing of customer apps and open-banking APIs",
      "Third-party and outsourcing risk reviews aligned to DORA",
    ],
  },
  healthcare: {
    slug: "/industries/healthcare",
    title: "Healthcare",
    summary: "Keep patient records safe and clinical systems running, even on equipment that can't be patched on demand.",
    description:
      "NHS trusts, private providers and health-tech suppliers must satisfy the Data Security and Protection Toolkit while keeping care uninterrupted. We plan every piece of security work around clinical reality.",
    approach:
      "Clinical systems often run on certified configurations that can't simply be updated or rebooted. We agree maintenance windows with clinical engineering, use compensating controls where updates aren't possible, and turn DSPT assertions into evidence your information-governance lead can stand behind.",
    icon: HeartPulse,
    focusAreas: [
      "DSPT evidence preparation and gap remediation",
      "Network segmentation for connected medical devices",
      "Phishing resilience for clinical and admin staff",
      "Secure patient portals and online booking tools",
    ],
  },
  manufacturing: {
    slug: "/industries/manufacturing",
    title: "Manufacturing",
    summary: "Protect production lines from cyber disruption without stopping the line to do it.",
    description:
      "Downtime is the real cost of a cyber incident on a plant. We help manufacturers measure and shrink that exposure, working to IEC 62443 and the NIS Regulations where they apply.",
    approach:
      "We work alongside your engineers, not around them: passive monitoring first, changes only in agreed windows, and every recommendation expressed in hours of downtime avoided. In parallel, we map production and quality workflows to find the manual steps worth automating.",
    icon: Factory,
    focusAreas: [
      "OT asset inventory built without active scanning",
      "Remote-access controls for OEM and integrator engineers",
      "Recovery planning for line controllers and historians",
      "Shop-floor workflow mapping and automation",
    ],
  },
  technology: {
    slug: "/industries/technology",
    title: "Technology",
    summary: "Security that keeps pace with weekly releases and the due-diligence questions that follow every enterprise deal.",
    description:
      "SaaS and platform companies are judged on security long before an incident: in procurement questionnaires, SOC 2 requests and investor due diligence. We help you answer with confidence.",
    approach:
      "We embed in your delivery process instead of auditing it from outside: threat models during design, scanning in the pipeline and a trust pack your sales team can send to prospects. As you grow, we help formalise controls toward ISO 27001 or SOC 2 without adding bureaucracy.",
    icon: Cpu,
    focusAreas: [
      "Hardening CI/CD pipelines and cloud accounts",
      "Security questionnaire and trust-pack support for sales",
      "ISO 27001 or SOC 2 readiness for scale-ups",
      "AI feature reviews for data-leak and prompt-injection risk",
    ],
  },
};

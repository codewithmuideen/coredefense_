import { Landmark, HeartPulse, Factory, Cpu, Briefcase, Building2, Store, School } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Each sentence appears in exactly one place:
//   summary      → industry page hero
//   description  → the industry's tab in the /industries explorer
//   approach     → "How CoreDefense helps" on the industry page
//   focusAreas   → checklist on the industry page
//   threats      → "What we see in this sector" cards on the industry page
//   regulations  → names appear as chips in the explorer; the detail sentence only on the industry page
// The short home-page teaser lives in lib/industries-data.ts.
export interface IndustryDetail {
  slug: string;
  title: string;
  summary: string;
  description: string;
  approach: string;
  image?: string;
  icon: LucideIcon;
  focusAreas: string[];
  threats: { title: string; detail: string }[];
  regulations: { name: string; detail: string }[];
  /** Keys of lib/service-detail-data.ts most often used in this sector. */
  services: string[];
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
    threats: [
      { title: "Account takeover", detail: "Credential stuffing and SIM-swap fraud aimed at retail banking apps and payment flows." },
      { title: "Third-party concentration", detail: "A single cloud or software supplier outage can breach impact tolerances across several services at once." },
      { title: "Payment fraud via BEC", detail: "Spoofed supplier emails that redirect high-value transfers, often timed around month-end." },
    ],
    regulations: [
      { name: "FCA PS21/3", detail: "Map important business services, set impact tolerances and prove you can stay within them." },
      { name: "DORA", detail: "EU-facing firms must test digital resilience and manage ICT third-party risk to a common standard." },
      { name: "PCI DSS v4.0", detail: "Future-dated requirements became mandatory in March 2025, including targeted risk analyses." },
    ],
    services: ["security-assessment", "compliance-governance", "vulnerability-management", "business-analysis"],
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
    threats: [
      { title: "Ransomware on shared suppliers", detail: "Attacks on pathology and IT suppliers have halted services across several trusts at once." },
      { title: "Legacy medical devices", detail: "Imaging and monitoring kit running unsupported operating systems that can't be patched in place." },
      { title: "Records exposure", detail: "Misdirected emails and over-shared drives remain a leading cause of reportable data incidents." },
    ],
    regulations: [
      { name: "DSPT", detail: "Annual self-assessment that every organisation with access to NHS patient data must publish." },
      { name: "UK GDPR", detail: "Health data is special-category data, so it needs a lawful basis plus an additional condition." },
      { name: "DCB0129 / DCB0160", detail: "Clinical risk management standards for manufacturers and deployers of health IT." },
    ],
    services: ["security-assessment", "it-ot-security", "security-awareness", "web-development"],
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
    threats: [
      { title: "IT-to-OT ransomware spread", detail: "Flat networks let an infection on an office laptop reach the HMIs that run the line." },
      { title: "Unmanaged vendor access", detail: "Always-on remote connections left behind by integrators long after commissioning." },
      { title: "Unknown assets", detail: "Controllers and gateways that never made it into any register, so nobody watches them." },
    ],
    regulations: [
      { name: "IEC 62443", detail: "The international series for securing industrial automation through zones, conduits and security levels." },
      { name: "NIS Regulations", detail: "Operators of essential services must manage risk and report significant incidents to their regulator." },
      { name: "Cyber Essentials", detail: "Often a contractual requirement from automotive, defence and public-sector customers." },
    ],
    services: ["it-ot-security", "incident-readiness", "process-modelling", "intelligent-automation"],
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
    threats: [
      { title: "Leaked secrets", detail: "API keys and tokens committed to repositories or baked into container images." },
      { title: "Software supply chain", detail: "Compromised open-source packages and build tooling that reach production unnoticed." },
      { title: "Tenant isolation flaws", detail: "Authorisation bugs that let one customer read another customer's data." },
    ],
    regulations: [
      { name: "SOC 2", detail: "The attestation US enterprise buyers ask for most, covering security and optionally availability and privacy." },
      { name: "ISO 27001:2022", detail: "Internationally recognised certification; the 2022 revision added controls for cloud and secure coding." },
      { name: "EU AI Act", detail: "Obligations phase in from 2025 for providers and deployers of AI systems sold into the EU." },
    ],
    services: ["cloud-devops-security", "software-engineering", "compliance-governance", "ai-strategy"],
  },
  "professional-services": {
    slug: "/industries/professional-services",
    title: "Professional Services",
    summary: "Protect client confidentiality, the asset every law firm, accountancy and consultancy is really selling.",
    description:
      "Advisory firms hold some of their clients' most sensitive information and move money on their behalf. Attackers know it, and so do the clients sending you security questionnaires.",
    approach:
      "We focus first on the two routes attackers use most against firms: the inbox and the client portal. Then we help partners answer client due-diligence questions with evidence rather than reassurance, and make sure matter data is only visible to the people working on it.",
    icon: Briefcase,
    focusAreas: [
      "Email security and payment-diversion controls",
      "Access reviews for document management and matter files",
      "Client due-diligence questionnaire support",
      "Cyber Essentials Plus and ISO 27001 for panel requirements",
    ],
    threats: [
      { title: "Conveyancing and invoice fraud", detail: "Criminals intercept completion or invoice emails and swap in their own bank details." },
      { title: "Targeted phishing of partners", detail: "Convincing lures built from public deal announcements and LinkedIn profiles." },
      { title: "Over-shared matter data", detail: "Whole-firm access to client folders that only a small team should see." },
    ],
    regulations: [
      { name: "SRA Code of Conduct", detail: "Solicitors must protect client money and confidential information, and report serious breaches." },
      { name: "ICAEW guidance", detail: "Accountancy firms are expected to show reasonable controls over client data and systems." },
      { name: "UK GDPR", detail: "Firms are usually controllers for their own data and processors for much of their clients' data." },
    ],
    services: ["security-awareness", "compliance-governance", "security-assessment", "incident-readiness"],
  },
  "critical-infrastructure": {
    slug: "/industries/critical-infrastructure",
    title: "Critical Infrastructure",
    summary: "Resilience for energy, water and transport operators, where a cyber incident becomes a public-safety event.",
    description:
      "Operators of essential services run long-lived control systems under close regulatory scrutiny. We help them meet the NCSC Cyber Assessment Framework while keeping supply flowing.",
    approach:
      "We assess against the CAF's fourteen principles so your regulator sees familiar language, then prioritise the gaps that matter most to safety and supply. Work on control systems is passive-first and scheduled with operations, and incident plans are rehearsed with the people who would actually run a degraded network.",
    icon: Building2,
    focusAreas: [
      "NCSC CAF self-assessment and improvement plans",
      "Segmentation between corporate IT and control networks",
      "Incident exercises for degraded and manual operation",
      "Supplier and remote-maintenance access governance",
    ],
    threats: [
      { title: "State-sponsored intrusion", detail: "Long-dwell campaigns that pre-position inside control networks rather than causing immediate damage." },
      { title: "Remote-access abuse", detail: "Exposed VPN and remote-desktop gateways used by maintenance contractors." },
      { title: "Ageing control systems", detail: "SCADA components that were never designed to authenticate the commands they receive." },
    ],
    regulations: [
      { name: "NIS Regulations", detail: "Sector regulators such as Ofgem and Ofwat audit operators against defined security outcomes." },
      { name: "NCSC CAF", detail: "Fourteen principles across four objectives, used by most UK regulators to judge cyber resilience." },
      { name: "Cyber Security and Resilience Bill", detail: "Proposed legislation that would widen NIS scope to more suppliers and managed services." },
    ],
    services: ["it-ot-security", "incident-readiness", "vulnerability-management", "compliance-governance"],
  },
  retail: {
    slug: "/industries/retail",
    title: "Retail",
    summary: "Keep tills, checkouts and loyalty platforms trading safely through every peak season.",
    description:
      "Retailers run thousands of endpoints across stores, warehouses and e-commerce, and a single outage at peak can wipe out a quarter's margin. We focus security where trading risk is highest.",
    approach:
      "We begin with the customer journey, from basket to payment to delivery, and test each step the way a fraudster would. Store networks are segmented so a compromised kiosk can't reach payment systems, and the help desk gets clear procedures, because it's a favourite target for social engineering.",
    icon: Store,
    focusAreas: [
      "E-commerce and checkout penetration testing",
      "Store network segmentation and point-of-sale hardening",
      "Help-desk identity verification procedures",
      "Peak-season incident and continuity planning",
    ],
    threats: [
      { title: "Help-desk social engineering", detail: "Callers impersonating staff to reset passwords and MFA, the entry point in several recent UK retail attacks." },
      { title: "Web skimming", detail: "Malicious scripts injected into checkout pages that copy card details as customers type." },
      { title: "Loyalty fraud", detail: "Stolen credentials used to drain points balances and gift cards at scale." },
    ],
    regulations: [
      { name: "PCI DSS v4.0", detail: "Now requires an inventory and integrity checks for every script running on payment pages." },
      { name: "UK GDPR", detail: "Leaks of customer or loyalty data that put shoppers at risk go to the ICO within 72 hours." },
      { name: "Consumer Duty", detail: "Retailers offering credit products must show good outcomes, including during disruption." },
    ],
    services: ["security-assessment", "cloud-devops-security", "security-awareness", "incident-readiness"],
  },
  education: {
    slug: "/industries/education",
    title: "Education",
    summary: "Open campuses and research networks that stay open to learning, not to attackers.",
    description:
      "Universities, colleges and multi-academy trusts balance openness with protecting student records and valuable research. Budgets are tight, so every security pound has to count.",
    approach:
      "We prioritise ruthlessly: identity and backups first, because they decide whether a ransomware attack is an inconvenience or a closure. For research-intensive institutions we add controls around sensitive projects and export-controlled data, without locking down teaching networks.",
    icon: School,
    focusAreas: [
      "MFA and identity hygiene across staff and students",
      "Offline, tested backups for core systems",
      "Research data protection and trusted research controls",
      "Low-cost awareness programmes for staff",
    ],
    threats: [
      { title: "Ransomware with data theft", detail: "Attackers steal pupil and staff records before encrypting systems, then threaten publication." },
      { title: "Compromised student accounts", detail: "Huge user populations with weak passwords provide easy footholds." },
      { title: "Research espionage", detail: "Hostile actors targeting dual-use research and intellectual property." },
    ],
    regulations: [
      { name: "DfE cyber standards", detail: "Department for Education standards for schools and colleges, covering backups, MFA and training." },
      { name: "UK GDPR", detail: "Children's data attracts extra care, and institutions must answer subject access requests promptly." },
      { name: "Trusted Research", detail: "NCSC and NPSA guidance on protecting research from interference and theft." },
    ],
    services: ["security-awareness", "incident-readiness", "vulnerability-management", "ai-ml"],
  },
};

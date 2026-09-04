export interface IndustryDetail {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  focusAreas: string[];
}

export const industryDetails: Record<string, IndustryDetail> = {
  "financial-services": {
    slug: "/industries/financial-services",
    title: "Financial Services",
    summary: "Regulatory-grade security and resilience for banks, lenders and fintechs.",
    description:
      "Financial services organisations operate under some of the strictest regulatory and security expectations of any sector. CoreDefense supports banks, lenders and fintechs with cybersecurity, compliance mapping and digital engineering built for that level of scrutiny.",
    image: "/images/illustrations/compliance-governance.png",
    focusAreas: [
      "Compliance mapping against financial services regulation",
      "Vulnerability management for customer-facing platforms",
      "Secure digital engineering for online and mobile banking",
      "Business process optimisation for operational risk teams",
    ],
  },
  healthcare: {
    slug: "/industries/healthcare",
    title: "Healthcare",
    summary: "Protecting patient data and clinical systems without slowing down care.",
    description:
      "Healthcare organisations must protect sensitive patient data and keep clinical systems running — often on infrastructure that can't simply be taken offline for patching. CoreDefense designs security around that reality.",
    image: "/images/illustrations/it-ot-hub.png",
    focusAreas: [
      "Security assessment for clinical and administrative systems",
      "IT/OT security for connected medical devices",
      "Compliance support for patient data protection",
      "Digital platforms for patient and staff experience",
    ],
  },
  manufacturing: {
    slug: "/industries/manufacturing",
    title: "Manufacturing",
    summary: "IT/OT security for production environments and industrial control systems.",
    description:
      "Manufacturing environments blend IT and operational technology in ways that create unique risk. CoreDefense helps manufacturers secure production systems without disrupting operations.",
    image: "/images/illustrations/it-ot-security.png",
    focusAreas: [
      "IT/OT security and network segmentation",
      "Industrial control system risk assessment",
      "Business process mapping for operational efficiency",
      "Workflow automation for production and quality processes",
    ],
  },
  technology: {
    slug: "/industries/technology",
    title: "Technology",
    summary: "Secure-by-design engineering for fast-moving product and platform teams.",
    description:
      "Technology companies move fast — and need security and engineering practices that keep pace rather than slowing delivery down. CoreDefense supports product and platform teams with security embedded from day one.",
    image: "/images/illustrations/cloud-devops.png",
    focusAreas: [
      "Cloud & DevOps security for engineering teams",
      "AI & automation for product and operations",
      "Digital platform and software engineering support",
      "Security awareness for fast-scaling teams",
    ],
  },
};

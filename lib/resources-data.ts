export interface ResourceItem {
  title: string;
  category: "Insight" | "Guide" | "Case Study";
  excerpt: string;
  href: string;
  readTime?: string;
}

export const resourceItems: ResourceItem[] = [
  {
    title: "Mapping vulnerabilities to compliance frameworks",
    category: "Guide",
    excerpt: "A practical approach to aligning remediation work with ISO 27001, NIST and PCI DSS requirements.",
    href: "/resources/guides",
    readTime: "8 min read",
  },
  {
    title: "Why IT and OT security need a shared language",
    category: "Insight",
    excerpt: "How manufacturing and critical infrastructure teams can bridge the gap between IT and operational technology security.",
    href: "/resources/insights",
    readTime: "6 min read",
  },
  {
    title: "Where AI actually helps in threat triage",
    category: "Insight",
    excerpt: "A grounded look at what AI can and can't do when prioritising security alerts.",
    href: "/resources/insights",
    readTime: "7 min read",
  },
  {
    title: "Business process mapping: a starting framework",
    category: "Guide",
    excerpt: "Current-state, analysis, optimisation, future-state — a practical framework for process discovery.",
    href: "/resources/guides",
    readTime: "10 min read",
  },
];

export const caseStudyPlaceholders = [
  { title: "Financial Services", status: "Case Study Coming Soon" },
  { title: "Manufacturing", status: "Case Study Coming Soon" },
  { title: "Technology", status: "Case Study Coming Soon" },
];

import type { SearchableItem } from "@/types";
import { faqItems } from "@/lib/faq-data";
import { articles, articleHref } from "@/lib/articles-data";

export const searchIndex: SearchableItem[] = [
  // Services
  { title: "All Solutions", href: "/solutions", category: "Services", description: "Every CoreDefense practice and service" },
  { title: "Cybersecurity", href: "/cybersecurity", category: "Services", description: "AI-powered, compliance-ready cybersecurity" },
  { title: "Vulnerability Management", href: "/cybersecurity/vulnerability-management", category: "Services" },
  { title: "Cloud & DevOps Security", href: "/cybersecurity/cloud-devops-security", category: "Services" },
  { title: "IT/OT Security", href: "/cybersecurity/it-ot-security", category: "Services" },
  { title: "Compliance & Governance", href: "/cybersecurity/compliance-governance", category: "Services" },
  { title: "AI-Powered Threat Triage", href: "/cybersecurity/ai-threat-triage", category: "Services" },
  { title: "Security Assessment", href: "/cybersecurity/security-assessment", category: "Services" },
  { title: "Incident Readiness", href: "/cybersecurity/incident-readiness", category: "Services" },
  { title: "Security Awareness", href: "/cybersecurity/security-awareness", category: "Services" },
  { title: "Business Transformation", href: "/business-transformation", category: "Services" },
  { title: "Business Process Mapping", href: "/business-transformation/process-modelling", category: "Services" },
  { title: "Cybersecurity Business Analysis", href: "/business-transformation/business-analysis", category: "Services" },
  { title: "Digital Engineering", href: "/digital-engineering", category: "Services" },
  { title: "Website Development", href: "/digital-engineering/web-development", category: "Services" },
  { title: "Software Engineering", href: "/digital-engineering/software-engineering", category: "Services" },
  { title: "Digital Platforms", href: "/digital-engineering/digital-platforms", category: "Services" },
  { title: "AI & Automation", href: "/ai-automation", category: "Services" },
  { title: "AI Strategy", href: "/ai-automation/ai-strategy", category: "Services" },
  { title: "Workflow & Intelligent Automation", href: "/ai-automation/intelligent-automation", category: "Services" },
  { title: "AI & Machine Learning", href: "/ai-automation/ai-ml", category: "Services" },

  // Platform
  { title: "Platform Overview", href: "/platform", category: "Pages" },
  { title: "Platform Features", href: "/platform/features", category: "Pages" },
  { title: "Integrations Ecosystem", href: "/platform/integrations", category: "Pages" },
  { title: "Security Trust Center", href: "/platform/trust-center", category: "Pages" },
  { title: "Use Cases", href: "/platform/use-cases", category: "Pages" },
  { title: "Compliance Mapping", href: "/platform/compliance-mapping", category: "Pages" },

  // Industries
  { title: "Financial Services", href: "/industries/financial-services", category: "Industries" },
  { title: "Healthcare", href: "/industries/healthcare", category: "Industries" },
  { title: "Manufacturing", href: "/industries/manufacturing", category: "Industries" },
  { title: "Technology", href: "/industries/technology", category: "Industries" },
  { title: "Professional Services", href: "/industries/professional-services", category: "Industries" },
  { title: "Critical Infrastructure", href: "/industries/critical-infrastructure", category: "Industries" },
  { title: "Retail", href: "/industries/retail", category: "Industries" },
  { title: "Education", href: "/industries/education", category: "Industries" },
  { title: "All Industries", href: "/industries", category: "Industries" },

  // Resources
  { title: "Blog", href: "/blog", category: "Resources", description: "Live security news and CoreDefense daily briefs" },
  { title: "Insights", href: "/resources/insights", category: "Resources" },
  { title: "Guides", href: "/resources/guides", category: "Resources" },

  // Pages
  { title: "About CoreDefense", href: "/about", category: "Pages" },
  { title: "Team", href: "/team", category: "Pages", description: "Meet the people behind CoreDefense" },
  { title: "Resource Center", href: "/resources", category: "Resources" },
  { title: "Privacy Policy", href: "/privacy", category: "Pages" },
  { title: "Cookie Policy", href: "/cookies", category: "Pages" },
  { title: "Terms of Use", href: "/terms", category: "Pages" },
  { title: "Accessibility", href: "/accessibility", category: "Pages" },
  { title: "Talent Hub", href: "/careers", category: "Pages", description: "Careers and introducing yourself to CoreDefense" },
  { title: "Contact", href: "/contact", category: "Pages", description: "Email, phone and consultation booking" },
  { title: "Request Early Access", href: "/request-access", category: "Pages" },

  // Articles
  ...articles.map((a) => ({
    title: a.title,
    href: articleHref(a),
    category: "Resources" as const,
    description: a.excerpt,
  })),

  // FAQs
  ...faqItems.map((f) => ({
    title: f.question,
    href: "/faq",
    category: "FAQs" as const,
    description: f.answer,
  })),
];

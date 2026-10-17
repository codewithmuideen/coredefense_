import {
  ShieldCheck,
  Cloud,
  Factory,
  FileCheck2,
  BrainCircuit,
  Radar,
  FileSearch,
  ShieldAlert,
  GraduationCap,
  Workflow,
  LineChart,
  Users,
  Globe2,
  LayoutDashboard,
  Code2,
  Cpu,
  Boxes,
  Sparkles,
  Bot,
  BarChart3,
  Settings2,
  Puzzle,
  Plug,
  LockKeyhole,
  ListChecks,
  MapPinned,
  Briefcase,
  Building2,
  Landmark,
  HeartPulse,
  Factory as FactoryIcon,
  Cpu as TechIcon,
  Store,
  School,
  Newspaper,
  BookOpenText,
  FileBarChart2,
  HelpCircle,
  Info,
  Compass,
  Mail,
  Rss,
  UserRound,
} from "lucide-react";
import type { MegaMenuSection, NavColumn } from "@/types";

export const solutionsMenu: MegaMenuSection = {
  label: "Solutions",
  href: "/solutions",
  columns: [
    {
      heading: "Cybersecurity",
      href: "/cybersecurity",
      links: [
        { label: "Vulnerability Management", href: "/cybersecurity/vulnerability-management", icon: Radar },
        { label: "Cloud & DevOps Security", href: "/cybersecurity/cloud-devops-security", icon: Cloud },
        { label: "IT/OT Security", href: "/cybersecurity/it-ot-security", icon: Factory },
        { label: "Compliance & Governance", href: "/cybersecurity/compliance-governance", icon: FileCheck2 },
        { label: "AI-Powered Threat Triage", href: "/cybersecurity/ai-threat-triage", icon: BrainCircuit },
        { label: "Security Assessment", href: "/cybersecurity/security-assessment", icon: FileSearch },
        { label: "Incident Readiness", href: "/cybersecurity/incident-readiness", icon: ShieldAlert },
        { label: "Security Awareness", href: "/cybersecurity/security-awareness", icon: GraduationCap },
      ],
    },
    {
      heading: "Business Transformation",
      href: "/business-transformation",
      links: [
        { label: "Business Process Mapping", href: "/business-transformation/process-modelling", icon: Workflow },
        { label: "Process Optimisation", href: "/business-transformation/process-modelling", icon: LineChart },
        { label: "Cybersecurity Business Analysis", href: "/business-transformation/business-analysis", icon: Users },
        { label: "Digital Transformation", href: "/business-transformation", icon: Globe2 },
        { label: "Workflow Automation", href: "/business-transformation/workflow-automation", icon: Settings2 },
      ],
    },
    {
      heading: "Digital Engineering",
      href: "/digital-engineering",
      links: [
        { label: "Website Development", href: "/digital-engineering/web-development", icon: LayoutDashboard },
        { label: "Web Applications", href: "/digital-engineering/software-engineering", icon: Code2 },
        { label: "Digital Platforms", href: "/digital-engineering/digital-platforms", icon: Boxes },
        { label: "UI/UX Engineering", href: "/digital-engineering/web-development", icon: Sparkles },
        { label: "Software Engineering", href: "/digital-engineering/software-engineering", icon: Cpu },
        { label: "Cloud Solutions", href: "/digital-engineering/digital-platforms", icon: Cloud },
      ],
    },
    {
      heading: "AI & Automation",
      href: "/ai-automation",
      links: [
        { label: "AI Strategy", href: "/ai-automation/ai-strategy", icon: Sparkles },
        { label: "AI Automation", href: "/ai-automation/intelligent-automation", icon: Bot },
        { label: "Intelligent Workflows", href: "/ai-automation/intelligent-automation", icon: Workflow },
        { label: "AI/ML Solutions", href: "/ai-automation/ai-ml", icon: BrainCircuit },
        { label: "Business Intelligence", href: "/ai-automation/ai-ml", icon: BarChart3 },
        { label: "Process Automation", href: "/ai-automation/intelligent-automation", icon: Settings2 },
      ],
    },
  ],
  featured: {
    title: "AI-Powered Threat Triage",
    description:
      "See how CoreDefense combines AI and human expertise to detect, prioritise and remediate threats faster.",
    href: "/cybersecurity/ai-threat-triage",
    ctaLabel: "Explore the capability",
    image: "/images/illustrations/single-black-cube-monolith.jpg",
  },
};

export const platformMenu: MegaMenuSection = {
  label: "Platform",
  href: "/platform",
  columns: [
    {
      heading: "The CoreDefense Platform",
      href: "/platform",
      links: [
        { label: "Features", href: "/platform/features", icon: Puzzle },
        { label: "Integrations Ecosystem", href: "/platform/integrations", icon: Plug },
        { label: "Use Cases", href: "/platform/use-cases", icon: ListChecks },
      ],
    },
    {
      heading: "Trust & Compliance",
      links: [
        { label: "Security Trust Center", href: "/platform/trust-center", icon: LockKeyhole },
        { label: "Compliance Mapping", href: "/platform/compliance-mapping", icon: MapPinned },
      ],
    },
  ],
  featured: {
    title: "Request Platform Access",
    description:
      "CoreDefense's cybersecurity platform is in active development. Request early access and we'll be in touch about onboarding.",
    href: "/request-access",
    ctaLabel: "Request Early Access",
    image: "/images/illustrations/floating-cube-data-stream.jpg",
  },
};

export const industriesMenu: MegaMenuSection = {
  label: "Industries",
  href: "/industries",
  columns: [
    {
      heading: "Industries We Serve",
      href: "/industries",
      links: [
        { label: "Financial Services", href: "/industries/financial-services", icon: Landmark },
        { label: "Healthcare", href: "/industries/healthcare", icon: HeartPulse },
        { label: "Manufacturing", href: "/industries/manufacturing", icon: FactoryIcon },
        { label: "Technology", href: "/industries/technology", icon: TechIcon },
      ],
    },
    {
      heading: "Also Supported",
      links: [
        { label: "Professional Services", href: "/industries", icon: Briefcase },
        { label: "Critical Infrastructure", href: "/industries", icon: Building2 },
        { label: "Retail", href: "/industries", icon: Store },
        { label: "Education", href: "/industries", icon: School },
      ],
    },
  ],
  featured: {
    title: "Sector-specific risk, mapped to your business",
    description:
      "Every industry carries a different risk profile. See how CoreDefense tailors cybersecurity and transformation to yours.",
    href: "/industries",
    ctaLabel: "View all industries",
    image: "/images/illustrations/networking-security.jpg",
  },
};

export const resourcesMenu: MegaMenuSection = {
  label: "Resources",
  href: "/resources",
  columns: [
    {
      heading: "Resource Center",
      href: "/resources",
      links: [
        { label: "Blog", href: "/blog", icon: Rss },
        { label: "Insights", href: "/resources/insights", icon: Newspaper },
        { label: "Guides", href: "/resources/guides", icon: BookOpenText },
        { label: "Case Studies", href: "/resources/case-studies", icon: FileBarChart2 },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "FAQ", href: "/faq", icon: HelpCircle },
        { label: "Security Trust Center", href: "/platform/trust-center", icon: LockKeyhole },
      ],
    },
  ],
  featured: {
    title: "Compliance Mapping Guide",
    description:
      "A practical look at how CoreDefense maps vulnerabilities and controls against ISO, NIST, PCI DSS and GDPR.",
    href: "/platform/compliance-mapping",
    ctaLabel: "Read the guide",
    icon: MapPinned,
  },
};

export const aboutMenu: MegaMenuSection = {
  label: "About",
  href: "/about",
  columns: [
    {
      heading: "Company",
      links: [
        { label: "About CoreDefense", href: "/about", icon: Info },
        { label: "Our Approach", href: "/about#approach", icon: Compass },
        { label: "Leadership Team", href: "/team", icon: UserRound },
        { label: "Careers", href: "/careers", icon: Briefcase },
        { label: "Talent Hub", href: "/careers/talent-hub", icon: Users },
      ],
    },
    {
      heading: "Get in Touch",
      links: [
        { label: "Contact Us", href: "/contact", icon: Mail },
        { label: "Book a Consultation", href: "/book-consultation", icon: ShieldCheck },
      ],
    },
  ],
  featured: {
    title: "One technology partner, four connected practices",
    description:
      "Cybersecurity, business transformation, digital engineering and AI & automation, working together.",
    href: "/about",
    ctaLabel: "Learn about CoreDefense",
    image: "/images/photos/team-standing-desk.jpg",
  },
};

export const megaMenus: MegaMenuSection[] = [
  solutionsMenu,
  platformMenu,
  industriesMenu,
  resourcesMenu,
  aboutMenu,
];

export const footerColumns: NavColumn[] = [
  {
    heading: "Solutions",
    links: [
      { label: "All Solutions", href: "/solutions" },
      { label: "Cybersecurity", href: "/cybersecurity" },
      { label: "Business Transformation", href: "/business-transformation" },
      { label: "Digital Engineering", href: "/digital-engineering" },
      { label: "AI & Automation", href: "/ai-automation" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Platform Overview", href: "/platform" },
      { label: "Features", href: "/platform/features" },
      { label: "Integrations Ecosystem", href: "/platform/integrations" },
      { label: "Security Trust Center", href: "/platform/trust-center" },
      { label: "Use Cases", href: "/platform/use-cases" },
      { label: "Compliance Mapping", href: "/platform/compliance-mapping" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Leadership Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Talent Hub", href: "/careers/talent-hub" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Insights", href: "/resources/insights" },
      { label: "Guides", href: "/resources/guides" },
      { label: "Case Studies", href: "/resources/case-studies" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Terms", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

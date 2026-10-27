import {
  Cloud,
  Factory,
  FileCheck2,
  BrainCircuit,
  Radar,
  FileSearch,
  ShieldAlert,
  GraduationCap,
  Workflow,
  Users,
  LayoutDashboard,
  Code2,
  Boxes,
  Sparkles,
  Bot,
  BarChart3,
  Puzzle,
  Plug,
  LockKeyhole,
  ListChecks,
  MapPinned,
  Landmark,
  HeartPulse,
  Cpu,
  Newspaper,
  BookOpenText,
  HelpCircle,
  Info,
  Mail,
  Rss,
  UserRound,
} from "lucide-react";
import type { MegaMenuSection, NavColumn } from "@/types";

// Every link points to a different page: no two labels share a destination.
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
        { label: "Process Mapping & Optimisation", href: "/business-transformation/process-modelling", icon: Workflow },
        { label: "Cybersecurity Business Analysis", href: "/business-transformation/business-analysis", icon: Users },
      ],
    },
    {
      heading: "Digital Engineering",
      href: "/digital-engineering",
      links: [
        { label: "Websites & UI/UX", href: "/digital-engineering/web-development", icon: LayoutDashboard },
        { label: "Web Apps & Software", href: "/digital-engineering/software-engineering", icon: Code2 },
        { label: "Digital Platforms & Cloud", href: "/digital-engineering/digital-platforms", icon: Boxes },
      ],
    },
    {
      heading: "AI & Automation",
      href: "/ai-automation",
      links: [
        { label: "AI Strategy", href: "/ai-automation/ai-strategy", icon: Sparkles },
        { label: "Workflow & Intelligent Automation", href: "/ai-automation/intelligent-automation", icon: Bot },
        { label: "AI/ML & Business Intelligence", href: "/ai-automation/ai-ml", icon: BarChart3 },
      ],
    },
  ],
  featured: {
    title: "AI-Powered Threat Triage",
    description: "Machine speed on the noise, human judgement on the decisions that matter.",
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
    description: "Be among the first organisations to pilot the platform and shape what we build next.",
    href: "/request-access",
    ctaLabel: "Request Early Access",
    image: "/images/illustrations/image_20261017_125543.jpg",
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
        { label: "Manufacturing", href: "/industries/manufacturing", icon: Factory },
        { label: "Technology", href: "/industries/technology", icon: Cpu },
      ],
    },
  ],
  featured: {
    title: "Regulation-ready by sector",
    description: "From FCA operational resilience to the NHS DSPT and IEC 62443, we work to your rulebook.",
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
      ],
    },
    {
      heading: "Support",
      links: [{ label: "FAQ", href: "/faq", icon: HelpCircle }],
    },
  ],
  featured: {
    title: "Today's security news",
    description: "Headlines from leading security newsrooms, refreshed every hour.",
    href: "/blog",
    ctaLabel: "Read the blog",
    icon: Rss,
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
        { label: "Team", href: "/team", icon: UserRound },
        { label: "Talent Hub", href: "/careers", icon: Users },
      ],
    },
    {
      heading: "Get in Touch",
      links: [{ label: "Contact Us", href: "/contact", icon: Mail }],
    },
  ],
  featured: {
    title: "The people behind the work",
    description: "Meet the team, see how we work and find out where you might fit.",
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
      { label: "Solutions Overview", href: "/solutions" },
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
      { label: "Team", href: "/team" },
      { label: "Talent Hub", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Resource Center", href: "/resources" },
      { label: "Blog", href: "/blog" },
      { label: "Insights", href: "/resources/insights" },
      { label: "Guides", href: "/resources/guides" },
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

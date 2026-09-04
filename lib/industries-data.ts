import { Landmark, HeartPulse, Factory, Cpu, Briefcase, Building2, Store, School } from "lucide-react";
import type { Industry } from "@/types";

export const industries: Industry[] = [
  {
    title: "Financial Services",
    slug: "/industries/financial-services",
    description: "Regulatory-grade security and resilience for banks, lenders and fintechs.",
    icon: Landmark,
  },
  {
    title: "Healthcare",
    slug: "/industries/healthcare",
    description: "Protecting patient data and clinical systems without slowing down care.",
    icon: HeartPulse,
  },
  {
    title: "Manufacturing",
    slug: "/industries/manufacturing",
    description: "IT/OT security for production environments and industrial control systems.",
    icon: Factory,
  },
  {
    title: "Technology",
    slug: "/industries/technology",
    description: "Secure-by-design engineering for fast-moving product and platform teams.",
    icon: Cpu,
  },
  {
    title: "Professional Services",
    slug: "/industries",
    description: "Protecting client data and confidentiality across advisory and legal firms.",
    icon: Briefcase,
  },
  {
    title: "Critical Infrastructure",
    slug: "/industries",
    description: "Resilience for the systems the UK depends on every day.",
    icon: Building2,
  },
  {
    title: "Retail",
    slug: "/industries",
    description: "Securing payment systems, customer data and e-commerce platforms.",
    icon: Store,
  },
  {
    title: "Education",
    slug: "/industries",
    description: "Protecting student data and research systems across campuses.",
    icon: School,
  },
];

import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export interface NavColumn {
  heading: string;
  href?: string;
  links: NavLink[];
}

export interface MegaMenuSection {
  label: string;
  href: string;
  columns: NavColumn[];
  featured: {
    title: string;
    description: string;
    href: string;
    ctaLabel: string;
    image?: string;
    icon?: LucideIcon;
  };
}

export interface Practice {
  number: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  image: string;
  points: string[];
}

export interface Capability {
  title: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  image?: string;
}

export interface Industry {
  title: string;
  slug: string;
  description: string;
  icon: LucideIcon;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SearchableItem {
  title: string;
  href: string;
  category: "Services" | "Industries" | "Resources" | "Pages" | "FAQs";
  description?: string;
}

export interface TrialFormData {
  firstName: string;
  lastName: string;
  workEmail: string;
  company: string;
  jobTitle: string;
  phone: string;
  employees: string;
  concern: string;
  consent: boolean;
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

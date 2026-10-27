import {
  Cloud,
  Radar,
  Factory,
  FileCheck2,
  BrainCircuit,
  FileSearch,
  ShieldAlert,
  GraduationCap,
} from "lucide-react";
import type { Capability } from "@/types";

export const cyberCapabilities: Capability[] = [
  {
    title: "Vulnerability Management",
    slug: "/cybersecurity/vulnerability-management",
    description: "Continuous discovery, scanning and prioritisation of vulnerabilities across your estate.",
    icon: Radar,
  },
  {
    title: "Cloud & DevOps Security",
    slug: "/cybersecurity/cloud-devops-security",
    description: "Locks down AWS, Azure and Google Cloud accounts and the pipelines that deploy to them.",
    icon: Cloud,
  },
  {
    title: "IT/OT Security",
    slug: "/cybersecurity/it-ot-security",
    description: "Bridging IT and operational technology security for manufacturing and critical infrastructure.",
    icon: Factory,
  },
  {
    title: "Compliance & Governance",
    slug: "/cybersecurity/compliance-governance",
    description: "Policies, gap analysis and hands-on audit support for ISO 27001 and Cyber Essentials.",
    icon: FileCheck2,
  },
  {
    title: "AI-Powered Threat Triage",
    slug: "/cybersecurity/ai-threat-triage",
    description: "AI models help investigate, resolve and quarantine threats faster than manual triage alone.",
    icon: BrainCircuit,
  },
  {
    title: "Security Assessment",
    slug: "/cybersecurity/security-assessment",
    description: "Structured assessments that reveal your real exposure, not just a checklist.",
    icon: FileSearch,
  },
  {
    title: "Incident Readiness",
    slug: "/cybersecurity/incident-readiness",
    description: "Playbooks, tabletop exercises and response planning so incidents don't become crises.",
    icon: ShieldAlert,
  },
  {
    title: "Security Awareness",
    slug: "/cybersecurity/security-awareness",
    description: "Phishing simulations and short, role-based lessons that change everyday behaviour.",
    icon: GraduationCap,
  },
];

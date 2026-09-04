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
    image: "/images/illustrations/security-analytics.png",
  },
  {
    title: "Cloud & DevOps Security",
    slug: "/cybersecurity/cloud-devops-security",
    description: "Secure cloud configuration, workload protection and DevSecOps across AWS, Azure and GCP.",
    icon: Cloud,
    image: "/images/illustrations/cloud-devops.png",
  },
  {
    title: "IT/OT Security",
    slug: "/cybersecurity/it-ot-security",
    description: "Bridging IT and operational technology security for manufacturing and critical infrastructure.",
    icon: Factory,
    image: "/images/illustrations/it-ot-security.png",
  },
  {
    title: "Compliance & Governance",
    slug: "/cybersecurity/compliance-governance",
    description: "Map controls and vulnerabilities against ISO 27001, NIST, PCI DSS and GDPR.",
    icon: FileCheck2,
    image: "/images/illustrations/compliance-governance.png",
  },
  {
    title: "AI-Powered Threat Triage",
    slug: "/cybersecurity/ai-threat-triage",
    description: "AI models help investigate, resolve and quarantine threats faster than manual triage alone.",
    icon: BrainCircuit,
    image: "/images/illustrations/ai-threat-triage.jpg",
  },
  {
    title: "Security Assessment",
    slug: "/cybersecurity/security-assessment",
    description: "Structured assessments that reveal your real exposure — not just a checklist.",
    icon: FileSearch,
    image: "/images/illustrations/it-ot-cross.png",
  },
  {
    title: "Incident Readiness",
    slug: "/cybersecurity/incident-readiness",
    description: "Playbooks, tabletop exercises and response planning so incidents don't become crises.",
    icon: ShieldAlert,
    image: "/images/photos/incident-alert.jpg",
  },
  {
    title: "Security Awareness",
    slug: "/cybersecurity/security-awareness",
    description: "Training that turns your people into a security asset rather than the weakest link.",
    icon: GraduationCap,
    image: "/images/illustrations/phishing-awareness.png",
  },
];

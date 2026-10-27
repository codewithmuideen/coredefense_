import { Users, LayoutTemplate, Code2, Boxes, Sparkles, Bot, BrainCircuit } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ServiceDetail {
  slug: string;
  category: string;
  categoryHref: string;
  title: string;
  /** Card teaser, shown only in the practice page's service grid. */
  summary: string;
  /** Opening paragraph, shown only in the service page hero. */
  description: string;
  image?: string;
  /** A drawn visual used instead of a photo. */
  visual?: "bpmn";
  icon?: LucideIcon;
  whatWeDo: string[];
  outcomes: string[];
}

export const serviceDetails: Record<string, ServiceDetail> = {
  "cloud-devops-security": {
    slug: "/cybersecurity/cloud-devops-security",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Cloud & DevOps Security",
    summary: "Secure cloud configuration, workload protection and DevSecOps practice.",
    description:
      "As organisations move faster in the cloud, misconfiguration and insecure pipelines become the fastest-growing source of risk. We secure cloud infrastructure and delivery pipelines without slowing your engineers down.",
    image: "/images/photos/dev-team-screens.jpg",
    whatWeDo: [
      "Posture review across AWS, Azure and Google Cloud against CIS Benchmarks",
      "CI/CD pipeline assessment: secrets handling, signing and dependency scanning",
      "Container and Kubernetes workload hardening",
      "Cloud identity review to find over-privileged roles and keys",
    ],
    outcomes: [
      "Fewer exploitable misconfigurations reaching production",
      "Security checks that run in the pipeline, not after release",
      "A clear map of who and what can access your cloud estate",
    ],
  },
  "vulnerability-management": {
    slug: "/cybersecurity/vulnerability-management",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Vulnerability Management",
    summary: "Ongoing scanning with fixes ranked by real business risk.",
    description:
      "Knowing you have vulnerabilities isn't enough. You need to know which ones matter. We combine scanning, exploit intelligence such as the CISA KEV catalogue and your business context to focus remediation where it counts.",
    image: "/images/photos/analyst-desk.jpg",
    whatWeDo: [
      "Scheduled and continuous scanning across IT, cloud and OT assets",
      "Prioritisation using EPSS, known-exploited status and asset criticality, not just CVSS",
      "Remediation tickets routed straight to the owning team",
      "Monthly executive summary alongside the technical backlog",
    ],
    outcomes: [
      "Fewer critical vulnerabilities left open past their SLA",
      "Faster mean-time-to-remediate",
      "Trend reporting that shows risk actually going down",
    ],
  },
  "compliance-governance": {
    slug: "/cybersecurity/compliance-governance",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Compliance & Governance",
    summary: "Gap analysis, policies and audit preparation, done with you.",
    description:
      "Certification projects stall on paperwork, not technology. Our consultants run the gap analysis, write the policies people will actually follow and stand beside you in front of the auditor.",
    image: "/images/photos/office-collab-1.jpg",
    whatWeDo: [
      "ISO 27001 and Cyber Essentials Plus readiness assessments",
      "Information security policy suite, written for your organisation",
      "Risk register and Statement of Applicability preparation",
      "Internal audit and certification-day support",
    ],
    outcomes: [
      "A realistic timeline to certification",
      "Named owners for every control",
      "Auditors who find what they expected to find",
    ],
  },
  "it-ot-security": {
    slug: "/cybersecurity/it-ot-security",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "IT/OT Security",
    summary: "Securing production systems where IT meets the factory floor.",
    description:
      "Plant networks run on PLCs, SCADA and decades-old protocols that traditional IT tools can't see and can't safely scan. We secure converged environments using the IEC 62443 approach of zones and conduits.",
    image: "/images/photos/server-room-collab.jpg",
    whatWeDo: [
      "Passive asset discovery that won't disrupt live production",
      "Zone and conduit design for network segmentation",
      "Industrial control system risk assessment",
      "Joint incident playbooks for IT and engineering teams",
    ],
    outcomes: [
      "Visibility of every device on the plant network",
      "Lower risk of a cyber incident stopping production",
      "A shared risk language between IT and engineering",
    ],
  },
  "ai-threat-triage": {
    slug: "/cybersecurity/ai-threat-triage",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "AI-Powered Threat Triage",
    summary: "AI that sorts the alert queue so analysts focus on real threats.",
    description:
      "Security teams are drowning in alerts. We apply AI to enrich, cluster and rank them, so your analysts spend their time on investigations rather than on dismissing false positives.",
    image: "/images/photos/night-security-review.jpg",
    whatWeDo: [
      "Automated enrichment with threat intelligence and asset context",
      "Clustering of related alerts into a single incident",
      "Ranking models tuned to your environment and history",
      "Human sign-off for containment and other high-impact actions",
    ],
    outcomes: [
      "Shorter time from alert to decision",
      "Less analyst time spent on noise",
      "Consistent triage quality, even at 3am",
    ],
  },
  "security-assessment": {
    slug: "/cybersecurity/security-assessment",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Security Assessment",
    summary: "A point-in-time health check of your security, with a clear action plan.",
    description:
      "A security assessment should tell you something you didn't already know. Ours combine hands-on technical testing with interviews and document review to show where an attacker would actually get in.",
    image: "/images/photos/soc-team.jpg",
    whatWeDo: [
      "External and internal infrastructure testing",
      "Web application testing aligned to the OWASP Top 10",
      "Microsoft 365 and Active Directory configuration review",
      "Findings rated by likelihood and business impact",
    ],
    outcomes: [
      "An honest baseline of where you stand",
      "A 30/60/90-day remediation plan",
      "A board-ready summary alongside the technical report",
    ],
  },
  "incident-readiness": {
    slug: "/cybersecurity/incident-readiness",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Incident Readiness",
    summary: "Playbooks, tabletop exercises and response planning.",
    description:
      "The organisations that recover fastest from incidents are the ones that rehearsed. We write your response playbooks and then test them under pressure before an attacker does.",
    image: "/images/photos/incident-alert.jpg",
    whatWeDo: [
      "Response plans and playbooks for ransomware, data breach and business email compromise",
      "Tabletop exercises with executives and technical teams",
      "Escalation, legal and ICO 72-hour notification workflows",
      "Post-incident review templates",
    ],
    outcomes: [
      "Everyone knows their role before the bad day arrives",
      "Regulatory deadlines met without panic",
      "Fewer decisions made under pressure for the first time",
    ],
  },
  "security-awareness": {
    slug: "/cybersecurity/security-awareness",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Security Awareness",
    summary: "Training that turns your people into a security asset.",
    description:
      "Most breaches involve a human decision somewhere along the way. Our awareness programmes build lasting judgement instead of ticking an annual e-learning box.",
    image: "/images/photos/support-headset.jpg",
    whatWeDo: [
      "Phishing simulations that get harder as people improve",
      "Short, role-specific modules for finance, HR and IT administrators",
      "A one-click route for staff to report suspicious messages",
      "Quarterly culture metrics reported to leadership",
    ],
    outcomes: [
      "Falling click rates on simulated phishing",
      "Rising reporting rates for genuine threats",
      "Staff who see security as part of their job",
    ],
  },
  "process-modelling": {
    slug: "/business-transformation/process-modelling",
    category: "Business Transformation",
    categoryHref: "/business-transformation",
    title: "Business Process Mapping & Optimisation",
    summary: "BPMN maps of how work really flows, and a better design to replace it.",
    description:
      "You can't optimise what you haven't mapped. We document how processes actually run today in BPMN 2.0, measure where time and money leak away, then design a leaner future state that is ready for automation.",
    visual: "bpmn",
    whatWeDo: [
      "Current-state BPMN 2.0 maps built from workshops and job shadowing",
      "Cycle-time, hand-off and rework analysis",
      "Future-state design with automation candidates highlighted",
      "Control points and segregation of duties built into each flow",
    ],
    outcomes: [
      "One agreed picture of how the work gets done",
      "Quantified savings for each improvement",
      "Process models that developers can build from directly",
    ],
  },
  "business-analysis": {
    slug: "/business-transformation/business-analysis",
    category: "Business Transformation",
    categoryHref: "/business-transformation",
    title: "Cybersecurity Business Analysis",
    summary: "Turning technical risk into decisions the business can make.",
    description:
      "Security investment is easier to justify when it's tied to business impact. Our analysts sit between the security team, operations and the board, translating risk into requirements, budgets and priorities.",
    icon: Users,
    whatWeDo: [
      "Stakeholder interviews and requirements gathering",
      "Business impact analysis for critical services",
      "Cost-of-risk modelling to support investment cases",
      "User stories and acceptance criteria for security projects",
    ],
    outcomes: [
      "Security priorities ranked by business risk",
      "Business cases that get approved",
      "Projects delivered to clear, testable requirements",
    ],
  },
  "web-development": {
    slug: "/digital-engineering/web-development",
    category: "Digital Engineering",
    categoryHref: "/digital-engineering",
    title: "Website Development & UI/UX Engineering",
    summary: "Fast, accessible websites with a design system behind them.",
    description:
      "Your website is often a buyer's first real impression of your business. We design and build sites that load fast, meet accessibility standards and are easy for your team to keep updated.",
    icon: LayoutTemplate,
    whatWeDo: [
      "User research, wireframes and interactive prototypes",
      "Reusable design systems and component libraries",
      "Next.js and headless CMS builds",
      "Core Web Vitals and technical SEO tuning",
    ],
    outcomes: [
      "Pages that load in under two seconds",
      "Usable by every visitor, including assistive technology users",
      "Content your marketing team can publish without a developer",
    ],
  },
  "software-engineering": {
    slug: "/digital-engineering/software-engineering",
    category: "Digital Engineering",
    categoryHref: "/digital-engineering",
    title: "Web Applications & Software Engineering",
    summary: "Custom web applications engineered to scale.",
    description:
      "From internal tools to customer-facing products, we build web applications with clean architecture, automated tests and secure coding practices, so they keep working as requirements change.",
    icon: Code2,
    whatWeDo: [
      "Full-stack development in TypeScript, Python and .NET",
      "API design, documentation and third-party integration",
      "Automated test suites and code review on every change",
      "Secure coding to the OWASP ASVS",
    ],
    outcomes: [
      "Software that's maintainable long after launch day",
      "Fewer defects reaching your users",
      "A codebase any competent engineer can pick up",
    ],
  },
  "digital-platforms": {
    slug: "/digital-engineering/digital-platforms",
    category: "Digital Engineering",
    categoryHref: "/digital-engineering",
    title: "Digital Platforms & Cloud Solutions",
    summary: "Multi-service platforms and the cloud foundations under them.",
    description:
      "Some products need more than a single application. They need a platform with shared identity, data and integrations. We design and run the cloud architecture that holds it all together.",
    icon: Boxes,
    whatWeDo: [
      "Platform and multi-tenant architecture design",
      "Infrastructure as code with Terraform",
      "Event-driven and microservice integration",
      "Observability, autoscaling and disaster recovery",
    ],
    outcomes: [
      "Platforms that scale with demand",
      "Cloud bills sized to real usage",
      "Predictable releases with no surprise outages",
    ],
  },
  "ai-strategy": {
    slug: "/ai-automation/ai-strategy",
    category: "AI & Automation",
    categoryHref: "/ai-automation",
    title: "AI Strategy",
    summary: "A grounded AI roadmap tied to real business outcomes.",
    description:
      "Adopting AI without a plan leads to scattered pilots that never scale. We build a roadmap grounded in your data, your processes and the risks you're prepared to carry.",
    icon: Sparkles,
    whatWeDo: [
      "AI opportunity workshops across business functions",
      "Use cases scored for value, feasibility and risk",
      "Data and governance readiness review",
      "Alignment with ISO/IEC 42001 and the UK's AI principles",
    ],
    outcomes: [
      "A ranked list of use cases worth funding",
      "Clarity on where AI will and won't help",
      "Leadership aligned on how AI is used safely",
    ],
  },
  "intelligent-automation": {
    slug: "/ai-automation/intelligent-automation",
    category: "AI & Automation",
    categoryHref: "/ai-automation",
    title: "Workflow & Intelligent Automation",
    summary: "From simple rule-based workflows to AI agents that handle the exceptions.",
    description:
      "Some processes need a simple rule-based workflow. Others need AI to read documents, classify requests or draft responses. We build both, connect them to your existing systems and keep a human in control.",
    icon: Bot,
    whatWeDo: [
      "Workflow automation in Power Automate, n8n and similar platforms",
      "Document understanding for invoices, forms and email",
      "AI agents with approval steps for sensitive actions",
      "Monitoring, audit trails and governance for every automation",
    ],
    outcomes: [
      "Hours of manual work removed each week",
      "Faster cycle times on approvals and requests",
      "Automations that are governed, not shadow IT",
    ],
  },
  "ai-ml": {
    slug: "/ai-automation/ai-ml",
    category: "AI & Automation",
    categoryHref: "/ai-automation",
    title: "AI/ML Solutions & Business Intelligence",
    summary: "Custom models and dashboards built around your own data.",
    description:
      "From demand forecasting to anomaly detection, we build machine learning and analytics around your real data quality and the decisions your people actually make.",
    icon: BrainCircuit,
    whatWeDo: [
      "Custom model development and evaluation",
      "Power BI and Looker dashboards",
      "Data pipelines and warehouse design",
      "Retraining schedules so accuracy holds over time",
    ],
    outcomes: [
      "Decisions backed by evidence, not instinct",
      "One version of the numbers across the business",
      "Models that keep performing after go-live",
    ],
  },
};

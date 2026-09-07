export interface ServiceDetail {
  slug: string;
  category: string;
  categoryHref: string;
  title: string;
  summary: string;
  description: string;
  image: string;
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
      "As organisations move faster in the cloud, misconfiguration and insecure pipelines become the fastest-growing source of risk. CoreDefense helps you secure cloud infrastructure and DevOps workflows without slowing delivery down.",
    image: "/images/illustrations/networking-security.jpg",
    whatWeDo: [
      "Cloud configuration and posture review across AWS, Azure and GCP",
      "DevSecOps pipeline assessment and secure CI/CD recommendations",
      "Cloud workload and container security",
      "Identity and access management review for cloud environments",
    ],
    outcomes: [
      "Reduced cloud misconfiguration risk",
      "Security embedded earlier in the development lifecycle",
      "Clear visibility of cloud identity and access sprawl",
    ],
  },
  "vulnerability-management": {
    slug: "/cybersecurity/vulnerability-management",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Vulnerability Management",
    summary: "Continuous discovery, scanning and prioritisation of vulnerabilities.",
    description:
      "Knowing you have vulnerabilities isn't enough — you need to know which ones matter. CoreDefense combines scanning, business context and AI-assisted triage to help you focus remediation where it counts.",
    image: "/images/illustrations/compliance-mapping.jpg",
    whatWeDo: [
      "Continuous vulnerability scanning across IT, cloud and OT assets",
      "Risk-based prioritisation using business context, not just CVSS",
      "Remediation tracking and workflow automation",
      "Executive and technical reporting",
    ],
    outcomes: [
      "Fewer critical vulnerabilities left unresolved",
      "Faster mean-time-to-remediate",
      "Evidence-ready reporting for audits and stakeholders",
    ],
  },
  "compliance-governance": {
    slug: "/cybersecurity/compliance-governance",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Compliance & Governance",
    summary: "Map vulnerabilities and controls against ISO, NIST, PCI DSS and GDPR.",
    description:
      "Compliance shouldn't be a once-a-year scramble. CoreDefense helps you build governance and control mapping into everyday security operations, so audits become a formality rather than a fire drill.",
    image: "/images/illustrations/compliance-mapping.jpg",
    whatWeDo: [
      "Control mapping against ISO 27001, NIST, PCI DSS and GDPR",
      "Governance framework design and policy support",
      "Gap analysis and remediation roadmaps",
      "Ongoing compliance monitoring support",
    ],
    outcomes: [
      "Audit-ready evidence, always available",
      "Clearer ownership of controls across the business",
      "Reduced compliance risk and manual effort",
    ],
  },
  "it-ot-security": {
    slug: "/cybersecurity/it-ot-security",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "IT/OT Security",
    summary: "Bridging IT and operational technology security.",
    description:
      "Manufacturing and critical infrastructure environments run on operational technology that traditional IT security often can't see. CoreDefense bridges that gap with security designed for converged IT/OT environments.",
    image: "/images/illustrations/networking-security.jpg",
    whatWeDo: [
      "IT/OT network segmentation and visibility review",
      "Industrial control system risk assessment",
      "Convergence roadmap between IT and OT security teams",
      "Business analysis of operational risk and downtime impact",
    ],
    outcomes: [
      "Reduced blind spots between IT and OT networks",
      "Lower risk of operational downtime from cyber incidents",
      "A shared risk language between IT and engineering teams",
    ],
  },
  "ai-threat-triage": {
    slug: "/cybersecurity/ai-threat-triage",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "AI-Powered Threat Triage",
    summary: "AI-assisted investigation, resolution and quarantine of threats.",
    description:
      "Security teams are drowning in alerts. CoreDefense applies AI to help investigate, prioritise and triage threats faster — augmenting your analysts rather than replacing their judgement.",
    image: "/images/illustrations/cybersecurity-security-threshold.jpg",
    whatWeDo: [
      "AI-assisted alert triage and investigation support",
      "Automated enrichment of security events with context",
      "Prioritisation models tuned to your environment",
      "Human-in-the-loop review for high-impact decisions",
    ],
    outcomes: [
      "Faster time to investigate and resolve alerts",
      "Less analyst time spent on false positives",
      "Consistent triage quality at higher alert volumes",
    ],
  },
  "security-assessment": {
    slug: "/cybersecurity/security-assessment",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Security Assessment",
    summary: "Structured assessments that reveal your real exposure.",
    description:
      "A security assessment should tell you something you didn't already know. CoreDefense's assessments combine technical testing with business context to give you a realistic picture of your exposure.",
    image: "/images/illustrations/cybersecurity-security-threshold.jpg",
    whatWeDo: [
      "Technical security assessment across infrastructure and applications",
      "Risk scoring aligned to business impact",
      "Clear, prioritised findings — not just a raw scan output",
      "Executive summary alongside technical detail",
    ],
    outcomes: [
      "A realistic view of current exposure",
      "A prioritised remediation roadmap",
      "Findings your board can actually act on",
    ],
  },
  "incident-readiness": {
    slug: "/cybersecurity/incident-readiness",
    category: "Cybersecurity",
    categoryHref: "/cybersecurity",
    title: "Incident Readiness",
    summary: "Playbooks, tabletop exercises and response planning.",
    description:
      "The organisations that recover fastest from incidents are the ones that planned for them. CoreDefense helps you build incident response playbooks and test them before you need them for real.",
    image: "/images/photos/incident-alert.jpg",
    whatWeDo: [
      "Incident response playbook development",
      "Tabletop exercises with key stakeholders",
      "Roles, escalation paths and communication planning",
      "Post-incident review frameworks",
    ],
    outcomes: [
      "Faster, more coordinated incident response",
      "Clarity on roles before an incident happens",
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
      "Most breaches involve a human decision somewhere along the way. CoreDefense's security awareness training is designed to build genuine judgement, not just tick a compliance box.",
    image: "/images/illustrations/cybersecurity-security-threshold.jpg",
    whatWeDo: [
      "Phishing simulation and awareness campaigns",
      "Role-specific security training content",
      "Measurable awareness metrics over time",
      "Culture-focused rollout, not just annual e-learning",
    ],
    outcomes: [
      "Fewer successful phishing attempts",
      "Higher reporting rates for suspicious activity",
      "A security-aware culture, not just a trained one",
    ],
  },
  "process-modelling": {
    slug: "/business-transformation/process-modelling",
    category: "Business Transformation",
    categoryHref: "/business-transformation",
    title: "Business Process Mapping & Optimisation",
    summary: "Map current-state processes and design what should replace them.",
    description:
      "You can't optimise what you haven't mapped. CoreDefense works with your teams to document how processes actually run today, then designs optimised, automation-ready versions.",
    image: "/images/illustrations/business-transformation-process-flow.jpg",
    whatWeDo: [
      "Current-state process mapping and documentation",
      "Bottleneck and risk identification",
      "Future-state process design",
      "Optimisation recommendations grounded in real workflows",
    ],
    outcomes: [
      "A clear, shared view of how processes actually work",
      "Identified opportunities for efficiency and automation",
      "A practical roadmap from current to future state",
    ],
  },
  "business-analysis": {
    slug: "/business-transformation/business-analysis",
    category: "Business Transformation",
    categoryHref: "/business-transformation",
    title: "Cybersecurity Business Analysis",
    summary: "Business analysis that connects security work to business outcomes.",
    description:
      "Security investment is easier to justify — and prioritise — when it's tied to business impact. CoreDefense's business analysis practice bridges security, operations and stakeholders.",
    image: "/images/illustrations/business-transformation-operating-model.jpg",
    whatWeDo: [
      "Stakeholder analysis and requirements gathering",
      "Business impact analysis for security and IT/OT risk",
      "Translating technical risk into business language",
      "Supporting investment and prioritisation decisions",
    ],
    outcomes: [
      "Security priorities aligned to business risk",
      "Clearer business cases for security investment",
      "Better collaboration between security and the business",
    ],
  },
  "workflow-automation": {
    slug: "/business-transformation/workflow-automation",
    category: "Business Transformation",
    categoryHref: "/business-transformation",
    title: "Workflow Automation",
    summary: "Turn optimised processes into automated workflows.",
    description:
      "Once a process is mapped and optimised, automation is where the real efficiency gains happen. CoreDefense helps design and implement workflow automation that fits how your business actually works.",
    image: "/images/illustrations/ai-automation-intelligence-loom-2.jpg",
    whatWeDo: [
      "Automation opportunity assessment",
      "Workflow and integration design",
      "Implementation support across common platforms",
      "Governance for automated processes",
    ],
    outcomes: [
      "Reduced manual, repetitive work",
      "Faster process cycle times",
      "Automation that's governed, not ungoverned shadow IT",
    ],
  },
  "web-development": {
    slug: "/digital-engineering/web-development",
    category: "Digital Engineering",
    categoryHref: "/digital-engineering",
    title: "Website Development & UI/UX Engineering",
    summary: "Enterprise-grade websites engineered for performance and accessibility.",
    description:
      "A website is often the first impression of a technology company. CoreDefense designs and builds websites and UI/UX with the same engineering rigour we bring to cybersecurity work.",
    image: "/images/illustrations/digital-engineering-digital-foundry.jpg",
    whatWeDo: [
      "UI/UX design and design systems",
      "Modern, accessible frontend engineering",
      "Performance and SEO-focused build",
      "CMS and content architecture where needed",
    ],
    outcomes: [
      "Fast, accessible, well-structured websites",
      "A design system that scales with the business",
      "Sites built for measurable conversion, not just aesthetics",
    ],
  },
  "software-engineering": {
    slug: "/digital-engineering/software-engineering",
    category: "Digital Engineering",
    categoryHref: "/digital-engineering",
    title: "Web Applications & Software Engineering",
    summary: "Custom web applications engineered to scale.",
    description:
      "From internal tools to customer-facing products, CoreDefense builds web applications with clean architecture that can evolve as requirements change.",
    image: "/images/illustrations/digital-engineering-digital-foundry.jpg",
    whatWeDo: [
      "Full-stack web application development",
      "API design and integration",
      "Cloud-native architecture",
      "Ongoing engineering support and iteration",
    ],
    outcomes: [
      "Applications built for maintainability, not just launch day",
      "Clean architecture that supports future features",
      "Security considered from the first line of code",
    ],
  },
  "digital-platforms": {
    slug: "/digital-engineering/digital-platforms",
    category: "Digital Engineering",
    categoryHref: "/digital-engineering",
    title: "Digital Platforms & Cloud Solutions",
    summary: "Platform-level engineering for complex digital products.",
    description:
      "Some products need more than a website or a single application — they need a platform. CoreDefense designs and builds digital platforms with the cloud architecture to support them.",
    image: "/images/illustrations/digital-engineering-digital-foundry.jpg",
    whatWeDo: [
      "Digital platform architecture and design",
      "Cloud infrastructure design and deployment",
      "Multi-service and integration architecture",
      "Scalability and reliability engineering",
    ],
    outcomes: [
      "Platforms built to scale with usage",
      "Cloud architecture aligned to actual needs, not over-engineered",
      "A foundation that supports future product growth",
    ],
  },
  "ai-strategy": {
    slug: "/ai-automation/ai-strategy",
    category: "AI & Automation",
    categoryHref: "/ai-automation",
    title: "AI Strategy",
    summary: "A grounded AI roadmap tied to real business outcomes.",
    description:
      "Adopting AI without a strategy leads to scattered pilots that never scale. CoreDefense helps you build an AI roadmap grounded in your actual data, processes and business priorities.",
    image: "/images/illustrations/ai-automation-intelligence-loom-2.jpg",
    whatWeDo: [
      "AI readiness and opportunity assessment",
      "Use case identification and prioritisation",
      "Data and governance readiness review",
      "Roadmap and investment planning",
    ],
    outcomes: [
      "A prioritised, realistic AI roadmap",
      "Clarity on where AI will and won't help",
      "Governance built in from the start",
    ],
  },
  "intelligent-automation": {
    slug: "/ai-automation/intelligent-automation",
    category: "AI & Automation",
    categoryHref: "/ai-automation",
    title: "AI Automation & Intelligent Workflows",
    summary: "Automation that combines AI with your existing workflows.",
    description:
      "CoreDefense combines process automation with AI-driven decision-making to build workflows that handle more than simple rule-based automation ever could.",
    image: "/images/illustrations/ai-automation-intelligence-loom-2.jpg",
    whatWeDo: [
      "Intelligent workflow design",
      "Integration with existing systems and tools",
      "AI-assisted decision points within workflows",
      "Monitoring and continuous improvement",
    ],
    outcomes: [
      "Reduced manual processing time",
      "Workflows that adapt to more complex scenarios",
      "Faster decision-making across operational processes",
    ],
  },
  "ai-ml": {
    slug: "/ai-automation/ai-ml",
    category: "AI & Automation",
    categoryHref: "/ai-automation",
    title: "AI/ML Solutions & Business Intelligence",
    summary: "Custom AI/ML solutions and analytics for better decisions.",
    description:
      "From predictive analytics to custom machine learning models, CoreDefense builds AI/ML solutions designed around your data and your decisions — not generic off-the-shelf assumptions.",
    image: "/images/illustrations/ai-automation-intelligence-loom-2.jpg",
    whatWeDo: [
      "Custom AI/ML model development",
      "Business intelligence and analytics dashboards",
      "Data pipeline design to support AI/ML use cases",
      "Model monitoring and lifecycle support",
    ],
    outcomes: [
      "Decisions backed by better data and models",
      "Analytics that reach the people who need them",
      "AI/ML solutions built for your actual data quality",
    ],
  },
};

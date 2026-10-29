import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { CONTACT } from "@/lib/contact";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.coredefense.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CoreDefense | Cybersecurity, Transformation & AI for UK Enterprise",
    template: "%s | CoreDefense",
  },
  description:
    "UK cybersecurity consultancy for IT, cloud and OT, with BPMN process transformation, secure software engineering and governed AI under one roof.",
  applicationName: "CoreDefense",
  category: "technology",
  keywords: [
    "CoreDefense",
    "Cybersecurity UK",
    "Cybersecurity Services UK",
    "Cloud Security",
    "IT/OT Security",
    "Vulnerability Management",
    "AI Cybersecurity",
    "Business Transformation",
    "Process Modelling",
    "Digital Engineering",
    "AI Automation",
    "Cybersecurity Consulting",
    "Penetration Testing UK",
    "ISO 27001 Consultancy",
    "Cyber Essentials Plus",
    "IEC 62443",
    "BPMN Process Mapping",
  ],
  authors: [{ name: "CoreDefense", url: siteUrl }],
  creator: "CoreDefense",
  publisher: "CoreDefense",
  formatDetection: { telephone: true, email: true, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "CoreDefense",
    title: "CoreDefense | Cybersecurity, Transformation & AI for UK Enterprise",
    description:
      "Security testing, process redesign, software engineering and AI from one senior UK team.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoreDefense | Cybersecurity, Transformation & AI for UK Enterprise",
    description:
      "Find the security gaps worth fixing, redesign slow processes and ship software and AI that pass audit.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
  colorScheme: "light",
};

const telephone = CONTACT.phoneHref.replace("tel:", "");

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#organization`,
      name: "CoreDefense",
      url: siteUrl,
      logo: `${siteUrl}/images/brand/logo-full.png`,
      image: `${siteUrl}/opengraph-image`,
      description:
        "Cybersecurity, process transformation, digital engineering and AI services for UK organisations.",
      email: CONTACT.email,
      telephone,
      areaServed: "GB",
      address: { "@type": "PostalAddress", addressCountry: "GB" },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: CONTACT.email,
          telephone,
          availableLanguage: ["English"],
        },
      ],
      knowsAbout: ["Cybersecurity", "Vulnerability management", "ISO 27001", "IEC 62443", "BPMN", "Workflow automation", "Machine learning"],
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "CoreDefense",
      inLanguage: "en-GB",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={manrope.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}

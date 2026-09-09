import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";

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
    "CoreDefense is a UK technology company delivering AI-powered cybersecurity, business transformation, digital engineering and AI & automation for enterprise organisations.",
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
  ],
  authors: [{ name: "CoreDefense" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "CoreDefense",
    title: "CoreDefense | Cybersecurity, Transformation & AI for UK Enterprise",
    description:
      "AI-powered cybersecurity, business transformation, digital engineering and AI & automation: one UK technology partner, four connected practices.",
    images: [{ url: "/images/brand/logo-full.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoreDefense | Cybersecurity, Transformation & AI for UK Enterprise",
    description:
      "AI-powered cybersecurity, business transformation, digital engineering and AI & automation for UK enterprise.",
    images: ["/images/brand/logo-full.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "CoreDefense",
  url: siteUrl,
  logo: `${siteUrl}/images/brand/logo-full.png`,
  description:
    "CoreDefense is a UK technology company delivering AI-powered cybersecurity, business transformation, digital engineering and AI & automation.",
  areaServed: "GB",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
  },
  sameAs: [],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}

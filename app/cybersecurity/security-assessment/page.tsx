import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";
import { serviceDetails } from "@/lib/service-detail-data";

const service = serviceDetails["security-assessment"];

export const metadata: Metadata = {
  alternates: { canonical: "/cybersecurity/security-assessment" },
  title: service.title,
  description: service.summary,
};

export default function Page() {
  return <ServiceDetailPage service={service} />;
}

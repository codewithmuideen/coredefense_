import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";
import { serviceDetails } from "@/lib/service-detail-data";

const service = serviceDetails["it-ot-security"];

export const metadata: Metadata = {
  alternates: { canonical: "/cybersecurity/it-ot-security" },
  title: service.title,
  description: service.summary,
};

export default function Page() {
  return <ServiceDetailPage service={service} />;
}

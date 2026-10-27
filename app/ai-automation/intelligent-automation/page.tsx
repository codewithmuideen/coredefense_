import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";
import { serviceDetails } from "@/lib/service-detail-data";

const service = serviceDetails["intelligent-automation"];

export const metadata: Metadata = {
  alternates: { canonical: "/ai-automation/intelligent-automation" },
  title: service.title,
  description: service.summary,
};

export default function Page() {
  return <ServiceDetailPage service={service} />;
}

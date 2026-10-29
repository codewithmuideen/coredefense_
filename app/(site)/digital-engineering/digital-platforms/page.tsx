import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";
import { serviceDetails } from "@/lib/service-detail-data";

const service = serviceDetails["digital-platforms"];

export const metadata: Metadata = {
  alternates: { canonical: "/digital-engineering/digital-platforms" },
  title: service.title,
  description: service.summary,
};

export default function Page() {
  return <ServiceDetailPage service={service} />;
}

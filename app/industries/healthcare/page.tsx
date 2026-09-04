import type { Metadata } from "next";
import IndustryDetailPage from "@/components/templates/IndustryDetailPage";
import { industryDetails } from "@/lib/industry-detail-data";

const industry = industryDetails["healthcare"];

export const metadata: Metadata = {
  title: industry.title,
  description: industry.summary,
};

export default function Page() {
  return <IndustryDetailPage industry={industry} />;
}

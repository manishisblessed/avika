import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { returnsPage } from "@/data/info-pages";
import { COMPANY_BRAND_PRIMARY, COMPANY_BRAND_SECONDARY } from "@/lib/company";

export const metadata: Metadata = {
  title: `Returns & Refunds — ${COMPANY_BRAND_PRIMARY} ${COMPANY_BRAND_SECONDARY}`,
  description:
    "Return damaged or wrong grocery items within 48 hours. Refund timelines and replacement policy at AVIKA Grocery Mart.",
};

export default function ReturnsPage() {
  return <InfoPage data={returnsPage} />;
}

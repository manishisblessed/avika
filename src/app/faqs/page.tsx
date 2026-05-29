import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { faqsPage } from "@/data/info-pages";
import { COMPANY_BRAND_PRIMARY, COMPANY_BRAND_SECONDARY } from "@/lib/company";

export const metadata: Metadata = {
  title: `FAQs — ${COMPANY_BRAND_PRIMARY} ${COMPANY_BRAND_SECONDARY}`,
  description:
    "Frequently asked questions about ordering, delivery, payments, returns, and accounts at AVIKA Grocery Mart.",
};

export default function FaqsPage() {
  return <InfoPage data={faqsPage} />;
}

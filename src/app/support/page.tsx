import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { supportPage } from "@/data/info-pages";
import { COMPANY_BRAND_PRIMARY, COMPANY_BRAND_SECONDARY } from "@/lib/company";

export const metadata: Metadata = {
  title: `Support — ${COMPANY_BRAND_PRIMARY} ${COMPANY_BRAND_SECONDARY}`,
  description:
    "Contact AVIKA Grocery Mart support for orders, delivery, returns, and product help. Phone, email, and store hours.",
};

export default function SupportPage() {
  return <InfoPage data={supportPage} />;
}

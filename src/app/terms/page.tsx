import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { termsPage } from "@/data/info-pages";
import { COMPANY_BRAND_PRIMARY, COMPANY_BRAND_SECONDARY } from "@/lib/company";

export const metadata: Metadata = {
  title: `Terms of Service — ${COMPANY_BRAND_PRIMARY} ${COMPANY_BRAND_SECONDARY}`,
  description:
    "Terms and conditions for using AVIKA Grocery Mart online store and delivery services.",
};

export default function TermsPage() {
  return <InfoPage data={termsPage} />;
}

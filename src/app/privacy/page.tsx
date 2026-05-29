import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { privacyPage } from "@/data/info-pages";
import { COMPANY_BRAND_PRIMARY, COMPANY_BRAND_SECONDARY } from "@/lib/company";

export const metadata: Metadata = {
  title: `Privacy Policy — ${COMPANY_BRAND_PRIMARY} ${COMPANY_BRAND_SECONDARY}`,
  description:
    "How AVIKA DEPARTMENTAL PRIVATE LIMITED collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return <InfoPage data={privacyPage} />;
}

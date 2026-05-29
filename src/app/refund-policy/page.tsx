import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { refundPolicyPage } from "@/data/info-pages";
import { COMPANY_BRAND_PRIMARY, COMPANY_BRAND_SECONDARY } from "@/lib/company";

export const metadata: Metadata = {
  title: `Refund Policy — ${COMPANY_BRAND_PRIMARY} ${COMPANY_BRAND_SECONDARY}`,
  description:
    "Refund eligibility, methods, and timelines for orders placed with AVIKA DEPARTMENTAL PRIVATE LIMITED.",
};

export default function RefundPolicyPage() {
  return <InfoPage data={refundPolicyPage} />;
}

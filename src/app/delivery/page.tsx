import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { deliveryPage } from "@/data/info-pages";
import { COMPANY_BRAND_PRIMARY, COMPANY_BRAND_SECONDARY } from "@/lib/company";

export const metadata: Metadata = {
  title: `Delivery Info — ${COMPANY_BRAND_PRIMARY} ${COMPANY_BRAND_SECONDARY}`,
  description:
    "Same-day grocery delivery across Delhi NCR. Delivery slots, charges, cut-off times, and service areas for AVIKA Grocery Mart.",
};

export default function DeliveryPage() {
  return <InfoPage data={deliveryPage} />;
}

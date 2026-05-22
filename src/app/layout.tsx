import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import PageTransition from "@/components/PageTransition";
import CursorAura from "@/components/CursorAura";
import AuthProvider from "@/components/AuthProvider";
import SearchModal from "@/components/SearchModal";
import {
  COMPANY_BRAND_PRIMARY,
  COMPANY_BRAND_SECONDARY,
  COMPANY_LEGAL_NAME,
  COMPANY_TAGLINE,
} from "@/lib/company";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://avikagrocery.com"),
  title: `${COMPANY_BRAND_PRIMARY} ${COMPANY_BRAND_SECONDARY} — ${COMPANY_TAGLINE}`,
  applicationName: COMPANY_LEGAL_NAME,
  description: `${COMPANY_LEGAL_NAME}. Your trusted online grocery store in Delhi NCR. Fresh fruits, vegetables, dairy, staples, and daily essentials delivered to your doorstep.`,
  keywords: ["AVIKA", "grocery", "online grocery", "fresh vegetables", "fruits", "dairy", "Delhi NCR", "same day delivery", "grocery delivery"],
  icons: {
    icon: [{ url: "/logo_avika.png", type: "image/png" }],
    shortcut: ["/logo_avika.png"],
    apple: [{ url: "/logo_avika.png" }],
  },
  openGraph: {
    title: `${COMPANY_BRAND_PRIMARY} ${COMPANY_BRAND_SECONDARY}`,
    description: COMPANY_TAGLINE,
    siteName: COMPANY_LEGAL_NAME,
    images: [{ url: "/logo_avika.png" }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <CursorAura />
          <Navbar />
          <CartDrawer />
          <SearchModal />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

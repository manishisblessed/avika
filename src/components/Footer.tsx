import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import { COMPANY_LEGAL_NAME, COMPANY_PHONE, COMPANY_CONTACT_EMAIL, COMPANY_ADDRESS_LINE, COMPANY_WORKING_HOURS } from "@/lib/company";

const cols = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/categories", label: "Categories" },
      { href: "/products?category=fruits-vegetables", label: "Fruits & Vegetables" },
      { href: "/products?category=dairy-eggs", label: "Dairy & Eggs" },
      { href: "/products?category=staples-grains", label: "Staples & Grains" },
      { href: "/products?category=snacks-beverages", label: "Snacks & Beverages" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
      { href: "/account", label: "My Account" },
      { href: "/cart", label: "My Cart" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/delivery", label: "Delivery Info" },
      { href: "/returns", label: "Returns & Refunds" },
      { href: "/faqs", label: "FAQs" },
      { href: "/support", label: "Support" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-ink/10 bg-bg-soft">
      <div className="section py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label={COMPANY_LEGAL_NAME}
              className="inline-flex items-center mb-6 group"
            >
              <span className="relative block h-14 w-[210px] transition-transform duration-500 group-hover:scale-[1.03]">
                <Image
                  src="/logo_avika.png"
                  alt={COMPANY_LEGAL_NAME}
                  fill
                  sizes="210px"
                  className="object-contain object-left drop-shadow-[0_6px_22px_rgba(249,115,22,0.25)]"
                />
              </span>
            </Link>
            <p className="text-ink-soft max-w-sm leading-relaxed">
              Your trusted neighborhood grocery store. Fresh produce, quality staples,
              and everyday essentials delivered to your doorstep across Delhi NCR.
            </p>
            <div className="mt-8 flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="p-2.5 rounded-full border border-ink/15 bg-white text-ink-soft hover:text-gold-600 hover:border-gold-500/50 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-ink-soft hover:text-gold-700 text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold mb-5">
              Reach Us
            </h4>
            <ul className="space-y-3 text-sm text-ink-soft">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-gold-600 mt-0.5 flex-shrink-0" />
                <span>{COMPANY_ADDRESS_LINE}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold-600 flex-shrink-0" />
                <span>{COMPANY_PHONE}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-gold-600 flex-shrink-0" />
                <span>{COMPANY_CONTACT_EMAIL}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-gold-600 flex-shrink-0" />
                <span>{COMPANY_WORKING_HOURS}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink/10">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-[10px] uppercase tracking-widest text-ink-mute">
            {["UPI", "Visa", "Mastercard", "Rupay", "Net Banking", "Razorpay"].map((p) => (
              <span key={p} className="px-3 py-1 rounded-full border border-ink/12 bg-white">
                {p}
              </span>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-mute">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} {COMPANY_LEGAL_NAME}. All rights reserved. CIN: U47110DL2020PTC123456
            </p>
            <p className="flex gap-6">
              <Link href="/privacy" className="hover:text-gold-700">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gold-700">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:text-gold-700">Refund Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

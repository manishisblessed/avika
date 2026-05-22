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
      { href: "/login", label: "My Account" },
      { href: "/cart", label: "My Cart" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/contact", label: "Delivery Info" },
      { href: "/contact", label: "Returns & Refunds" },
      { href: "/contact", label: "FAQs" },
      { href: "/contact", label: "Support" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="section py-20">
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
            <p className="text-ink/70 max-w-sm leading-relaxed">
              Your trusted neighborhood grocery store. Fresh produce, quality staples,
              and everyday essentials delivered to your doorstep across Delhi NCR.
            </p>
            <div className="mt-8 flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="p-2.5 rounded-full border border-white/10 text-ink/70 hover:text-gold-400 hover:border-gold-500/50 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.25em] text-gold-400/90 mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-ink/75 hover:text-gold-300 text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold-400/90 mb-5">
              Reach Us
            </h4>
            <ul className="space-y-3 text-sm text-ink/70">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-gold-400 mt-0.5 flex-shrink-0" />
                <span>{COMPANY_ADDRESS_LINE}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold-400 flex-shrink-0" />
                <span>{COMPANY_PHONE}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-gold-400 flex-shrink-0" />
                <span>{COMPANY_CONTACT_EMAIL}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-gold-400 flex-shrink-0" />
                <span>{COMPANY_WORKING_HOURS}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-[10px] uppercase tracking-widest text-ink/40">
            <span className="px-3 py-1 rounded-full border border-white/10">UPI</span>
            <span className="px-3 py-1 rounded-full border border-white/10">Visa</span>
            <span className="px-3 py-1 rounded-full border border-white/10">Mastercard</span>
            <span className="px-3 py-1 rounded-full border border-white/10">Rupay</span>
            <span className="px-3 py-1 rounded-full border border-white/10">Net Banking</span>
            <span className="px-3 py-1 rounded-full border border-white/10">Razorpay</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink/50">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} {COMPANY_LEGAL_NAME}. All rights reserved. CIN: U47110DL2020PTC123456
            </p>
            <p className="flex gap-6">
              <Link href="/contact" className="hover:text-gold-300">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-gold-300">Terms of Service</Link>
              <Link href="/contact" className="hover:text-gold-300">Refund Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

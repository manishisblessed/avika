"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useSearch } from "@/store/search";
import { COMPANY_LEGAL_NAME } from "@/lib/company";

const links = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const totalItems = useCart((s) => s.totalItems());
  const openCart = useCart((s) => s.open);
  const openSearch = useSearch((s) => s.open);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "py-3 bg-bg/70 backdrop-blur-xl border-b border-white/5"
          : "py-5 bg-transparent",
      )}
    >
      <div className="section flex items-center justify-between">
        <Link
          href="/"
          aria-label={COMPANY_LEGAL_NAME}
          className="group relative inline-flex items-center"
        >
          <span className="relative block h-10 md:h-12 w-[150px] md:w-[180px] transition-transform duration-500 group-hover:scale-[1.03]">
            <Image
              src="/logo_avika.png"
              alt={COMPANY_LEGAL_NAME}
              fill
              priority
              sizes="180px"
              className="object-contain object-left drop-shadow-[0_4px_18px_rgba(249,115,22,0.25)]"
            />
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm tracking-wide transition-colors",
                  active ? "text-gold-300" : "text-ink/80 hover:text-ink",
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/5 border border-gold-500/30"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search"
            onClick={openSearch}
            className="p-2.5 rounded-full hover:bg-white/5 transition-colors text-ink/80 hover:text-ink"
          >
            <Search size={18} />
          </button>
          <Link
            href={session ? "/account" : "/login"}
            aria-label="Account"
            className="hidden sm:inline-flex p-2.5 rounded-full hover:bg-white/5 transition-colors text-ink/80 hover:text-ink"
          >
            {session ? <User size={18} /> : <LogIn size={18} />}
          </Link>
          <button
            onClick={openCart}
            aria-label="Cart"
            className="relative p-2.5 rounded-full hover:bg-white/5 transition-colors text-ink/80 hover:text-ink"
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center shadow-gold-sm"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden p-2.5 rounded-full hover:bg-white/5 transition-colors text-ink/80 hover:text-ink"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden mt-3 mx-6 glass-strong rounded-2xl p-4 flex flex-col gap-1"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-xl text-ink/90 hover:bg-white/5 hover:text-gold-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-white/5 my-1" />
            <Link
              href={session ? "/account" : "/login"}
              className="px-4 py-3 rounded-xl text-ink/90 hover:bg-white/5 hover:text-gold-300 transition-colors flex items-center gap-2"
            >
              {session ? <User size={16} /> : <LogIn size={16} />}
              {session ? "My Account" : "Sign In"}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

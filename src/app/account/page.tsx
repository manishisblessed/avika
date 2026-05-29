"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Package,
  LogOut,
  ShoppingBag,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<
    { id: string; total: number; status: string; createdAt: string; items: string }[]
  >([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(() => {});
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="pt-36 pb-24 section text-center">
        <div className="inline-block w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;

  return (
    <div className="pt-36 pb-24">
      <section className="section">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow mb-3">My Account</span>
              <h1 className="display text-4xl md:text-5xl font-bold mt-4 text-ink">
                Hello, <span className="gold-text">{user.name || "there"}.</span>
              </h1>
              <p className="mt-2 text-ink-soft">{user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn-ghost self-start"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Reveal delay={0.05}>
            <div className="card p-6 card-hover h-full">
              <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-4">
                <User size={18} />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">Profile</h3>
              <p className="text-sm text-ink-soft mt-1">{user.name}</p>
              <p className="text-sm text-ink-soft">{user.email}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card p-6 card-hover h-full">
              <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-4">
                <Package size={18} />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">Orders</h3>
              <p className="text-sm text-ink-soft mt-1">
                {orders.length} {orders.length === 1 ? "order" : "orders"} placed
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="card p-6 card-hover h-full">
              <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-4">
                <MapPin size={18} />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">Delivery Area</h3>
              <p className="text-sm text-ink-soft mt-1">Delhi NCR</p>
              <p className="text-sm text-ink-soft">Same-day delivery available</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="card p-8">
            <h2 className="font-display text-xl font-bold text-ink mb-6">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-4">
                  <ShoppingBag size={28} className="text-gold-600" />
                </div>
                <p className="font-display text-lg font-semibold text-ink">No orders yet</p>
                <p className="text-sm text-ink-soft mt-2">
                  Your order history will appear here once you make a purchase.
                </p>
                <Link href="/products" className="btn-gold mt-6 inline-flex">
                  Start Shopping <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  let itemCount = 0;
                  try {
                    itemCount = JSON.parse(order.items).length;
                  } catch {}
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-ink/10 bg-white hover:border-gold-500/40 transition-colors"
                    >
                      <div>
                        <p className="text-sm text-ink font-medium">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-ink-mute mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-display font-bold text-ink">
                          ₹{Math.round(order.total)}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] uppercase tracking-widest rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700">
                          {order.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}

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
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { formatPrice, cn } from "@/lib/utils";

type OrderData = {
  id: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  status: string;
  createdAt: string;
  items: string;
  address: string | null;
  razorpayPayId: string | null;
};

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Package }> = {
  confirmed: { label: "Confirmed", color: "text-emerald-700", bg: "bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
  placed: { label: "Placed", color: "text-blue-700", bg: "bg-blue-500/10 border-blue-500/30", icon: Clock },
  processing: { label: "Processing", color: "text-amber-700", bg: "bg-amber-500/10 border-amber-500/30", icon: Package },
  shipped: { label: "Shipped", color: "text-purple-700", bg: "bg-purple-500/10 border-purple-500/30", icon: Truck },
  delivered: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-500/10 border-red-500/30", icon: AlertCircle },
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

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
          setLoading(false);
        })
        .catch(() => setLoading(false));
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
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Reveal delay={0.05}>
            <div className="card p-5 card-hover h-full">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-3">
                <User size={18} />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-ink-mute">Profile</p>
              <p className="font-display text-lg font-bold text-ink mt-1">{user.name || "—"}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card p-5 card-hover h-full">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-3">
                <Package size={18} />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-ink-mute">Orders</p>
              <p className="font-display text-lg font-bold text-ink mt-1">{orders.length}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="card p-5 card-hover h-full">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-3">
                <CreditCard size={18} />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-ink-mute">Total Spent</p>
              <p className="font-display text-lg font-bold text-ink mt-1">
                {orders.length > 0 ? formatPrice(totalSpent) : "—"}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="card p-5 card-hover h-full">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-3">
                <MapPin size={18} />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-ink-mute">Delivery</p>
              <p className="font-display text-lg font-bold text-ink mt-1">Delhi NCR</p>
            </div>
          </Reveal>
        </div>

        {/* Order History */}
        <Reveal delay={0.25}>
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-ink">Order History</h2>
              {orders.length > 0 && (
                <span className="text-xs text-ink-mute">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
              </div>
            ) : orders.length === 0 ? (
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
                {orders.map((order, idx) => {
                  const sConf = statusConfig[order.status] || statusConfig.placed;
                  const StatusIcon = sConf.icon;

                  let parsedItems: { name: string; qty: number; price: number }[] = [];
                  try {
                    parsedItems = JSON.parse(order.items);
                  } catch {
                    parsedItems = [];
                  }

                  const itemCount = parsedItems.reduce((sum, i) => sum + i.qty, 0);
                  const itemNames = parsedItems
                    .slice(0, 3)
                    .map((i) => i.name)
                    .join(", ");
                  const moreCount = parsedItems.length - 3;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="group flex items-center gap-4 p-5 rounded-xl border border-ink/10 bg-white hover:border-gold-500/40 hover:shadow-sm transition-all"
                      >
                        <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gold-500/8 items-center justify-center text-gold-600 flex-shrink-0 group-hover:bg-gold-500/15 transition-colors">
                          <Package size={20} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-ink">
                              Order #{order.id.slice(-8).toUpperCase()}
                            </p>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-widest rounded-full border",
                                sConf.bg,
                                sConf.color,
                              )}
                            >
                              <StatusIcon size={10} />
                              {sConf.label}
                            </span>
                          </div>
                          <p className="text-xs text-ink-mute mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            · {itemCount} {itemCount === 1 ? "item" : "items"}
                          </p>
                          <p className="text-xs text-ink-mute mt-0.5 line-clamp-1">
                            {itemNames}
                            {moreCount > 0 && ` +${moreCount} more`}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-display text-lg font-bold text-ink">
                            {formatPrice(order.total)}
                          </p>
                        </div>

                        <ChevronRight
                          size={18}
                          className="text-ink-mute group-hover:text-gold-600 transition-colors flex-shrink-0"
                        />
                      </Link>
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

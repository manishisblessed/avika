"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

import { formatPrice, cn } from "@/lib/utils";
import { productImageSrc } from "@/lib/product-images";
import { Reveal } from "@/components/Reveal";

type OrderItem = {
  id: string;
  name: string;
  image?: string;
  qty: number;
  price: number;
  unit?: string;
};

type Order = {
  id: string;
  items: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  razorpayOrderId: string | null;
  razorpayPayId: string | null;
  address: string | null;
  createdAt: string;
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
  confirmed: { label: "Confirmed", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
  placed: { label: "Placed", color: "text-blue-600 bg-blue-500/10 border-blue-500/30", icon: Clock },
  processing: { label: "Processing", color: "text-amber-600 bg-amber-500/10 border-amber-500/30", icon: Package },
  shipped: { label: "Shipped", color: "text-purple-600 bg-purple-500/10 border-purple-500/30", icon: Truck },
  delivered: { label: "Delivered", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-600 bg-red-500/10 border-red-500/30", icon: AlertCircle },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (!session?.user || !id) return;

    fetch(`/api/orders/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Order not found");
        return r.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [session, id]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="pt-36 pb-24 section text-center">
        <div className="inline-block w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-36 pb-24 section text-center">
        <div className="inline-flex p-5 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h1 className="display text-2xl font-bold text-ink">Order not found</h1>
        <p className="text-ink-soft mt-2">This order doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link href="/account" className="btn-gold mt-6 inline-flex">
          <ArrowLeft size={16} /> Back to Account
        </Link>
      </div>
    );
  }

  let parsedItems: OrderItem[] = [];
  try {
    parsedItems = JSON.parse(order.items);
  } catch {
    parsedItems = [];
  }

  const status = statusConfig[order.status] || statusConfig.placed;
  const StatusIcon = status.icon;
  const orderDate = new Date(order.createdAt);

  return (
    <div className="pt-36 pb-24">
      <section className="section max-w-4xl">
        <Reveal>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-gold-600 transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to My Account
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow mb-2">Order Details</span>
              <h1 className="display text-3xl md:text-4xl font-bold text-ink mt-3">
                Order <span className="gold-text">#{order.id.slice(-8).toUpperCase()}</span>
              </h1>
              <p className="text-ink-soft mt-1">
                Placed on{" "}
                {orderDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                at{" "}
                {orderDate.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium self-start",
                status.color,
              )}
            >
              <StatusIcon size={16} />
              {status.label}
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Items */}
          <Reveal delay={0.05}>
            <div className="md:col-span-2 card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-600">
                  <ShoppingBag size={16} />
                </div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Items ({parsedItems.length})
                </h2>
              </div>

              <div className="space-y-4">
                {parsedItems.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white border border-ink/8 hover:border-gold-500/30 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-ink/5">
                      {item.image ? (
                        <Image
                          src={productImageSrc([item.image])}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-ink-mute" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-ink-mute mt-0.5">
                        {formatPrice(item.price)} × {item.qty}
                        {item.unit ? ` (${item.unit})` : ""}
                      </p>
                    </div>
                    <p className="font-display font-bold text-ink text-sm">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Reveal delay={0.1}>
              <div className="card p-6 space-y-3">
                <h3 className="font-display font-bold text-ink flex items-center gap-2">
                  <CreditCard size={16} className="text-gold-600" />
                  Payment Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Subtotal</span>
                    <span className="text-ink">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Shipping</span>
                    <span className="text-ink">
                      {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Tax</span>
                    <span className="text-ink">{formatPrice(order.tax)}</span>
                  </div>
                  <div className="h-px bg-ink/10 my-2" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-ink">Total</span>
                    <span className="font-display text-xl font-bold text-ink">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
                {order.razorpayPayId && (
                  <p className="text-[11px] text-ink-mute pt-2">
                    Payment ID: {order.razorpayPayId}
                  </p>
                )}
              </div>
            </Reveal>

            {/* Delivery Address */}
            {order.address && (
              <Reveal delay={0.15}>
                <div className="card p-6">
                  <h3 className="font-display font-bold text-ink flex items-center gap-2 mb-3">
                    <MapPin size={16} className="text-gold-600" />
                    Delivery Address
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">{order.address}</p>
                </div>
              </Reveal>
            )}

            {/* Order ID */}
            <Reveal delay={0.2}>
              <div className="card p-6">
                <h3 className="font-display font-bold text-ink flex items-center gap-2 mb-3">
                  <Package size={16} className="text-gold-600" />
                  Order Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Order ID</span>
                    <span className="text-ink font-mono text-xs">{order.id.slice(-8).toUpperCase()}</span>
                  </div>
                  {order.razorpayOrderId && (
                    <div className="flex justify-between">
                      <span className="text-ink-soft">Razorpay ID</span>
                      <span className="text-ink font-mono text-xs">{order.razorpayOrderId.slice(-12)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

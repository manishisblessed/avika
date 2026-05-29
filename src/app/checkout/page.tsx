"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

import { useCart } from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import { productImageSrc } from "@/lib/product-images";
import { Reveal } from "@/components/Reveal";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const steps = ["Address", "Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [paying, setPaying] = useState(false);

  const ship = subtotal() > 499 ? 0 : 49;
  const tax = subtotal() * 0.05;
  const total = subtotal() + ship + tax;

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const placeOrder = async () => {
    setPaying(true);

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "AVIKA Grocery Mart",
        description: `Order - ${items.length} items`,
        order_id: data.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              orderData: {
                items: items.map((i) => ({
                  id: i.product.id,
                  name: i.product.name,
                  qty: i.qty,
                  price: i.product.price,
                })),
                subtotal: subtotal(),
                shipping: ship,
                tax,
                total,
              },
            }),
          });

          if (verifyRes.ok) {
            setDone(true);
            setTimeout(() => clear(), 800);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
          setPaying(false);
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#f97316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Unable to initiate payment. Please try again.");
      setPaying(false);
    }
  };

  if (items.length === 0 && !done) {
    return (
      <div className="pt-36 pb-24 section text-center">
        <h1 className="display text-4xl">Your bag is empty.</h1>
        <Link href="/products" className="btn-gold mt-8 inline-flex">
          Browse the shop
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="pt-36 pb-24 section">
        <Reveal>
          <div className="max-w-2xl mx-auto card p-12 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="inline-flex w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 items-center justify-center text-white shadow-gold mb-8"
            >
              <Check size={32} strokeWidth={3} />
            </motion.div>
            <h1 className="display text-3xl md:text-4xl font-bold text-ink">
              Thank you. <span className="gold-text">Order placed.</span>
            </h1>
            <p className="mt-5 text-ink-soft text-lg">
              Your order is being packed. We&apos;ll email a tracking link
              within a few hours.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <Stat label="Order #" value={`AV${Math.floor(Math.random() * 90000 + 10000)}`} />
              <Stat label="Total" value={formatPrice(total)} />
              <Stat label="ETA" value="Same day" />
            </div>
            <Link href="/products" className="btn-gold mt-10 inline-flex">
              Continue shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    <div className="pt-36 pb-24">
      <section className="section">
        <Reveal>
          <span className="eyebrow mb-3">Checkout</span>
          <h1 className="display text-4xl md:text-5xl font-bold mt-4 leading-tight text-ink">
            Almost <span className="gold-text">yours.</span>
          </h1>
        </Reveal>

        {/* Progress */}
        <div className="mt-12 flex items-center justify-between max-w-2xl">
          {steps.map((label, i) => (
            <div key={label} className="flex-1 flex items-center">
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={{
                    backgroundColor:
                      i <= step ? "rgba(249,115,22,1)" : "rgba(21,36,26,0.06)",
                    color: i <= step ? "#ffffff" : "#788379",
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium border border-ink/10"
                >
                  {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
                </motion.div>
                <span
                  className={cn(
                    "absolute top-11 text-[10px] uppercase tracking-widest whitespace-nowrap",
                    i === step ? "text-gold-700" : "text-ink-mute",
                  )}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-2 bg-ink/10 relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: i < step ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ originX: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-600"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="card p-8"
              >
                {step === 0 && <AddressStep />}
                {step === 1 && <ShippingStep />}
                {step === 2 && <PaymentStep />}
                {step === 3 && <ReviewStep />}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex justify-between">
              <button
                onClick={prev}
                disabled={step === 0}
                className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              {step < steps.length - 1 ? (
                <button onClick={next} className="btn-gold">
                  Continue
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={placeOrder} disabled={paying} className="btn-gold disabled:opacity-60">
                  {paying ? "Processing..." : "Pay & Place Order"}
                  <Sparkles size={16} />
                </button>
              )}
            </div>
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <div className="card p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-ink">Order</h3>
              <ul className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={productImageSrc(product.images)}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink line-clamp-1">{product.name}</p>
                      <p className="text-xs text-ink-mute">{formatPrice(product.price * qty)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="h-px bg-ink/10" />
              <Row label="Subtotal" value={formatPrice(subtotal())} />
              <Row label="Shipping" value={ship === 0 ? "Free" : formatPrice(ship)} />
              <Row label="Tax" value={formatPrice(tax)} />
              <div className="h-px bg-ink/10" />
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-ink">Total</span>
                <span className="font-display text-2xl font-bold text-ink">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-ink-mute pt-2">
                <ShieldCheck size={14} className="text-gold-600" />
                Secure 256-bit encryption
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
    </>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  className,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs uppercase tracking-widest text-ink-mute font-medium">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full bg-white border border-ink/15 rounded-xl px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 transition-colors"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-soft">{label}</span>
      <span className="text-ink font-medium">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-[10px] uppercase tracking-widest text-ink-mute">{label}</p>
      <p className="mt-1 font-display text-lg font-bold text-ink">{value}</p>
    </div>
  );
}

function AddressStep() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-ink">Delivery Address</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="First name" placeholder="Rahul" />
        <Field label="Last name" placeholder="Sharma" />
      </div>
      <Field label="Phone" type="tel" placeholder="+91 98765 43210" />
      <Field label="Email" type="email" placeholder="rahul@example.com" />
      <Field label="Address line 1" placeholder="B-204, Eros Metro Mall" />
      <Field label="Address line 2 (optional)" placeholder="Flat, floor, landmark" />
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="City" placeholder="New Delhi" />
        <Field label="PIN code" placeholder="110075" />
        <Field label="State" placeholder="Delhi" />
      </div>
    </div>
  );
}

function ShippingStep() {
  const [m, setM] = useState("standard");
  const opts = [
    { id: "standard", t: "Standard", d: "Within 2-4 hours", p: "Free over ₹499" },
    { id: "express", t: "Express", d: "Within 60 minutes", p: "+ ₹79" },
    { id: "scheduled", t: "Scheduled", d: "Pick your time slot", p: "+ ₹29" },
  ];
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-ink">Shipping Method</h2>
      <div className="space-y-3">
        {opts.map((o) => (
          <button
            key={o.id}
            onClick={() => setM(o.id)}
            className={cn(
              "w-full text-left p-5 rounded-xl border flex items-center justify-between transition-all bg-white",
              m === o.id
                ? "border-gold-500 ring-2 ring-gold-500/30"
                : "border-ink/12 hover:border-gold-500/40",
            )}
          >
            <div>
              <p className="font-medium text-ink">{o.t}</p>
              <p className="text-xs text-ink-mute mt-1">{o.d}</p>
            </div>
            <p className="text-gold-700 text-sm font-medium">{o.p}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function PaymentStep() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-ink">Payment</h2>
      <div className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 mb-4">
          <ShieldCheck size={24} className="text-gold-600" />
        </div>
        <h3 className="font-display text-lg font-bold text-ink">Secure Payment via Razorpay</h3>
        <p className="text-sm text-ink-soft mt-2 max-w-sm mx-auto">
          You&apos;ll be redirected to Razorpay&apos;s secure payment page when you place your order.
          Pay with UPI, debit/credit card, netbanking, or wallets.
        </p>
        <div className="flex items-center justify-center gap-3 mt-5 text-[11px] text-ink-mute">
          {["UPI", "Cards", "Netbanking", "Wallets"].map((p) => (
            <span key={p} className="px-3 py-1 rounded-full border border-ink/12 bg-white">
              {p}
            </span>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-ink-mute flex items-center gap-2">
        <ShieldCheck size={14} className="text-gold-600" />
        256-bit encrypted · PCI DSS compliant · RBI regulated
      </p>
    </div>
  );
}

function ReviewStep() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-ink">Review &amp; confirm</h2>
      <p className="text-ink-soft">
        Everything in order? Tap the button below to place your order. You&apos;ll
        receive an SMS and email with tracking shortly after.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="card p-4">
          <p className="text-[10px] uppercase tracking-widest text-ink-mute">Deliver to</p>
          <p className="mt-2 text-ink font-medium">Rahul Sharma</p>
          <p className="text-ink-soft text-sm">B-204, Eros Metro Mall, Dwarka 110075</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] uppercase tracking-widest text-ink-mute">Payment</p>
          <p className="mt-2 text-ink font-medium">Razorpay (UPI / Card / Netbanking)</p>
          <p className="text-ink-soft text-sm">Pay securely on next step</p>
        </div>
      </div>
    </div>
  );
}

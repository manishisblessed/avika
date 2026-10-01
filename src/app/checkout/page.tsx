"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  LogIn,
  Clock,
  Zap,
  CalendarClock,
} from "lucide-react";

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

type Address = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
  state: string;
};

const emptyAddress: Address = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  pincode: "",
  state: "",
};

type ShippingMethod = "standard" | "express" | "scheduled";

const shippingOptions: {
  id: ShippingMethod;
  title: string;
  desc: string;
  price: string;
  extra: number;
  icon: typeof Clock;
}[] = [
  { id: "standard", title: "Standard", desc: "Within 2–4 hours", price: "Free over ₹499", extra: 0, icon: Clock },
  { id: "express", title: "Express", desc: "Within 60 minutes", price: "+ ₹79", extra: 79, icon: Zap },
  { id: "scheduled", title: "Scheduled", desc: "Pick your time slot", price: "+ ₹29", extra: 29, icon: CalendarClock },
];

export default function CheckoutPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [paying, setPaying] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);

  const [address, setAddress] = useState<Address>(emptyAddress);
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");

  const shippingExtra = shippingOptions.find((o) => o.id === shippingMethod)!.extra;
  const baseShip = subtotal() > 499 ? 0 : 49;
  const ship = baseShip + shippingExtra;
  const tax = subtotal() * 0.05;
  const total = subtotal() + ship + tax;

  const updateAddress = useCallback(
    (field: keyof Address, value: string) => {
      setAddress((prev) => ({ ...prev, [field]: value }));
      setAddressErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  const validateAddress = useCallback((): boolean => {
    const errors: Partial<Record<keyof Address, string>> = {};
    if (!address.firstName.trim()) errors.firstName = "Required";
    if (!address.lastName.trim()) errors.lastName = "Required";
    if (!address.phone.trim()) errors.phone = "Required";
    else if (!/^\+?[\d\s-]{10,}$/.test(address.phone.trim())) errors.phone = "Invalid phone";
    if (!address.email.trim()) errors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim())) errors.email = "Invalid email";
    if (!address.line1.trim()) errors.line1 = "Required";
    if (!address.city.trim()) errors.city = "Required";
    if (!address.pincode.trim()) errors.pincode = "Required";
    else if (!/^\d{6}$/.test(address.pincode.trim())) errors.pincode = "Must be 6 digits";
    if (!address.state.trim()) errors.state = "Required";

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  }, [address]);

  const next = () => {
    if (step === 0 && !validateAddress()) return;
    setStep((s) => Math.min(steps.length - 1, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const fullAddress = `${address.firstName} ${address.lastName}, ${address.line1}${address.line2 ? ", " + address.line2 : ""}, ${address.city} ${address.pincode}, ${address.state}`;

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
                  image: i.product.images?.[0] || "",
                  qty: i.qty,
                  price: i.product.price,
                  unit: i.product.unit || "",
                })),
                subtotal: subtotal(),
                shipping: ship,
                tax,
                total,
                address: fullAddress,
                shippingMethod,
              },
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.verified) {
            setOrderId(verifyData.dbOrderId || "");
            setOrderTotal(total);
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
          name: `${address.firstName} ${address.lastName}`.trim() || session?.user?.name || "",
          email: address.email || session?.user?.email || "",
          contact: address.phone || "",
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

  if (authStatus === "loading") {
    return (
      <div className="pt-36 pb-24 section text-center">
        <div className="inline-block w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="pt-36 pb-24 section">
        <Reveal>
          <div className="max-w-lg mx-auto card p-12 text-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 items-center justify-center mb-6">
              <LogIn size={28} className="text-gold-600" />
            </div>
            <h1 className="display text-3xl font-bold text-ink">
              Sign in to <span className="gold-text">checkout</span>
            </h1>
            <p className="mt-3 text-ink-soft">
              Please sign in or create an account so we can save your order and send you updates.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login?callbackUrl=/checkout" className="btn-gold">
                Sign In <ArrowRight size={16} />
              </Link>
              <Link href="/signup?callbackUrl=/checkout" className="btn-ghost">
                Create Account
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

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
    const displayOrderId = orderId
      ? `AV-${orderId.slice(-8).toUpperCase()}`
      : `AV${Math.floor(Math.random() * 90000 + 10000)}`;

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
              Thank you. <span className="gold-text">Order placed!</span>
            </h1>
            <p className="mt-5 text-ink-soft text-lg">
              Your order is being packed. We&apos;ll notify you with tracking updates shortly.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <Stat label="Order #" value={displayOrderId} />
              <Stat label="Total" value={formatPrice(orderTotal)} />
              <Stat label="ETA" value="Same day" />
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              {orderId && (
                <Link href={`/account/orders/${orderId}`} className="btn-gold">
                  View Order Details <ArrowRight size={16} />
                </Link>
              )}
              <Link href="/products" className={orderId ? "btn-ghost" : "btn-gold inline-flex"}>
                Continue Shopping <ArrowRight size={16} />
              </Link>
            </div>
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
                  {step === 0 && (
                    <AddressStep
                      address={address}
                      errors={addressErrors}
                      onChange={updateAddress}
                    />
                  )}
                  {step === 1 && (
                    <ShippingStep selected={shippingMethod} onSelect={setShippingMethod} />
                  )}
                  {step === 2 && <PaymentStep />}
                  {step === 3 && (
                    <ReviewStep address={address} shippingMethod={shippingMethod} />
                  )}
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
                <Row label="Tax (5%)" value={formatPrice(tax)} />
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

/* ─── Reusable sub-components ─── */

function Field({
  label,
  type = "text",
  placeholder,
  className,
  value,
  onChange,
  error,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs uppercase tracking-widest text-ink-mute font-medium">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "mt-2 w-full bg-white border rounded-xl px-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 transition-colors",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
            : "border-ink/15 focus:border-gold-500 focus:ring-gold-500/30",
        )}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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

/* ─── Step Components ─── */

function AddressStep({
  address,
  errors,
  onChange,
}: {
  address: Address;
  errors: Partial<Record<keyof Address, string>>;
  onChange: (field: keyof Address, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-ink">Delivery Address</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="First name"
          placeholder="Rahul"
          value={address.firstName}
          onChange={(v) => onChange("firstName", v)}
          error={errors.firstName}
        />
        <Field
          label="Last name"
          placeholder="Sharma"
          value={address.lastName}
          onChange={(v) => onChange("lastName", v)}
          error={errors.lastName}
        />
      </div>
      <Field
        label="Phone"
        type="tel"
        placeholder="+91 98765 43210"
        value={address.phone}
        onChange={(v) => onChange("phone", v)}
        error={errors.phone}
      />
      <Field
        label="Email"
        type="email"
        placeholder="rahul@example.com"
        value={address.email}
        onChange={(v) => onChange("email", v)}
        error={errors.email}
      />
      <Field
        label="Address line 1"
        placeholder="B-204, Eros Metro Mall"
        value={address.line1}
        onChange={(v) => onChange("line1", v)}
        error={errors.line1}
      />
      <Field
        label="Address line 2 (optional)"
        placeholder="Flat, floor, landmark"
        value={address.line2}
        onChange={(v) => onChange("line2", v)}
      />
      <div className="grid sm:grid-cols-3 gap-4">
        <Field
          label="City"
          placeholder="New Delhi"
          value={address.city}
          onChange={(v) => onChange("city", v)}
          error={errors.city}
        />
        <Field
          label="PIN code"
          placeholder="110075"
          value={address.pincode}
          onChange={(v) => onChange("pincode", v)}
          error={errors.pincode}
        />
        <Field
          label="State"
          placeholder="Delhi"
          value={address.state}
          onChange={(v) => onChange("state", v)}
          error={errors.state}
        />
      </div>
    </div>
  );
}

function ShippingStep({
  selected,
  onSelect,
}: {
  selected: ShippingMethod;
  onSelect: (m: ShippingMethod) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-ink">Shipping Method</h2>
      <div className="space-y-3">
        {shippingOptions.map((o) => {
          const Icon = o.icon;
          return (
            <button
              key={o.id}
              onClick={() => onSelect(o.id)}
              className={cn(
                "w-full text-left p-5 rounded-xl border flex items-center gap-4 transition-all bg-white",
                selected === o.id
                  ? "border-gold-500 ring-2 ring-gold-500/30"
                  : "border-ink/12 hover:border-gold-500/40",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  selected === o.id
                    ? "bg-gold-500/15 text-gold-600"
                    : "bg-ink/5 text-ink-mute",
                )}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink">{o.title}</p>
                <p className="text-xs text-ink-mute mt-1">{o.desc}</p>
              </div>
              <p className="text-gold-700 text-sm font-medium">{o.price}</p>
            </button>
          );
        })}
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

function ReviewStep({
  address,
  shippingMethod,
}: {
  address: Address;
  shippingMethod: ShippingMethod;
}) {
  const methodLabel =
    shippingOptions.find((o) => o.id === shippingMethod)?.title || "Standard";

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
          <p className="mt-2 text-ink font-medium">
            {address.firstName} {address.lastName}
          </p>
          <p className="text-ink-soft text-sm">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
          </p>
          <p className="text-ink-soft text-sm">
            {address.city} {address.pincode}, {address.state}
          </p>
          <p className="text-ink-mute text-xs mt-1">{address.phone}</p>
        </div>
        <div className="card p-4">
          <p className="text-[10px] uppercase tracking-widest text-ink-mute">Payment & Shipping</p>
          <p className="mt-2 text-ink font-medium">Razorpay (UPI / Card / Netbanking)</p>
          <p className="text-ink-soft text-sm">{methodLabel} delivery</p>
        </div>
      </div>
    </div>
  );
}

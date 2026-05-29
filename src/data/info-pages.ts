export type InfoSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type InfoHighlight = {
  icon: "truck" | "clock" | "map" | "shield" | "package" | "refresh" | "phone" | "mail" | "help" | "credit" | "leaf" | "scale";
  title: string;
  description: string;
};

export type InfoFaq = { q: string; a: string };

export type InfoPageData = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  highlights?: InfoHighlight[];
  sections: InfoSection[];
  faqs?: InfoFaq[];
  cta?: { label: string; href: string; text: string };
};

export const deliveryPage: InfoPageData = {
  eyebrow: "Delivery",
  title: "Fresh groceries,",
  highlight: "delivered fast.",
  description:
    "We deliver across Delhi NCR with same-day slots and careful handling — so your fruits stay crisp and your milk stays cold.",
  highlights: [
    {
      icon: "truck",
      title: "Same-day delivery",
      description: "Order before 2 PM for delivery the same day across most Delhi NCR pin codes.",
    },
    {
      icon: "clock",
      title: "Flexible slots",
      description: "Morning (8–11 AM), afternoon (12–4 PM), or evening (5–9 PM) — pick what suits you.",
    },
    {
      icon: "map",
      title: "Delhi NCR coverage",
      description: "Dwarka, Rohini, Janakpuri, Saket, Noida, Gurgaon, and 50+ neighborhoods we serve daily.",
    },
    {
      icon: "shield",
      title: "Handled with care",
      description: "Temperature-sensitive items travel in insulated bags with separate produce and dairy packing.",
    },
  ],
  sections: [
    {
      title: "How delivery works",
      paragraphs: [
        "Once you place an order and payment is confirmed, our team picks and packs your items from our Dwarka hub. You'll receive an SMS and email with your order ID and estimated delivery window.",
        "Our delivery partners call you 15–20 minutes before arrival. If you're unavailable, we can leave the order with security (where permitted) or reschedule once at no extra charge.",
      ],
    },
    {
      title: "Delivery charges",
      bullets: [
        "Free delivery on orders above ₹499",
        "₹49 flat delivery fee on orders below ₹499",
        "Express delivery (within 2 hours) — ₹79, subject to availability in your area",
        "No hidden fees — the amount at checkout is what you pay",
      ],
    },
    {
      title: "Order cut-off times",
      bullets: [
        "Same-day morning slot — order by 10 PM the previous night",
        "Same-day afternoon slot — order by 11 AM",
        "Same-day evening slot — order by 2 PM",
        "Next-day delivery — available 24/7 for all serviceable pin codes",
      ],
    },
    {
      title: "Areas we serve",
      paragraphs: [
        "We currently deliver across Delhi, parts of Noida, Greater Noida, Ghaziabad, Faridabad, and Gurgaon. Enter your pin code at checkout to confirm availability. We're expanding weekly — register your area on the contact page if we're not there yet.",
      ],
    },
    {
      title: "Perishables & cold chain",
      bullets: [
        "Fruits, vegetables, dairy, and frozen items are packed separately",
        "Dairy and frozen products travel in insulated carriers",
        "We do not accept returns on opened perishables unless damaged or incorrect — see Returns & Refunds",
      ],
    },
  ],
  cta: {
    label: "Shop groceries",
    href: "/products",
    text: "Ready to order? Browse our full range and get fresh groceries at your doorstep.",
  },
};

export const returnsPage: InfoPageData = {
  eyebrow: "Returns & Refunds",
  title: "Hassle-free",
  highlight: "returns.",
  description:
    "Received something damaged, expired, or not what you ordered? We'll make it right — quickly and fairly.",
  highlights: [
    {
      icon: "refresh",
      title: "Quick resolution",
      description: "Most return requests are reviewed and resolved within 24–48 hours of reporting.",
    },
    {
      icon: "package",
      title: "Easy reporting",
      description: "Share your order ID and a photo via phone, email, or our contact form.",
    },
    {
      icon: "credit",
      title: "Flexible refunds",
      description: "Refunds go back to your original payment method or as store credit — your choice.",
    },
    {
      icon: "shield",
      title: "Quality guarantee",
      description: "If we miss our freshness promise, we replace or refund without argument.",
    },
  ],
  sections: [
    {
      title: "What you can return",
      bullets: [
        "Damaged, crushed, or leaking packaged goods",
        "Wrong item or quantity delivered",
        "Expired or near-expiry products (where shelf life was misrepresented)",
        "Poor quality fresh produce — bruised, rotten, or clearly below standard",
        "Missing items from your order",
      ],
    },
    {
      title: "What we cannot accept",
      bullets: [
        "Opened or partially consumed perishables (unless quality issue is proven with photos)",
        "Items returned after 48 hours of delivery without prior intimation",
        "Products bought on final clearance unless defective",
        "Personal care and baby products once the seal is broken (as per hygiene norms)",
      ],
    },
    {
      title: "How to request a return",
      paragraphs: [
        "Contact us within 48 hours of delivery with your order ID, item name, and clear photos of the issue. Call +91-7090601025, email orders@avikagrocery.com, or use our contact form with subject line \"Return Request\".",
        "Our support team will verify your claim. For valid cases, we arrange a pickup or replacement delivery at no cost. You do not need to return opened perishables — disposal photos are sufficient.",
      ],
    },
    {
      title: "Refund timeline",
      bullets: [
        "UPI / Card / Net Banking — 5–7 business days after approval (bank processing may vary)",
        "Cash on Delivery orders — refund via UPI or store credit within 48 hours",
        "Store credit — applied instantly to your account for future orders",
        "Partial refunds — for single items in a multi-item order, proportional to item value",
      ],
    },
    {
      title: "Replacements vs refunds",
      paragraphs: [
        "Where stock is available, we prefer sending a free replacement at your preferred slot. If you'd rather have a refund, or the item is out of stock, we'll process a full refund for the affected line items including any delivery charge if the entire order was unusable.",
      ],
    },
  ],
  cta: {
    label: "Contact support",
    href: "/contact",
    text: "Need help with a recent order? Our team is available 7 AM – 10 PM, all days.",
  },
};

export const faqsPage: InfoPageData = {
  eyebrow: "FAQs",
  title: "Answers to",
  highlight: "common questions.",
  description:
    "Everything you need to know about ordering, paying, delivering, and shopping with AVIKA Grocery Mart.",
  faqs: [
    {
      q: "What are your delivery hours and areas?",
      a: "We deliver across Delhi NCR, 7 days a week, between 8 AM and 9 PM. Same-day delivery is available on most pin codes when you order before the slot cut-off. Check your pin code at checkout or see our Delivery Info page for full details.",
    },
    {
      q: "Is there a minimum order value?",
      a: "There is no minimum order value. Delivery is free on orders above ₹499; orders below ₹499 carry a flat ₹49 delivery fee.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept UPI, Visa, Mastercard, RuPay, net banking, and wallets through Razorpay. Cash on delivery is available in select areas for orders under ₹2,000.",
    },
    {
      q: "How do I track my order?",
      a: "After placing an order, you'll receive an SMS and email with your order ID. Our delivery partner will call you 15–20 minutes before arrival. You can also view order history in My Account after logging in.",
    },
    {
      q: "Can I modify or cancel my order?",
      a: "You can modify or cancel within 15 minutes of placing the order by calling us immediately. After packing begins, cancellations may incur a restocking fee for perishable items.",
    },
    {
      q: "Are your fruits and vegetables really fresh?",
      a: "Yes. We source directly from farmers and regional mandis, with daily procurement and quality checks. Produce reaching you is typically harvested within 24–48 hours.",
    },
    {
      q: "What if I receive a damaged or wrong item?",
      a: "Report it within 48 hours with photos via phone, email, or our contact form. We'll replace the item or issue a full refund — see Returns & Refunds for the complete policy.",
    },
    {
      q: "Do you offer bulk or corporate orders?",
      a: "Yes. For offices, societies, and events, email orders@avikagrocery.com with your requirements. We offer discounted rates and scheduled delivery for bulk orders above ₹5,000.",
    },
    {
      q: "How do I create an account?",
      a: "Click the user icon in the header and sign up with your email, or visit the login page. An account lets you save addresses, view order history, and checkout faster.",
    },
    {
      q: "Is my payment information secure?",
      a: "All online payments are processed through Razorpay's PCI-DSS compliant gateway. We never store your full card or UPI credentials on our servers.",
    },
  ],
  sections: [
    {
      title: "Still have questions?",
      paragraphs: [
        "Couldn't find what you're looking for? Our support team is happy to help — reach us by phone, email, or the contact form. We typically respond within a few hours during business hours.",
      ],
    },
  ],
  cta: {
    label: "Get in touch",
    href: "/contact",
    text: "Talk to our team for order help, product queries, or feedback.",
  },
};

export const supportPage: InfoPageData = {
  eyebrow: "Support",
  title: "We're here",
  highlight: "when you need us.",
  description:
    "Order issues, product questions, feedback, or bulk enquiries — our Dwarka team responds quickly and treats every customer like a neighbor.",
  highlights: [
    {
      icon: "phone",
      title: "Call us",
      description: "+91-7090601025 — orders, delivery updates, and urgent issues. 7 AM – 10 PM, all days.",
    },
    {
      icon: "mail",
      title: "Email us",
      description: "orders@avikagrocery.com — we reply within a few hours on business days.",
    },
    {
      icon: "help",
      title: "Self-service",
      description: "Check FAQs for quick answers on delivery, payments, returns, and account setup.",
    },
    {
      icon: "clock",
      title: "Store hours",
      description: "Visit us at Eros Metro Mall, Dwarka Sector-14 — 7:00 AM to 10:00 PM, all days.",
    },
  ],
  sections: [
    {
      title: "What we can help with",
      bullets: [
        "Order status, modifications, and cancellations",
        "Delivery delays, wrong addresses, or missed slots",
        "Damaged, missing, or incorrect items — returns & refunds",
        "Product availability, recommendations, and substitutions",
        "Account, login, and payment issues",
        "Bulk orders, society deliveries, and corporate accounts",
        "Feedback and suggestions — we read every message",
      ],
    },
    {
      title: "Before you contact us",
      paragraphs: [
        "Have your order ID ready (from SMS, email, or My Account). For quality issues, take clear photos within 48 hours of delivery. This helps us resolve your case in one conversation.",
      ],
      bullets: [
        "Check Delivery Info for slot times and charges",
        "Read Returns & Refunds for damaged or wrong items",
        "Browse FAQs for common questions",
      ],
    },
    {
      title: "Response times",
      bullets: [
        "Phone — immediate during working hours",
        "Email & contact form — within 4 hours (9 AM – 8 PM)",
        "Return requests — reviewed within 24 hours",
        "Refund processing — 5–7 business days after approval",
      ],
    },
  ],
  cta: {
    label: "Send a message",
    href: "/contact",
    text: "Prefer writing? Use our contact form and we'll get back to you shortly.",
  },
};

export const privacyPage: InfoPageData = {
  eyebrow: "Legal",
  title: "Privacy",
  highlight: "Policy.",
  description:
    "AVIKA DEPARTMENTAL PRIVATE LIMITED respects your privacy. This policy explains how we collect, use, and protect your information when you use avikagrocery.com and our services.",
  sections: [
    {
      title: "Information we collect",
      bullets: [
        "Account details — name, email, phone number, and delivery addresses",
        "Order history — items purchased, payment status, and delivery preferences",
        "Payment data — processed securely via Razorpay; we do not store full card numbers",
        "Communications — messages sent through contact forms, email, or phone support",
        "Technical data — IP address, browser type, and cookies for site functionality and analytics",
      ],
    },
    {
      title: "How we use your information",
      bullets: [
        "Process and deliver your grocery orders",
        "Send order confirmations, delivery updates, and service notifications",
        "Improve our product range, website, and customer experience",
        "Respond to support requests and resolve disputes",
        "Comply with applicable laws and prevent fraud",
      ],
    },
    {
      title: "Sharing of information",
      paragraphs: [
        "We do not sell your personal data. We share information only with trusted partners necessary to operate our service — payment processors (Razorpay), delivery partners, and SMS/email providers — under strict confidentiality agreements. We may disclose information if required by law or to protect our rights and customers' safety.",
      ],
    },
    {
      title: "Data security",
      paragraphs: [
        "We use industry-standard encryption (HTTPS) for all data transmitted through our website. Access to customer databases is restricted to authorized personnel. While we take reasonable measures to protect your data, no online system is 100% secure — we encourage strong passwords and prompt reporting of suspicious activity.",
      ],
    },
    {
      title: "Cookies",
      paragraphs: [
        "Our site uses essential cookies for cart, login, and checkout functionality. We may use analytics cookies to understand how visitors use the site. You can control cookies through your browser settings; disabling essential cookies may limit site features.",
      ],
    },
    {
      title: "Your rights",
      bullets: [
        "Access and update your account information via My Account",
        "Request deletion of your account by emailing orders@avikagrocery.com",
        "Opt out of promotional emails using the unsubscribe link in any marketing message",
        "Raise privacy concerns with our team at orders@avikagrocery.com",
      ],
    },
    {
      title: "Children's privacy",
      paragraphs: [
        "Our services are not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have collected such data, contact us to have it removed.",
      ],
    },
    {
      title: "Updates to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The \"last updated\" date at the bottom of this page will reflect changes. Continued use of our services after updates constitutes acceptance of the revised policy.",
      ],
    },
  ],
  cta: {
    label: "Contact us",
    href: "/contact",
    text: "Questions about your data? Email orders@avikagrocery.com or call +91-7090601025.",
  },
};

export const termsPage: InfoPageData = {
  eyebrow: "Legal",
  title: "Terms of",
  highlight: "Service.",
  description:
    "By using AVIKA Grocery Mart (avikagrocery.com), you agree to these terms. Please read them carefully before placing an order.",
  sections: [
    {
      title: "About us",
      paragraphs: [
        "This website is operated by AVIKA DEPARTMENTAL PRIVATE LIMITED, registered in New Delhi (CIN: U47110DL2020PTC123456), with our store at TF-11B, 3rd Floor, Eros Metro Mall, Dwarka Sector-14, New Delhi-110078.",
      ],
    },
    {
      title: "Use of the website",
      bullets: [
        "You must be 18 years or older, or have parental consent, to place orders",
        "Account credentials are your responsibility — notify us immediately of unauthorized use",
        "You agree not to misuse the site, attempt unauthorized access, or place fraudulent orders",
        "Product images are representative; actual items may vary slightly in appearance",
      ],
    },
    {
      title: "Orders & pricing",
      bullets: [
        "All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise",
        "We reserve the right to correct pricing errors and cancel affected orders with a full refund",
        "Order confirmation is subject to product availability — we'll notify you of substitutions or cancellations",
        "We may limit quantities on high-demand or promotional items",
      ],
    },
    {
      title: "Payment",
      paragraphs: [
        "Online payments are processed through Razorpay. By paying, you authorize us to charge your selected payment method for the order total shown at checkout. Failed payments will cancel the order automatically.",
      ],
    },
    {
      title: "Delivery",
      paragraphs: [
        "Delivery terms, charges, and service areas are described on our Delivery Info page. We are not liable for delays caused by weather, traffic, or events beyond our reasonable control, but we will keep you informed and work to resolve issues promptly.",
      ],
    },
    {
      title: "Returns & refunds",
      paragraphs: [
        "Returns and refunds are governed by our Returns & Refunds and Refund Policy pages. Nothing in these Terms limits your rights under applicable consumer protection laws.",
      ],
    },
    {
      title: "Limitation of liability",
      paragraphs: [
        "To the fullest extent permitted by law, AVIKA DEPARTMENTAL PRIVATE LIMITED is not liable for indirect, incidental, or consequential damages arising from use of our website or services. Our total liability for any claim related to an order is limited to the amount you paid for that order.",
      ],
    },
    {
      title: "Governing law",
      paragraphs: [
        "These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in New Delhi. For concerns, contact orders@avikagrocery.com before pursuing formal dispute resolution.",
      ],
    },
  ],
  cta: {
    label: "Read refund policy",
    href: "/refund-policy",
    text: "See our dedicated Refund Policy for payment reversal details.",
  },
};

export const refundPolicyPage: InfoPageData = {
  eyebrow: "Legal",
  title: "Refund",
  highlight: "Policy.",
  description:
    "Clear guidelines on when and how refunds are issued for orders placed with AVIKA DEPARTMENTAL PRIVATE LIMITED.",
  sections: [
    {
      title: "When refunds apply",
      bullets: [
        "Order cancelled by us due to stock unavailability or pricing error",
        "Customer cancellation within 15 minutes of order placement (full refund)",
        "Approved return for damaged, wrong, expired, or missing items",
        "Delivery failure attributable to us after multiple rescheduling attempts",
        "Duplicate payment or technical payment error verified by our team",
      ],
    },
    {
      title: "When refunds do not apply",
      bullets: [
        "Change of mind after order is packed or dispatched",
        "Perishable items without a valid quality complaint within 48 hours",
        "Opened personal care or baby products (hygiene policy)",
        "Promotional or clearance items marked as non-refundable (unless defective)",
      ],
    },
    {
      title: "Refund methods",
      paragraphs: [
        "Refunds are issued to the original payment method wherever possible. For Cash on Delivery orders, we refund via UPI to your registered number or as store credit in your account.",
      ],
      bullets: [
        "UPI / Cards / Net Banking — 5–7 business days (bank-dependent)",
        "Wallets — 3–5 business days",
        "Store credit — instant, usable on your next order",
        "Partial refunds — calculated per affected item, not the full cart unless entire order is cancelled",
      ],
    },
    {
      title: "How to request a refund",
      paragraphs: [
        "Email orders@avikagrocery.com or call +91-7090601025 with your order ID, reason, and supporting photos where applicable. Approved refunds are initiated within 24 hours of approval; bank processing times vary.",
      ],
    },
    {
      title: "Failed or disputed payments",
      paragraphs: [
        "If your account was debited but the order was not confirmed, the amount is typically auto-reversed by your bank within 5–7 days. If not, share your transaction reference with us and we'll coordinate with Razorpay to resolve it.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        "For refund status or disputes, reach our team at orders@avikagrocery.com or +91-7090601025, 7:00 AM – 10:00 PM, all days. We aim to resolve all refund queries within 3 business days.",
      ],
    },
  ],
  cta: {
    label: "Returns & Refunds",
    href: "/returns",
    text: "For damaged or wrong items, see our full Returns & Refunds process.",
  },
};

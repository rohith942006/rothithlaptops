// Content for footer information pages (/info/...). Edit the text here.
export const infoPages: Record<string, { title: string; intro: string; sections: { h: string; p: string }[] }> = {
  "order-tracking": {
    title: "Order Tracking",
    intro: "Track your order using the order number from your confirmation email.",
    sections: [
      { h: "Where is my order?", p: "Once your order ships, we email and SMS you a tracking link. Most orders are dispatched within 24 hours on business days." },
      { h: "Need help?", p: "Share your order number with us on WhatsApp or by phone and we'll give you a live update." },
    ],
  },
  shipping: {
    title: "Shipping Information",
    intro: "Free delivery across India on all laptops.",
    sections: [
      { h: "Delivery times", p: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available in major metro cities for ₹199." },
      { h: "Packaging", p: "Every laptop ships in its sealed manufacturer box inside a protective outer carton, fully insured in transit." },
      { h: "Open-box check", p: "Please record an unboxing video and check the package seal on delivery. Report any damage within 48 hours." },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    intro: "Shop with confidence — easy replacements for eligible products.",
    sections: [
      { h: "7-day replacement", p: "If your product arrives damaged, defective or different from what you ordered, we'll replace it within 7 days of delivery." },
      { h: "Refunds", p: "Approved refunds are processed to the original payment method within 5–7 business days." },
      { h: "How to request", p: "Contact us with your order number, photos and a short description of the issue." },
    ],
  },
  warranty: {
    title: "Warranty",
    intro: "All products carry the official manufacturer warranty.",
    sections: [
      { h: "Manufacturer warranty", p: "Warranty is serviced by the brand's authorised service centres across India. Your GST invoice is your warranty proof." },
      { h: "We help you claim", p: "Not sure how to raise a claim? Our support team will guide you through the brand's process step by step." },
    ],
  },
  faqs: {
    title: "Frequently Asked Questions",
    intro: "Quick answers to common questions.",
    sections: [
      { h: "Are your products genuine?", p: "Yes. We sell 100% genuine, brand-new products with official manufacturer warranty and a GST invoice." },
      { h: "Do you offer EMI?", p: "Yes — no-cost EMI on major credit cards for up to 12 months, plus standard EMI options on select debit cards." },
      { h: "Is Cash on Delivery available?", p: "COD is available for orders up to ₹50,000 in serviceable pincodes." },
      { h: "Do you supply businesses?", p: "Absolutely. Contact us for bulk pricing, GST invoicing and fleet deployments." },
    ],
  },
  careers: {
    title: "Careers",
    intro: "Help people find the perfect laptop.",
    sections: [
      { h: "Open roles", p: "We're always looking for friendly product experts, support specialists and delivery partners. Email your CV to us with the role in the subject line." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "How we collect, use and protect your information.",
    sections: [
      { h: "What we collect", p: "Details you provide when ordering — name, contact information and delivery address — used only to fulfil and support your order." },
      { h: "Payments", p: "Payments are handled by secure, PCI-compliant payment partners. We never store your full card details." },
      { h: "Your choices", p: "You can unsubscribe from marketing emails at any time and request deletion of your data by contacting us." },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "Please read these terms before using our website.",
    sections: [
      { h: "Pricing", p: "Prices and availability may change without notice. Prices shown on this demo website are sample prices for illustration." },
      { h: "Orders", p: "An order is confirmed once payment is received (or on dispatch for COD). We may cancel orders affected by pricing errors and issue a full refund." },
      { h: "Governing law", p: "These terms are governed by the laws of India." },
    ],
  },
};

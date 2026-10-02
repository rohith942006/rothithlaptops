import type { Metadata } from "next";
import ContactView from "@/components/ContactView";

export const metadata: Metadata = { title: "Contact Us", description: "Get help choosing a laptop, with an order, or for business purchases." };

export default function ContactPage() {
  return <ContactView />;
}

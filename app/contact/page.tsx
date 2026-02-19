import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tejhas.com";

export const metadata: Metadata = {
  title: "Contact Us | Tejhas",
  description:
    "Get in touch with Tejhas. Request a demo or ask us about Tejhas ERP, MRP and CRM for MSMEs.",
  keywords: [
    "Tejhas",
    "tejhas software",
    "contact Tejhas",
    "ERP demo",
    "Tejhas ERP",
  ],
  openGraph: {
    title: "Contact Us | Tejhas",
    description:
      "Get in touch with Tejhas. Request a demo or ask us about ERP, MRP and CRM for MSMEs.",
    url: `${BASE_URL}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Tejhas",
    description: "Get in touch with Tejhas. Request a demo or ask us about ERP for MSMEs.",
  },
  alternates: { canonical: `${BASE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        Contact Us
      </h1>
      <p className="text-lg text-foreground/80 mb-12">
        Get in touch. Request a demo or tell us what you need—we will respond as soon as we can.
      </p>
      <ContactForm />
      <div className="mt-12 pt-8 border-t border-white/10 text-foreground/60 text-sm">
        Or email us directly at{" "}
        <a href="mailto:sales@tejhas.com" className="text-accent hover:underline">sales@tejhas.com</a>.
      </div>
    </div>
  );
}

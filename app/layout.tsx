import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactModalProvider } from "@/components/ContactModalContext";
import { ChatProvider } from "@/components/ChatContext";
import ChatWidget from "@/components/ChatWidget";
import JsonLd from "./JsonLd";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tejhas.com";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Tejhas | ERP for MSMEs",
  description:
    "ERP that adapts to you—not the other way around. Tejhas software: ERP, MRP and CRM for MSMEs. Built for how you actually work. Simple, efficient, adaptive.",
  keywords: [
    "Tejhas",
    "tejhas software",
    "Tejhas ERP",
    "Customized ERP",
    "Customized production management software",
    "ERP for MSMEs",
    "ERP",
    "MRP",
    "CRM",
    "material resource planning",
    "manufacturing ERP",
  ],
  openGraph: {
    title: "Tejhas | ERP for MSMEs",
    description:
      "ERP that adapts to you—not the other way around. Tejhas software: ERP, MRP and CRM for MSMEs. Built for how you actually work.",
    url: BASE_URL,
    siteName: "Tejhas",
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tejhas | ERP for MSMEs",
    description:
      "ERP that adapts to you—not the other way around. Tejhas software: ERP, MRP and CRM for MSMEs.",
  },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakarta.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <JsonLd />
        <ContactModalProvider>
          <ChatProvider>
            <Header />
            <main className="flex-1 pt-16 md:pt-20">{children}</main>
            <Footer />
            <ChatWidget />
          </ChatProvider>
        </ContactModalProvider>
      </body>
    </html>
  );
}

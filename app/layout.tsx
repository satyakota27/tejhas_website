import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactModalProvider } from "@/components/ContactModalContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tejhas | ERP for MSMEs",
  description:
    "ERP that adapts to you—not the other way around. Built for how you actually work. Simple, efficient, adaptive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakarta.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <ContactModalProvider>
          <Header />
          <main className="flex-1 pt-16 md:pt-20">{children}</main>
          <Footer />
        </ContactModalProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Hero from "@/components/Hero";
import QuoteSection from "@/components/QuoteSection";
import FeaturesCarousel from "@/components/FeaturesCarousel";
import DesignSection from "@/components/DesignSection";
import WhyTejhasSection from "@/components/WhyTejhasSection";
import FoundersSection from "@/components/FoundersSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tejhas.com";

export const metadata: Metadata = {
  title: "Tejhas | ERP, MRP & CRM for MSMEs",
  description:
    "Tejhas software: ERP that adapts to you. MRP and CRM for MSMEs. Material resource planning and manufacturing ERP built for how you actually work.",
  alternates: { canonical: BASE_URL },
};

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <QuoteSection />
      <FeaturesCarousel />
      <DesignSection />
      <WhyTejhasSection />
      <FoundersSection />
      <CTASection />
    </>
  );
}

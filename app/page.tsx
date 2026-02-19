import Hero from "@/components/Hero";
import QuoteSection from "@/components/QuoteSection";
import FeaturesCarousel from "@/components/FeaturesCarousel";
import DesignSection from "@/components/DesignSection";
import WhyTejhasSection from "@/components/WhyTejhasSection";
import FoundersSection from "@/components/FoundersSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <QuoteSection />
      <FeaturesCarousel />
      <DesignSection />
      <WhyTejhasSection />
      <FoundersSection />
      <StatsSection />
      <CTASection />
    </>
  );
}

"use client";

import Link from "next/link";
import { useContactModal } from "@/components/ContactModalContext";

export default function Hero() {
  const { openModal } = useContactModal();

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="max-w-4xl">
          <p className="text-accent font-semibold tracking-wide uppercase text-sm mb-4">
            ERP for MSME<span className="normal-case">s</span>
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Built for how you actually work.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-2xl">
            Many MSME businesses lose profitability and growth opportunities due to the lack of
            structured systems. An ERP digitises inventory, manufacturing, purchase, and sales,
            giving business owners visibility into where their organization is losing efficiency
            or money.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={openModal}
              className="btn-primary px-6 py-3.5"
            >
              Request Demo
            </button>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 hover:border-white/40 text-foreground font-semibold px-6 py-3.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,184,166,0.15),transparent)]" />
    </section>
  );
}

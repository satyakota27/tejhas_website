"use client";

import { useContactModal } from "@/components/ContactModalContext";

export default function CTASection() {
  const { openModal } = useContactModal();

  return (
    <section className="py-20 md:py-28 bg-white/[0.02] border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-accent font-bold tracking-widest uppercase text-sm mb-4">
          SIMPLE | EFFICIENT | ADAPTIVE
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
          ERP that adapts to you—not the other way around.
        </h2>
        <p className="text-foreground/70 text-lg mb-10">
          Stop wrestling with rigid software. Start making decisions with clarity.
        </p>
        <button
          type="button"
          onClick={openModal}
          className="btn-primary px-8 py-4 text-lg"
        >
          Request Demo
        </button>
      </div>
    </section>
  );
}

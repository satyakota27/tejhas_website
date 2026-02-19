"use client";

import { createContext, useContext, useState, useCallback } from "react";
import ContactForm from "./ContactForm";

type ContactModalContextType = {
  openModal: () => void;
  closeModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextType | null>(null);

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <ContactModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <div className="bg-background border border-white/10 rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <h2 id="contact-modal-title" className="text-xl font-bold text-foreground">
                Contact Us
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-foreground/70 hover:text-foreground rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-hidden flex flex-col min-h-0">
              <p className="text-foreground/80 mb-4 text-sm">
                Request a demo or get in touch. We will respond as soon as we can.
              </p>
              <ContactForm compact />
              <p className="mt-4 text-foreground/60 text-sm shrink-0">
                Or email us at{" "}
                <a href="mailto:sales@tejhas.com" className="text-accent hover:underline">
                  sales@tejhas.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  );
}

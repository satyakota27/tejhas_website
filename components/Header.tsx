"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useContactModal } from "@/components/ContactModalContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openModal } = useContactModal();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Tejhas"
              width={220}
              height={62}
              className="h-10 w-auto md:h-12"
              priority
            />
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-foreground/90 hover:text-foreground font-medium transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => { openModal(); setMobileMenuOpen(false); }}
                className="text-foreground/90 hover:text-foreground font-medium transition-colors"
              >
                Contact Us
              </button>
            </li>
          </ul>

          <button
            type="button"
            onClick={openModal}
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-accent hover:bg-accent-hover text-background font-semibold px-5 py-2.5 transition-colors"
          >
            Request Demo
          </button>

          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <ul className="flex flex-col gap-4">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block text-foreground/90 hover:text-foreground font-medium py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => { openModal(); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-foreground/90 hover:text-foreground font-medium py-1"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { openModal(); setMobileMenuOpen(false); }}
                  className="inline-flex items-center justify-center rounded-lg bg-accent hover:bg-accent-hover text-background font-semibold px-5 py-2.5 w-full"
                >
                  Request Demo
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

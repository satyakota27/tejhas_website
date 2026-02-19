"use client";

import Link from "next/link";
import Image from "next/image";
import { useContactModal } from "@/components/ContactModalContext";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
];

export default function Footer() {
  const { openModal } = useContactModal();

  return (
    <footer className="bg-black/40 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex">
              <Image
                src="/logo.png"
                alt="Tejhas"
                width={200}
                height={56}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-foreground/70 text-sm max-w-xs">
              SIMPLE | EFFICIENT | ADAPTIVE
            </p>
            <p className="text-foreground/60 text-sm max-w-sm">
              ERP that adapts to you—not the other way around.
            </p>
          </div>
          <nav>
            <ul className="flex flex-wrap gap-6">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openModal}
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-10 pt-8 border-t border-white/10 text-foreground/50 text-sm">
          &copy; {new Date().getFullYear()} Tejhas. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

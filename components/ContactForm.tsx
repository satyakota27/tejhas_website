"use client";

import { useState } from "react";

const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL || "";
const CONTACT_EMAIL = "sales@tejhas.com";

type SubmitState = "idle" | "submitting" | "success" | "error";

function buildMailtoBody(data: { name: string; email: string; phone: string; company: string; role: string; message: string }) {
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "(not provided)"}`,
    `Company: ${data.company}`,
    `Role: ${data.role || "(not provided)"}`,
    "",
    "Message:",
    data.message,
  ];
  return lines.join("\n");
}

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || "",
      company: (formData.get("company") as string) || "",
      role: (formData.get("role") as string) || "",
      message: (formData.get("message") as string) || "",
    };

    setState("submitting");
    setErrorMessage("");

    if (CONTACT_API_URL) {
      try {
        const res = await fetch(CONTACT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          setState("success");
          form.reset();
        } else {
          const json = await res.json().catch(() => ({}));
          setState("error");
          setErrorMessage(json.error || "Something went wrong. Please try again.");
        }
      } catch {
        setState("error");
        setErrorMessage("Network error. Please check your connection and try again.");
      }
      return;
    }

    // Fallback: open mailto so the message and contact details go to sales@tejhas.com
    const subject = encodeURIComponent("Tejhas website – contact / demo request");
    const body = encodeURIComponent(buildMailtoBody(data));
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    setState("success");
    form.reset();
  }

  if (state === "success") {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 text-center">
        <p className="text-accent font-semibold">Thank you for reaching out.</p>
        <p className="text-foreground/80 mt-1 text-sm">
          We will get back to you as soon as we can.
        </p>
      </div>
    );
  }

  const formClass = compact
    ? "max-w-none grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
    : "space-y-6 max-w-xl";

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Full name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
          placeholder="Work or personal email"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
          placeholder="10-digit mobile (optional)"
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1">
          Company name <span className="text-red-400">*</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          required
          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
          placeholder="Your company"
        />
      </div>
      <div className={compact ? "md:col-span-2" : ""}>
        <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
          Role / Designation
        </label>
        <input
          id="role"
          name="role"
          type="text"
          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
          placeholder="e.g. Operations Manager"
        />
      </div>
      <div className={compact ? "md:col-span-2" : ""}>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
          What do you need help with? <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={compact ? 3 : 4}
          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y text-sm"
          placeholder="Tell us about your requirements or questions"
        />
      </div>
      {state === "error" && (
        <p className={`text-red-400 text-sm ${compact ? "md:col-span-2" : ""}`}>{errorMessage}</p>
      )}
      <div className={compact ? "md:col-span-2" : ""}>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full md:w-auto inline-flex items-center justify-center rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-sm"
        >
          {state === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

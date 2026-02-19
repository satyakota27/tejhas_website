"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useChat } from "@/components/ChatContext";
import { useContactModal } from "@/components/ContactModalContext";

type Message = {
  role: "bot" | "user";
  content: string;
  choices?: { id: string; label: string }[];
};

const AREAS = [
  { id: "inventory", label: "Inventory management" },
  { id: "sales", label: "Sales management" },
  { id: "production", label: "Production management" },
] as const;

const AREA_RESPONSES: Record<string, string> = {
  inventory:
    "Tejhas digitizes and customizes your inventory so you get real-time stock visibility, reorder points, and workflows that fit your warehouses and locations. You can track materials, finished goods, and multiple sites from one place.",
  sales:
    "Tejhas streamlines sales with customized pipelines, order management, and CRM so you can track opportunities and close deals without spreadsheets. Quotes, orders, and customer history stay in one system.",
  production:
    "Tejhas digitizes production management with scheduling, shop-floor tracking, and bills of materials tailored to how you manufacture. You get visibility into capacity, work in progress, and delivery timelines.",
};

const INITIAL_MESSAGES: Message[] = [
  {
    role: "bot",
    content:
      "Hi! Tejhas helps MSMEs digitize and customize inventory, sales, and production. What would you like to improve?",
    choices: AREAS.map((a) => ({ id: a.id, label: a.label })),
  },
];

export default function ChatWidget() {
  const { isOpen, openChat, closeChat } = useChat();
  const { openModal: openContactModal } = useContactModal();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [step, setStep] = useState<"asked_focus" | "answered" | "cta">("asked_focus");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages(INITIAL_MESSAGES);
      setStep("asked_focus");
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    if (isOpen) {
      window.addEventListener("keydown", onEscape);
      return () => window.removeEventListener("keydown", onEscape);
    }
  }, [isOpen, closeChat]);

  const handleChoice = (id: string, label: string) => {
    if (step === "asked_focus") {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: label },
        { role: "bot", content: AREA_RESPONSES[id] ?? "" },
        {
          role: "bot",
          content: "Want to see how this works for you?",
          choices: [
            { id: "demo", label: "Request Demo" },
            { id: "about", label: "More about Tejhas" },
          ],
        },
      ]);
      setStep("cta");
    } else if (step === "cta") {
      if (id === "demo") {
        openContactModal();
        closeChat();
      }
      if (id === "about") {
        closeChat();
      }
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setStep("asked_focus");
  };

  return (
    <>
      {/* Floating button - only when chat is closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-lg transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-[90] flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-background shadow-xl sm:bottom-24 sm:right-6 sm:max-h-[80vh]"
          style={{ height: "min(80vh, 520px)" }}
          role="dialog"
          aria-label="Chat"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 shrink-0">
            <span className="font-semibold text-foreground">Tejhas</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg p-2 text-foreground/70 hover:bg-white/10 hover:text-foreground"
                aria-label="Reset chat"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="rounded-lg p-2 text-foreground/70 hover:bg-white/10 hover:text-foreground"
                aria-label="Close chat"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "flex justify-end" : ""}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-accent/20 px-4 py-2 text-foreground"
                      : "max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.03] px-4 py-2 text-foreground/90"
                  }
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.choices && msg.choices.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.choices.map((c) =>
                        c.id === "about" ? (
                          <Link
                            key={c.id}
                            href="/about"
                            onClick={() => closeChat()}
                            className="inline-flex rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-foreground hover:bg-white/10"
                          >
                            {c.label}
                          </Link>
                        ) : (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleChoice(c.id, c.label)}
                            className="inline-flex rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/20 hover:border-accent/40"
                          >
                            {c.label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </>
  );
}

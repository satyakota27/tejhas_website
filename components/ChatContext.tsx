"use client";

import { createContext, useContext, useState, useCallback } from "react";

type ChatContextType = {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

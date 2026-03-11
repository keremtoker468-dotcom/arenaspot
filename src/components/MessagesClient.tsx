"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, Profile, Message } from "@/lib/types/database";

type ConversationWithProfile = Conversation & {
  otherUser: Profile;
};

interface MessagesClientProps {
  conversations: ConversationWithProfile[];
  userId: string;
}

export default function MessagesClient({
  conversations,
  userId,
}: MessagesClientProps) {
  const [activeConvo, setActiveConvo] = useState<ConversationWithProfile | null>(
    conversations[0] ?? null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  useEffect(() => {
    if (!activeConvo) return;

    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", activeConvo.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages((data ?? []) as Message[]);
        scrollToBottom();
      });

    const channel = supabase
      .channel(`msgs:${activeConvo.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConvo.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvo?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      bodyRef.current?.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const sendMsg = async () => {
    if (!input.trim() || !activeConvo) return;
    const content = input.trim();
    setInput("");

    await supabase.from("messages").insert({
      conversation_id: activeConvo.id,
      sender_id: userId,
      content,
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  if (conversations.length === 0) {
    return (
      <div className="rounded-[12px] border border-border bg-white p-16 text-center">
        <div className="mb-3 text-4xl">💬</div>
        <p className="text-lg font-bold">Henüz mesajın yok</p>
        <p className="mt-1 font-body text-sm text-muted">
          Sporcuları keşfet ve ilk mesajını gönder!
        </p>
      </div>
    );
  }

  return (
    <div className="grid h-[600px] grid-cols-[300px_1fr] overflow-hidden rounded-[12px] border border-border bg-white">
      {/* Conversation list */}
      <div className="overflow-y-auto border-r border-border">
        {conversations.map((c) => (
          <div
            key={c.id}
            className={`flex cursor-pointer items-center gap-3 border-b border-border p-4 transition-colors hover:bg-surface ${
              activeConvo?.id === c.id ? "bg-accent-light" : ""
            }`}
            onClick={() => setActiveConvo(c)}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[9px] border-[1.5px] border-accent-border bg-accent-light text-[13px] font-black text-accent">
              {getInitials(c.otherUser.full_name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold">
                {c.otherUser.full_name}
              </div>
              <div className="font-body text-[12px] text-faint">
                {c.type === "job_offer"
                  ? "💼 İş birliği"
                  : c.type === "sparring"
                    ? "🥊 Sparring"
                    : "💬 Mesaj"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat area */}
      {activeConvo ? (
        <div className="flex flex-col">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] border-[1.5px] border-accent-border bg-accent-light text-[12px] font-black text-accent">
              {getInitials(activeConvo.otherUser.full_name)}
            </div>
            <div>
              <div className="text-sm font-bold">
                {activeConvo.otherUser.full_name}
              </div>
              <div className="font-body text-[11px] text-faint">
                @{activeConvo.otherUser.username}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto p-4">
            {messages.map((m) => {
              const isMe = m.sender_id === userId;
              return (
                <div
                  key={m.id}
                  className={`mb-3 flex ${isMe ? "justify-end" : ""}`}
                >
                  <div>
                    <div
                      className={`max-w-[320px] rounded-[12px] px-[13px] py-[9px] font-body text-[13px] leading-[1.5] ${
                        isMe
                          ? "rounded-br-[3px] bg-accent text-white"
                          : "rounded-bl-[3px] bg-surface text-foreground"
                      }`}
                    >
                      {m.content}
                    </div>
                    <div className="mt-[2px] text-right text-[10px] text-faint">
                      {formatTime(m.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-border p-4">
            <input
              className="flex-1 rounded-[7px] border border-border px-3 py-2 font-body text-[13px] outline-none transition-colors focus:border-accent"
              placeholder="Mesaj yaz..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            />
            <button
              onClick={sendMsg}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[7px] bg-accent text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                <path d="M1 1l12 6-12 6V8.5l8-1.5-8-1.5V1z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <p className="font-body text-sm text-faint">
            Bir konuşma seç
          </p>
        </div>
      )}
    </div>
  );
}

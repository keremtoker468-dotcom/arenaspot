"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Message } from "@/lib/types/database";

interface ChatPanelProps {
  chat: {
    id: string;
    name: string;
    avatar: string;
    type: "fighter" | "pt";
    style?: string;
    city?: string;
  };
  onClose: () => void;
  user: User | null;
}

export default function ChatPanel({ chat, onClose, user }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;
    findOrCreateConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, chat.id]);

  useEffect(() => {
    if (!conversationId) return;

    // Fetch existing messages
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages((data ?? []) as Message[]);
        scrollToBottom();
      });

    // Subscribe to realtime
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
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
  }, [conversationId]);

  const findOrCreateConversation = async () => {
    if (!user) return;

    // Try to find existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .or(
        `and(participant_1.eq.${user.id},participant_2.eq.${chat.id}),and(participant_1.eq.${chat.id},participant_2.eq.${user.id})`
      )
      .single();

    if (existing) {
      setConversationId(existing.id);
      return;
    }

    // Create new conversation
    const convType =
      chat.type === "pt" ? "job_offer" : "general";
    const { data: newConv } = await supabase
      .from("conversations")
      .insert({
        participant_1: user.id,
        participant_2: chat.id,
        type: convType,
      })
      .select("id")
      .single();

    if (newConv) setConversationId(newConv.id);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      bodyRef.current?.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const sendMsg = async () => {
    if (!input.trim() || !user || !conversationId) return;

    const content = input.trim();
    setInput("");

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] w-[360px] overflow-hidden rounded-[14px] border border-border bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
      {/* Header */}
      <div className="flex items-center justify-between bg-foreground p-[14px_18px]">
        <div className="flex items-center gap-[10px]">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent-light text-[12px] font-extrabold text-accent">
            {chat.avatar}
          </div>
          <div>
            <div className="text-sm font-extrabold text-white">{chat.name}</div>
            <div className="font-body text-[11px] text-[#888]">
              {chat.type === "pt"
                ? `👤 PT · ${chat.city || ""}`
                : `${chat.style || ""} · ${chat.city || ""}`}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent text-[20px] leading-none text-[#888] transition-colors hover:text-white"
        >
          ×
        </button>
      </div>

      {/* PT banner */}
      {chat.type === "pt" && (
        <div className="border-b border-accent-border bg-accent-light p-[8px_14px] font-body text-[11px] font-bold text-accent">
          💼 İş birliği teklifi gönderiyorsunuz
        </div>
      )}

      {/* Messages */}
      <div ref={bodyRef} className="h-[280px] overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((m) => {
            const isMe = m.sender_id === user?.id;
            return (
              <div
                key={m.id}
                className={`mb-[10px] flex ${isMe ? "justify-end" : ""}`}
              >
                <div>
                  <div
                    className={`max-w-[75%] rounded-[12px] px-[13px] py-[9px] font-body text-[13px] leading-[1.5] ${
                      isMe
                        ? "rounded-br-[3px] bg-accent text-white"
                        : "rounded-bl-[3px] bg-surface text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                  <div className="mt-[3px] text-right text-[10px] text-faint">
                    {formatTime(m.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="pt-10 text-center">
            <div className="mb-2 text-[28px]">
              {chat.type === "pt" ? "💼" : "💬"}
            </div>
            <p className="font-body text-[13px] text-faint">
              {chat.type === "pt"
                ? "İş teklifini gönder!"
                : "Konuşmayı sen başlat!"}
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-border p-[12px_14px]">
        <input
          className="flex-1 rounded-[7px] border border-border px-3 py-2 font-body text-[13px] outline-none transition-colors focus:border-accent"
          placeholder={
            chat.type === "pt" ? "İş teklifi yaz..." : "Mesaj yaz..."
          }
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
  );
}

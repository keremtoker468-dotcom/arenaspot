"use client";

import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types/database";
import type { AppRole } from "@/lib/types/app";
import { motion } from "motion/react";
import FollowButton from "@/components/FollowButton";
import { MapPin, Users, MessageSquare } from "lucide-react";

interface AthleteCardProps {
  athlete: Profile;
  role: AppRole | null;
  onSelect: () => void;
  onMessage: () => void;
  user: User | null;
}

export default function AthleteCard({
  athlete,
  role,
  onSelect,
  onMessage,
}: AthleteCardProps) {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-[12px] border border-border bg-white p-5"
      onClick={onSelect}
      whileHover={{
        y: -4,
        borderColor: "#e63946",
        boxShadow: "0 8px 28px rgba(230, 57, 70, 0.10)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Accent bar - animated */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-[3px] bg-accent origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Header */}
      <div className="mb-[14px] flex items-start justify-between">
        <div className="flex items-center gap-[11px]">
          <div className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-[11px] border-[1.5px] border-accent-border bg-accent-light text-[15px] font-black text-accent">
            {getInitials(athlete.full_name)}
          </div>
          <div>
            <div className="flex items-center gap-[7px]">
              <span className="text-[17px] font-extrabold">
                {athlete.full_name}
              </span>
              {athlete.is_verified && (
                <span className="rounded-[4px] bg-accent px-[6px] py-[2px] text-[9px] font-extrabold tracking-[1px] text-white">
                  PRO
                </span>
              )}
            </div>
            <div className="mt-[1px] font-body text-[12px] text-faint">
              @{athlete.username}
            </div>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <FollowButton athleteId={athlete.id} />
        </div>
      </div>

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-[6px]">
        {athlete.fight_style && (
          <span className="inline-block rounded-[5px] border border-accent-border bg-accent-light px-[9px] py-[3px] text-[12px] font-bold text-accent">
            {athlete.fight_style}
          </span>
        )}
        {athlete.weight_class && (
          <span className="inline-block rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
            {athlete.weight_class}
          </span>
        )}
        {athlete.city && (
          <span className="inline-flex items-center gap-1 rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
            <MapPin size={10} />
            {athlete.city}
          </span>
        )}
      </div>

      {/* Record */}
      <div className="mb-3 flex gap-[6px]">
        <div className="flex-1 rounded-[7px] bg-[#f0fdf4] p-[8px_4px] text-center">
          <div className="text-[22px] font-black leading-none text-[#16a34a]">
            {athlete.record_w}
          </div>
          <div className="mt-[2px] text-[10px] font-bold tracking-[1px] text-[#16a34a]">
            WIN
          </div>
        </div>
        <div className="flex-1 rounded-[7px] bg-accent-light p-[8px_4px] text-center">
          <div className="text-[22px] font-black leading-none text-accent">
            {athlete.record_l}
          </div>
          <div className="mt-[2px] text-[10px] font-bold tracking-[1px] text-accent">
            LOSS
          </div>
        </div>
        <div className="flex-1 rounded-[7px] bg-surface p-[8px_4px] text-center">
          <div className="text-[22px] font-black leading-none text-faint">
            {athlete.record_d}
          </div>
          <div className="mt-[2px] text-[10px] font-bold tracking-[1px] text-faint">
            DRAW
          </div>
        </div>
      </div>

      {/* Bio */}
      {athlete.bio && (
        <p className="mb-3 font-body text-[13px] leading-[1.5] text-muted">
          {athlete.bio}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-[10px]">
        <span className="inline-flex items-center gap-1 font-body text-[12px] text-faint">
          <Users size={12} />
          {athlete.followers_count.toLocaleString()}
        </span>
        {(role === "athlete" || role === "coach") && (
          <button
            className="inline-flex items-center gap-[5px] rounded-[6px] bg-foreground px-3 py-[5px] font-heading text-[11px] font-extrabold text-white transition-colors hover:bg-[#333]"
            onClick={(e) => {
              e.stopPropagation();
              onMessage();
            }}
          >
            <MessageSquare size={11} />
            {role === "coach" ? "Iletisim" : "Mesaj At"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

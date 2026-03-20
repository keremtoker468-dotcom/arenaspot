"use client";

import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types/database";
import type { AppRole } from "@/lib/types/app";
import { motion } from "motion/react";
import FollowButton from "@/components/FollowButton";
import { Users, MessageCircle } from "lucide-react";

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

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return count.toString();
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
      whileTap={{ opacity: 0.9 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Accent bar - animated */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-[3px] origin-left bg-accent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Header */}
      <div className="mb-[14px] flex items-center gap-[11px]">
        <div className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent-border bg-accent-light text-[15px] font-black text-accent">
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
          <span className="inline-block rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
            {athlete.city}
          </span>
        )}
      </div>

      {/* Record - inline format */}
      <div className="mb-3 flex items-center gap-[14px]">
        <div className="flex items-baseline gap-[5px]">
          <span className="text-[20px] font-black leading-none text-[#16a34a]">
            {athlete.record_w}
          </span>
          <span className="text-[11px] font-bold tracking-[1px] text-[#16a34a]">
            WIN
          </span>
        </div>
        <div className="flex items-baseline gap-[5px]">
          <span className="text-[20px] font-black leading-none text-accent">
            {athlete.record_l}
          </span>
          <span className="text-[11px] font-bold tracking-[1px] text-accent">
            LOSS
          </span>
        </div>
        <div className="flex items-baseline gap-[5px]">
          <span className="text-[20px] font-black leading-none text-faint">
            {athlete.record_d}
          </span>
          <span className="text-[11px] font-bold tracking-[1px] text-faint">
            DRAW
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-[10px]">
        <span className="inline-flex items-center gap-1 font-body text-[12px] text-faint">
          <Users size={12} />
          {formatFollowers(athlete.followers_count)}
        </span>
        <div className="flex items-center gap-[8px]" onClick={(e) => e.stopPropagation()}>
          <FollowButton athleteId={athlete.id} variant="card" />
          {(role === "athlete" || role === "coach") && (
            <button
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
              onClick={(e) => {
                e.stopPropagation();
                onMessage();
              }}
            >
              <MessageCircle size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import FollowButton from "@/components/FollowButton";
import { useApp } from "@/components/ChatProvider";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Users,
  User,
  Briefcase,
} from "lucide-react";

export default function CoachesDiscoverPage() {
  const router = useRouter();
  const { openChat } = useApp();
  const [coaches, setCoaches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const supabase = createClient();

  const fetchCoaches = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("*")
      .eq("role", "pt")
      .order("followers_count", { ascending: false });

    if (search)
      query = query.or(
        `full_name.ilike.%${search}%,username.ilike.%${search}%`
      );

    const { data } = await query;
    setCoaches((data ?? []) as Profile[]);
    setLoading(false);
  }, [search, supabase]);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-[28px] lg:px-10">
      <div className="mb-4">
        <h2 className="mb-1 text-[28px] font-black tracking-[-0.5px] sm:text-[36px]">
          Koçlar
        </h2>
        <p className="font-body text-sm text-black">
          Deneyimli antrenörler ve personal trainerlar ile çalış.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          className="w-full rounded-[8px] border border-border py-[10px] pl-9 pr-[14px] font-body text-sm outline-none transition-colors focus:border-accent"
          placeholder="Koç ara... (İsim veya kullanıcı adı)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-4 text-[13px] font-semibold text-faint">
        {loading ? "Yükleniyor..." : `${coaches.length} koç bulundu`}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeletons"
            className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {coaches.map((coach) => (
              <motion.div
                key={coach.id}
                className="group relative cursor-pointer overflow-hidden rounded-[12px] border border-border bg-white p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -4,
                  borderColor: "#e63946",
                  boxShadow: "0 8px 28px rgba(230, 57, 70, 0.10)",
                }}
                whileTap={{ opacity: 0.9 }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}
                onClick={() => router.push(`/trainer/${coach.username}`)}
              >
                {/* Accent bar */}
                <motion.div
                  className="absolute left-0 right-0 top-0 h-[3px] origin-left bg-accent"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                />

                {/* Header */}
                <div className="mb-[14px] flex items-center gap-[11px]">
                  <div className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent-border bg-accent-light text-[15px] font-black text-accent">
                    {getInitials(coach.full_name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-[7px]">
                      <span className="text-[17px] font-extrabold">
                        {coach.full_name}
                      </span>
                      {coach.is_verified && (
                        <span className="rounded-[4px] bg-accent px-[6px] py-[2px] text-[9px] font-extrabold tracking-[1px] text-white">
                          PRO
                        </span>
                      )}
                    </div>
                    <div className="mt-[1px] font-body text-[12px] text-faint">
                      {coach.workplace || "Freelance"}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-[6px]">
                  <span className="inline-flex items-center gap-1 rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                    <User size={11} />
                    Personal Trainer
                  </span>
                  {coach.fight_style?.split(",").map((s) => (
                    <span
                      key={s}
                      className="inline-block rounded-[5px] border border-accent-border bg-accent-light px-[9px] py-[3px] text-[12px] font-bold text-accent"
                    >
                      {s.trim()}
                    </span>
                  ))}
                  {coach.city && (
                    <span className="inline-flex items-center gap-1 rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                      <MapPin size={11} />
                      {coach.city}
                    </span>
                  )}
                </div>

                {/* Bio */}
                {coach.bio && (
                  <p className="mb-[14px] line-clamp-2 font-body text-[13px] leading-[1.5] text-muted">
                    {coach.bio}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border pt-[10px]">
                  <span className="inline-flex items-center gap-1 font-body text-[12px] text-faint">
                    <Users size={12} />
                    {coach.followers_count} takipçi
                  </span>
                  <div className="flex items-center gap-[8px]" onClick={(e) => e.stopPropagation()}>
                    <FollowButton athleteId={coach.id} variant="card" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openChat({
                          id: coach.id,
                          name: coach.full_name,
                          avatar: getInitials(coach.full_name),
                          type: "pt",
                          city: coach.city || undefined,
                        });
                      }}
                      className="inline-flex items-center gap-[5px] rounded-[6px] bg-foreground px-[13px] py-[6px] font-heading text-[12px] font-extrabold text-white transition-colors hover:bg-[#333]"
                    >
                      <Briefcase size={12} />
                      İş Teklifi
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

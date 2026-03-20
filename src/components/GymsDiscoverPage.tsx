"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import FollowButton from "@/components/FollowButton";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Users,
  Building2,
} from "lucide-react";

export default function GymsDiscoverPage() {
  const router = useRouter();
  const [gyms, setGyms] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const supabase = createClient();

  const fetchGyms = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("*")
      .eq("role", "gym")
      .order("followers_count", { ascending: false });

    if (search)
      query = query.or(
        `full_name.ilike.%${search}%,gym_name.ilike.%${search}%,username.ilike.%${search}%`
      );

    const { data } = await query;
    setGyms((data ?? []) as Profile[]);
    setLoading(false);
  }, [search, supabase]);

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

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
          Spor Salonları
        </h2>
        <p className="font-body text-sm text-black">
          Türkiye ve MENA bölgesindeki dövüş sporu salonlarını keşfet.
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
          placeholder="Salon ara... (İsim veya kullanıcı adı)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-4 text-[13px] font-semibold text-faint">
        {loading ? "Yükleniyor..." : `${gyms.length} salon bulundu`}
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
            {gyms.map((gym) => (
              <motion.div
                key={gym.id}
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
                onClick={() => router.push(`/gym/${gym.username}`)}
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
                    {getInitials(gym.gym_name || gym.full_name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-[7px]">
                      <span className="text-[17px] font-extrabold">
                        {gym.gym_name || gym.full_name}
                      </span>
                      {gym.is_verified && (
                        <span className="rounded-[4px] bg-accent px-[6px] py-[2px] text-[9px] font-extrabold tracking-[1px] text-white">
                          PRO
                        </span>
                      )}
                    </div>
                    <div className="mt-[1px] font-body text-[12px] text-faint">
                      @{gym.username}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-[6px]">
                  <span className="inline-flex items-center gap-1 rounded-[5px] border border-accent-border bg-accent-light px-[9px] py-[3px] text-[12px] font-bold text-accent">
                    <Building2 size={11} />
                    Spor Salonu
                  </span>
                  {gym.city && (
                    <span className="inline-flex items-center gap-1 rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                      <MapPin size={11} />
                      {gym.city}
                    </span>
                  )}
                </div>

                {/* Bio */}
                {gym.bio && (
                  <p className="mb-[14px] line-clamp-2 font-body text-[13px] leading-[1.5] text-muted">
                    {gym.bio}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border pt-[10px]">
                  <span className="inline-flex items-center gap-1 font-body text-[12px] text-faint">
                    <Users size={12} />
                    {gym.followers_count} takipçi
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <FollowButton athleteId={gym.id} variant="card" />
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

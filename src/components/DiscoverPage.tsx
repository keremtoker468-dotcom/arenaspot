"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import AthleteCard from "@/components/AthleteCard";
import FollowButton from "@/components/FollowButton";
import CoachTypeSelect from "@/components/CoachTypeSelect";
import { useApp } from "@/components/ChatProvider";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  Search,
  Briefcase,
  User,
  MapPin,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react";

const STYLES_F = ["MMA", "Striker", "Grappler"];
const WEIGHTS_F = [
  "Flyweight",
  "Bantamweight",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight",
];

export default function DiscoverPage() {
  const { role, coachType, openChat, user, setCoachType } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const showCoachSelect = searchParams.get("coachselect") === "1";

  const [discoverTab, setDiscoverTab] = useState<"athletes" | "pts">(
    "athletes"
  );
  const [fStyle, setFStyle] = useState("");
  const [fWeight, setFWeight] = useState("");
  const [proOnly, setProOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState<Profile[]>([]);
  const [pts, setPts] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const supabase = createClient();

  const fetchAthletes = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("*")
      .eq("role", "athlete")
      .order("followers_count", { ascending: false });

    if (fStyle) query = query.eq("fight_style", fStyle);
    if (fWeight) query = query.eq("weight_class", fWeight);
    if (proOnly) query = query.eq("is_verified", true);
    if (search)
      query = query.or(
        `full_name.ilike.%${search}%,username.ilike.%${search}%`
      );

    const { data } = await query;
    setAthletes((data ?? []) as Profile[]);
    setLoading(false);
  }, [fStyle, fWeight, proOnly, search, supabase]);

  const fetchPTs = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "pt")
      .order("followers_count", { ascending: false });
    setPts((data ?? []) as Profile[]);
  }, [supabase]);

  useEffect(() => {
    fetchAthletes();
    if (role === "coach" && coachType === "gym") fetchPTs();
  }, [fetchAthletes, fetchPTs, role, coachType]);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  if (showCoachSelect && role === "coach" && !coachType) {
    return (
      <CoachTypeSelect
        onSelect={(type) => {
          setCoachType(type);
          router.replace("/discover");
        }}
      />
    );
  }

  const activeFilterCount = [fStyle !== "", fWeight !== "", proOnly].filter(
    Boolean
  ).length;

  const filterSidebar = (
    <div className="p-[28px_0]">
      <div className="mb-1 text-[13px] font-extrabold uppercase tracking-[2px] text-foreground">
        Filtreler
      </div>
      <div className="mb-6 font-body text-[12px] text-faint">
        Sporcu aramak için filtrele
      </div>

      {/* PRO filter */}
      <label className="mb-6 flex cursor-pointer items-center gap-[10px]">
        <input
          type="checkbox"
          checked={proOnly}
          onChange={(e) => setProOnly(e.target.checked)}
          className="h-[16px] w-[16px] rounded border-border accent-accent"
        />
        <span className="font-body text-[13px] font-semibold text-foreground">
          Sadece PRO Sporcular
        </span>
      </label>

      <div className="mb-6">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-foreground">
          Dövüş Stili
        </div>
        {STYLES_F.map((s) => (
          <button
            key={s}
            onClick={() => setFStyle(fStyle === s ? "" : s)}
            className={`block w-full rounded-[6px] bg-transparent px-[10px] py-[7px] text-left font-body text-[14px] font-semibold transition-all ${
              fStyle === s
                ? "bg-accent-light font-bold text-accent"
                : "text-foreground/70 hover:bg-surface hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-foreground">
          Kilo Sınıfı
        </div>
        {WEIGHTS_F.map((w) => (
          <button
            key={w}
            onClick={() => setFWeight(fWeight === w ? "" : w)}
            className={`block w-full rounded-[6px] bg-transparent px-[10px] py-[7px] text-left font-body text-[14px] font-semibold transition-all ${
              fWeight === w
                ? "bg-accent-light font-bold text-accent"
                : "text-foreground/70 hover:bg-surface hover:text-foreground"
            }`}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
      {/* Mobile filter toggle */}
      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="mt-4 flex items-center gap-2 rounded-[8px] border border-border px-4 py-[9px] font-heading text-[13px] font-bold text-muted transition-all hover:bg-surface lg:hidden"
      >
        <SlidersHorizontal size={14} />
        Filtreler
        {activeFilterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <div className="fixed inset-0 z-[150] lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-[16px] bg-white px-6 pb-6 shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex items-center justify-between py-4">
                <span className="text-[15px] font-black">Filtreler</span>
                <button onClick={() => setFiltersOpen(false)}>
                  <X size={20} className="text-muted" />
                </button>
              </div>
              {filterSidebar}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[240px_1fr]">
        {/* Desktop sidebar */}
        <div className="hidden border-r border-border pr-[28px] lg:block">
          {filterSidebar}
        </div>

        {/* Main */}
        <div className="py-[28px] lg:pl-[32px]">
          <div className="mb-4">
            <h2 className="mb-1 text-[28px] font-black tracking-[-0.5px] sm:text-[36px]">
              Sporcu Keşfet
            </h2>
            <p className="font-body text-sm text-black">
              Türkiye ve MENA bölgesindeki dövüş sporcularını keşfet. Sparring
              partneri bul, takip et, mesajlaş.
            </p>
          </div>

          {/* Gym tabs */}
          {role === "coach" && coachType === "gym" && (
            <div className="mb-6 flex gap-0 border-b border-border">
              <button
                className={`border-b-2 px-5 py-[10px] font-heading text-sm font-bold tracking-[0.5px] transition-all ${
                  discoverTab === "athletes"
                    ? "border-accent text-foreground"
                    : "border-transparent text-faint hover:text-foreground"
                }`}
                onClick={() => setDiscoverTab("athletes")}
              >
                Sporcular
              </button>
              <button
                className={`flex items-center gap-[6px] border-b-2 px-5 py-[10px] font-heading text-sm font-bold tracking-[0.5px] transition-all ${
                  discoverTab === "pts"
                    ? "border-accent text-foreground"
                    : "border-transparent text-faint hover:text-foreground"
                }`}
                onClick={() => setDiscoverTab("pts")}
              >
                PT&apos;ler
                <span className="rounded-[10px] bg-accent px-[6px] py-[1px] text-[10px] font-bold text-white">
                  İş Birliği
                </span>
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-5">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              className="w-full rounded-[8px] border border-border py-[10px] pl-9 pr-[14px] font-body text-sm outline-none transition-colors focus:border-accent"
              placeholder={
                discoverTab === "pts"
                  ? "PT ara..."
                  : "Sporcu ara... (İsim veya kullanıcı adı)"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* PT List (gym only) */}
          {role === "coach" && coachType === "gym" && discoverTab === "pts" && (
            <div>
              <div className="mb-4 text-[13px] font-semibold text-faint">
                {pts.length} PT bulundu
              </div>
              <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-3">
                {pts.map((pt) => (
                  <motion.div
                    key={pt.id}
                    className="relative cursor-pointer overflow-hidden rounded-[12px] border border-border bg-white p-5"
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
                      delay: 0,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}
                    onClick={() => router.push(`/trainer/${pt.username}`)}
                  >
                    <div className="mb-[14px] flex items-center gap-[11px]">
                      <div className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-accent-border bg-accent-light text-[15px] font-black text-accent">
                        {getInitials(pt.full_name)}
                      </div>
                      <div>
                        <div className="text-[17px] font-extrabold">
                          {pt.full_name}
                        </div>
                        <div className="mt-[1px] font-body text-[12px] text-faint">
                          {pt.workplace || "Freelance"}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-[6px]">
                      <span className="inline-flex items-center gap-1 rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                        <User size={11} />
                        Personal Trainer
                      </span>
                      {pt.fight_style?.split(",").map((s) => (
                        <span
                          key={s}
                          className="inline-block rounded-[5px] border border-accent-border bg-accent-light px-[9px] py-[3px] text-[12px] font-bold text-accent"
                        >
                          {s.trim()}
                        </span>
                      ))}
                      {pt.city && (
                        <span className="inline-flex items-center gap-1 rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                          <MapPin size={11} />
                          {pt.city}
                        </span>
                      )}
                    </div>

                    <p className="mb-[14px] font-body text-[13px] leading-[1.5] text-muted">
                      {pt.bio}
                    </p>

                    <div className="flex items-center justify-between border-t border-border pt-[10px]">
                      <span className="inline-flex items-center gap-1 font-body text-[12px] text-faint">
                        <Users size={12} />
                        {pt.followers_count} takipçi
                      </span>
                      <div className="flex items-center gap-[8px]" onClick={(e) => e.stopPropagation()}>
                        <FollowButton athleteId={pt.id} variant="card" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openChat({
                              id: pt.id,
                              name: pt.full_name,
                              avatar: getInitials(pt.full_name),
                              type: "pt",
                              city: pt.city || undefined,
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
              </div>
            </div>
          )}

          {/* Athlete List */}
          {discoverTab === "athletes" && (
            <div>
              <div className="mb-4 text-[13px] font-semibold text-faint">
                {loading
                  ? "Yükleniyor..."
                  : `${athletes.length} sporcu bulundu`}
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
                    {athletes.map((f) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <AthleteCard
                          athlete={f}
                          role={role}
                          onSelect={() =>
                            router.push(`/athlete/${f.username}`)
                          }
                          onMessage={() =>
                            openChat({
                              id: f.id,
                              name: f.full_name,
                              avatar: getInitials(f.full_name),
                              type: "fighter",
                              style: f.fight_style || undefined,
                              city: f.city || undefined,
                            })
                          }
                          user={user}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

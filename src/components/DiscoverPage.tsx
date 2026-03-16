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

const STYLES_F = ["All", "MMA", "Boks", "Kickboks", "Muay Thai"];
const CITIES_F = ["All", "Istanbul", "Ankara", "Izmir", "Bursa"];
const WEIGHTS_F = [
  "All",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
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
  const [fStyle, setFStyle] = useState("All");
  const [fCity, setFCity] = useState("All");
  const [fWeight, setFWeight] = useState("All");
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

    if (fStyle !== "All") query = query.eq("fight_style", fStyle);
    if (fCity !== "All") query = query.eq("city", fCity);
    if (fWeight !== "All") query = query.eq("weight_class", fWeight);
    if (search)
      query = query.or(
        `full_name.ilike.%${search}%,username.ilike.%${search}%`
      );

    const { data } = await query;
    setAthletes((data ?? []) as Profile[]);
    setLoading(false);
  }, [fStyle, fCity, fWeight, search, supabase]);

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

  const filterSidebar = (
    <div className="p-[28px_0]">
      <div className="mb-5 text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
        Filtreler
      </div>

      <div className="mb-6">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-faint">
          Stil
        </div>
        {STYLES_F.map((s) => (
          <button
            key={s}
            onClick={() => setFStyle(s)}
            className={`block w-full rounded-[6px] bg-transparent px-[10px] py-[7px] text-left font-heading text-sm font-semibold transition-all ${
              fStyle === s
                ? "bg-accent-light font-bold text-accent"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-faint">
          Sehir
        </div>
        {CITIES_F.map((c) => (
          <button
            key={c}
            onClick={() => setFCity(c)}
            className={`block w-full rounded-[6px] bg-transparent px-[10px] py-[7px] text-left font-heading text-sm font-semibold transition-all ${
              fCity === c
                ? "bg-accent-light font-bold text-accent"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-faint">
          Kilo Sinifi
        </div>
        {WEIGHTS_F.map((w) => (
          <button
            key={w}
            onClick={() => setFWeight(w)}
            className={`block w-full rounded-[6px] bg-transparent px-[10px] py-[7px] text-left font-heading text-[13px] font-semibold transition-all ${
              fWeight === w
                ? "bg-accent-light font-bold text-accent"
                : "text-muted hover:bg-surface hover:text-foreground"
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
        {(fStyle !== "All" || fCity !== "All" || fWeight !== "All") && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
            {[fStyle !== "All", fCity !== "All", fWeight !== "All"].filter(Boolean).length}
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
              {role === "athlete"
                ? "Sporcu Kesfet"
                : role === "fan"
                  ? "Dovusculeri Kesfet"
                  : "Sporculari Kesfet"}
            </h2>
            <p className="font-body text-sm text-muted">
              {role === "athlete"
                ? "Sparring partneri bul, rakiplerini tani."
                : role === "fan"
                  ? "Favori sporcularini takip et."
                  : coachType === "gym"
                    ? "Yetenekli sporculari bul. PT'lerle is birligi yap."
                    : "Yetenekli sporculari bul ve onlara ulas."}
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
                  Is Birligi
                </span>
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-5">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input
              className="w-full rounded-[8px] border border-border py-[10px] pl-9 pr-[14px] font-body text-sm outline-none transition-colors focus:border-accent"
              placeholder={
                discoverTab === "pts" ? "PT ara..." : "Sporcu ara..."
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
                {pts.map((pt, index) => (
                  <motion.div
                    key={pt.id}
                    className="relative overflow-hidden rounded-[12px] border border-border bg-white p-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                      y: -4,
                      borderColor: "#e63946",
                      boxShadow: "0 8px 28px rgba(230, 57, 70, 0.10)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.05,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" }}
                  >
                    <div className="mb-[14px] flex items-start justify-between">
                      <div className="flex items-center gap-[11px]">
                        <div className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-[11px] border-[1.5px] border-accent-border bg-accent-light text-[15px] font-black text-accent">
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
                      <FollowButton athleteId={pt.id} />
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
                        {pt.followers_count} takipci
                      </span>
                      <button
                        onClick={() =>
                          openChat({
                            id: pt.id,
                            name: pt.full_name,
                            avatar: getInitials(pt.full_name),
                            type: "pt",
                            city: pt.city || undefined,
                          })
                        }
                        className="inline-flex items-center gap-[5px] rounded-[6px] bg-foreground px-[13px] py-[6px] font-heading text-[12px] font-extrabold text-white transition-colors hover:bg-[#333]"
                      >
                        <Briefcase size={12} />
                        Is Teklifi
                      </button>
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
                  ? "Yukleniyor..."
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
                        transition={{ duration: 0.25, delay: i * 0.04 }}
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
                    {athletes.map((f, index) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: index * 0.05,
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

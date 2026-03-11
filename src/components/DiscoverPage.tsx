"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types/database";
import type { AppRole, CoachType } from "@/app/page";
import AthleteCard from "@/components/AthleteCard";
import FollowButton from "@/components/FollowButton";

const STYLES_F = ["All", "MMA", "Boks", "Kickboks", "Muay Thai"];
const CITIES_F = ["All", "İstanbul", "Ankara", "İzmir", "Bursa"];
const WEIGHTS_F = [
  "All",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Heavyweight",
];

interface DiscoverPageProps {
  role: AppRole | null;
  coachType: CoachType | null;
  onSelectAthlete: (athlete: Profile) => void;
  onOpenChat: (chat: {
    id: string;
    name: string;
    avatar: string;
    type: "fighter" | "pt";
    style?: string;
    city?: string;
  }) => void;
  user: User | null;
}

export default function DiscoverPage({
  role,
  coachType,
  onSelectAthlete,
  onOpenChat,
  user,
}: DiscoverPageProps) {
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

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-[240px_1fr] gap-0 px-10">
      {/* Sidebar */}
      <div className="border-r border-border p-[28px_28px_28px_0]">
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
            Şehir
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
            Kilo Sınıfı
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

      {/* Main */}
      <div className="p-[28px_0_28px_32px]">
        <div className="mb-4">
          <h2 className="mb-1 text-[36px] font-black tracking-[-0.5px]">
            {role === "athlete"
              ? "Sporcu Keşfet"
              : role === "fan"
                ? "Dövüşçüleri Keşfet"
                : "Sporcuları Keşfet"}
          </h2>
          <p className="font-body text-sm text-muted">
            {role === "athlete"
              ? "Sparring partneri bul, rakiplerini tanı."
              : role === "fan"
                ? "Favori sporcularını takip et."
                : coachType === "gym"
                  ? "Yetenekli sporcuları bul. PT'lerle iş birliği yap."
                  : "Yetenekli sporcuları bul ve onlara ulaş."}
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
              className={`border-b-2 px-5 py-[10px] font-heading text-sm font-bold tracking-[0.5px] transition-all ${
                discoverTab === "pts"
                  ? "border-accent text-foreground"
                  : "border-transparent text-faint hover:text-foreground"
              }`}
              onClick={() => setDiscoverTab("pts")}
            >
              PT&apos;ler
              <span className="ml-[6px] rounded-[10px] bg-accent px-[6px] py-[1px] text-[10px] font-bold text-white">
                İş Birliği
              </span>
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-faint">
            🔍
          </span>
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[14px]">
              {pts.map((pt) => (
                <div
                  key={pt.id}
                  className="relative overflow-hidden rounded-[12px] border border-border bg-white p-5"
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
                    <span className="inline-block rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                      👤 Personal Trainer
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
                      <span className="inline-block rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                        📍 {pt.city}
                      </span>
                    )}
                  </div>

                  <p className="mb-[14px] font-body text-[13px] leading-[1.5] text-muted">
                    {pt.bio}
                  </p>

                  <div className="flex items-center justify-between border-t border-border pt-[10px]">
                    <span className="font-body text-[12px] text-faint">
                      👥 {pt.followers_count} takipçi
                    </span>
                    <button
                      onClick={() =>
                        onOpenChat({
                          id: pt.id,
                          name: pt.full_name,
                          avatar: getInitials(pt.full_name),
                          type: "pt",
                          city: pt.city || undefined,
                        })
                      }
                      className="rounded-[6px] bg-foreground px-[13px] py-[6px] font-heading text-[12px] font-extrabold text-white transition-colors hover:bg-[#333]"
                    >
                      💼 İş Teklifi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Athlete List */}
        {discoverTab === "athletes" && (
          <div>
            <div className="mb-4 text-[13px] font-semibold text-faint">
              {loading ? "Yükleniyor..." : `${athletes.length} sporcu bulundu`}
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[14px]">
              {athletes.map((f) => (
                <AthleteCard
                  key={f.id}
                  athlete={f}
                  role={role}
                  onSelect={() => onSelectAthlete(f)}
                  onMessage={() =>
                    onOpenChat({
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

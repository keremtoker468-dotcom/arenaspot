"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Video } from "@/lib/types/database";
import type { AppRole } from "@/lib/types/app";
import FollowButton from "@/components/FollowButton";
import { ArrowLeft, MessageSquare, Copy, Link2 } from "lucide-react";

interface AthleteProfileProps {
  athlete: Profile;
  role: AppRole | null;
  onBack: () => void;
  onOpenChat: (chat: {
    id: string;
    name: string;
    avatar: string;
    type: "fighter" | "pt";
    style?: string;
    city?: string;
  }) => void;
  user: import("@supabase/supabase-js").User | null;
}

export default function AthleteProfile({
  athlete,
  role,
  onBack,
  onOpenChat,
}: AthleteProfileProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [similarAthletes, setSimilarAthletes] = useState<Profile[]>([]);
  const supabase = createClient();
  const router = useRouter();

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.substring(0, 2);
  };

  useEffect(() => {
    supabase
      .from("videos")
      .select("*")
      .eq("athlete_id", athlete.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setVideos((data ?? []) as Video[]));

    if (athlete.fight_style) {
      supabase
        .from("profiles")
        .select("*")
        .eq("role", "athlete")
        .eq("fight_style", athlete.fight_style)
        .neq("id", athlete.id)
        .limit(3)
        .then(({ data }) => setSimilarAthletes((data ?? []) as Profile[]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [athlete.id]);

  const info = [
    ["Stil", athlete.fight_style],
    ["Kilo", athlete.weight_class],
    ["Yas", athlete.age ? `${athlete.age}` : null],
    ["Sehir", athlete.city],
    ["Gym", athlete.gym_name],
    ["Takipci", athlete.followers_count.toLocaleString()],
  ].filter(([, v]) => v);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6 lg:px-10">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-[5px] bg-transparent p-0 font-heading text-[13px] font-bold text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Kesfete Don
      </button>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr_220px]">
        {/* Left Column */}
        <div className="flex flex-col gap-[14px]">
          <div className="relative overflow-hidden rounded-[12px] border border-border bg-white p-[22px]">
            <div className="absolute left-0 right-0 top-0 h-1 bg-accent" />
            <div className="mx-auto mb-[14px] flex h-[72px] w-[72px] items-center justify-center rounded-[14px] border-2 border-accent-border bg-accent-light text-[26px] font-black text-accent">
              {getInitials(athlete.full_name)}
            </div>
            <div className="mb-[14px] text-center">
              <div className="mb-[3px] flex items-center justify-center gap-[7px]">
                <span className="text-[20px] font-black">
                  {athlete.full_name}
                </span>
                {athlete.is_verified && (
                  <span className="rounded-[4px] bg-accent px-[6px] py-[2px] text-[9px] font-extrabold tracking-[1px] text-white">
                    PRO
                  </span>
                )}
              </div>
              <div className="font-body text-[13px] text-faint">
                @{athlete.username}
              </div>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <FollowButton athleteId={athlete.id} />
            </div>

            {(role === "athlete" || role === "coach") && (
              <button
                className="mt-2 flex w-full items-center justify-center gap-[6px] rounded-[6px] bg-foreground px-4 py-[10px] font-heading text-[12px] font-extrabold text-white transition-colors hover:bg-[#333]"
                onClick={() =>
                  onOpenChat({
                    id: athlete.id,
                    name: athlete.full_name,
                    avatar: getInitials(athlete.full_name),
                    type: "fighter",
                    style: athlete.fight_style || undefined,
                    city: athlete.city || undefined,
                  })
                }
              >
                <MessageSquare size={13} />
                {role === "coach" ? "Iletisim Kur" : "Mesaj Gonder"}
              </button>
            )}
          </div>

          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Bilgiler
            </div>
            {info.map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between border-b border-border py-[9px]"
              >
                <span className="font-body text-[13px] text-muted">{k}</span>
                <span className="text-[13px] font-bold">{v}</span>
              </div>
            ))}
            {athlete.bio && (
              <p className="mt-[14px] font-body text-[13px] leading-[1.6] text-muted">
                {athlete.bio}
              </p>
            )}
          </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              Dovus Rekoru
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] p-[22px_12px] text-center">
                <div className="text-[40px] font-black leading-none text-[#16a34a] lg:text-[52px]">
                  {athlete.record_w}
                </div>
                <div className="mt-[5px] text-[12px] font-bold tracking-[2px] text-[#16a34a]">
                  WINS
                </div>
              </div>
              <div className="flex-1 rounded-[10px] border border-accent-border bg-accent-light p-[22px_12px] text-center">
                <div className="text-[40px] font-black leading-none text-accent lg:text-[52px]">
                  {athlete.record_l}
                </div>
                <div className="mt-[5px] text-[12px] font-bold tracking-[2px] text-accent">
                  LOSSES
                </div>
              </div>
              <div className="flex-1 rounded-[10px] border border-border bg-surface p-[22px_12px] text-center">
                <div className="text-[40px] font-black leading-none text-faint lg:text-[52px]">
                  {athlete.record_d}
                </div>
                <div className="mt-[5px] text-[12px] font-bold tracking-[2px] text-faint">
                  DRAWS
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
                Highlightlar
              </div>
              <span className="font-body text-[12px] text-faint">
                {videos.length} video
              </span>
            </div>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                {videos.map((video, i) => (
                  <div
                    key={video.id}
                    className="group/v relative flex aspect-video items-center justify-center overflow-hidden rounded-[9px] border border-border bg-surface transition-all hover:border-accent"
                  >
                    {video.cloudflare_video_id ? (
                      <iframe
                        src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE}.cloudflarestream.com/${video.cloudflare_video_id}/iframe`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-foreground transition-colors group-hover/v:bg-accent">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="white"
                          >
                            <path d="M3 1.5l8 5-8 5V1.5z" />
                          </svg>
                        </div>
                        <span className="absolute bottom-[7px] left-[9px] text-[11px] font-semibold text-muted">
                          #{i + 1}
                        </span>
                        {video.duration && (
                          <span className="absolute bottom-[7px] right-[9px] text-[11px] text-faint">
                            {Math.floor(video.duration / 60)}:
                            {String(video.duration % 60).padStart(2, "0")}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center font-body text-sm text-faint">
                Henuz video yuklenmemis
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[14px]">
          {similarAthletes.length > 0 && (
            <div className="rounded-[12px] border border-border bg-white p-[22px]">
              <div className="mb-[14px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
                Benzer Sporcular
              </div>
              {similarAthletes.map((f) => (
                <div
                  key={f.id}
                  className="flex cursor-pointer items-center gap-[10px] border-b border-border py-[10px] transition-colors hover:bg-surface"
                  onClick={() => router.push(`/athlete/${f.username}`)}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-[8px] border-[1.5px] border-accent-border bg-accent-light text-[11px] font-black text-accent">
                    {getInitials(f.full_name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{f.full_name}</div>
                    <span className="rounded-[5px] border border-accent-border bg-accent-light px-[6px] py-[1px] text-[10px] font-bold text-accent">
                      {f.fight_style}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-[12px] border border-border bg-white p-[22px]">
            <div className="mb-[14px] flex items-center gap-[6px] text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
              <Link2 size={12} />
              Profil Linki
            </div>
            <div className="mb-[10px] break-all rounded-[7px] border border-border bg-surface p-[9px_12px] font-body text-[12px] text-muted">
              arenaspot.com/{athlete.username}
            </div>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `arenaspot.com/${athlete.username}`
                )
              }
              className="flex w-full items-center justify-center gap-[6px] rounded-[7px] border border-accent-border bg-accent-light px-4 py-[9px] font-heading text-[12px] font-bold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              <Copy size={12} />
              Linki Kopyala
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

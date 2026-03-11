import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardForm from "@/components/DashboardForm";
import VideoUpload from "@/components/VideoUpload";
import type { Profile, Video } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard — Arenaspot",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as Profile | null;
  if (!profile) redirect("/auth");

  const { data: videosData } = await supabase
    .from("videos")
    .select("*")
    .eq("athlete_id", user.id)
    .order("created_at", { ascending: false });

  const videos = (videosData ?? []) as Video[];

  const isAthlete = profile.role === "athlete";
  const roleLabel =
    profile.role === "athlete"
      ? "Sporcu"
      : profile.role === "fan"
        ? "Fan"
        : profile.role === "gym"
          ? "Salon Sahibi"
          : "Personal Trainer";

  return (
    <div className="mx-auto max-w-3xl px-10 py-8">
      <div className="mb-1 flex items-center gap-3">
        <h1 className="text-[32px] font-black tracking-[-0.5px]">
          PROFİLİN
        </h1>
        <span className="rounded-[20px] border border-accent-border bg-accent-light px-3 py-[3px] text-[11px] font-bold tracking-[1px] text-accent">
          {roleLabel}
        </span>
      </div>
      <p className="font-body text-sm text-muted">
        Profilini düzenle ve bilgilerini güncelle.
      </p>

      <div className="mt-8">
        <DashboardForm profile={profile} />
      </div>

      {isAthlete && (
        <div className="mt-10">
          <h2 className="text-xl font-black">HIGHLIGHT VİDEOLARI</h2>
          <VideoUpload />

          {videos.length > 0 && (
            <div className="mt-4 space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between rounded-[10px] border border-border p-4"
                >
                  <div>
                    <p className="font-semibold">{video.title}</p>
                    {video.duration && (
                      <p className="font-body text-xs text-faint">
                        {Math.floor(video.duration / 60)}:
                        {String(video.duration % 60).padStart(2, "0")}
                      </p>
                    )}
                  </div>
                  <span className="font-body text-xs text-faint">
                    {new Date(video.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

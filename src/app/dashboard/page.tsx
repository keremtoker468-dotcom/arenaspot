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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-gray-900">
        YOUR PROFILE
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Manage your fighter profile and highlight videos.
      </p>

      {/* Profile Form */}
      <div className="mt-8">
        <DashboardForm profile={profile} />
      </div>

      {/* Video Management */}
      <div className="mt-10">
        <h2 className="font-heading text-xl font-bold text-gray-900">
          HIGHLIGHT VIDEOS
        </h2>
        <VideoUpload />

        {videos.length > 0 && (
          <div className="mt-4 space-y-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{video.title}</p>
                  {video.duration && (
                    <p className="text-xs text-gray-500">
                      {Math.floor(video.duration / 60)}:
                      {String(video.duration % 60).padStart(2, "0")}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(video.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FollowButton from "@/components/FollowButton";

export const dynamic = "force-dynamic";
import type { Profile, Video } from "@/lib/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("username", username)
    .single();

  const profile = data as { full_name: string; bio: string | null } | null;
  if (!profile) return { title: "Athlete Not Found" };

  return {
    title: `${profile.full_name} — Arenaspot`,
    description: profile.bio ?? `Check out ${profile.full_name} on Arenaspot`,
  };
}

export default async function AthletePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  const profile = profileData as Profile | null;
  if (!profile) notFound();

  const { data: videosData } = await supabase
    .from("videos")
    .select("*")
    .eq("athlete_id", profile.id)
    .order("created_at", { ascending: false });

  const videos = (videosData ?? []) as Video[];
  const record = `${profile.record_w}W - ${profile.record_l}L - ${profile.record_d}D`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-accent to-red-400" />
        <div className="relative px-6 pb-6">
          <div className="-mt-12 flex items-end gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-xl border-4 border-white bg-gray-200 shadow-sm">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-heading text-3xl font-bold text-gray-400">
                    {profile.full_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="mb-1 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl font-bold text-gray-900">
                  {profile.full_name}
                </h1>
                {profile.is_verified && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">@{profile.username}</p>
            </div>
            <FollowButton athleteId={profile.id} />
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="font-heading text-xl font-bold text-gray-900">
                {record}
              </p>
              <p className="text-xs text-gray-500">Record</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="font-heading text-xl font-bold text-gray-900">
                {profile.weight_class ?? "—"}
              </p>
              <p className="text-xs text-gray-500">Weight Class</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="font-heading text-xl font-bold text-gray-900">
                {profile.fight_style ?? "—"}
              </p>
              <p className="text-xs text-gray-500">Style</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="font-heading text-xl font-bold text-gray-900">
                {profile.followers_count}
              </p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
          </div>

          {/* Bio & Details */}
          {profile.bio && (
            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              {profile.bio}
            </p>
          )}
          <div className="mt-3 flex gap-4 text-sm text-gray-500">
            {profile.city && <span>{profile.city}</span>}
            {profile.age && <span>{profile.age} years old</span>}
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="mt-8">
        <h2 className="font-heading text-xl font-bold text-gray-900">
          HIGHLIGHT VIDEOS
        </h2>
        {videos.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="aspect-video bg-gray-900">
                  <iframe
                    src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_CUSTOMER_CODE}.cloudflarestream.com/${video.cloudflare_video_id}/iframe`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-heading font-semibold text-gray-900">
                    {video.title}
                  </h3>
                  {video.duration && (
                    <p className="text-xs text-gray-500">
                      {Math.floor(video.duration / 60)}:
                      {String(video.duration % 60).padStart(2, "0")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-400">
            No videos uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}

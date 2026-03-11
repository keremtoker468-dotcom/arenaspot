"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FollowButton({ athleteId }: { athleteId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkFollowStatus();
  }, [athleteId]);

  const checkFollowStatus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", user.id)
      .eq("following_id", athleteId)
      .single();

    setIsFollowing(!!data);
  };

  const handleFollow = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", athleteId);
        setIsFollowing(false);
      } else {
        await supabase.from("follows").insert({
          follower_id: user.id,
          following_id: athleteId,
        });
        setIsFollowing(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        isFollowing
          ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          : "bg-accent text-white hover:bg-accent-dark"
      } disabled:opacity-50`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

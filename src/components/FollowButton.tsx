"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FollowButton({ athleteId }: { athleteId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkFollowStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

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
      className={`whitespace-nowrap rounded-[6px] border-[1.5px] border-accent px-[14px] py-[5px] font-heading text-[12px] font-bold tracking-[0.5px] transition-all ${
        isFollowing
          ? "bg-accent text-white"
          : "bg-transparent text-accent hover:bg-accent hover:text-white"
      } disabled:opacity-50`}
    >
      {isFollowing ? "✓" : "+ Takip"}
    </button>
  );
}

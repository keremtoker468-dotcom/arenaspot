import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;

  if (!file || !title) {
    return NextResponse.json(
      { error: "File and title are required" },
      { status: 400 }
    );
  }

  // Upload to Cloudflare Stream
  const cfFormData = new FormData();
  cfFormData.append("file", file);

  const cfResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}`,
      },
      body: cfFormData,
    }
  );

  if (!cfResponse.ok) {
    return NextResponse.json(
      { error: "Failed to upload to Cloudflare Stream" },
      { status: 500 }
    );
  }

  const cfData = await cfResponse.json();
  const videoId = cfData.result.uid;
  const duration = cfData.result.duration
    ? Math.round(cfData.result.duration)
    : null;

  // Save to database
  const { error: dbError } = await supabase.from("videos").insert({
    athlete_id: user.id,
    cloudflare_video_id: videoId,
    title,
    duration,
  });

  if (dbError) {
    return NextResponse.json(
      { error: "Failed to save video record" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, videoId });
}

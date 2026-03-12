import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has a profile, if not they'll need to create one
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!profile) {
          // Create a minimal placeholder profile for OAuth users
          const email = user.email ?? "";
          const name =
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            email.split("@")[0];
          const username = email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          await supabase.from("profiles").insert({
            id: user.id,
            username: `${username}_${Date.now().toString(36)}`,
            full_name: name,
            role: "fan",
          });

          // New user — send to onboarding
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to auth page on error
  return NextResponse.redirect(`${origin}/auth`);
}

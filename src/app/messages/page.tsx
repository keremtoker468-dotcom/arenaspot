import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MessagesClient from "@/components/MessagesClient";
import type { Conversation, Profile } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mesajlar — Arenaspot",
};

type ConversationWithProfile = Conversation & {
  otherUser: Profile;
};

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Fetch conversations where user is participant
  const { data: convos } = await supabase
    .from("conversations")
    .select("*")
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const conversations = (convos ?? []) as Conversation[];

  // Fetch other participants' profiles
  const otherIds = conversations.map((c) =>
    c.participant_1 === user.id ? c.participant_2 : c.participant_1
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .in("id", otherIds.length > 0 ? otherIds : ["none"]);

  const profileMap = new Map(
    ((profiles ?? []) as Profile[]).map((p) => [p.id, p])
  );

  const convsWithProfiles: ConversationWithProfile[] = conversations
    .map((c) => {
      const otherId =
        c.participant_1 === user.id ? c.participant_2 : c.participant_1;
      const otherUser = profileMap.get(otherId);
      if (!otherUser) return null;
      return { ...c, otherUser };
    })
    .filter(Boolean) as ConversationWithProfile[];

  return (
    <div className="mx-auto max-w-4xl px-10 py-8 font-heading">
      <h1 className="mb-1 text-[32px] font-black tracking-[-0.5px]">
        MESAJLAR
      </h1>
      <p className="mb-8 font-body text-sm text-muted">
        Konuşmalarını yönet.
      </p>

      <MessagesClient conversations={convsWithProfiles} userId={user.id} />
    </div>
  );
}

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/lib/types/database";
import type { AppRole, CoachType } from "@/lib/types/app";
import ChatPanel from "@/components/ChatPanel";
import AuthModal from "@/components/AuthModal";

export type ChatData = {
  id: string;
  name: string;
  avatar: string;
  type: "fighter" | "pt";
  style?: string;
  city?: string;
};

interface AppContextType {
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  coachType: CoachType | null;
  openChat: (chat: ChatData) => void;
  openAuth: () => void;
  setRole: (role: AppRole) => void;
  setCoachType: (type: CoachType) => void;
}

const AppContext = createContext<AppContextType>({
  user: null,
  profile: null,
  role: null,
  coachType: null,
  openChat: () => {},
  openAuth: () => {},
  setRole: () => {},
  setCoachType: () => {},
});

export const useApp = () => useContext(AppContext);

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [coachType, setCoachType] = useState<CoachType | null>(null);
  const [activeChat, setActiveChat] = useState<ChatData | null>(null);
  const [authModal, setAuthModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) loadProfile(user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u.id);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) {
      const p = data as Profile;
      setProfile(p);
      const r = p.role as UserRole;
      if (r === "athlete") setRole("athlete");
      else if (r === "fan") setRole("fan");
      else if (r === "gym" || r === "pt") {
        setRole("coach");
        setCoachType(r);
      }
    }
  };

  const handleAuthComplete = (
    authRole: AppRole,
    authCoachType: CoachType | null
  ) => {
    setAuthModal(false);
    setRole(authRole);
    if (authRole === "coach" && authCoachType) setCoachType(authCoachType);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        role,
        coachType,
        openChat: setActiveChat,
        openAuth: () => setAuthModal(true),
        setRole,
        setCoachType,
      }}
    >
      {children}

      {activeChat && (
        <ChatPanel
          chat={activeChat}
          onClose={() => setActiveChat(null)}
          user={user}
        />
      )}

      {authModal && (
        <AuthModal
          onClose={() => setAuthModal(false)}
          onComplete={handleAuthComplete}
        />
      )}
    </AppContext.Provider>
  );
}

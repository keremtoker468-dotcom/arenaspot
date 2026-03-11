"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/lib/types/database";
import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import CoachTypeSelect from "@/components/CoachTypeSelect";
import DiscoverPage from "@/components/DiscoverPage";
import AthleteProfile from "@/components/AthleteProfile";
import AuthModal from "@/components/AuthModal";
import ChatPanel from "@/components/ChatPanel";

export type AppRole = "athlete" | "fan" | "coach";
export type CoachType = "gym" | "pt";
export type PageState = "landing" | "coachtype" | "discover" | "profile";

export default function App() {
  const [page, setPage] = useState<PageState>("landing");
  const [role, setRole] = useState<AppRole | null>(null);
  const [coachType, setCoachType] = useState<CoachType | null>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<Profile | null>(null);
  const [authModal, setAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeChat, setActiveChat] = useState<{
    id: string;
    name: string;
    avatar: string;
    type: "fighter" | "pt";
    style?: string;
    city?: string;
  } | null>(null);

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
      const profileData = data as Profile;
      setProfile(profileData);
      const r = profileData.role as UserRole;
      if (r === "athlete") {
        setRole("athlete");
      } else if (r === "fan") {
        setRole("fan");
      } else if (r === "gym" || r === "pt") {
        setRole("coach");
        setCoachType(r);
      }
      if (page === "landing") setPage("discover");
    }
  };

  const goTo = (r: AppRole) => {
    setRole(r);
    setPage("discover");
    setSelectedAthlete(null);
  };

  const goHome = () => {
    setPage("landing");
    setRole(null);
    setSelectedAthlete(null);
    setActiveChat(null);
    setCoachType(null);
  };

  const handleAuthComplete = (
    authRole: AppRole,
    authCoachType: CoachType | null
  ) => {
    setAuthModal(false);
    setRole(authRole);
    if (authRole === "coach" && authCoachType) setCoachType(authCoachType);
    setPage("discover");
    setSelectedAthlete(null);
  };

  const openProfile = (athlete: Profile) => {
    setSelectedAthlete(athlete);
    setPage("profile");
  };

  const backToDiscover = () => {
    setSelectedAthlete(null);
    setPage("discover");
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar
        role={role}
        coachType={coachType}
        page={page}
        onGoHome={goHome}
        onOpenAuth={() => setAuthModal(true)}
        user={user}
      />

      {page === "landing" && (
        <LandingHero
          onSelectRole={goTo}
          onSelectCoach={() => {
            setRole("coach");
            setPage("coachtype");
          }}
          onOpenAuth={() => setAuthModal(true)}
        />
      )}

      {page === "coachtype" && (
        <CoachTypeSelect
          onSelect={(type) => {
            setCoachType(type);
            setPage("discover");
          }}
        />
      )}

      {page === "discover" && !selectedAthlete && (
        <DiscoverPage
          role={role}
          coachType={coachType}
          onSelectAthlete={openProfile}
          onOpenChat={setActiveChat}
          user={user}
        />
      )}

      {page === "profile" && selectedAthlete && (
        <AthleteProfile
          athlete={selectedAthlete}
          role={role}
          onBack={backToDiscover}
          onOpenChat={setActiveChat}
          user={user}
        />
      )}

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
    </div>
  );
}

"use client";

import type { User } from "@supabase/supabase-js";
import type { AppRole, CoachType, PageState } from "@/app/page";

interface NavbarProps {
  role: AppRole | null;
  coachType: CoachType | null;
  page: PageState;
  onGoHome: () => void;
  onOpenAuth: () => void;
  user: User | null;
}

export default function Navbar({
  role,
  coachType,
  page,
  onGoHome,
  onOpenAuth,
}: NavbarProps) {
  const roleLabel =
    role === "athlete"
      ? "Sporcu"
      : role === "fan"
        ? "Fan"
        : coachType === "gym"
          ? "Salon"
          : coachType === "pt"
            ? "PT"
            : null;

  const roleIcon =
    role === "athlete"
      ? "🥊"
      : role === "fan"
        ? "👁"
        : coachType === "gym"
          ? "🏢"
          : coachType === "pt"
            ? "👤"
            : null;

  return (
    <nav className="sticky top-0 z-[100] border-b border-border bg-white">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-10">
        <div
          className="flex cursor-pointer items-center gap-[9px]"
          onClick={onGoHome}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-accent text-[17px] font-black text-white">
            A
          </div>
          <span className="text-[21px] font-black uppercase tracking-[1.5px]">
            Arena<span className="text-accent">spot</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {page !== "landing" && (
            <button
              onClick={onGoHome}
              className="rounded-[7px] border border-border bg-transparent px-[15px] py-[7px] font-heading text-[13px] font-bold text-muted transition-all hover:border-[#ccc] hover:text-foreground"
            >
              ← Ana Sayfa
            </button>
          )}
          {role && roleLabel && (
            <span className="rounded-[20px] border border-accent-border bg-accent-light px-3 py-[5px] text-[12px] font-bold tracking-[1px] text-accent">
              {roleIcon} {roleLabel}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenAuth}
            className="rounded-[7px] border border-border bg-transparent px-[15px] py-[7px] font-heading text-[13px] font-bold text-muted transition-all hover:border-[#ccc] hover:text-foreground"
          >
            Giriş Yap
          </button>
          <button
            onClick={onOpenAuth}
            className="rounded-[7px] border border-accent bg-accent px-[15px] py-[7px] font-heading text-[13px] font-bold text-white transition-all hover:bg-accent-dark"
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </nav>
  );
}

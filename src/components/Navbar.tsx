"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Swords,
  Eye,
  Building2,
  User,
  Search,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/ChatProvider";

const roleConfig = {
  athlete: { label: "Sporcu", Icon: Swords },
  fan: { label: "Fan", Icon: Eye },
  gym: { label: "Salon", Icon: Building2 },
  pt: { label: "PT", Icon: User },
} as const;

export default function Navbar() {
  const { user, role, coachType, openAuth } = useApp();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  const isLanding = pathname === "/";

  const displayRole =
    role === "coach"
      ? coachType
        ? roleConfig[coachType]
        : null
      : role
        ? roleConfig[role]
        : null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-[100] border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[9px]">
          <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-accent text-[17px] font-black text-white">
            A
          </div>
          <span className="text-[21px] font-black uppercase tracking-[1.5px]">
            Arena<span className="text-accent">spot</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {!isLanding && (
            <Link
              href="/"
              className="flex items-center gap-[5px] rounded-[7px] px-3 py-[7px] font-heading text-[13px] font-bold text-muted transition-all hover:bg-surface hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Ana Sayfa
            </Link>
          )}
          {role && (
            <Link
              href="/discover"
              className={`flex items-center gap-[5px] rounded-[7px] px-3 py-[7px] font-heading text-[13px] font-bold transition-all hover:bg-surface hover:text-foreground ${
                pathname === "/discover" ? "bg-surface text-foreground" : "text-muted"
              }`}
            >
              <Search size={14} />
              Kesfet
            </Link>
          )}
          {user && (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-[5px] rounded-[7px] px-3 py-[7px] font-heading text-[13px] font-bold transition-all hover:bg-surface hover:text-foreground ${
                  pathname === "/dashboard" ? "bg-surface text-foreground" : "text-muted"
                }`}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <Link
                href="/messages"
                className={`flex items-center gap-[5px] rounded-[7px] px-3 py-[7px] font-heading text-[13px] font-bold transition-all hover:bg-surface hover:text-foreground ${
                  pathname === "/messages" ? "bg-surface text-foreground" : "text-muted"
                }`}
              >
                <MessageSquare size={14} />
                Mesajlar
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Role badge */}
          {displayRole && (
            <span className="hidden items-center gap-[5px] rounded-[20px] border border-accent-border bg-accent-light px-3 py-[5px] text-[12px] font-bold tracking-[1px] text-accent sm:flex">
              <displayRole.Icon size={13} />
              {displayRole.label}
            </span>
          )}

          {/* Auth buttons or user menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-[6px] rounded-[7px] border border-border px-3 py-[6px] font-heading text-[13px] font-bold text-foreground transition-all hover:bg-surface"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-black text-white">
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </div>
                <ChevronDown size={13} className={`text-muted transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[98]" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-[calc(100%+6px)] z-[99] w-48 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-[8px] px-4 py-[10px] font-body text-[13px] text-foreground transition-colors hover:bg-surface"
                    >
                      <LayoutDashboard size={14} className="text-muted" />
                      Dashboard
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-[8px] px-4 py-[10px] font-body text-[13px] text-foreground transition-colors hover:bg-surface"
                    >
                      <MessageSquare size={14} className="text-muted" />
                      Mesajlar
                    </Link>
                    <div className="border-t border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-[8px] px-4 py-[10px] font-body text-[13px] text-accent transition-colors hover:bg-accent-light"
                    >
                      <LogOut size={14} />
                      Cikis Yap
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden gap-2 sm:flex">
              <button
                onClick={openAuth}
                className="rounded-[7px] border border-border bg-transparent px-[15px] py-[7px] font-heading text-[13px] font-bold text-muted transition-all hover:border-[#ccc] hover:text-foreground"
              >
                Giris Yap
              </button>
              <button
                onClick={openAuth}
                className="rounded-[7px] border border-accent bg-accent px-[15px] py-[7px] font-heading text-[13px] font-bold text-white transition-all hover:bg-accent-dark"
              >
                Kayit Ol
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center rounded-[7px] p-[7px] text-foreground transition-colors hover:bg-surface md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-white px-6 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-[8px] rounded-[7px] px-3 py-[9px] font-heading text-[13px] font-bold text-muted transition-all hover:bg-surface hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Ana Sayfa
            </Link>
            {role && (
              <Link
                href="/discover"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-[8px] rounded-[7px] px-3 py-[9px] font-heading text-[13px] font-bold text-muted transition-all hover:bg-surface hover:text-foreground"
              >
                <Search size={14} />
                Kesfet
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-[8px] rounded-[7px] px-3 py-[9px] font-heading text-[13px] font-bold text-muted transition-all hover:bg-surface hover:text-foreground"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                <Link
                  href="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-[8px] rounded-[7px] px-3 py-[9px] font-heading text-[13px] font-bold text-muted transition-all hover:bg-surface hover:text-foreground"
                >
                  <MessageSquare size={14} />
                  Mesajlar
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-[8px] rounded-[7px] px-3 py-[9px] font-heading text-[13px] font-bold text-accent transition-all hover:bg-accent-light"
                >
                  <LogOut size={14} />
                  Cikis Yap
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth();
                  }}
                  className="flex-1 rounded-[7px] border border-border py-[9px] font-heading text-[13px] font-bold text-muted"
                >
                  Giris Yap
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth();
                  }}
                  className="flex-1 rounded-[7px] bg-accent py-[9px] font-heading text-[13px] font-bold text-white"
                >
                  Kayit Ol
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

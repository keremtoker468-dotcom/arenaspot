"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/ChatProvider";

const navTabs = [
  { label: "Keşfet", href: "/discover" },
  { label: "Sporcular", href: "/discover" },
  { label: "Spor Salonları", href: "/discover/gyms" },
  { label: "Koçlar", href: "/discover/coaches" },
];

export default function Navbar() {
  const { user, openAuth } = useApp();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-[100] bg-[#1a1a2e]">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[9px]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[17px] font-black text-white">
            A
          </div>
          <span className="text-[21px] font-black uppercase tracking-[1.5px] text-white">
            Arena<span className="text-accent">spot</span>
          </span>
        </Link>

        {/* Desktop nav tabs */}
        <div className="hidden items-center gap-1 md:flex">
          {navTabs.map((tab) => {
            const isActive =
              tab.label === "Sporcular"
                ? pathname === "/discover"
                : pathname === tab.href;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`rounded-[7px] px-4 py-[7px] font-heading text-[14px] font-bold transition-all ${
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Auth buttons or user menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-[6px] rounded-[7px] border border-white/20 px-3 py-[6px] font-heading text-[13px] font-bold text-white transition-all hover:border-white/40"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-black text-white">
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </div>
                <ChevronDown
                  size={13}
                  className={`text-white/60 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[98]"
                    onClick={() => setUserMenuOpen(false)}
                  />
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
                      Çıkış Yap
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden gap-2 sm:flex">
              <button
                onClick={openAuth}
                className="rounded-[7px] border border-white/30 bg-transparent px-[15px] py-[7px] font-heading text-[13px] font-bold text-white transition-all hover:border-white/60"
              >
                Giriş Yap
              </button>
              <button
                onClick={openAuth}
                className="rounded-[7px] border border-accent bg-accent px-[15px] py-[7px] font-heading text-[13px] font-bold text-white transition-all hover:bg-accent-dark"
              >
                Kayıt Ol
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center rounded-[7px] p-[7px] text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#1a1a2e] px-6 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navTabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-[8px] rounded-[7px] px-3 py-[9px] font-heading text-[13px] font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                {tab.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-[8px] rounded-[7px] px-3 py-[9px] font-heading text-[13px] font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                <Link
                  href="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-[8px] rounded-[7px] px-3 py-[9px] font-heading text-[13px] font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                  <MessageSquare size={14} />
                  Mesajlar
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-[8px] rounded-[7px] px-3 py-[9px] font-heading text-[13px] font-bold text-accent transition-all hover:bg-accent-light/10"
                >
                  <LogOut size={14} />
                  Çıkış Yap
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth();
                  }}
                  className="flex-1 rounded-[7px] border border-white/30 py-[9px] font-heading text-[13px] font-bold text-white"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth();
                  }}
                  className="flex-1 rounded-[7px] bg-accent py-[9px] font-heading text-[13px] font-bold text-white"
                >
                  Kayıt Ol
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

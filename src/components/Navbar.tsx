"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-gray-900">
            ARENASPOT
          </span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-accent"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Discover
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "text-accent"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Swords, Eye, Dumbbell, ChevronDown } from "lucide-react";
import { useApp } from "@/components/ChatProvider";

/* ── Role card data ── */
const ROLES = [
  {
    key: "fan" as const,
    title: "FAN OL",
    desc: "Sporculari kesfet, takip et. Dovus dunyasinin heyecanini yasayan kalabaliga katil.",
    cta: "Kesfetmeye Basla",
    Icon: Eye,
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&q=80&auto=format",
  },
  {
    key: "athlete" as const,
    title: "SPORCU OL",
    desc: "Profilini olustur, highlight videolarini yukle. Sparring partneri ve antrenor bul.",
    cta: "Ringi Sahiplen",
    Icon: Swords,
    image:
      "https://images.unsplash.com/photo-1517438322307-e67111335449?w=900&q=80&auto=format",
  },
  {
    key: "coach" as const,
    title: "ANTRENOR OL",
    desc: "Salonunu veya PT hizmetini tanit. Yetenekli sporculari kesfet ve baglanti kur.",
    cta: "Katil",
    Icon: Dumbbell,
    image:
      "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=900&q=80&auto=format",
  },
];

export default function LandingHero() {
  const router = useRouter();
  const { openAuth, setRole } = useApp();

  /* refs */
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* scroll progress for hero zoom */
  const [expandingCard, setExpandingCard] = useState<number | null>(null);

  /* ── Apple-style scroll-driven hero zoom ── */
  const handleScroll = useCallback(() => {
    if (!heroRef.current || !bgRef.current || !overlayRef.current || !textRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress 0→1 as hero scrolls out of view
    const progress = Math.min(Math.max(-rect.top / vh, 0), 1);

    // Ring zoom: 1 → 1.6 (camera enters the ring)
    const scale = 1 + progress * 0.6;
    bgRef.current.style.transform = `scale(${scale})`;

    // Overlay darkens as we zoom in
    overlayRef.current.style.opacity = `${0.4 + progress * 0.4}`;

    // Text parallax: moves up faster than scroll
    textRef.current.style.transform = `translateY(${progress * -80}px)`;
    textRef.current.style.opacity = `${1 - progress * 1.5}`;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── Card scroll reveal (IntersectionObserver) ── */
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Cinematic card click → fullscreen expand → navigate ── */
  const handleRoleClick = (index: number, role: "fan" | "athlete" | "coach") => {
    if (expandingCard !== null) return;
    setExpandingCard(index);

    // After expand animation, navigate
    setTimeout(() => {
      if (role === "coach") {
        setRole("coach");
        router.push("/discover?coachselect=1");
      } else {
        setRole(role);
        router.push("/discover");
      }
    }, 700);
  };

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ════════════ HERO — Scroll-driven ring zoom ════════════ */}
      <section
        ref={heroRef}
        className="relative h-[200vh]"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Ring background — zooms on scroll */}
          <div
            ref={bgRef}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1920&q=80&auto=format')",
            }}
          />

          {/* Dark overlay — intensifies on scroll */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black transition-opacity duration-100"
            style={{ opacity: 0.4 }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

          {/* Hero text — parallax up on scroll */}
          <div
            ref={textRef}
            className="relative z-10 flex h-full flex-col items-center justify-center px-6 will-change-transform"
          >
            <span className="mb-6 inline-block rounded-[20px] border border-white/15 bg-white/8 px-[16px] py-[6px] text-[10px] font-extrabold uppercase tracking-[4px] text-white/70 backdrop-blur-md sm:text-[11px]">
              Dovus Sporlari Platformu
            </span>

            <h1 className="mb-5 text-center text-[52px] font-black uppercase leading-[0.88] tracking-[-3px] text-white sm:text-[76px] lg:text-[100px]">
              Ringde
              <br />
              <span className="text-accent">Yerini Al.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-[440px] text-center font-body text-[15px] leading-[1.7] text-white/60 sm:text-[17px]">
              Sporculari kesfet. Antrenorunu bul. Arenaya katil.
            </p>

            <button
              onClick={scrollToCards}
              className="rounded-[9px] bg-accent px-8 py-[14px] font-heading text-[13px] font-extrabold uppercase tracking-[2px] text-white transition-all duration-300 hover:bg-accent-dark hover:shadow-[0_8px_40px_rgba(230,57,70,0.35)]"
            >
              Kesfet
            </button>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToCards}
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/40 transition-colors hover:text-white"
          >
            <ChevronDown size={28} />
          </button>
        </div>
      </section>

      {/* ════════════ ROL KARTLARI — Cinematic reveal ════════════ */}
      <section
        ref={cardsRef}
        className="relative bg-white py-24"
      >
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          {/* Section heading */}
          <div className="mb-16 text-center">
            <h2 className="mb-3 text-[38px] font-black uppercase tracking-[-1.5px] sm:text-[48px]">
              Senin Rolin Ne?
            </h2>
            <p className="mx-auto max-w-[460px] font-body text-[15px] leading-[1.6] text-muted sm:text-[16px]">
              Platformu sana gore ayarlayalim. Bir rol sec ve arenaya katil.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((role, i) => (
              <div
                key={role.key}
                ref={(el) => { cardRefs.current[i] = el; }}
                onClick={() => handleRoleClick(i, role.key)}
                className={`group relative cursor-pointer overflow-hidden rounded-[16px] border border-border bg-white transition-all duration-500 ${
                  expandingCard === i ? "card-expanding" : ""
                } ${
                  visibleCards[i]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                } ${
                  i === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
                style={{
                  transitionDelay: visibleCards[i] ? `${i * 120}ms` : "0ms",
                }}
              >
                {/* Image container */}
                <div className="card-image relative h-[240px] overflow-hidden transition-all duration-700 sm:h-[280px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 will-change-transform group-hover:scale-110"
                    style={{ backgroundImage: `url('${role.image}')` }}
                  />
                  {/* Dark gradient overlay */}
                  <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 transition-opacity duration-500" />

                  {/* Icon badge — glassmorphism */}
                  <div className="absolute bottom-4 left-5 flex h-[46px] w-[46px] items-center justify-center rounded-[11px] border border-white/20 bg-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/80 group-hover:border-accent/30">
                    <role.Icon size={22} />
                  </div>

                  {/* Title on image */}
                  <div className="absolute bottom-5 left-[72px] text-[18px] font-black uppercase tracking-[1px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                    {role.title}
                  </div>
                </div>

                {/* Content */}
                <div className="card-content p-6 transition-opacity duration-300">
                  <p className="mb-5 font-body text-[13px] leading-[1.7] text-muted">
                    {role.desc}
                  </p>
                  <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-accent px-5 py-[11px] font-heading text-[12px] font-extrabold uppercase tracking-[1.5px] text-white transition-all duration-300 group-hover:bg-accent-dark group-hover:shadow-[0_4px_20px_rgba(230,57,70,0.25)]">
                    {role.cta}
                    <ChevronDown size={14} className="-rotate-90" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Login link */}
          <p className="mt-12 text-center font-body text-sm text-faint">
            Zaten hesabin var mi?{" "}
            <span
              className="cursor-pointer font-semibold text-accent underline transition-colors hover:text-accent-dark"
              onClick={openAuth}
            >
              Giris yap
            </span>
          </p>
        </div>
      </section>
    </>
  );
}

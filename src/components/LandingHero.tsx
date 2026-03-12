"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Swords, Eye, Dumbbell, ChevronDown } from "lucide-react";
import { useApp } from "@/components/ChatProvider";

const ROLES = [
  {
    key: "fan" as const,
    title: "FAN OL",
    desc: "Sporculari kesfet, takip et. Dovus dunyasinin heyecanini yasayan kalabaliga katil.",
    cta: "Kesfetmeye Basla",
    Icon: Eye,
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80&auto=format",
    overlay: "from-black/70 via-black/30 to-transparent",
  },
  {
    key: "athlete" as const,
    title: "SPORCU OL",
    desc: "Profilini olustur, highlight videolarini yukle. Sparring partneri ve antrenor bul.",
    cta: "Ringi Sahiplen",
    Icon: Swords,
    image:
      "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800&q=80&auto=format",
    overlay: "from-black/70 via-black/30 to-transparent",
  },
  {
    key: "coach" as const,
    title: "ANTRENOR OL",
    desc: "Salonunu veya PT hizmetini tanit. Yetenekli sporculari kesfet ve baglanti kur.",
    cta: "Katil",
    Icon: Dumbbell,
    image:
      "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=80&auto=format",
    overlay: "from-black/80 via-black/40 to-transparent",
  },
];

export default function LandingHero() {
  const router = useRouter();
  const { openAuth, setRole } = useApp();
  const cardsRef = useRef<HTMLDivElement>(null);

  const handleRoleClick = (role: "fan" | "athlete" | "coach") => {
    if (role === "coach") {
      setRole("coach");
      router.push("/discover?coachselect=1");
    } else {
      setRole(role);
      router.push("/discover");
    }
  };

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1920&q=80&auto=format')",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[800px] animate-fade-up px-6 text-center">
          <span className="mb-6 inline-block rounded-[20px] border border-white/20 bg-white/10 px-[14px] py-[5px] text-[11px] font-extrabold uppercase tracking-[3px] text-white/80 backdrop-blur-sm">
            Dovus Sporlari Platformu
          </span>

          <h1 className="mb-5 text-[52px] font-black uppercase leading-[0.92] tracking-[-2px] text-white sm:text-[72px] lg:text-[90px]">
            Ringde
            <br />
            <span className="text-accent">Yerini Al.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-[500px] font-body text-[16px] leading-[1.6] text-white/70 sm:text-[18px]">
            Sporculari kesfet. Antrenorunu bul. Arenaya katil.
          </p>

          <button
            onClick={scrollToCards}
            className="rounded-[9px] bg-accent px-8 py-[14px] font-heading text-[14px] font-extrabold uppercase tracking-[1.5px] text-white transition-all hover:bg-accent-dark hover:shadow-[0_8px_32px_rgba(230,57,70,0.3)]"
          >
            Kesfet
          </button>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToCards}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50 transition-colors hover:text-white"
        >
          <ChevronDown size={28} />
        </button>
      </section>

      {/* ── Rol Secim Kartlari ── */}
      <section
        ref={cardsRef}
        className="mx-auto max-w-[1200px] px-6 py-20 lg:px-10"
      >
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-[36px] font-black uppercase tracking-[-1px] sm:text-[44px]">
            Senin Rolin Ne?
          </h2>
          <p className="mx-auto max-w-[480px] font-body text-[15px] leading-[1.6] text-muted">
            Platformu sana gore ayarlayalim. Bir rol sec ve hemen basla.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role, i) => (
            <div
              key={role.key}
              onClick={() => handleRoleClick(role.key)}
              className={`group relative cursor-pointer overflow-hidden rounded-[14px] border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_40px_rgba(230,57,70,0.12)] ${
                i === 1
                  ? "opacity-0 animate-fade-up-2"
                  : i === 2
                    ? "opacity-0 animate-fade-up-3 sm:col-span-2 lg:col-span-1"
                    : "animate-fade-up"
              }`}
            >
              {/* Image */}
              <div className="relative h-[220px] overflow-hidden sm:h-[260px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${role.image}')` }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${role.overlay}`}
                />
                {/* Icon badge on image */}
                <div className="absolute bottom-4 left-4 flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                  <role.Icon size={22} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-[20px] font-black uppercase tracking-[0.5px]">
                  {role.title}
                </h3>
                <p className="mb-5 font-body text-[13px] leading-[1.6] text-muted">
                  {role.desc}
                </p>
                <span className="inline-flex items-center gap-1 rounded-[7px] border-[1.5px] border-accent bg-accent px-5 py-[10px] font-heading text-[12px] font-extrabold uppercase tracking-[1px] text-white transition-all group-hover:bg-accent-dark">
                  {role.cta}
                  <ChevronDown size={14} className="-rotate-90" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-body text-sm text-faint">
          Zaten hesabin var mi?{" "}
          <span
            className="cursor-pointer font-semibold text-accent underline transition-colors hover:text-accent-dark"
            onClick={openAuth}
          >
            Giris yap
          </span>
        </p>
      </section>
    </>
  );
}

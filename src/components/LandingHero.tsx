"use client";

import { useRouter } from "next/navigation";
import { Swords, Eye, Dumbbell } from "lucide-react";
import { useApp } from "@/components/ChatProvider";

export default function LandingHero() {
  const router = useRouter();
  const { openAuth, setRole } = useApp();

  const goDiscover = (role: "athlete" | "fan") => {
    setRole(role);
    router.push("/discover");
  };

  const goCoach = () => {
    setRole("coach");
    router.push("/discover?coachselect=1");
  };

  return (
    <div className="mx-auto max-w-[1200px] animate-fade-up px-6 pb-[60px] pt-20 text-center lg:px-10">
      <span className="mb-6 inline-block rounded-[20px] border border-accent-border bg-accent-light px-[14px] py-[5px] text-[11px] font-extrabold uppercase tracking-[3px] text-accent">
        Dovus Sporlari Platformu
      </span>
      <h1 className="mb-5 text-[48px] font-black uppercase leading-[0.92] tracking-[-2px] sm:text-[64px] lg:text-[76px]">
        Arenan
        <br />
        <em className="text-accent">Burada Baslar.</em>
      </h1>
      <p className="mx-auto mb-[52px] max-w-[460px] font-body text-[15px] leading-[1.6] text-muted sm:text-[17px]">
        Sporcu kesfet, salonunu tanit ya da favori dovusculerini takip et.
      </p>

      <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Sporcu */}
        <div
          className="group relative cursor-pointer overflow-hidden rounded-[14px] border border-border bg-white p-[36px_28px] text-left transition-all hover:-translate-y-[2px] hover:border-[#d0d0d0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          onClick={() => goDiscover("athlete")}
        >
          <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
          <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border border-accent-border bg-accent-light text-accent">
            <Swords size={24} />
          </div>
          <div className="mb-[10px] text-2xl font-black uppercase tracking-[0.5px]">
            Sporcuyum
          </div>
          <p className="mb-6 font-body text-sm leading-[1.6] text-muted">
            Profilini olustur, highlight videolarini yukle. Antrenorler ve
            fanlar seni kesfetsin. Sparring partneri bul.
          </p>
          <button className="inline-block rounded-[7px] border-[1.5px] border-accent bg-accent px-5 py-[10px] font-heading text-[13px] font-extrabold uppercase tracking-[1px] text-white transition-all hover:bg-accent-dark">
            Sporcu Olarak Katil
          </button>
        </div>

        {/* Fan */}
        <div
          className="group relative cursor-pointer overflow-hidden rounded-[14px] border border-border bg-white p-[36px_28px] text-left opacity-0 animate-fade-up-2 transition-all hover:-translate-y-[2px] hover:border-[#d0d0d0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          onClick={() => goDiscover("fan")}
        >
          <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
          <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border border-accent-border bg-accent-light text-accent">
            <Eye size={24} />
          </div>
          <div className="mb-[10px] text-2xl font-black uppercase tracking-[0.5px]">
            Fanim
          </div>
          <p className="mb-6 font-body text-sm leading-[1.6] text-muted">
            Dovusculeri kesfet, takip et ve en iyi highlightlari kacirma.
          </p>
          <button className="inline-block rounded-[7px] border-[1.5px] border-accent bg-transparent px-5 py-[10px] font-heading text-[13px] font-extrabold uppercase tracking-[1px] text-accent transition-all hover:bg-accent hover:text-white">
            Sporculari Kesfet
          </button>
        </div>

        {/* Coach */}
        <div
          className="group relative cursor-pointer overflow-hidden rounded-[14px] border border-border bg-white p-[36px_28px] text-left opacity-0 animate-fade-up-3 transition-all hover:-translate-y-[2px] hover:border-[#d0d0d0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:col-span-2 lg:col-span-1"
          onClick={goCoach}
        >
          <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
          <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border border-accent-border bg-accent-light text-accent">
            <Dumbbell size={24} />
          </div>
          <div className="mb-[10px] text-2xl font-black uppercase tracking-[0.5px]">
            Antrenor / Gym
          </div>
          <p className="mb-6 font-body text-sm leading-[1.6] text-muted">
            Salonunu veya PT hizmetini tanit. Yetenekli sporculari bul ve takip
            et.
          </p>
          <button className="inline-block rounded-[7px] border-[1.5px] border-accent bg-transparent px-5 py-[10px] font-heading text-[13px] font-extrabold uppercase tracking-[1px] text-accent transition-all hover:bg-accent hover:text-white">
            Antrenor Olarak Katil
          </button>
        </div>
      </div>

      <p className="mt-7 font-body text-sm text-faint">
        Zaten hesabin var mi?{" "}
        <span
          className="cursor-pointer text-accent underline"
          onClick={openAuth}
        >
          Giris yap
        </span>
      </p>
    </div>
  );
}

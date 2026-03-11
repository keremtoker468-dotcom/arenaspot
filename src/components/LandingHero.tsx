"use client";

import type { AppRole } from "@/app/page";

interface LandingHeroProps {
  onSelectRole: (role: AppRole) => void;
  onSelectCoach: () => void;
  onOpenAuth: () => void;
}

export default function LandingHero({
  onSelectRole,
  onSelectCoach,
  onOpenAuth,
}: LandingHeroProps) {
  return (
    <div className="mx-auto max-w-[1200px] animate-fade-up px-10 pb-[60px] pt-20 text-center">
      <span className="mb-6 inline-block rounded-[20px] border border-accent-border bg-accent-light px-[14px] py-[5px] text-[11px] font-extrabold uppercase tracking-[3px] text-accent">
        Dövüş Sporları Platformu
      </span>
      <h1 className="mb-5 text-[76px] font-black uppercase leading-[0.92] tracking-[-2px]">
        Arenan
        <br />
        <em className="text-accent">Burada Başlar.</em>
      </h1>
      <p className="mx-auto mb-[52px] max-w-[460px] font-body text-[17px] leading-[1.6] text-muted">
        Sporcu keşfet, salonunu tanıt ya da favori dövüşçülerini takip et.
      </p>

      <div className="mx-auto grid max-w-[960px] grid-cols-3 gap-5">
        {/* Sporcu */}
        <div
          className="group relative cursor-pointer overflow-hidden rounded-[14px] border border-border bg-white p-[36px_28px] text-left transition-all hover:-translate-y-[2px] hover:border-[#d0d0d0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          onClick={() => onSelectRole("athlete")}
        >
          <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
          <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border border-accent-border bg-accent-light text-2xl">
            🥊
          </div>
          <div className="mb-[10px] text-2xl font-black uppercase tracking-[0.5px]">
            Sporcuyum
          </div>
          <p className="mb-6 font-body text-sm leading-[1.6] text-muted">
            Profilini oluştur, highlight videolarını yükle. Antrenörler ve
            fanlar seni keşfetsin. Sparring partneri bul.
          </p>
          <button className="inline-block rounded-[7px] border-[1.5px] border-accent bg-accent px-5 py-[10px] font-heading text-[13px] font-extrabold uppercase tracking-[1px] text-white transition-all hover:bg-accent-dark">
            Sporcu Olarak Katıl
          </button>
        </div>

        {/* Fan */}
        <div
          className="group relative cursor-pointer overflow-hidden rounded-[14px] border border-border bg-white p-[36px_28px] text-left opacity-0 animate-fade-up-2 transition-all hover:-translate-y-[2px] hover:border-[#d0d0d0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          onClick={() => onSelectRole("fan")}
        >
          <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
          <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border border-accent-border bg-accent-light text-2xl">
            👁️
          </div>
          <div className="mb-[10px] text-2xl font-black uppercase tracking-[0.5px]">
            Fanım
          </div>
          <p className="mb-6 font-body text-sm leading-[1.6] text-muted">
            Dövüşçüleri keşfet, takip et ve en iyi highlightları kaçırma.
          </p>
          <button className="inline-block rounded-[7px] border-[1.5px] border-accent bg-transparent px-5 py-[10px] font-heading text-[13px] font-extrabold uppercase tracking-[1px] text-accent transition-all hover:bg-accent hover:text-white">
            Sporcuları Keşfet
          </button>
        </div>

        {/* Coach */}
        <div
          className="group relative cursor-pointer overflow-hidden rounded-[14px] border border-border bg-white p-[36px_28px] text-left opacity-0 animate-fade-up-3 transition-all hover:-translate-y-[2px] hover:border-[#d0d0d0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          onClick={onSelectCoach}
        >
          <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
          <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[12px] border border-accent-border bg-accent-light text-2xl">
            🏋️
          </div>
          <div className="mb-[10px] text-2xl font-black uppercase tracking-[0.5px]">
            Antrenör / Gym
          </div>
          <p className="mb-6 font-body text-sm leading-[1.6] text-muted">
            Salonunu veya PT hizmetini tanıt. Yetenekli sporcuları bul ve takip
            et.
          </p>
          <button className="inline-block rounded-[7px] border-[1.5px] border-accent bg-transparent px-5 py-[10px] font-heading text-[13px] font-extrabold uppercase tracking-[1px] text-accent transition-all hover:bg-accent hover:text-white">
            Antrenör Olarak Katıl
          </button>
        </div>
      </div>

      <p className="mt-7 font-body text-sm text-faint">
        Zaten hesabın var mı?{" "}
        <span
          className="cursor-pointer text-accent underline"
          onClick={onOpenAuth}
        >
          Giriş yap
        </span>
      </p>
    </div>
  );
}

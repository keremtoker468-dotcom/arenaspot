"use client";

import { useState } from "react";
import type { CoachType } from "@/lib/types/app";
import { Building2, Dumbbell, Check } from "lucide-react";

interface CoachTypeSelectProps {
  onSelect: (type: CoachType) => void;
}

const TYPES: { type: CoachType; Icon: typeof Building2; title: string; desc: string }[] = [
  {
    type: "gym",
    Icon: Building2,
    title: "Salon / Gym Sahibi",
    desc: "Kendi salonunu tanıt. Sporcuları keşfet ve PT'lere iş teklifi ver.",
  },
  {
    type: "pt",
    Icon: Dumbbell,
    title: "Personal Trainer",
    desc: "PT hizmetini tanıt. Sporcuları keşfet ve onlara ulaş.",
  },
];

export default function CoachTypeSelect({ onSelect }: CoachTypeSelectProps) {
  const [selected, setSelected] = useState<CoachType | null>(null);

  return (
    <div className="mx-auto max-w-[680px] px-6 py-[60px] text-center lg:px-10">
      <div className="mb-[10px] text-[12px] font-extrabold uppercase tracking-[3px] text-accent">
        Antrenör Kaydı
      </div>
      <h2
        className="mb-3 text-[36px] font-black tracking-[-0.5px]"
        style={{ fontFamily: "Barlow Condensed, sans-serif" }}
      >
        Sen kimsin?
      </h2>
      <p className="font-body text-[15px] leading-relaxed text-muted">
        Hesabını doğru kişiselleştirebilmemiz için seçimini yap.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {TYPES.map(({ type, Icon, title, desc }) => (
          <div
            key={type}
            className={`cursor-pointer rounded-[14px] border-[1.5px] p-7 text-left transition-all duration-200 ease-out hover:border-accent hover:shadow-[0_4px_20px_rgba(230,57,70,0.08)] ${
              selected === type
                ? "border-accent bg-accent-light shadow-[0_4px_20px_rgba(230,57,70,0.08)]"
                : "border-border bg-white"
            }`}
            onClick={() => setSelected(type)}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] bg-accent-light text-accent">
              <Icon size={24} />
            </div>
            <div
              className="mb-2 text-[18px] font-black"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              {title}
            </div>
            <p className="font-body text-[14px] leading-[1.6] text-muted">
              {desc}
            </p>
            {selected === type && (
              <div className="mt-4 flex items-center gap-[6px] text-[13px] font-bold text-accent">
                <Check size={15} strokeWidth={2.5} />
                Seçildi
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className={`mt-8 transition-opacity duration-200 ${selected ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <button
          onClick={() => selected && onSelect(selected)}
          className="rounded-[10px] bg-accent px-10 py-[14px] font-heading text-[15px] font-extrabold tracking-[0.5px] text-white transition-colors duration-200 hover:bg-accent-dark"
        >
          Devam Et →
        </button>
      </div>
    </div>
  );
}

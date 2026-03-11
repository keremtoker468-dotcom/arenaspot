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
    desc: "Kendi salonunu tanit. Sporculari kesfet ve PT'lere is teklifi ver.",
  },
  {
    type: "pt",
    Icon: Dumbbell,
    title: "Personal Trainer",
    desc: "PT hizmetini tanit. Sporculari kesfet ve onlara ulas.",
  },
];

export default function CoachTypeSelect({ onSelect }: CoachTypeSelectProps) {
  const [selected, setSelected] = useState<CoachType | null>(null);

  return (
    <div className="mx-auto max-w-[680px] animate-fade-up px-6 py-[60px] text-center lg:px-10">
      <div className="mb-[10px] text-[11px] font-extrabold uppercase tracking-[3px] text-accent">
        Antrenor Kaydi
      </div>
      <h2 className="mb-2 text-[38px] font-black tracking-[-0.5px]">
        Sen kimsin?
      </h2>
      <p className="font-body text-[15px] text-muted">
        Hesabini dogru kisisellestiremiz icin secimini yap.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TYPES.map(({ type, Icon, title, desc }) => (
          <div
            key={type}
            className={`cursor-pointer rounded-[12px] border-[1.5px] p-[28px_24px] text-left transition-all hover:border-accent hover:shadow-[0_4px_20px_rgba(230,57,70,0.1)] ${
              selected === type
                ? "border-accent bg-accent-light"
                : "border-border bg-white"
            }`}
            onClick={() => setSelected(type)}
          >
            <div className="mb-3 text-accent">
              <Icon size={28} />
            </div>
            <div className="mb-[6px] text-[19px] font-black">{title}</div>
            <p className="font-body text-[13px] leading-[1.5] text-muted">
              {desc}
            </p>
            {selected === type && (
              <div className="mt-3 flex items-center gap-1 text-[12px] font-bold text-accent">
                <Check size={14} />
                Secildi
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <button
          onClick={() => onSelect(selected)}
          className="mt-6 rounded-[9px] bg-accent px-8 py-[13px] font-heading text-[15px] font-extrabold tracking-[1px] text-white transition-all hover:bg-accent-dark"
        >
          Devam Et
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import type { CoachType } from "@/app/page";

interface CoachTypeSelectProps {
  onSelect: (type: CoachType) => void;
}

const TYPES: { type: CoachType; icon: string; title: string; desc: string }[] =
  [
    {
      type: "gym",
      icon: "🏢",
      title: "Salon / Gym Sahibi",
      desc: "Kendi salonunu tanıt. Sporcuları keşfet ve PT'lere iş teklifi ver.",
    },
    {
      type: "pt",
      icon: "👤",
      title: "Personal Trainer",
      desc: "PT hizmetini tanıt. Sporcuları keşfet ve onlara ulaş.",
    },
  ];

export default function CoachTypeSelect({ onSelect }: CoachTypeSelectProps) {
  const [selected, setSelected] = useState<CoachType | null>(null);

  return (
    <div className="mx-auto max-w-[680px] animate-fade-up px-10 py-[60px] text-center">
      <div className="mb-[10px] text-[11px] font-extrabold uppercase tracking-[3px] text-accent">
        Antrenör Kaydı
      </div>
      <h2 className="mb-2 text-[38px] font-black tracking-[-0.5px]">
        Sen kimsin?
      </h2>
      <p className="font-body text-[15px] text-muted">
        Hesabını doğru kişiselleştirmemiz için seçimini yap.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {TYPES.map(({ type, icon, title, desc }) => (
          <div
            key={type}
            className={`cursor-pointer rounded-[12px] border-[1.5px] p-[28px_24px] text-left transition-all hover:border-accent hover:shadow-[0_4px_20px_rgba(230,57,70,0.1)] ${
              selected === type
                ? "border-accent bg-accent-light"
                : "border-border bg-white"
            }`}
            onClick={() => setSelected(type)}
          >
            <div className="mb-3 text-[28px]">{icon}</div>
            <div className="mb-[6px] text-[19px] font-black">{title}</div>
            <p className="font-body text-[13px] leading-[1.5] text-muted">
              {desc}
            </p>
            {selected === type && (
              <div className="mt-3 text-[12px] font-bold text-accent">
                ✓ Seçildi
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
          Devam Et →
        </button>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AppRole, CoachType } from "@/app/page";

interface AuthModalProps {
  onClose: () => void;
  onComplete: (role: AppRole, coachType: CoachType | null) => void;
}

type AuthStep = "method" | "role" | "coachtype" | "done";

export default function AuthModal({ onClose, onComplete }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>("method");
  const [authRole, setAuthRole] = useState<AppRole | null>(null);
  const [authCoachType, setAuthCoachType] = useState<CoachType | null>(null);
  const supabase = createClient();

  const steps: AuthStep[] = authRole === "coach"
    ? ["method", "role", "coachtype", "done"]
    : ["method", "role", "done"];

  const currentIdx = steps.indexOf(step);

  const handleOAuth = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (!error) setStep("role");
  };

  const handleContinueEmail = () => {
    setStep("role");
  };

  const handleBack = () => {
    if (step === "coachtype") setStep("role");
    else if (step === "role") setStep("method");
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/45 p-5 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[460px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step indicators */}
        <div className="flex justify-center gap-[6px] pt-5">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-[6px] w-[6px] rounded-full transition-colors ${
                currentIdx >= i ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6">
          <div>
            {step === "method" && (
              <h2 className="text-[22px] font-black tracking-[-0.3px]">
                Arenaspot&apos;a Katıl
              </h2>
            )}
            {step === "role" && (
              <h2 className="text-[22px] font-black tracking-[-0.3px]">
                Sen kimsin?
              </h2>
            )}
            {step === "coachtype" && (
              <h2 className="text-[22px] font-black tracking-[-0.3px]">
                Antrenör tipi
              </h2>
            )}
            {step === "done" && (
              <h2 className="text-[22px] font-black tracking-[-0.3px]">
                Hoş geldin! 🎉
              </h2>
            )}
            {step !== "method" && step !== "done" && (
              <button
                onClick={handleBack}
                className="mt-1 bg-transparent p-0 font-body text-[12px] font-bold text-muted"
              >
                ← Geri
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-transparent text-[22px] leading-none text-faint transition-colors hover:text-foreground"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-7 pt-6">
          {/* STEP 1 — OAuth */}
          {step === "method" && (
            <div>
              <p className="mb-5 font-body text-sm leading-[1.5] text-muted">
                Saniyeler içinde başla. Şifre gerekmez.
              </p>
              <button
                onClick={() => handleOAuth("google")}
                className="mb-[10px] flex w-full items-center justify-center gap-[10px] rounded-[10px] border-[1.5px] border-border bg-white px-4 py-[13px] font-heading text-sm font-bold transition-all hover:border-faint hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                Google ile devam et
              </button>
              <button
                onClick={() => handleOAuth("apple")}
                className="mb-[10px] flex w-full items-center justify-center gap-[10px] rounded-[10px] border-[1.5px] border-border bg-white px-4 py-[13px] font-heading text-sm font-bold transition-all hover:border-faint hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <svg width="20" height="20" viewBox="0 0 814 1000">
                  <path
                    d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 268.5-317.7 99.6 0 167.3 65.6 239.6 65.6 69.1 0 148.8-71.8 248.5-71.8z"
                    fill="#000"
                  />
                </svg>
                Apple ile devam et
              </button>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="whitespace-nowrap font-body text-[12px] text-faint">
                  ya da
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <button
                onClick={handleContinueEmail}
                className="flex w-full items-center justify-center gap-[10px] rounded-[10px] border-[1.5px] border-border bg-surface px-4 py-[13px] font-heading text-sm font-bold transition-all hover:border-faint hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                ✉️ &nbsp; E-posta ile devam et
              </button>

              <p className="mt-4 text-center font-body text-[12px] leading-[1.5] text-faint">
                Kayıt olarak{" "}
                <span className="cursor-pointer text-accent">
                  Kullanım Şartları
                </span>
                &apos;nı kabul etmiş olursunuz.
              </p>
            </div>
          )}

          {/* STEP 2 — Role */}
          {step === "role" && (
            <div>
              <p className="mb-[18px] font-body text-sm text-muted">
                Deneyimini kişiselleştirelim.
              </p>
              <div className="mb-[10px] grid grid-cols-2 gap-[10px]">
                {(
                  [
                    {
                      r: "athlete" as AppRole,
                      icon: "🥊",
                      title: "Sporcuyum",
                      desc: "Profil oluştur, keşfedil, sparring bul",
                    },
                    {
                      r: "fan" as AppRole,
                      icon: "👁️",
                      title: "Fanım",
                      desc: "Dövüşçüleri keşfet ve takip et",
                    },
                  ] as const
                ).map(({ r, icon, title, desc }) => (
                  <div
                    key={r}
                    className={`cursor-pointer rounded-[10px] border-[1.5px] p-4 text-center transition-all hover:border-accent ${
                      authRole === r
                        ? "border-accent bg-accent-light"
                        : "border-border"
                    }`}
                    onClick={() => setAuthRole(r)}
                  >
                    <div className="mb-[6px] text-[22px]">{icon}</div>
                    <div className="text-sm font-extrabold tracking-[0.3px]">
                      {title}
                    </div>
                    <div className="mt-[3px] font-body text-[12px] leading-[1.4] text-muted">
                      {desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coach — full width */}
              <div
                className={`flex cursor-pointer items-center gap-[14px] rounded-[10px] border-[1.5px] p-[14px_16px] text-left transition-all hover:border-accent ${
                  authRole === "coach"
                    ? "border-accent bg-accent-light"
                    : "border-border"
                }`}
                onClick={() => setAuthRole("coach")}
              >
                <div className="text-2xl">🏋️</div>
                <div>
                  <div className="text-sm font-extrabold tracking-[0.3px]">
                    Antrenör / Gym
                  </div>
                  <div className="font-body text-[12px] leading-[1.4] text-muted">
                    Salonunu tanıt, sporcuları bul, PT&apos;lerle iş birliği
                    yap
                  </div>
                </div>
              </div>

              <button
                className="mt-[14px] w-full rounded-[9px] bg-accent px-4 py-[13px] font-heading text-sm font-extrabold tracking-[0.5px] text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-faint"
                disabled={!authRole}
                onClick={() =>
                  authRole === "coach"
                    ? setStep("coachtype")
                    : setStep("done")
                }
              >
                Devam Et →
              </button>
            </div>
          )}

          {/* STEP 3 — Coach type */}
          {step === "coachtype" && (
            <div>
              <p className="mb-[18px] font-body text-sm text-muted">
                Bu seçim bazı özellikleri açar/kapatır.
              </p>
              <div className="flex flex-col gap-[10px]">
                {(
                  [
                    {
                      t: "gym" as CoachType,
                      icon: "🏢",
                      title: "Salon / Gym Sahibi",
                      desc: "Salonunu tanıt. Sporcuları keşfet. PT'lere iş teklifi ver.",
                    },
                    {
                      t: "pt" as CoachType,
                      icon: "👤",
                      title: "Personal Trainer",
                      desc: "PT hizmetini tanıt. Sporculara ulaş.",
                    },
                  ] as const
                ).map(({ t, icon, title, desc }) => (
                  <div
                    key={t}
                    className={`flex cursor-pointer items-center gap-[14px] rounded-[10px] border-[1.5px] p-[14px_16px] text-left transition-all hover:border-accent ${
                      authCoachType === t
                        ? "border-accent bg-accent-light"
                        : "border-border"
                    }`}
                    onClick={() => setAuthCoachType(t)}
                  >
                    <div className="text-2xl">{icon}</div>
                    <div>
                      <div className="text-sm font-extrabold tracking-[0.3px]">
                        {title}
                      </div>
                      <div className="font-body text-[12px] leading-[1.4] text-muted">
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="mt-[14px] w-full rounded-[9px] bg-accent px-4 py-[13px] font-heading text-sm font-extrabold tracking-[0.5px] text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-faint"
                disabled={!authCoachType}
                onClick={() => setStep("done")}
              >
                Devam Et →
              </button>
            </div>
          )}

          {/* STEP 4 — Done */}
          {step === "done" && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-border bg-accent-light text-[28px]">
                🎉
              </div>
              <h3 className="mb-2 text-[20px] font-black">Her şey hazır!</h3>
              <p className="mb-6 font-body text-sm leading-[1.6] text-muted">
                {authRole === "athlete" &&
                  "Profilini oluştur, highlightlarını yükle ve keşfedilmeye başla."}
                {authRole === "fan" &&
                  "Sporcuları keşfetmeye ve takip etmeye hazırsın."}
                {authRole === "coach" &&
                  authCoachType === "gym" &&
                  "Salonunu tanıt, sporcuları keşfet ve PT'lerle iş birliği yap."}
                {authRole === "coach" &&
                  authCoachType === "pt" &&
                  "PT profilini oluştur ve sporcularla bağlan."}
              </p>

              <div className="mb-5 flex items-center gap-3 rounded-[10px] border border-border bg-surface p-[14px_16px]">
                <span className="text-[20px]">
                  {authRole === "athlete"
                    ? "🥊"
                    : authRole === "fan"
                      ? "👁️"
                      : authCoachType === "gym"
                        ? "🏢"
                        : "👤"}
                </span>
                <div className="text-left">
                  <div className="text-sm font-extrabold">
                    {authRole === "athlete"
                      ? "Sporcu Hesabı"
                      : authRole === "fan"
                        ? "Fan Hesabı"
                        : authCoachType === "gym"
                          ? "Salon Hesabı"
                          : "PT Hesabı"}
                  </div>
                  <div className="font-body text-[12px] text-muted">
                    Hesap tipini ayarladık ✓
                  </div>
                </div>
              </div>

              <button
                className="w-full rounded-[9px] bg-accent px-4 py-[13px] font-heading text-sm font-extrabold tracking-[0.5px] text-white transition-colors hover:bg-accent-dark"
                onClick={() => onComplete(authRole!, authCoachType)}
              >
                Platforma Gir →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

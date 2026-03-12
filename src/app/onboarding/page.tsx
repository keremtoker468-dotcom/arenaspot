"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types/database";
import {
  Swords,
  Eye,
  Building2,
  Dumbbell,
  User,
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Scale,
  Trophy,
  FileText,
  Camera,
  Briefcase,
  Target,
} from "lucide-react";

const FIGHT_STYLES = ["MMA", "Boks", "Kickboks", "Muay Thai"];
const WEIGHT_CLASSES = [
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Heavyweight",
];
const CITIES = ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana"];

type OnboardingRole = UserRole | null;
type Step = "role" | "basics" | "details" | "done";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<OnboardingRole>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic fields (all roles)
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");

  // Athlete fields
  const [fightStyle, setFightStyle] = useState("");
  const [weightClass, setWeightClass] = useState("");
  const [age, setAge] = useState("");
  const [recordW, setRecordW] = useState("0");
  const [recordL, setRecordL] = useState("0");
  const [recordD, setRecordD] = useState("0");

  // Gym fields
  const [gymName, setGymName] = useState("");

  // PT fields
  const [workplace, setWorkplace] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);

  const steps: Step[] = role === "fan" ? ["role", "basics", "done"] : ["role", "basics", "details", "done"];
  const currentIdx = steps.indexOf(step);
  const totalSteps = steps.length;

  const toggleSpecialization = (s: string) => {
    setSpecializations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSave = async () => {
    if (!role) return;
    setSaving(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Oturum bulunamadi");

      const updateData: Record<string, unknown> = {
        full_name: fullName.trim(),
        username: username.toLowerCase().trim(),
        role,
        bio: bio.trim() || null,
        city: city || null,
      };

      if (role === "athlete") {
        updateData.fight_style = fightStyle || null;
        updateData.weight_class = weightClass || null;
        updateData.age = age ? Number(age) : null;
        updateData.record_w = Number(recordW);
        updateData.record_l = Number(recordL);
        updateData.record_d = Number(recordD);
      }

      if (role === "gym") {
        updateData.gym_name = gymName.trim() || null;
      }

      if (role === "pt") {
        updateData.workplace = workplace.trim() || null;
        updateData.fight_style = specializations.join(", ") || null;
      }

      // Try update first (for OAuth users who already have a row)
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) {
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username: username.toLowerCase().trim(),
            full_name: fullName.trim(),
            role,
            bio: bio.trim() || null,
            city: city || null,
            ...(role === "athlete" && {
              fight_style: fightStyle || null,
              weight_class: weightClass || null,
              age: age ? Number(age) : null,
              record_w: Number(recordW),
              record_l: Number(recordL),
              record_d: Number(recordD),
            }),
            ...(role === "gym" && { gym_name: gymName.trim() || null }),
            ...(role === "pt" && {
              workplace: workplace.trim() || null,
              fight_style: specializations.join(", ") || null,
            }),
          });

        if (insertError) throw insertError;
      }

      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata olustu");
    } finally {
      setSaving(false);
    }
  };

  const canProceedFromBasics = fullName.trim().length >= 2 && username.trim().length >= 3;

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-[540px]">
        {/* Progress bar */}
        {step !== "done" && (
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-[3px] text-faint">
                Adim {currentIdx + 1} / {totalSteps - 1}
              </span>
            </div>
            <div className="h-[3px] rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${((currentIdx + 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP: Role Selection */}
        {step === "role" && (
          <div className="animate-fade-up">
            <h1 className="mb-2 text-[32px] font-black tracking-[-0.5px]">
              Hos geldin!
            </h1>
            <p className="mb-8 font-body text-[15px] leading-[1.5] text-muted">
              Platformu sana gore ayarlayalim. Hangi rolde kullanmak istiyorsun?
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Athlete */}
              <button
                onClick={() => setRole("athlete")}
                className={`group relative overflow-hidden rounded-[12px] border-[1.5px] p-6 text-left transition-all hover:border-accent hover:shadow-[0_4px_20px_rgba(230,57,70,0.1)] ${
                  role === "athlete"
                    ? "border-accent bg-accent-light"
                    : "border-border bg-white"
                }`}
              >
                <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
                <Swords size={24} className="mb-3 text-accent" />
                <div className="mb-1 text-[16px] font-black">Sporcu</div>
                <p className="font-body text-[12px] leading-[1.4] text-muted">
                  Profil olustur, highlight yukle, sparring bul
                </p>
                {role === "athlete" && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                    <Check size={12} />
                  </div>
                )}
              </button>

              {/* Fan */}
              <button
                onClick={() => setRole("fan")}
                className={`group relative overflow-hidden rounded-[12px] border-[1.5px] p-6 text-left transition-all hover:border-accent hover:shadow-[0_4px_20px_rgba(230,57,70,0.1)] ${
                  role === "fan"
                    ? "border-accent bg-accent-light"
                    : "border-border bg-white"
                }`}
              >
                <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
                <Eye size={24} className="mb-3 text-accent" />
                <div className="mb-1 text-[16px] font-black">Fan</div>
                <p className="font-body text-[12px] leading-[1.4] text-muted">
                  Sporculari kesfet ve takip et
                </p>
                {role === "fan" && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                    <Check size={12} />
                  </div>
                )}
              </button>

              {/* Gym */}
              <button
                onClick={() => setRole("gym")}
                className={`group relative overflow-hidden rounded-[12px] border-[1.5px] p-6 text-left transition-all hover:border-accent hover:shadow-[0_4px_20px_rgba(230,57,70,0.1)] ${
                  role === "gym"
                    ? "border-accent bg-accent-light"
                    : "border-border bg-white"
                }`}
              >
                <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
                <Building2 size={24} className="mb-3 text-accent" />
                <div className="mb-1 text-[16px] font-black">Salon / Gym</div>
                <p className="font-body text-[12px] leading-[1.4] text-muted">
                  Salonunu tanit, sporcu ve PT bul
                </p>
                {role === "gym" && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                    <Check size={12} />
                  </div>
                )}
              </button>

              {/* PT */}
              <button
                onClick={() => setRole("pt")}
                className={`group relative overflow-hidden rounded-[12px] border-[1.5px] p-6 text-left transition-all hover:border-accent hover:shadow-[0_4px_20px_rgba(230,57,70,0.1)] ${
                  role === "pt"
                    ? "border-accent bg-accent-light"
                    : "border-border bg-white"
                }`}
              >
                <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
                <Dumbbell size={24} className="mb-3 text-accent" />
                <div className="mb-1 text-[16px] font-black">Personal Trainer</div>
                <p className="font-body text-[12px] leading-[1.4] text-muted">
                  PT hizmetini tanit, sporcularla baglan
                </p>
                {role === "pt" && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                    <Check size={12} />
                  </div>
                )}
              </button>
            </div>

            <button
              disabled={!role}
              onClick={() => setStep("basics")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[9px] bg-accent px-4 py-[13px] font-heading text-sm font-extrabold tracking-[0.5px] text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-faint"
            >
              Devam Et
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* STEP: Basics */}
        {step === "basics" && (
          <div className="animate-fade-up">
            <button
              onClick={() => setStep("role")}
              className="mb-4 flex items-center gap-1 bg-transparent p-0 font-body text-[12px] font-bold text-muted transition-colors hover:text-foreground"
            >
              <ChevronLeft size={14} />
              Geri
            </button>

            <h2 className="mb-1 text-[28px] font-black tracking-[-0.5px]">
              Temel Bilgiler
            </h2>
            <p className="mb-6 font-body text-[15px] text-muted">
              {role === "athlete"
                ? "Sporcu profilinin temelini olustur."
                : role === "gym"
                  ? "Salonunun temel bilgilerini gir."
                  : role === "pt"
                    ? "PT profilinin temelini olustur."
                    : "Profilini olustur ve sporculari kesfetmeye basla."}
            </p>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                  <User size={14} className="text-faint" />
                  {role === "gym" ? "Salon Sahibi Adi" : "Ad Soyad"}
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === "gym" ? "Ahmet Yilmaz" : "Kaan Demir"}
                  className="w-full rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                />
              </div>

              {/* Username */}
              <div>
                <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                  <Target size={14} className="text-faint" />
                  Kullanici Adi
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-faint">
                    @
                  </span>
                  <input
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                      )
                    }
                    placeholder="kaandemir"
                    className="w-full rounded-[8px] border border-border py-[11px] pl-8 pr-4 font-body text-sm outline-none transition-colors focus:border-accent"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                  <FileText size={14} className="text-faint" />
                  {role === "gym"
                    ? "Salon Hakkinda"
                    : role === "pt"
                      ? "Kendin Hakkinda"
                      : "Hakkinda"}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder={
                    role === "athlete"
                      ? "Dovus tecrubeni ve hedeflerini kisa anlat..."
                      : role === "gym"
                        ? "Salonunuzun ozellikleri, egitim programlari..."
                        : role === "pt"
                          ? "Uzmanlik alanin ve tecrubeni anlat..."
                          : "Kendinden kisa bahset..."
                  }
                  className="w-full resize-none rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                />
              </div>

              {/* City */}
              <div>
                <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                  <MapPin size={14} className="text-faint" />
                  Sehir
                </label>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(city === c ? "" : c)}
                      className={`rounded-[6px] border px-3 py-[7px] font-heading text-[13px] font-semibold transition-all ${
                        city === c
                          ? "border-accent bg-accent-light text-accent"
                          : "border-border text-muted hover:border-faint hover:bg-surface"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gym name (gym only in basics) */}
              {role === "gym" && (
                <div>
                  <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                    <Building2 size={14} className="text-faint" />
                    Salon Adi
                  </label>
                  <input
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    placeholder="Power Gym Istanbul"
                    className="w-full rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-[8px] bg-accent-light p-3 font-body text-sm text-accent">
                {error}
              </div>
            )}

            <button
              disabled={!canProceedFromBasics}
              onClick={() => {
                if (role === "fan") {
                  handleSave();
                } else {
                  setStep("details");
                }
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[9px] bg-accent px-4 py-[13px] font-heading text-sm font-extrabold tracking-[0.5px] text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-faint"
            >
              {role === "fan" ? (saving ? "Kaydediliyor..." : "Profili Tamamla") : "Devam Et"}
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* STEP: Details (athlete / gym / pt specific) */}
        {step === "details" && (
          <div className="animate-fade-up">
            <button
              onClick={() => setStep("basics")}
              className="mb-4 flex items-center gap-1 bg-transparent p-0 font-body text-[12px] font-bold text-muted transition-colors hover:text-foreground"
            >
              <ChevronLeft size={14} />
              Geri
            </button>

            {/* ATHLETE DETAILS */}
            {role === "athlete" && (
              <>
                <h2 className="mb-1 text-[28px] font-black tracking-[-0.5px]">
                  Sporcu Detaylari
                </h2>
                <p className="mb-6 font-body text-[15px] text-muted">
                  Dovus stilin, kilo sinifin ve rekorun.
                </p>

                <div className="space-y-4">
                  {/* Fight Style */}
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Swords size={14} className="text-faint" />
                      Dovus Stili
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FIGHT_STYLES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFightStyle(fightStyle === s ? "" : s)}
                          className={`rounded-[6px] border px-4 py-[9px] font-heading text-[13px] font-bold transition-all ${
                            fightStyle === s
                              ? "border-accent bg-accent text-white"
                              : "border-border text-muted hover:border-faint hover:bg-surface"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight Class */}
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Scale size={14} className="text-faint" />
                      Kilo Sinifi
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {WEIGHT_CLASSES.map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setWeightClass(weightClass === w ? "" : w)}
                          className={`rounded-[6px] border px-3 py-[7px] font-heading text-[13px] font-semibold transition-all ${
                            weightClass === w
                              ? "border-accent bg-accent-light text-accent"
                              : "border-border text-muted hover:border-faint hover:bg-surface"
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <User size={14} className="text-faint" />
                      Yas
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min={16}
                      max={60}
                      placeholder="25"
                      className="w-full max-w-[120px] rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>

                  {/* Fight Record */}
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Trophy size={14} className="text-faint" />
                      Dovus Rekoru
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="overflow-hidden rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] p-3 text-center">
                        <label className="text-[10px] font-bold tracking-[1px] text-[#16a34a]">
                          GALIBIYET
                        </label>
                        <input
                          type="number"
                          value={recordW}
                          onChange={(e) => setRecordW(e.target.value)}
                          min={0}
                          className="mt-1 w-full bg-transparent text-center text-[28px] font-black leading-none text-[#16a34a] outline-none"
                        />
                      </div>
                      <div className="overflow-hidden rounded-[10px] border border-accent-border bg-accent-light p-3 text-center">
                        <label className="text-[10px] font-bold tracking-[1px] text-accent">
                          MAGLUBIYET
                        </label>
                        <input
                          type="number"
                          value={recordL}
                          onChange={(e) => setRecordL(e.target.value)}
                          min={0}
                          className="mt-1 w-full bg-transparent text-center text-[28px] font-black leading-none text-accent outline-none"
                        />
                      </div>
                      <div className="overflow-hidden rounded-[10px] border border-border bg-surface p-3 text-center">
                        <label className="text-[10px] font-bold tracking-[1px] text-faint">
                          BERABERLIK
                        </label>
                        <input
                          type="number"
                          value={recordD}
                          onChange={(e) => setRecordD(e.target.value)}
                          min={0}
                          className="mt-1 w-full bg-transparent text-center text-[28px] font-black leading-none text-faint outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* GYM DETAILS */}
            {role === "gym" && (
              <>
                <h2 className="mb-1 text-[28px] font-black tracking-[-0.5px]">
                  Salon Detaylari
                </h2>
                <p className="mb-6 font-body text-[15px] text-muted">
                  Salonunuzun sundugu dovus stilleri ve olanaklar.
                </p>

                <div className="space-y-4">
                  {/* Fight Styles offered */}
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Swords size={14} className="text-faint" />
                      Sunulan Dovus Stilleri
                    </label>
                    <p className="mb-2 font-body text-[12px] text-faint">
                      Birden fazla secebilirsiniz
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {FIGHT_STYLES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSpecialization(s)}
                          className={`rounded-[6px] border px-4 py-[9px] font-heading text-[13px] font-bold transition-all ${
                            specializations.includes(s)
                              ? "border-accent bg-accent text-white"
                              : "border-border text-muted hover:border-faint hover:bg-surface"
                          }`}
                        >
                          {specializations.includes(s) && <Check size={12} className="mr-1 inline" />}
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Salon capacity / extra info placeholder */}
                  <div className="rounded-[10px] border border-border bg-surface p-5">
                    <div className="flex items-start gap-3">
                      <Camera size={18} className="mt-[2px] text-faint" />
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          Salon Fotograflari
                        </div>
                        <p className="mt-1 font-body text-[12px] leading-[1.5] text-muted">
                          Profilinizi olusturduktan sonra Dashboard uzerinden salon fotograflari yukleyebilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* PT DETAILS */}
            {role === "pt" && (
              <>
                <h2 className="mb-1 text-[28px] font-black tracking-[-0.5px]">
                  PT Detaylari
                </h2>
                <p className="mb-6 font-body text-[15px] text-muted">
                  Uzmanlik alanlarin ve calisma bilgilerin.
                </p>

                <div className="space-y-4">
                  {/* Workplace */}
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Briefcase size={14} className="text-faint" />
                      Calistigi Yer
                    </label>
                    <input
                      value={workplace}
                      onChange={(e) => setWorkplace(e.target.value)}
                      placeholder="Power Gym Istanbul veya Freelance"
                      className="w-full rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>

                  {/* Specializations */}
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Swords size={14} className="text-faint" />
                      Uzmanlik Alanlari
                    </label>
                    <p className="mb-2 font-body text-[12px] text-faint">
                      Birden fazla secebilirsiniz
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {FIGHT_STYLES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSpecialization(s)}
                          className={`rounded-[6px] border px-4 py-[9px] font-heading text-[13px] font-bold transition-all ${
                            specializations.includes(s)
                              ? "border-accent bg-accent text-white"
                              : "border-border text-muted hover:border-faint hover:bg-surface"
                          }`}
                        >
                          {specializations.includes(s) && <Check size={12} className="mr-1 inline" />}
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <User size={14} className="text-faint" />
                      Yas
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min={18}
                      max={70}
                      placeholder="30"
                      className="w-full max-w-[120px] rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>

                  {/* Experience info */}
                  <div className="rounded-[10px] border border-border bg-surface p-5">
                    <div className="flex items-start gap-3">
                      <Trophy size={18} className="mt-[2px] text-faint" />
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          Sertifika ve Tecrube
                        </div>
                        <p className="mt-1 font-body text-[12px] leading-[1.5] text-muted">
                          Profilinizi olusturduktan sonra bio alanindan sertifikalarinizi ve tecrubelerinizi detayli yazabilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="mt-4 rounded-[8px] bg-accent-light p-3 font-body text-sm text-accent">
                {error}
              </div>
            )}

            <button
              disabled={saving}
              onClick={handleSave}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[9px] bg-accent px-4 py-[13px] font-heading text-sm font-extrabold tracking-[0.5px] text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Profili Tamamla"}
              <Check size={16} />
            </button>
          </div>
        )}

        {/* STEP: Done */}
        {step === "done" && (
          <div className="animate-fade-up text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent-border bg-accent-light">
              <Check size={36} className="text-accent" />
            </div>

            <h2 className="mb-2 text-[32px] font-black tracking-[-0.5px]">
              Profil Hazir!
            </h2>
            <p className="mb-8 font-body text-[15px] leading-[1.6] text-muted">
              {role === "athlete"
                ? "Sporcu profilin olusturuldu. Simdi sporculari kesfet, sparring partneri bul ve highlight videolarini yukle."
                : role === "gym"
                  ? "Salon profilin olusturuldu. Simdi yetenekli sporculari kesfet ve PT'lerle is birligi yap."
                  : role === "pt"
                    ? "PT profilin olusturuldu. Simdi sporculari kesfet ve onlara ulas."
                    : "Profilin olusturuldu. Simdi sporculari kesfet ve takip et."}
            </p>

            {/* Profile summary card */}
            <div className="mb-6 overflow-hidden rounded-[12px] border border-border bg-white text-left">
              <div className="h-1 bg-accent" />
              <div className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border-[1.5px] border-accent-border bg-accent-light text-[16px] font-black text-accent">
                    {fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[17px] font-extrabold">{fullName}</div>
                    <div className="font-body text-[12px] text-faint">
                      @{username}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-[6px]">
                  <span className="inline-flex items-center gap-1 rounded-[5px] border border-accent-border bg-accent-light px-[9px] py-[3px] text-[12px] font-bold text-accent">
                    {role === "athlete" && <Swords size={11} />}
                    {role === "fan" && <Eye size={11} />}
                    {role === "gym" && <Building2 size={11} />}
                    {role === "pt" && <Dumbbell size={11} />}
                    {role === "athlete"
                      ? "Sporcu"
                      : role === "fan"
                        ? "Fan"
                        : role === "gym"
                          ? "Salon"
                          : "PT"}
                  </span>
                  {city && (
                    <span className="inline-flex items-center gap-1 rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                      <MapPin size={10} />
                      {city}
                    </span>
                  )}
                  {role === "athlete" && fightStyle && (
                    <span className="rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                      {fightStyle}
                    </span>
                  )}
                  {role === "athlete" && weightClass && (
                    <span className="rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                      {weightClass}
                    </span>
                  )}
                  {role === "gym" && gymName && (
                    <span className="rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                      {gymName}
                    </span>
                  )}
                  {role === "pt" && workplace && (
                    <span className="rounded-[5px] border border-border bg-surface px-[9px] py-[3px] text-[12px] font-bold text-muted">
                      {workplace}
                    </span>
                  )}
                </div>

                {role === "athlete" && (
                  <div className="mt-3 flex gap-[6px]">
                    <div className="flex-1 rounded-[7px] bg-[#f0fdf4] p-[6px_4px] text-center">
                      <div className="text-[18px] font-black leading-none text-[#16a34a]">
                        {recordW}
                      </div>
                      <div className="mt-[2px] text-[9px] font-bold tracking-[1px] text-[#16a34a]">
                        W
                      </div>
                    </div>
                    <div className="flex-1 rounded-[7px] bg-accent-light p-[6px_4px] text-center">
                      <div className="text-[18px] font-black leading-none text-accent">
                        {recordL}
                      </div>
                      <div className="mt-[2px] text-[9px] font-bold tracking-[1px] text-accent">
                        L
                      </div>
                    </div>
                    <div className="flex-1 rounded-[7px] bg-surface p-[6px_4px] text-center">
                      <div className="text-[18px] font-black leading-none text-faint">
                        {recordD}
                      </div>
                      <div className="mt-[2px] text-[9px] font-bold tracking-[1px] text-faint">
                        D
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => router.push("/discover")}
                className="flex flex-1 items-center justify-center gap-2 rounded-[9px] bg-accent px-4 py-[13px] font-heading text-sm font-extrabold tracking-[0.5px] text-white transition-colors hover:bg-accent-dark"
              >
                Sporculari Kesfet
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex flex-1 items-center justify-center gap-2 rounded-[9px] border-[1.5px] border-border bg-white px-4 py-[12px] font-heading text-sm font-extrabold tracking-[0.5px] text-foreground transition-colors hover:bg-surface"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

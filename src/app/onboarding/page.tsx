"use client";

import { useState, useEffect } from "react";
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
  const [userId, setUserId] = useState<string | null>(null);

  // Basic fields
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      setUserId(user.id);

      supabase
        .from("profiles")
        .select("id, username, full_name, role")
        .eq("id", user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile) {
            if (profile.username) setUsername(profile.username);
            if (profile.full_name) setFullName(profile.full_name);
          }
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps: Step[] =
    role === "fan"
      ? ["role", "basics", "done"]
      : ["role", "basics", "details", "done"];
  const currentIdx = steps.indexOf(step);
  const totalSteps = steps.length;

  const toggleSpecialization = (s: string) => {
    setSpecializations((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSave = async () => {
    if (!role || !userId) return;
    setSaving(true);
    setError(null);

    try {
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

      // Profile is always auto-created by database trigger, so always update
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);
      if (updateError) throw updateError;

      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata olustu");
    } finally {
      setSaving(false);
    }
  };

  const canProceedFromBasics =
    fullName.trim().length >= 2 && username.trim().length >= 3;

  if (userId === null) {
    return (
      <div className="flex min-h-[calc(100vh-60px)] items-center justify-center">
        <div className="text-sm text-muted">Yukleniyor...</div>
      </div>
    );
  }

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
                style={{
                  width: `${((currentIdx + 1) / (totalSteps - 1)) * 100}%`,
                }}
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
              {(
                [
                  { r: "athlete" as UserRole, Icon: Swords, title: "Sporcu", desc: "Profil olustur, highlight yukle, sparring bul" },
                  { r: "fan" as UserRole, Icon: Eye, title: "Fan", desc: "Sporculari kesfet ve takip et" },
                  { r: "gym" as UserRole, Icon: Building2, title: "Salon / Gym", desc: "Salonunu tanit, sporcu ve PT bul" },
                  { r: "pt" as UserRole, Icon: Dumbbell, title: "Personal Trainer", desc: "PT hizmetini tanit, sporcularla baglan" },
                ] as const
              ).map(({ r, Icon, title, desc }) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`group relative overflow-hidden rounded-[12px] border-[1.5px] p-6 text-left transition-all hover:border-accent hover:shadow-[0_4px_20px_rgba(230,57,70,0.1)] ${
                    role === r ? "border-accent bg-accent-light" : "border-border bg-white"
                  }`}
                >
                  <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
                  <Icon size={24} className="mb-3 text-accent" />
                  <div className="mb-1 text-[16px] font-black">{title}</div>
                  <p className="font-body text-[12px] leading-[1.4] text-muted">{desc}</p>
                  {role === r && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                      <Check size={12} />
                    </div>
                  )}
                </button>
              ))}
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
              Profilinin temelini olustur.
            </p>

            <div className="space-y-4">
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

              <div>
                <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                  <Target size={14} className="text-faint" />
                  Kullanici Adi
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-faint">@</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    placeholder="kaandemir"
                    className="w-full rounded-[8px] border border-border py-[11px] pl-8 pr-4 font-body text-sm outline-none transition-colors focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                  <FileText size={14} className="text-faint" />
                  Hakkinda
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Kendinden kisa bahset..."
                  className="w-full resize-none rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                />
              </div>

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
              disabled={!canProceedFromBasics || saving}
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

        {/* STEP: Details */}
        {step === "details" && (
          <div className="animate-fade-up">
            <button
              onClick={() => setStep("basics")}
              className="mb-4 flex items-center gap-1 bg-transparent p-0 font-body text-[12px] font-bold text-muted transition-colors hover:text-foreground"
            >
              <ChevronLeft size={14} />
              Geri
            </button>

            {role === "athlete" && (
              <>
                <h2 className="mb-1 text-[28px] font-black tracking-[-0.5px]">Sporcu Detaylari</h2>
                <p className="mb-6 font-body text-[15px] text-muted">Dovus stilin, kilo sinifin ve rekorun.</p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Swords size={14} className="text-faint" />
                      Dovus Stili
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FIGHT_STYLES.map((s) => (
                        <button key={s} type="button" onClick={() => setFightStyle(fightStyle === s ? "" : s)}
                          className={`rounded-[6px] border px-4 py-[9px] font-heading text-[13px] font-bold transition-all ${
                            fightStyle === s ? "border-accent bg-accent text-white" : "border-border text-muted hover:border-faint hover:bg-surface"
                          }`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Scale size={14} className="text-faint" />
                      Kilo Sinifi
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {WEIGHT_CLASSES.map((w) => (
                        <button key={w} type="button" onClick={() => setWeightClass(weightClass === w ? "" : w)}
                          className={`rounded-[6px] border px-3 py-[7px] font-heading text-[13px] font-semibold transition-all ${
                            weightClass === w ? "border-accent bg-accent-light text-accent" : "border-border text-muted hover:border-faint hover:bg-surface"
                          }`}
                        >{w}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <User size={14} className="text-faint" />
                      Yas
                    </label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min={16} max={60} placeholder="25"
                      className="w-full max-w-[120px] rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Trophy size={14} className="text-faint" />
                      Dovus Rekoru
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="overflow-hidden rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] p-3 text-center">
                        <label className="text-[10px] font-bold tracking-[1px] text-[#16a34a]">GALIBIYET</label>
                        <input type="number" value={recordW} onChange={(e) => setRecordW(e.target.value)} min={0}
                          className="mt-1 w-full bg-transparent text-center text-[28px] font-black leading-none text-[#16a34a] outline-none"
                        />
                      </div>
                      <div className="overflow-hidden rounded-[10px] border border-accent-border bg-accent-light p-3 text-center">
                        <label className="text-[10px] font-bold tracking-[1px] text-accent">MAGLUBIYET</label>
                        <input type="number" value={recordL} onChange={(e) => setRecordL(e.target.value)} min={0}
                          className="mt-1 w-full bg-transparent text-center text-[28px] font-black leading-none text-accent outline-none"
                        />
                      </div>
                      <div className="overflow-hidden rounded-[10px] border border-border bg-surface p-3 text-center">
                        <label className="text-[10px] font-bold tracking-[1px] text-faint">BERABERLIK</label>
                        <input type="number" value={recordD} onChange={(e) => setRecordD(e.target.value)} min={0}
                          className="mt-1 w-full bg-transparent text-center text-[28px] font-black leading-none text-faint outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {role === "gym" && (
              <>
                <h2 className="mb-1 text-[28px] font-black tracking-[-0.5px]">Salon Detaylari</h2>
                <p className="mb-6 font-body text-[15px] text-muted">Salonunuzun sundugu dovus stilleri.</p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Swords size={14} className="text-faint" />
                      Sunulan Dovus Stilleri
                    </label>
                    <p className="mb-2 font-body text-[12px] text-faint">Birden fazla secebilirsiniz</p>
                    <div className="flex flex-wrap gap-2">
                      {FIGHT_STYLES.map((s) => (
                        <button key={s} type="button" onClick={() => toggleSpecialization(s)}
                          className={`rounded-[6px] border px-4 py-[9px] font-heading text-[13px] font-bold transition-all ${
                            specializations.includes(s) ? "border-accent bg-accent text-white" : "border-border text-muted hover:border-faint hover:bg-surface"
                          }`}
                        >
                          {specializations.includes(s) && <Check size={12} className="mr-1 inline" />}
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[10px] border border-border bg-surface p-5">
                    <div className="flex items-start gap-3">
                      <Camera size={18} className="mt-[2px] text-faint" />
                      <div>
                        <div className="text-sm font-bold text-foreground">Salon Fotograflari</div>
                        <p className="mt-1 font-body text-[12px] leading-[1.5] text-muted">
                          Profilinizi olusturduktan sonra Dashboard uzerinden salon fotograflari yukleyebilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {role === "pt" && (
              <>
                <h2 className="mb-1 text-[28px] font-black tracking-[-0.5px]">PT Detaylari</h2>
                <p className="mb-6 font-body text-[15px] text-muted">Uzmanlik alanlarin ve calisma bilgilerin.</p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Briefcase size={14} className="text-faint" />
                      Calistigi Yer
                    </label>
                    <input value={workplace} onChange={(e) => setWorkplace(e.target.value)} placeholder="Power Gym Istanbul veya Freelance"
                      className="w-full rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <Swords size={14} className="text-faint" />
                      Uzmanlik Alanlari
                    </label>
                    <p className="mb-2 font-body text-[12px] text-faint">Birden fazla secebilirsiniz</p>
                    <div className="flex flex-wrap gap-2">
                      {FIGHT_STYLES.map((s) => (
                        <button key={s} type="button" onClick={() => toggleSpecialization(s)}
                          className={`rounded-[6px] border px-4 py-[9px] font-heading text-[13px] font-bold transition-all ${
                            specializations.includes(s) ? "border-accent bg-accent text-white" : "border-border text-muted hover:border-faint hover:bg-surface"
                          }`}
                        >
                          {specializations.includes(s) && <Check size={12} className="mr-1 inline" />}
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-[6px] flex items-center gap-[6px] font-body text-sm font-medium text-muted">
                      <User size={14} className="text-faint" />
                      Yas
                    </label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min={18} max={70} placeholder="30"
                      className="w-full max-w-[120px] rounded-[8px] border border-border px-4 py-[11px] font-body text-sm outline-none transition-colors focus:border-accent"
                    />
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

            <h2 className="mb-2 text-[32px] font-black tracking-[-0.5px]">Profil Hazir!</h2>
            <p className="mb-8 font-body text-[15px] leading-[1.6] text-muted">
              {role === "athlete"
                ? "Sporcu profilin olusturuldu. Simdi sporculari kesfet ve sparring partneri bul."
                : role === "gym"
                  ? "Salon profilin olusturuldu. Simdi sporculari kesfet."
                  : role === "pt"
                    ? "PT profilin olusturuldu. Simdi sporculari kesfet."
                    : "Profilin olusturuldu. Simdi sporculari kesfet."}
            </p>

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

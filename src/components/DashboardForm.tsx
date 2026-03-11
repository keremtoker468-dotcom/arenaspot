"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";

const WEIGHT_CLASSES = [
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Heavyweight",
];

const FIGHT_STYLES = ["MMA", "Boks", "Kickboks", "Muay Thai"];

export default function DashboardForm({ profile }: { profile: Profile }) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: profile.full_name,
    bio: profile.bio ?? "",
    city: profile.city ?? "",
    age: profile.age ?? "",
    weight_class: profile.weight_class ?? "",
    fight_style: profile.fight_style ?? "",
    record_w: profile.record_w,
    record_l: profile.record_l,
    record_d: profile.record_d,
    gym_name: profile.gym_name ?? "",
    workplace: profile.workplace ?? "",
  });

  const isAthlete = profile.role === "athlete";
  const isGym = profile.role === "gym";
  const isPT = profile.role === "pt";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const updateData: Partial<Profile> = {
      full_name: form.full_name,
      bio: form.bio || null,
      city: form.city || null,
      age: form.age ? Number(form.age) : null,
    };

    if (isAthlete) {
      updateData.weight_class = form.weight_class || null;
      updateData.fight_style = form.fight_style || null;
      updateData.record_w = Number(form.record_w);
      updateData.record_l = Number(form.record_l);
      updateData.record_d = Number(form.record_d);
    }

    if (isGym) {
      updateData.gym_name = form.gym_name || null;
    }

    if (isPT) {
      updateData.workplace = form.workplace || null;
      updateData.fight_style = form.fight_style || null;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", profile.id);

    setSaving(false);

    if (error) {
      setMessage("Kaydedilemedi. Lütfen tekrar deneyin.");
    } else {
      setMessage("Profil güncellendi!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[12px] border border-border bg-white p-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block font-body text-sm font-medium text-muted">
            Ad Soyad
          </label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-sm font-medium text-muted">
            Şehir
          </label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="İstanbul"
            className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block font-body text-sm font-medium text-muted">
          Bio
        </label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
        />
      </div>

      {isAthlete && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-muted">
                Yaş
              </label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                min={16}
                max={60}
                className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-muted">
                Kilo Sınıfı
              </label>
              <select
                name="weight_class"
                value={form.weight_class}
                onChange={handleChange}
                className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
              >
                <option value="">Seç...</option>
                {WEIGHT_CLASSES.map((wc) => (
                  <option key={wc} value={wc}>
                    {wc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-body text-sm font-medium text-muted">
                Dövüş Stili
              </label>
              <select
                name="fight_style"
                value={form.fight_style}
                onChange={handleChange}
                className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
              >
                <option value="">Seç...</option>
                {FIGHT_STYLES.map((fs) => (
                  <option key={fs} value={fs}>
                    {fs}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block font-body text-sm font-medium text-muted">
              Dövüş Rekoru
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-body text-xs text-faint">Galibiyet</label>
                <input
                  name="record_w"
                  type="number"
                  value={form.record_w}
                  onChange={handleChange}
                  min={0}
                  className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="font-body text-xs text-faint">Mağlubiyet</label>
                <input
                  name="record_l"
                  type="number"
                  value={form.record_l}
                  onChange={handleChange}
                  min={0}
                  className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="font-body text-xs text-faint">Beraberlik</label>
                <input
                  name="record_d"
                  type="number"
                  value={form.record_d}
                  onChange={handleChange}
                  min={0}
                  className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {isGym && (
        <div className="mt-4">
          <label className="mb-1 block font-body text-sm font-medium text-muted">
            Salon Adı
          </label>
          <input
            name="gym_name"
            value={form.gym_name}
            onChange={handleChange}
            placeholder="Power Gym Istanbul"
            className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
          />
        </div>
      )}

      {isPT && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block font-body text-sm font-medium text-muted">
              Çalıştığı Yer
            </label>
            <input
              name="workplace"
              value={form.workplace}
              onChange={handleChange}
              placeholder="Freelance"
              className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block font-body text-sm font-medium text-muted">
              Uzmanlık Alanları
            </label>
            <input
              name="fight_style"
              value={form.fight_style}
              onChange={handleChange}
              placeholder="Kickboks, Muay Thai"
              className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
            />
          </div>
        </div>
      )}

      {message && (
        <p
          className={`mt-4 font-body text-sm ${message.includes("edilemedi") ? "text-accent" : "text-[#16a34a]"}`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-6 w-full rounded-[9px] bg-accent px-4 py-[10px] font-heading text-sm font-extrabold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
      >
        {saving ? "Kaydediliyor..." : "Profili Kaydet"}
      </button>
    </form>
  );
}

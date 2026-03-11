"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";

const WEIGHT_CLASSES = [
  "Strawweight",
  "Flyweight",
  "Bantamweight",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight",
];

export default function DashboardForm({ profile }: { profile: Profile }) {
  const router = useRouter();
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
  });

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

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        bio: form.bio || null,
        city: form.city || null,
        age: form.age ? Number(form.age) : null,
        weight_class: form.weight_class || null,
        fight_style: form.fight_style || null,
        record_w: Number(form.record_w),
        record_l: Number(form.record_l),
        record_d: Number(form.record_d),
      })
      .eq("id", profile.id);

    setSaving(false);

    if (error) {
      setMessage("Failed to save. Please try again.");
    } else {
      setMessage("Profile updated!");
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Las Vegas, NV"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          placeholder="Tell scouts and fans about yourself..."
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            min={16}
            max={60}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight Class
          </label>
          <select
            name="weight_class"
            value={form.weight_class}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select...</option>
            {WEIGHT_CLASSES.map((wc) => (
              <option key={wc} value={wc}>
                {wc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fight Style
          </label>
          <input
            name="fight_style"
            value={form.fight_style}
            onChange={handleChange}
            placeholder="e.g. Striker, BJJ"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fight Record
        </label>
        <div className="mt-1 grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500">Wins</label>
            <input
              name="record_w"
              type="number"
              value={form.record_w}
              onChange={handleChange}
              min={0}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Losses</label>
            <input
              name="record_l"
              type="number"
              value={form.record_l}
              onChange={handleChange}
              min={0}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Draws</label>
            <input
              name="record_d"
              type="number"
              value={form.record_d}
              onChange={handleChange}
              min={0}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {message && (
        <p
          className={`text-sm ${message.includes("Failed") ? "text-red-600" : "text-green-600"}`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}

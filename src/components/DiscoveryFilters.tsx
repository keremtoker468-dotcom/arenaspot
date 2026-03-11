"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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

const FIGHT_STYLES = [
  "Striker",
  "Grappler",
  "Wrestler",
  "BJJ",
  "Muay Thai",
  "Boxing",
  "MMA",
  "Kickboxing",
];

export default function DiscoveryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("q", search);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearch} className="flex-1 sm:max-w-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search athletes..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-10 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-accent px-3 py-1 text-xs font-semibold text-white hover:bg-accent-dark"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex gap-3">
        <select
          value={searchParams.get("weight_class") ?? ""}
          onChange={(e) => updateFilter("weight_class", e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">All Weight Classes</option>
          {WEIGHT_CLASSES.map((wc) => (
            <option key={wc} value={wc}>
              {wc}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("fight_style") ?? ""}
          onChange={(e) => updateFilter("fight_style", e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">All Styles</option>
          {FIGHT_STYLES.map((fs) => (
            <option key={fs} value={fs}>
              {fs}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

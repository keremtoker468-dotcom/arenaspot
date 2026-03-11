import Link from "next/link";
import type { Profile } from "@/lib/types/database";

export default function AthleteCard({ athlete }: { athlete: Profile }) {
  const record = `${athlete.record_w}-${athlete.record_l}-${athlete.record_d}`;

  return (
    <Link
      href={`/athlete/${athlete.username}`}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative h-48 bg-gray-100">
        {athlete.avatar_url ? (
          <img
            src={athlete.avatar_url}
            alt={athlete.full_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200">
            <span className="font-heading text-4xl font-bold text-gray-400">
              {athlete.full_name.charAt(0)}
            </span>
          </div>
        )}
        {athlete.is_verified && (
          <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
            Verified
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-accent">
              {athlete.full_name}
            </h3>
            <p className="text-sm text-gray-500">@{athlete.username}</p>
          </div>
          <span className="rounded-md bg-gray-100 px-2 py-1 font-heading text-sm font-semibold text-gray-700">
            {record}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {athlete.weight_class && (
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-accent">
              {athlete.weight_class}
            </span>
          )}
          {athlete.fight_style && (
            <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {athlete.fight_style}
            </span>
          )}
          {athlete.city && (
            <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {athlete.city}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

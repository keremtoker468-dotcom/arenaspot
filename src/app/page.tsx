import { createClient } from "@/lib/supabase/server";
import AthleteCard from "@/components/AthleteCard";
import DiscoveryFilters from "@/components/DiscoveryFilters";

export const dynamic = "force-dynamic";
import type { Profile } from "@/lib/types/database";

export default async function DiscoveryPage({
  searchParams,
}: {
  searchParams: { weight_class?: string; fight_style?: string; q?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .order("followers_count", { ascending: false });

  if (searchParams.weight_class) {
    query = query.eq("weight_class", searchParams.weight_class);
  }
  if (searchParams.fight_style) {
    query = query.eq("fight_style", searchParams.fight_style);
  }
  if (searchParams.q) {
    query = query.or(
      `full_name.ilike.%${searchParams.q}%,username.ilike.%${searchParams.q}%`
    );
  }

  const { data } = await query;
  const athletes = (data ?? []) as Profile[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          DISCOVER MMA ATHLETES
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Find rising fighters, watch highlights, and follow their journey to
          the top.
        </p>
      </div>

      {/* Filters */}
      <DiscoveryFilters />

      {/* Athletes Grid */}
      {athletes.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {athletes.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="font-heading text-xl font-semibold text-gray-400">
            No athletes found
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </div>
  );
}

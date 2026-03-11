import { CardSkeleton } from "@/components/ui/Skeleton";

export default function DiscoverLoading() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-7 lg:px-10">
      <div className="mb-6">
        <div className="mb-2 h-8 w-48 animate-pulse rounded-[8px] bg-surface" />
        <div className="h-4 w-64 animate-pulse rounded-[6px] bg-surface" />
      </div>
      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

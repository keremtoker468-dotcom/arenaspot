import { ProfileSkeleton } from "@/components/ui/Skeleton";

export default function AthleteLoading() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6 lg:px-10">
      <div className="mb-5 h-4 w-24 animate-pulse rounded-[6px] bg-surface" />
      <ProfileSkeleton />
    </div>
  );
}

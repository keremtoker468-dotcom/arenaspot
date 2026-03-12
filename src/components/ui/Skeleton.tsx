export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[8px] bg-surface ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-white p-5">
      <div className="mb-[14px] flex items-start gap-[11px]">
        <Skeleton className="h-[50px] w-[50px] flex-shrink-0 rounded-[11px]" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="mb-3 flex gap-[6px]">
        <Skeleton className="h-[22px] w-16 rounded-[5px]" />
        <Skeleton className="h-[22px] w-20 rounded-[5px]" />
      </div>
      <div className="mb-3 flex gap-[6px]">
        <Skeleton className="h-[52px] flex-1 rounded-[7px]" />
        <Skeleton className="h-[52px] flex-1 rounded-[7px]" />
        <Skeleton className="h-[52px] flex-1 rounded-[7px]" />
      </div>
      <Skeleton className="mb-3 h-10 w-full" />
      <div className="flex items-center justify-between border-t border-border pt-[10px]">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-20 rounded-[6px]" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr_220px]">
      <div className="flex flex-col gap-[14px]">
        <div className="rounded-[12px] border border-border bg-white p-[22px]">
          <Skeleton className="mx-auto mb-[14px] h-[72px] w-[72px] rounded-[14px]" />
          <Skeleton className="mx-auto mb-2 h-5 w-36" />
          <Skeleton className="mx-auto h-3 w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="rounded-[12px] border border-border bg-white p-[22px]">
          <Skeleton className="mb-[14px] h-3 w-24" />
          <div className="flex gap-3">
            <Skeleton className="h-24 flex-1 rounded-[10px]" />
            <Skeleton className="h-24 flex-1 rounded-[10px]" />
            <Skeleton className="h-24 flex-1 rounded-[10px]" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="h-32 rounded-[12px]" />
      </div>
    </div>
  );
}

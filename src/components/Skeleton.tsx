export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-rich-black-700/20 ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-bx-border rounded-lg overflow-hidden bg-bx-bg/40">
      <Skeleton className="w-full h-56" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="bg-bx-card rounded-lg p-6 border border-bx-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: image slider area */}
        <Skeleton className="w-full aspect-[4/3]" />
        {/* Right: details area (title + actions, description, metadata) */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-9 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

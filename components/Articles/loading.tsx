import { Skeleton } from "../ui/skeleton";

function SkeletonCard() {
  return (
    <div>
      <Skeleton className="aspect-[4/3] w-full rounded-none bg-border" />
      <Skeleton className="mt-4 h-3 w-40 rounded-none bg-border" />
      <Skeleton className="mt-3 h-6 w-[85%] rounded-none bg-border" />
      <Skeleton className="mt-2 h-4 w-full rounded-none bg-border" />
      <Skeleton className="mt-2 h-4 w-[60%] rounded-none bg-border" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-6 border-b border-border pb-4">
        <Skeleton className="h-4 w-12 rounded-none bg-border" />
        <Skeleton className="h-4 w-16 rounded-none bg-border" />
        <Skeleton className="h-4 w-16 rounded-none bg-border" />
        <Skeleton className="h-4 w-24 rounded-none bg-border" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

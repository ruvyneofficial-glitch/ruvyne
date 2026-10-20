import { Skeleton } from "../ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
      <Skeleton className="aspect-square w-full rounded-none bg-border" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-40 rounded-none bg-border" />
        <Skeleton className="h-6 w-[85%] rounded-none bg-border" />
        <Skeleton className="h-4 w-full rounded-none bg-border" />
        <Skeleton className="h-4 w-[60%] rounded-none bg-border" />
      </div>
    </div>
  );
}

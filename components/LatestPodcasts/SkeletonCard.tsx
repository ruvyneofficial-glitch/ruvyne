import { Skeleton } from "../ui/skeleton";

export default function SkeletonCard() {
  return (
    <div>
      <Skeleton className="aspect-square w-full rounded-none bg-border" />
      <Skeleton className="mt-4 h-3 w-24 rounded-none bg-border" />
      <Skeleton className="mt-3 h-6 w-[80%] rounded-none bg-border" />
      <Skeleton className="mt-3 h-3 w-32 rounded-none bg-border" />
    </div>
  );
}

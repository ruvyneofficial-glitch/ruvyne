import { Skeleton } from "../ui/skeleton";

function SkeletonAuthor() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Skeleton className="aspect-square w-full max-w-[10rem] rounded-full bg-border" />
      <Skeleton className="h-6 w-28 rounded-none bg-border" />
      <Skeleton className="h-3 w-20 rounded-none bg-border" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
      <SkeletonAuthor />
      <SkeletonAuthor />
      <SkeletonAuthor />
      <SkeletonAuthor />
      <SkeletonAuthor />
      <SkeletonAuthor />
    </div>
  );
}

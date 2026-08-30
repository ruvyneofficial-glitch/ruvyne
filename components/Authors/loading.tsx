import { Skeleton } from "../ui/skeleton";

function SkeletonAuthor() {
  return (
    <Skeleton className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 md:gap-12 p-4 md:p-8 bg-white border border-[#a1a1a1] rounded-none">
      <Skeleton className="bg-[#a1a1a1] w-[9.375rem] h-[9.375rem] shrink-0 rounded-full" />
      <div className="flex flex-col gap-4 w-full">
        <Skeleton className="bg-[#a1a1a1] h-8 w-[60%] rounded-none" />
        <div className="flex gap-8">
          <Skeleton className="bg-[#a1a1a1] h-5 w-28 rounded-none" />
          <Skeleton className="bg-[#a1a1a1] h-5 w-24 rounded-none" />
        </div>
      </div>
    </Skeleton>
  );
}

export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 mb-48 max-w-[95rem] w-full mx-auto border border-black border-collapse">
      <SkeletonAuthor />
      <SkeletonAuthor />
      <SkeletonAuthor />
      <SkeletonAuthor />
    </div>
  );
}

import { Skeleton } from "../ui/skeleton";

function SkeletonCard() {
  return (
    <Skeleton className="bg-white border border-[#a1a1a1] p-8 rounded-none">
      <div className="flex items-center justify-between">
        <Skeleton className="bg-[#a1a1a1] h-5 w-32 rounded-none" />
        <Skeleton className="bg-white h-[2.625rem] w-24 border border-[#a1a1a1] rounded-full" />
      </div>
      <Skeleton className="bg-[#a1a1a1] w-full aspect-square my-8 rounded-none" />
      <Skeleton className="bg-[#a1a1a1] h-8 w-[80%] mb-3 rounded-none" />
      <div className="flex flex-col gap-2 mt-3 mb-12">
        <Skeleton className="bg-[#a1a1a1] h-4 w-full rounded-none" />
        <Skeleton className="bg-[#a1a1a1] h-4 w-full rounded-none" />
        <Skeleton className="bg-[#a1a1a1] h-4 w-[60%] rounded-none" />
      </div>
      <div className="flex flex-wrap gap-4">
        <Skeleton className="bg-[#a1a1a1] h-5 w-40 rounded-none" />
        <Skeleton className="bg-[#a1a1a1] h-5 w-28 rounded-none" />
      </div>
    </Skeleton>
  );
}

export default function Loading() {
  return (
    <div className="max-w-[95rem] w-full mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-2 md:gap-0 my-6">
        <Skeleton className="bg-[#a1a1a1] h-6 w-28 rounded-none" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="bg-white h-[2.625rem] w-20 border border-[#a1a1a1] rounded-full" />
          <Skeleton className="bg-white h-[2.625rem] w-24 border border-[#a1a1a1] rounded-full" />
          <Skeleton className="bg-white h-[2.625rem] w-24 border border-[#a1a1a1] rounded-full" />
          <Skeleton className="bg-white h-[2.625rem] w-32 border border-[#a1a1a1] rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[#a1a1a1] border-collapse mb-48">
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

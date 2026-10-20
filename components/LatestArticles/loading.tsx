import { Skeleton } from "../ui/skeleton";
import SkeletonCard from "./SkeletonCard";

export default function Loading() {
  return (
    <div>
      <div className="-mx-4 mt-4 md:mx-0 md:mt-8">
        <Skeleton className="aspect-[4/5] w-full rounded-none bg-border sm:aspect-[16/9] lg:aspect-[21/9]" />
        <div className="relative mx-4 -mt-20 space-y-4 bg-muted p-6 sm:mx-8 sm:-mt-28 sm:p-10 lg:mx-16 lg:max-w-4xl">
          <Skeleton className="h-3 w-24 rounded-none bg-border" />
          <Skeleton className="h-12 w-[90%] rounded-none bg-border" />
          <Skeleton className="h-5 w-[70%] rounded-none bg-border" />
        </div>
      </div>
      <Skeleton className="mx-auto my-12 h-12 w-64 rounded-none bg-border md:my-16" />
      <div className="flex flex-col gap-14 lg:flex-row xl:gap-20">
        <div className="flex-1 space-y-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <Skeleton className="h-[32rem] rounded-none bg-border lg:w-[20rem]" />
      </div>
    </div>
  );
}

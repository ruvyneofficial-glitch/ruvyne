import SkeletonCard from "./SkeletonCard";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

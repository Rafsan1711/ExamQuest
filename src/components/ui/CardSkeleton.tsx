import { Skeleton } from './Skeleton';

export const CardSkeleton = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
};

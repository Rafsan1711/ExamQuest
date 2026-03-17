import { Skeleton } from './Skeleton';

export const TableSkeleton = () => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="hidden sm:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/20">
              <th className="p-4 w-1/4"><Skeleton className="h-4 w-24" /></th>
              <th className="p-4 w-1/4"><Skeleton className="h-4 w-32" /></th>
              <th className="p-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></th>
              <th className="p-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></th>
              <th className="p-4 text-center"><Skeleton className="h-4 w-12 mx-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-white/[0.02]">
                <td className="p-4 border-r border-white/5 align-top">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="p-4 border-r border-white/5">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="space-y-4 flex flex-col items-center">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-5 rounded" />
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="space-y-4 flex flex-col items-center">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-5 rounded" />
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="space-y-4 flex flex-col items-center">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-5 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Skeleton */}
      <div className="sm:hidden space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-20 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

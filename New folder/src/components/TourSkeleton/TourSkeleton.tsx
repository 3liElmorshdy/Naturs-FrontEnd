export function TourSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden border border-slate-200 dark:border-slate-700">
      {/* Skeleton Image */}
      <div className="h-48 bg-slate-300 dark:bg-slate-700 animate-pulse"></div>


      <div className="p-6">
        {/* Skeleton Title */}
        <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-3 animate-pulse"></div>


{/* Skeleton Location */}
 <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mb-4 animate-pulse"></div>


        {/* Skeleton Price & Rating */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
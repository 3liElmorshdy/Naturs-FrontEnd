import { Loader2 } from "lucide-react";
import touristIcon from "../../assets/tourist-svgrepo-com.svg";

type PageLoaderProps = {
  message?: string;
  minHeight?: string;
};

export default function PageLoader({
  message = "Loading...",
  minHeight = "min-h-[50vh]",
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full ${minHeight} flex-grow flex-col items-center justify-center p-6 transition-all duration-300`}
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing backdrop aura */}
        <div className="absolute -inset-4 rounded-full bg-teal-500/10 blur-xl dark:bg-teal-400/10" />

        {/* Outer animated spinner with logo center */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Subtle outer track */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
          {/* Animated spinning arc */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-teal-600 dark:border-t-teal-400" />

          {/* Center icon / tourist logo */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
            <img
              src={touristIcon}
              alt=""
              className="h-6 w-6 object-contain opacity-90 transition-transform duration-300 dark:invert"
            />
          </div>
        </div>

        {/* Informative text & subtle spinner */}
        <div className="mt-5 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-medium tracking-wide text-slate-600 dark:text-slate-300">
            {message}
          </span>
        </div>
      </div>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

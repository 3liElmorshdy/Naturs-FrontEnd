import { Download } from "lucide-react";
import React from "react";
import { usePWAInstall } from "../../hooks/usePWAInstall";

interface InstallButtonProps {
  className?: string;
}

export function InstallButton({ className = "" }: InstallButtonProps) {
  const { isInstallable, installApp } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button
      type="button"
      onClick={installApp}
      className={`inline-flex items-center gap-1.5 rounded-xl border border-teal-600/30 bg-teal-50/60 px-3 py-1.5 text-xs sm:text-sm font-semibold text-teal-700 shadow-sm transition hover:border-teal-600 hover:bg-teal-100/80 hover:text-teal-800 active:scale-95 dark:border-teal-500/40 dark:bg-teal-500/10 dark:text-teal-300 dark:hover:border-teal-400 dark:hover:bg-teal-500/20 dark:hover:text-teal-200 ${className}`}
      title="Install App"
      aria-label="Install App"
    >
      <Download className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
      <span className="hidden sm:inline">Install App</span>
      <span className="sm:hidden">Install</span>
    </button>
  );
}

export default InstallButton;

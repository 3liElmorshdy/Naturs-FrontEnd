export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function inputClassName(hasError = false) {
  return [
    "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:ring-4 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600",

    hasError
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-500/60 dark:focus:border-rose-400"
      : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/10 dark:border-slate-700 dark:focus:border-teal-400 dark:focus:ring-teal-400/10",
  ].join(" ");
}
interface StarsProps {
  value: number;
}

export function Stars({ value }: StarsProps) {
  const rating = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <span
      aria-label={`${value} out of 5 stars`}
      className="text-amber-400"
    >
      {"★".repeat(rating)}
      <span className="text-slate-300 dark:text-slate-600">
        {"★".repeat(5 - rating)}
      </span>
    </span>
  );
}
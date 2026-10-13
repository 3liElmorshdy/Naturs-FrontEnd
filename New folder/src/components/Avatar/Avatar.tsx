import { USER_IMG } from "../../utils/viewDetails";

interface AvatarProps {
  name: string;
  photo?: string;
  size?: "sm" | "md";
}

export function Avatar({
  name,
  photo,
  size = "md",
}: AvatarProps) {
  const isDefault = !photo || photo === "default.jpg";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : "h-10 w-10 text-sm";

  if (isDefault) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white ${sizeClass}`}
        aria-label={name}
      >
        {initials || "U"}
      </span>
    );
  }

  return (
    <img
      src={`${USER_IMG}${photo}`}
      alt={name}
      className={`shrink-0 rounded-full object-cover ${sizeClass}`}
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}
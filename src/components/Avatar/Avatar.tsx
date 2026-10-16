import React, { useEffect, useState } from "react";
import { API_ORIGIN } from "../../config";

export interface AvatarProps {
  src?: string | undefined;
  photo?: string | undefined;
  name?: string | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
  className?: string | undefined;
}

const SIZE_MAP = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
  xl: "h-14 w-14 text-lg",
};

export function Avatar({
  src,
  photo,
  name = "User",
  size = "md",
  className = "",
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const rawImage = src || photo;

  useEffect(() => {
    setImageError(false);
  }, [rawImage]);

  const isDefault = !rawImage || rawImage === "default.jpg" || imageError;

  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  if (isDefault) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white shadow-sm ring-2 ring-teal-400/40 ring-offset-1 dark:ring-offset-slate-900 ${sizeClass} ${className}`}
        aria-label={name}
      >
        {initials}
      </span>
    );
  }

  const photoUrl =
    rawImage.startsWith("http://") ||
    rawImage.startsWith("https://")
      ? rawImage.includes("/upload/")
        ? rawImage.replace("/upload/", "/upload/f_auto,q_auto,w_150,c_fill/")
        : rawImage
      : rawImage.startsWith("data:") || rawImage.startsWith("blob:")
        ? rawImage
        : rawImage.startsWith("/")
          ? `${API_ORIGIN}${rawImage}`
          : `${API_ORIGIN}/img/users/${rawImage}`;

  return (
    <img
      src={photoUrl}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setImageError(true)}
      className={`shrink-0 rounded-full object-cover ring-2 ring-teal-400/40 ring-offset-1 dark:ring-offset-slate-900 ${sizeClass} ${className}`}
    />
  );

}


export default Avatar;
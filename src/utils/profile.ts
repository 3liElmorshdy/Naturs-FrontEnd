export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDate(value?: string | Date) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(date);
}

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ??
  "http://localhost:5020";

export function getUserPhotoUrl(
  photo?: string | null,
) {
  if (!photo) {
    return null;
  }

  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://")
  ) {
    return photo;
  }

  return `${API_ORIGIN}/img/users/${photo}`;
}
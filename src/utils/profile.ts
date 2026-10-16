import { API_ORIGIN } from "../config";
export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDate(value?: string | Date, id?: string) {
  if (value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("en", {
        dateStyle: "long",
      }).format(date);
    }
  }

  // Fallback: استخراج التاريخ من أول 8 خانات في الـ ObjectId
  if (id && id.length === 24) {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("en", {
        dateStyle: "long",
      }).format(date);
    }
  }

  return "Not available";
}


export function getUserPhotoUrl(
  photo?: string | null,
): string | null {
  if (!photo || photo === "default.jpg") {
    return null;
  }

  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://") ||
    photo.startsWith("data:") ||
    photo.startsWith("blob:")
  ) {
    return photo;
  }

  if (photo.startsWith("/")) {
    return `${API_ORIGIN}${photo}`;
  }

  return `${API_ORIGIN}/img/users/${photo}`;
}
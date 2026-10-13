// إذا كان VITE_API_ORIGIN غير محدد أو فارغ، نستخدم الرابط النسبي عبر Vercel Rewrite
export const API_ORIGIN: string =
  (import.meta.env.VITE_API_ORIGIN as string | undefined) || "";

export const API_BASE_URL = API_ORIGIN
  ? `${API_ORIGIN}/api/v1`
  : "/api/v1";


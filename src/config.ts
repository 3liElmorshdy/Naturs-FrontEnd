// المصدر الوحيد لرابط الباك إند. غيّره من VITE_API_ORIGIN في Vercel بدون لمس الكود.
export const API_ORIGIN: string =
  (import.meta.env.VITE_API_ORIGIN as string | undefined) ||
  "https://naturs-1.onrender.com";

export const API_BASE_URL = `${API_ORIGIN}/api/v1`;

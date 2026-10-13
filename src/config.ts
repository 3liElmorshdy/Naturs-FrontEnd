// رابط الباك إند الأساسي لجلب الصور والملفات الثابتة
export const API_ORIGIN: string =
  (import.meta.env.VITE_API_ORIGIN as string | undefined) ||
  "https://naturs-1.onrender.com";

// مسار الـ API النسبي لاستخدام Vercel Rewrite للحفاظ على الكوكيز والـ Session
export const API_BASE_URL = "/api/v1";


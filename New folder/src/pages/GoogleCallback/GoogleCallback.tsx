import { useGoogleAuth } from "../../hooks/auth/useGoogleAuth";

/**
 * GoogleCallback
 *
 * صفحة وسيطة (لا تعرض UI) — دورها فقط:
 * 1. تلتقط الـ token من الـ URL بعد redirect من الـ backend
 * 2. تخزنه في localStorage
 * 3. تنقل المستخدم للـ home
 *
 * الـ URL المتوقع من الـ backend:
 *   /auth/google/callback?token=JWT&user=%7B...%7D
 */
const GoogleCallback = () => {
  useGoogleAuth(); // كل اللوجيك في الـ hook

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-4">
      {/* Spinner */}
      <div className="w-10 h-10 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
        Completing Google login…
      </p>
    </div>
  );
};

export default GoogleCallback;

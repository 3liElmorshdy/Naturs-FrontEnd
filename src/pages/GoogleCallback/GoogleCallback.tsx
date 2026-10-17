import { useGoogleAuth } from "../../hooks/auth/useGoogleAuth";
import GoogleIcon from "../../components/GoogleIcon/GoogleIcon";

/**
 * GoogleCallback
 *
 * صفحة وسيطة تُظهر شاشة تحميل احترافية أثناء إتمام تسجيل الدخول أو إنشاء الحساب عبر Google
 * وتتحقق من الجلسة وتوجه المستخدم تلقائياً للصفحة الرئيسية مع رسالة ترحيبية مناسبة.
 */
const GoogleCallback = () => {
  const { isSignup } = useGoogleAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-500">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-800 flex flex-col items-center text-center transition-all duration-300">
        {/* Google Icon with subtle animation */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-teal-400/20" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 shadow-sm border border-slate-200 dark:bg-slate-700 dark:border-slate-600">
            <GoogleIcon />
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="mb-4 h-7 w-7 animate-spin rounded-full border-3 border-teal-500 border-t-transparent" />

        {/* Title based on login vs register */}
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {isSignup ? "Creating your account…" : "Signing you in…"}
        </h2>

        {/* Informative Subtext */}
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {isSignup
            ? "Completing your Google sign up. Setting up your Tejwal profile…"
            : "Completing Google login. Connecting to your account…"}
        </p>

        {/* Security badge */}
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
          Secure Google Authentication
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;

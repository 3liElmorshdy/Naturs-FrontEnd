import { ReactNode } from "react";
import { Link } from "react-router-dom";

// تعريف أنواع الخصائص التي سيستقبلها المكون
interface ButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  // إضافة كل الأنواع الجديدة لمشروع Natours
  variant?: "primary" | "secondary" | "outline" | "accent" | "danger" | "ghost";
  className?: string;
  disabled?: boolean; // مهمة جداً لتعطيل الزر أثناء التحميل
  isLoading?: boolean; // يُظهر Spinner ويُعطّل الزر أثناء الطلبات
}

// Spinner صغير يُستخدم داخل الزر أثناء التحميل
const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

function Button({
  children,
  to,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  isLoading = false,
}: ButtonProps) {
  // الكلاسات الأساسية: استخدام inline-flex يسهل إضافة أيقونات بجوار النص مستقبلاً
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // تحديد كلاسات الألوان حسب الـ variant
  let variantClasses = "";
  switch (variant) {
    case "primary": // للإجراءات الأساسية (تسجيل، حفظ)
      variantClasses =
        "bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md dark:bg-teal-500 dark:hover:bg-teal-600 focus:ring-teal-500";
      break;
    case "secondary": // للإجراءات الجانبية (تسجيل الدخول، إلغاء)
      variantClasses =
        "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md dark:bg-transparent dark:text-slate-200 dark:border dark:border-slate-500 dark:hover:border-slate-300 dark:hover:bg-white/5 focus:ring-slate-400";
      break;
    case "outline": // للفلترة أو الحدود الشفافة
      variantClasses =
        "border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white hover:shadow-md dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-400 dark:hover:text-slate-900 focus:ring-teal-500";
      break;
    case "accent": // يخطف العين: لحجز الجولات السياحية والدفع
      variantClasses =
        "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md focus:ring-orange-500";
      break;
    case "danger": // للحذف وإلغاء الحساب
      variantClasses =
        "bg-red-600 text-white hover:bg-red-700 hover:shadow-md dark:bg-red-500 dark:hover:bg-red-600 focus:ring-red-500";
      break;
    case "ghost": // نصوص قابلة للضغط فقط (تسجيل خروج، نسيت كلمة المرور)
      variantClasses =
        "bg-transparent text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-slate-800 focus:ring-teal-500";
      break;
  }

  // دمج كل الكلاسات معاً
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

  // إذا تم تمرير مسار، سيعمل المكون كرابط (Link)
  if (to) {
    return (
      <Link
        to={to}
        // منع النقر على الرابط إذا كان معطلاً
        className={`${combinedClasses} ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        {children}
      </Link>
    );
  }

  // إذا لم يتم تمرير مسار، سيعمل كزر عادي (Button)
  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Spinner />
          <span className="ml-2">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;

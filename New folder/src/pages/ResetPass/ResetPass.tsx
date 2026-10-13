import React, { useState } from "react";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function ResetPass() {
  // 1. إضافة handleSubmit لاستخدامها في الـ form
  const { register, onSubmit, errors, isSubmitting } = useResetPassword();

  // 2. تعريف الـ States الخاصة بإظهار وإخفاء الباسورد
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      {/* 3. استخدام handleSubmit(onSubmit) */}
      <form onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-4">
        {/* حقل كلمة المرور الجديدة */}
        <div className="relative flex flex-col gap-1">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            {...register("password")}
            className={`p-3 rounded-xl border w-full bg-slate-50 text-slate-800 outline-none transition-all pr-12 dark:bg-slate-700 dark:text-white ${
              errors.password
                ? "border-red-500 ring-1 ring-red-500"
                : "border-slate-300 focus:ring-2 focus:ring-teal-500 dark:border-slate-600"
            }`}
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-[22px] right-3 -translate-y-1/2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <span className="text-red-500 text-xs font-medium ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* حقل تأكيد كلمة المرور */}
        <div className="relative flex flex-col gap-1">
          <label htmlFor="passwordConfirm" className="sr-only">
            Confirm Password
          </label>
          <input
            id="passwordConfirm"
            {...register("passwordConfirm")}
            className={`p-3 rounded-xl border w-full bg-slate-50 text-slate-800 outline-none transition-all pr-12 dark:bg-slate-700 dark:text-white ${
              errors.passwordConfirm
                ? "border-red-500 ring-1 ring-red-500"
                : "border-slate-300 focus:ring-2 focus:ring-teal-500 dark:border-slate-600"
            }`}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
          />
          <button
            type="button"
            onClick={toggleConfirmPassword}
            className="absolute top-[22px] right-3 -translate-y-1/2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.passwordConfirm && (
            <span className="text-red-500 text-xs font-medium ml-1">
              {errors.passwordConfirm.message}
            </span>
          )}
        </div>

        {/* زر الإرسال المنسق */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full flex items-center justify-center bg-teal-500 text-white font-semibold p-3 rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default ResetPass;

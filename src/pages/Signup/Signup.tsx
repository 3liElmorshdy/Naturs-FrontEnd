import React from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import Button from "../../components/Button/Buttons";
import { useSignup } from "../../hooks/auth/useSignUp";
import Divider from "../../components/Divider/Divider";
import GoogleIcon from "../../components/GoogleIcon/GoogleIcon";


const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    serverError,
    registeredEmail,
  } = useSignup();

  const handelgoogleSignUp = () => {
    window.location.href = 'http://localhost:5020/api/v1/users/auth/google';
  };

  return (
    <section className="bg-slate-50 min-h-screen flex justify-center items-center p-4 dark:bg-slate-900 transition-colors">
      <div className="bg-white rounded-3xl flex max-w-4xl w-full p-2 items-center shadow-xl dark:bg-slate-800 transition-colors">
        {/* ─── شاشة "راجع بريدك" بدل الفورم عند النجاح ─── */}
        {registeredEmail ? (
          <div className="w-full md:w-1/2 px-8 py-10 md:px-12 flex flex-col items-center justify-center text-center">
            {/* أيقونة الظرف مع دائرة خضراء متحركة */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center animate-bounce">
                <Mail size={40} className="text-teal-600 dark:text-teal-400" />
              </div>
              {/* علامة صح صغيرة في الزاوية */}
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                ✓
              </span>
            </div>

            <h2 className="font-bold text-2xl text-slate-800 dark:text-white mb-3">
           Your account has been created successfully 🎉
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
             We sent you a verification link to {" "}
              <span className="font-semibold text-teal-600 dark:text-teal-400 break-all">
                {registeredEmail}

              </span>
              . Please click on it to be able to log in.
            </p>

            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              Didn't receive the email? Check your Spam folder.
            </p>
          </div>
        ) : (
          <div className="w-full md:w-1/2 px-8 py-10 md:px-12">
            <h2 className="font-bold text-3xl text-slate-800 dark:text-white">
              Create Account
            </h2>
            <p className="text-sm mt-2 text-slate-500 dark:text-slate-400">
              Join Natours and start your adventure!
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
              noValidate
              aria-disabled={isSubmitting}
            >
              {/* Banner للأخطاء القادمة من الـ Backend */}
              {serverError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                >
                  <span>⚠️</span>
                  <span>{serverError}</span>
                </div>
              )}

              {/* الحقول (نفس الـ JSX السابق مع استخدام متغيرات الـ Hook) */}
              <div className="flex flex-col gap-1">
                <input
                  {...register("name")}
                  className={`p-3 rounded-xl border w-full bg-slate-50 dark:bg-slate-700 dark:text-white outline-none ${errors.name ? "border-red-500" : "border-slate-300 focus:ring-2 focus:ring-teal-500"}`}
                  placeholder="Full Name"
                />
                {errors.name && (
                  <span className="text-red-500 text-[10px] ml-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  {...register("email")}
                  className={`p-3 rounded-xl border w-full bg-slate-50 dark:bg-slate-700 dark:text-white outline-none ${errors.email ? "border-red-500" : "border-slate-300 focus:ring-2 focus:ring-teal-500"}`}
                  placeholder="Email address"
                />
                {errors.email && (
                  <span className="text-red-500 text-[10px] ml-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="relative flex flex-col gap-1">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`p-3 rounded-xl border w-full bg-slate-50 dark:bg-slate-700 dark:text-white outline-none ${errors.password ? "border-red-500" : "border-slate-300 focus:ring-2 focus:ring-teal-500"}`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[22px] right-3 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <span className="text-red-500 text-[10px] ml-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  {...register("passwordConfirm")}
                  type="password"
                  className={`p-3 rounded-xl border w-full bg-slate-50 dark:bg-slate-700 dark:text-white outline-none ${errors.passwordConfirm ? "border-red-500" : "border-slate-300 focus:ring-2 focus:ring-teal-500"}`}
                  placeholder="Confirm Password"
                />
                {errors.passwordConfirm && (
                  <span className="text-red-500 text-[10px] ml-1">
                    {errors.passwordConfirm.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="mt-2 w-full"
              >
                Sign Up
              </Button>
            </form>

            <Divider />

            {/* Google Button */}
            <Button
              variant="outline"
              className="w-full mt-3 flex items-center justify-center gap-2"
              onClick={handelgoogleSignUp}
            >
              <GoogleIcon />
              <span className="ml-3">Sign up with Google</span>
            </Button>
          </div>
        )}
        

        <div className="hidden md:block w-1/2 p-2">
          <img
            className="rounded-2xl h-[650px] w-full object-cover"
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1080"
            alt="Mountain view"
          />
        </div>
      </div>
      
    </section>
  );
};

export default Signup;


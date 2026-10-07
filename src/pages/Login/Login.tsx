import React from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../components/Button/Buttons";
import { useLogin } from "../../hooks/auth/useLogin";
import Divider from "../../components/Divider/Divider";
import GoogleIcon from "../../components/GoogleIcon/GoogleIcon";

const Login: React.FC = () => {
  // Destructure everything needed from the custom hook
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    togglePassword,
    serverError,
  } = useLogin();

  return (
    <section className="bg-slate-50 min-h-screen flex justify-center items-center p-4 dark:bg-slate-900 transition-colors duration-500">
      <div className="bg-white rounded-3xl flex max-w-4xl w-full p-2 items-center shadow-xl dark:bg-slate-800 transition-colors duration-500">
        <div className="w-full md:w-1/2 px-8 py-10 md:px-12">
          <h2 className="font-bold text-3xl text-slate-800 dark:text-white">
            Login
          </h2>
          <p className="text-sm mt-2 text-slate-500 dark:text-slate-400">
            Welcome back! Please enter your details.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 mt-8"
            noValidate
          >
            {/* Server Error Banner */}
            {serverError && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
              >
                <span>⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                className={`p-3 rounded-xl border w-full bg-slate-50 text-slate-800 outline-none transition-all dark:bg-slate-700 dark:text-white ${
                  errors.email
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300 focus:ring-2 focus:ring-teal-500 dark:border-slate-600"
                }`}
                type="email"
                placeholder="Email address"
              />
              {errors.email?.message && (
                <span className="text-red-500 text-xs font-medium ml-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
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
                placeholder="Password"
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

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="mt-2 w-full shadow-md active:scale-95"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* ... Rest of the UI (Divider, Social Login, Footer Links) ... */}
          <Divider />

          <Button
            variant="outline"
            className="w-full mt-6 flex justify-center items-center bg-transparent border-slate-300 dark:border-slate-60
       0"
            onClick={() => {
window.location.href = 'http://localhost:5020/api/v1/users/auth/google';            }}
          >
            <GoogleIcon />
            <span className="ml-3">Login with Google</span>
          </Button>
          <div className="mt-4 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-8 flex justify-between items-center border-t border-slate-200 pt-6 dark:border-slate-700">
            <p className="text-slate-600 text-sm dark:text-slate-400">
              New to Natours?
            </p>
            <Button
              to="/signup"
              variant="secondary"
              className="text-xs px-4 py-2"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block w-1/2 p-2">
          <img
            className="rounded-2xl h-[600px] w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 shadow-lg"
            src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?q=80&w=1080"
            alt="Camping in nature"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;

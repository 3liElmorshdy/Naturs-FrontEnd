import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Loader, XCircle } from "lucide-react";

import api from "../../services/api";
import { updateUser } from "../../store/authSlice";
import type { AppDispatch, RootState } from "../../store/store";
import { getRequestErrorMessage } from "../../utils/requestError";

type Status = "loading" | "success" | "error";

function ConfirmEmailChange() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) =>
    Boolean(state.auth.user),
  );

  const hasRun = useRef(false);

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    /*
      StrictMode في وضع التطوير بيشغّل الـ effect مرتين.
      التوكن بيتستهلك من أول طلب، فالطلب التاني هيفشل.
      الـ ref بيمنع الطلب المكرر.
    */
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;

    if (!token) {
      setMessage("This confirmation link is invalid.");
      setStatus("error");
      return;
    }

    api
      .patch(`/users/confirmEmailChange/${token}`)
      .then((response) => {
        if (isLoggedIn) {
          dispatch(updateUser(response.data.data.user));
        }

        setMessage(
          response.data.message ?? "Your email address has been updated.",
        );
        setStatus("success");
      })
      .catch((error) => {
        setMessage(getRequestErrorMessage(error));
        setStatus("error");
      });
  }, [token, isLoggedIn, dispatch]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center p-4">
      <div className="w-full rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        {status === "loading" && (
          <div role="status" aria-live="polite">
            <Loader
              className="mx-auto h-8 w-8 animate-spin text-teal-600 dark:text-teal-400"
              aria-hidden="true"
            />

            <h1 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
              Confirming your new email…
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This will only take a moment.
            </p>
          </div>
        )}

        {status === "success" && (
          <div role="status">
            <CheckCircle2
              className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />

            <h1 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">
              Email confirmed
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {message}
            </p>

            <Link
              to="/profile"
              className="mt-6 inline-flex rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Go to my profile
            </Link>
          </div>
        )}

        {status === "error" && (
          <div role="alert">
            <XCircle
              className="mx-auto h-10 w-10 text-rose-600 dark:text-rose-400"
              aria-hidden="true"
            />

            <h1 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">
              Could not confirm email
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {message}
            </p>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              The link may have expired or already been used. You can request a
              new one from your profile.
            </p>

            <Link
              to="/profile"
              className="mt-6 inline-flex rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Back to profile
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default ConfirmEmailChange;
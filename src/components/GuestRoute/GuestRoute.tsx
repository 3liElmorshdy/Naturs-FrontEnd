import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../../store/store";

interface GuestRouteProps {
  children: ReactNode;
}

export default function GuestRoute({
  children,
}: GuestRouteProps) {
  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const location = useLocation();

  /*
    المستخدم logged in:
    لا تسمح له بدخول login/signup.
  */
  if (user) {
    const from =
      location.state?.from?.pathname || "/";

    return <Navigate to={from} replace />;
  }

  /*
    المستخدم غير مسجل:
    اسمح له بدخول login/signup.
  */
  return <>{children}</>;
}
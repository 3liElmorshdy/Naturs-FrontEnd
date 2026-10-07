import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../../store/store";
import type { Role } from "../../constants/roles";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: readonly Role[];
};

function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();

  const { user, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div
          className="h-9 w-9 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role as Role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
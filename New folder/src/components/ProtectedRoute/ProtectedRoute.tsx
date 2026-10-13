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

  const { user } = useSelector(
    (state: RootState) => state.auth,
  );

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
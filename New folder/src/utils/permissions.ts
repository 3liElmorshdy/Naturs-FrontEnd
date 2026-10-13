import {
  ROLES,
  type Role,
} from "../constants/roles";

export function hasAnyRole(
  userRole: string | undefined,
  allowedRoles: readonly Role[],
) {
  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole as Role);
}

export function isAdmin(userRole?: string) {
  return userRole === ROLES.ADMIN;
}

export function canManageTours(userRole?: string) {
  return (
    userRole === ROLES.ADMIN ||
    userRole === ROLES.LEAD_GUIDE
  );
}

export function canViewMonthlyPlan(userRole?: string) {
  return (
    userRole === ROLES.ADMIN ||
    userRole === ROLES.LEAD_GUIDE ||
    userRole === ROLES.GUIDE
  );
}

export function canAccessManagementDashboard(
  userRole?: string,
) {
  return (
    userRole === ROLES.ADMIN ||
    userRole === ROLES.LEAD_GUIDE ||
    userRole === ROLES.GUIDE
  );
}
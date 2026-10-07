export const ROLES = {
  ADMIN: "admin",
  LEAD_GUIDE: "lead-guide",
  GUIDE: "guide",
  USER: "user",
} as const;

export const ADMIN_ROLES = [
  ROLES.ADMIN,
  ROLES.LEAD_GUIDE,
] as const;

export const TOUR_MANAGER_ROLES = [
  ROLES.ADMIN,
  ROLES.LEAD_GUIDE,
] as const;

export const MONTHLY_PLAN_ROLES = [
  ROLES.ADMIN,
  ROLES.LEAD_GUIDE,
  ROLES.GUIDE,
] as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
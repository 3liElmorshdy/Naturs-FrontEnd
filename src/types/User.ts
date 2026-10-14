export type UserRole = "user" | "guide" | "lead-guide" | "admin";

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  pendingEmail?: string;
  role: UserRole;
  photo?: string;
  active?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  passwordChangedAt?: string;
}

export default User;
export type UserRole = "user" | "guide" | "lead-guide" | "admin";

export type User = {
  _id: string;
  name: string;
  email: string;
  pendingEmail?: string;
  role: UserRole;
  photo?: string;
  active?: boolean;
  createdAt?: string;
};

export default User;
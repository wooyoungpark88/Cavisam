// Admin UI types — NOT re-exported from index.ts to avoid conflict with profile.ts UserRole/UserStatus
export type UserRole = "teacher" | "parent" | "unassigned";
export type UserStatus = "approved" | "pending" | "suspended";

export interface AdminUser {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string;
  approvedAt?: string;
  linkedStudents?: string[];
  avatarColor: string;
  initial: string;
  department?: string;
}

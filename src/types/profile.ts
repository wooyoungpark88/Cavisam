export type UserRole = 'teacher' | 'parent' | 'admin';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  organization_id: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

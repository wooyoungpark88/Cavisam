import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Profile, UserRole } from '../types';

const STORAGE_KEY = 'cavisam_auth';

interface StoredAuth {
  id: string;
  name: string;
  role: UserRole;
  organization_id: string;
  organization_name: string;
}

export interface AuthContextValue {
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (data: StoredAuth) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadAuth();
    if (stored) {
      setProfile({
        id: stored.id,
        name: stored.name,
        role: stored.role,
        organization_id: stored.organization_id,
        avatar_url: null,
        created_at: '',
      });
    }
    setLoading(false);
  }, []);

  function signIn(data: StoredAuth) {
    const auth: StoredAuth = { ...data, id: data.id || generateId() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    setProfile({
      id: auth.id,
      name: auth.name,
      role: auth.role,
      organization_id: auth.organization_id,
      avatar_url: null,
      created_at: '',
    });
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }

  const role = profile?.role ?? null;

  return (
    <AuthContext.Provider value={{ profile, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

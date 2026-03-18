import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile, UserRole, UserStatus } from '../types';

export interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  status: UserStatus | null;
  loading: boolean;
  /** Supabase 프로필을 다시 불러옴 (역할 변경, 승인 후 등) */
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, role, status, organization_id, avatar_url, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    const { data: { session: current } } = await supabase.auth.getSession();
    if (current?.user) {
      const p = await fetchProfile(current.user.id);
      setProfile(p);
    }
  }

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id).then((p) => {
          setProfile(p);
          setLoading(false);
        });
      } else {
        // 데모 모드 체크 (Supabase 미연결 시 localStorage 기반 체험)
        try {
          const raw = localStorage.getItem('cavisam_demo');
          if (raw) {
            setProfile(JSON.parse(raw) as Profile);
          }
        } catch { /* ignore */ }
        setLoading(false);
      }
    });

    // 세션 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        if (s?.user) {
          fetchProfile(s.user.id).then((p) => setProfile(p));
        } else {
          setProfile(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    localStorage.removeItem('cavisam_demo');
    setSession(null);
    setProfile(null);
  }

  const role = profile?.role ?? null;
  const status = profile?.status ?? null;

  return (
    <AuthContext.Provider
      value={{ session, profile, role, status, loading, refreshProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getStudentsWithRecords } from '../lib/api/students';
import type { Student } from '../types';
import { getBehaviorStats } from '../lib/api/events';
import { supabase } from '../lib/supabase';

interface TeacherData {
  loading: boolean;
  /** 교사 이름 */
  teacherName: string;
  /** 기관 ID */
  orgId: string;
  /** 학생 목록 (오늘 일일기록 포함) */
  students: Student[];
  /** 행동 통계 (30일) */
  behaviorStats: {
    self_harm: number;
    harm_others: number;
    obsession: number;
    total: number;
    byDate: Map<string, number>;
  } | null;
  /** 안읽은 메시지 수 */
  unreadCount: number;
  /** 데이터 새로고침 */
  refresh: () => Promise<void>;
}

const TeacherDataContext = createContext<TeacherData | null>(null);

export function useTeacherData(): TeacherData {
  const ctx = useContext(TeacherDataContext);
  if (!ctx) throw new Error('useTeacherData must be used within TeacherDataProvider');
  return ctx;
}

export function TeacherDataProvider({ children }: { children: ReactNode }) {
  const { session, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [behaviorStats, setBehaviorStats] = useState<TeacherData['behaviorStats']>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const orgId = profile?.organization_id ?? '';
  const teacherName = profile?.name ?? '선생님';
  const isDemo = !session && !!profile; // 데모 모드: Supabase 세션 없이 localStorage 프로필만 있는 경우

  async function fetchAll() {
    if (!profile || !orgId || isDemo) {
      setLoading(false);
      return;
    }

    try {
      const today = new Date().toISOString().slice(0, 10);

      const [studs, stats] = await Promise.all([
        getStudentsWithRecords(orgId, today),
        getBehaviorStats(orgId),
      ]);

      setStudents(studs);
      setBehaviorStats(stats);

      // 안읽은 메시지 수
      const { count } = await supabase
        .from('parent_messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', profile.id)
        .eq('is_read', false);
      setUnreadCount(count ?? 0);
    } catch (err) {
      console.error('[TeacherDataContext] fetchAll 오류:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [profile?.id, orgId]);

  return (
    <TeacherDataContext.Provider
      value={{ loading, teacherName, orgId, students, behaviorStats, unreadCount, refresh: fetchAll }}
    >
      {children}
    </TeacherDataContext.Provider>
  );
}

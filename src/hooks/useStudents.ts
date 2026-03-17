import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getStudentsWithRecords } from '../lib/api/students';
import { useAuth } from './useAuth';
import { DEMO_STUDENTS } from '../lib/demo';
import type { Student } from '../types';

export function useStudents(date: string) {
  const { profile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!profile?.organization_id) return;
    setLoading(true);
    try {
      const data = await getStudentsWithRecords(profile.organization_id, date);
      // Supabase가 비어있으면 데모 데이터 사용
      if (data.length === 0) {
        setStudents(DEMO_STUDENTS);
      } else {
        setStudents(data);
      }
      setError(null);
    } catch {
      // Supabase 연결 실패 시 데모 데이터 사용
      setStudents(DEMO_STUDENTS);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [profile?.organization_id, date]);

  useEffect(() => { void load(); }, [load]);

  // Realtime: 일일 기록 변경 감지
  useEffect(() => {
    if (!profile?.organization_id) return;
    const channel = supabase
      .channel('daily-records-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_records' },
        () => { void load(); }
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [profile?.organization_id, load]);

  return { students, loading, error, reload: load };
}

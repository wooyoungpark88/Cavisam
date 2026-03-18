import { supabase } from '../supabase';

export interface MorningReportDB {
  id: string;
  student_id: string;
  parent_id: string;
  date: string;
  sleep_time: string | null;
  condition: 'good' | 'normal' | 'bad' | 'very_bad' | null;
  meal: 'good' | 'normal' | 'none' | null;
  bowel: 'normal' | 'none' | null;
  medication: string | null;
  note: string | null;
  created_at: string;
}

export async function getMorningReports(studentId: string, limit = 30): Promise<MorningReportDB[]> {
  const { data } = await supabase
    .from('morning_reports')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false })
    .limit(limit);
  return (data ?? []) as MorningReportDB[];
}

export async function getTodayMorningReport(studentId: string): Promise<MorningReportDB | null> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('morning_reports')
    .select('*')
    .eq('student_id', studentId)
    .eq('date', today)
    .single();
  return (data as MorningReportDB) ?? null;
}

export async function upsertMorningReport(
  report: Omit<MorningReportDB, 'id' | 'created_at'>
): Promise<void> {
  await supabase
    .from('morning_reports')
    .upsert(report, { onConflict: 'student_id,date' });
}

export async function getDailyRecordsByStudent(studentId: string, limit = 30) {
  const { data } = await supabase
    .from('daily_records')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false })
    .limit(limit);
  return data ?? [];
}

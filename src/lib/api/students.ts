import { supabase } from '../supabase';
import type { Student } from '../../types';

export interface StudentDB {
  id: string;
  name: string;
  phone: string;
  organization_id: string;
  parent_id: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface DailyRecordDB {
  id: string;
  student_id: string;
  date: string;
  sleep: string;
  condition: 'good' | 'normal' | 'bad' | 'very_bad';
  meal: 'good' | 'normal' | 'none';
  bowel: 'normal' | 'none';
  note: string;
  medication: string;
  created_by: string | null;
  created_at: string;
}

// DB row를 UI Student 타입으로 변환
function toStudentUI(s: StudentDB, r?: DailyRecordDB | null): Student {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });
  return {
    id: s.id,
    name: s.name,
    phone: s.phone,
    date: r?.date ?? today,
    sleep: r?.sleep ?? '-',
    condition: r?.condition ?? 'normal',
    meal: r?.meal ?? 'normal',
    bowel: r?.bowel ?? 'normal',
    note: r?.note ?? '',
    medication: r?.medication ?? '',
    avatar: s.avatar_url ?? undefined,
  };
}

export async function getStudentsWithRecords(orgId: string, date: string): Promise<Student[]> {
  const [{ data: students }, { data: records }] = await Promise.all([
    supabase.from('students').select('*').eq('organization_id', orgId).order('name'),
    supabase.from('daily_records').select('*').eq('date', date),
  ]);

  if (!students) return [];

  const recordMap = new Map<string, DailyRecordDB>();
  (records ?? []).forEach((r) => recordMap.set(r.student_id, r as DailyRecordDB));

  return (students as StudentDB[]).map((s) => toStudentUI(s, recordMap.get(s.id)));
}

export async function upsertDailyRecord(
  record: Omit<DailyRecordDB, 'id' | 'created_at'>
): Promise<void> {
  await supabase
    .from('daily_records')
    .upsert(record, { onConflict: 'student_id,date' });
}

export async function getStudentsByParent(parentId: string): Promise<StudentDB[]> {
  const { data } = await supabase
    .from('students')
    .select('*')
    .eq('parent_id', parentId)
    .order('name');
  return (data ?? []) as StudentDB[];
}

export async function createStudent(
  student: Omit<StudentDB, 'id' | 'created_at'>
): Promise<StudentDB | null> {
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single();
  if (error) throw error;
  return data as StudentDB;
}

export async function updateStudent(
  id: string,
  updates: Partial<Omit<StudentDB, 'id' | 'created_at'>>
): Promise<void> {
  const { error } = await supabase.from('students').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
}

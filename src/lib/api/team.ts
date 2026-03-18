import { supabase } from '../supabase';

export interface CareTeamMemberDB {
  id: string;
  student_id: string;
  member_id: string;
  role: 'lead' | 'support' | 'observer';
  created_at: string;
  member?: { name: string; role: string; avatar_url: string | null };
}

export async function getCareTeam(studentId: string): Promise<CareTeamMemberDB[]> {
  const { data } = await supabase
    .from('care_team')
    .select('*, member:profiles!member_id(name, role, avatar_url)')
    .eq('student_id', studentId)
    .order('created_at');
  return (data ?? []) as CareTeamMemberDB[];
}

export async function addCareTeamMember(
  studentId: string,
  memberId: string,
  role: CareTeamMemberDB['role']
): Promise<void> {
  await supabase
    .from('care_team')
    .upsert({ student_id: studentId, member_id: memberId, role }, { onConflict: 'student_id,member_id' });
}

export async function removeCareTeamMember(studentId: string, memberId: string): Promise<void> {
  await supabase
    .from('care_team')
    .delete()
    .eq('student_id', studentId)
    .eq('member_id', memberId);
}

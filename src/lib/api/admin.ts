import { supabase } from '../supabase';
import type { Profile, UserRole, UserStatus } from '../../types';

export async function getAllProfiles(): Promise<Profile[]> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? []) as Profile[];
}

export async function updateProfileStatus(userId: string, status: UserStatus): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId);
  if (error) throw error;
}

export async function updateProfileRole(userId: string, role: UserRole): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  if (error) throw error;
}

export async function getPendingProfiles(): Promise<Profile[]> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  return (data ?? []) as Profile[];
}

import { supabase } from '../supabase';

export interface MessageDB {
  id: string;
  student_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'daily_report';
  is_read: boolean;
  created_at: string;
  sender?: { name: string; avatar_url: string | null };
  receiver?: { name: string; avatar_url: string | null };
}

export async function getMessages(studentId: string, userId: string): Promise<MessageDB[]> {
  const { data } = await supabase
    .from('parent_messages')
    .select('*, sender:profiles!sender_id(name, avatar_url), receiver:profiles!receiver_id(name, avatar_url)')
    .eq('student_id', studentId)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  return (data ?? []) as MessageDB[];
}

export async function sendMessage(
  msg: Pick<MessageDB, 'student_id' | 'sender_id' | 'receiver_id' | 'content' | 'message_type'>
): Promise<MessageDB | null> {
  const { data, error } = await supabase
    .from('parent_messages')
    .insert(msg)
    .select()
    .single();
  if (error) throw error;
  return data as MessageDB;
}

export async function markAsRead(studentId: string, userId: string): Promise<void> {
  await supabase
    .from('parent_messages')
    .update({ is_read: true })
    .eq('student_id', studentId)
    .eq('receiver_id', userId)
    .eq('is_read', false);
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from('parent_messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false);
  return count ?? 0;
}

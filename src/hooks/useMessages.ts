import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getMessages, markAsRead } from '../lib/api/messages';
import { useAuth } from './useAuth';
import type { MessageDB } from '../lib/api/messages';

export function useMessages(studentId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageDB[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!studentId || !user) return;
    setLoading(true);
    try {
      const data = await getMessages(studentId, user.id);
      setMessages(data);
      await markAsRead(studentId, user.id);
    } finally {
      setLoading(false);
    }
  }, [studentId, user]);

  useEffect(() => { void load(); }, [load]);

  // Realtime 구독
  useEffect(() => {
    if (!studentId || !user) return;
    const channel = supabase
      .channel(`messages-${studentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'parent_messages',
          filter: `student_id=eq.${studentId}`,
        },
        () => { void load(); }
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [studentId, user, load]);

  return { messages, loading, reload: load };
}

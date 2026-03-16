import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  getUnconfirmedEvents,
  getConfirmedEvents,
  getExcludedEvents,
  getEventGroup,
} from '../lib/api/events';
import { useAuth } from './useAuth';
import type { EventCardData, UnconfirmedEvent } from '../types';
import type { EventGroupDB } from '../lib/api/events';

export function useEvents() {
  const { profile } = useAuth();
  const [unconfirmed, setUnconfirmed] = useState<UnconfirmedEvent[]>([]);
  const [confirmed, setConfirmed] = useState<EventCardData[]>([]);
  const [excluded, setExcluded] = useState<UnconfirmedEvent[]>([]);
  const [eventGroup, setEventGroup] = useState<EventGroupDB | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!profile?.organization_id) return;
    setLoading(true);
    try {
      const [u, c, e, g] = await Promise.all([
        getUnconfirmedEvents(profile.organization_id),
        getConfirmedEvents(profile.organization_id),
        getExcludedEvents(profile.organization_id),
        getEventGroup(profile.organization_id),
      ]);
      setUnconfirmed(u);
      setConfirmed(c);
      setExcluded(e);
      setEventGroup(g);
    } finally {
      setLoading(false);
    }
  }, [profile?.organization_id]);

  useEffect(() => { void load(); }, [load]);

  // Realtime 구독
  useEffect(() => {
    if (!profile?.organization_id) return;
    const channel = supabase
      .channel('behavior-events-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'behavior_events' },
        () => { void load(); }
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [profile?.organization_id, load]);

  return { unconfirmed, confirmed, excluded, eventGroup, loading, reload: load };
}

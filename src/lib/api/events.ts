import { supabase } from '../supabase';
import type { EventCardData, BehaviorEvent, UnconfirmedEvent } from '../../types';

export interface BehaviorEventDB {
  id: string;
  student_id: string | null;
  type: 'self_harm' | 'harm_others' | 'obsession';
  occurred_at: string;
  thumbnail_url: string | null;
  label: string;
  confirmed: boolean;
  excluded: boolean;
  event_group_id: string | null;
  created_at: string;
  students?: { name: string; phone: string; avatar_url: string | null };
}

export interface EventGroupDB {
  id: string;
  name: string;
  organization_id: string;
  period: string;
  channel: string;
  auto_approve: boolean;
  created_at: string;
}

export async function getUnconfirmedEvents(orgId: string): Promise<UnconfirmedEvent[]> {
  const { data } = await supabase
    .from('behavior_events')
    .select('*, students(name, phone, avatar_url)')
    .eq('confirmed', false)
    .eq('excluded', false)
    .eq('students.organization_id', orgId)
    .order('occurred_at', { ascending: false });

  return ((data ?? []) as BehaviorEventDB[]).map((e) => ({
    id: e.id,
    thumbnail: {
      id: e.id,
      time: new Date(e.occurred_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      imageUrl: e.thumbnail_url ?? '',
      label: e.label,
    },
  }));
}

export async function getConfirmedEvents(orgId: string): Promise<EventCardData[]> {
  const { data } = await supabase
    .from('behavior_events')
    .select('*, students(name, phone, avatar_url, organization_id)')
    .eq('confirmed', true)
    .eq('excluded', false)
    .order('occurred_at', { ascending: false });

  const filtered = ((data ?? []) as BehaviorEventDB[]).filter(
    (e) => (e.students as { organization_id?: string } | undefined)?.organization_id === orgId
  );

  // 학생별로 그룹핑
  const byStudent = new Map<string, BehaviorEventDB[]>();
  filtered.forEach((e) => {
    if (!e.student_id) return;
    const arr = byStudent.get(e.student_id) ?? [];
    arr.push(e);
    byStudent.set(e.student_id, arr);
  });

  const cards: EventCardData[] = [];
  byStudent.forEach((events, studentId) => {
    const first = events[0];
    const byType = new Map<string, BehaviorEventDB[]>();
    events.forEach((e) => {
      const arr = byType.get(e.type) ?? [];
      arr.push(e);
      byType.set(e.type, arr);
    });

    const behaviors: BehaviorEvent[] = [];
    byType.forEach((evs, type) => {
      behaviors.push({
        id: `${studentId}-${type}`,
        type: type as BehaviorEvent['type'],
        thumbnails: evs.slice(0, 4).map((e) => ({
          id: e.id,
          time: new Date(e.occurred_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          imageUrl: e.thumbnail_url ?? '',
          label: e.label,
        })),
      });
    });

    cards.push({
      id: studentId,
      subjectName: first.students?.name ?? '미확인',
      subjectPhone: first.students?.phone ?? '',
      avatar: first.students?.avatar_url ?? undefined,
      behaviors,
    });
  });

  return cards;
}

export async function getExcludedEvents(orgId: string): Promise<UnconfirmedEvent[]> {
  const { data } = await supabase
    .from('behavior_events')
    .select('*, students(name, phone, avatar_url, organization_id)')
    .eq('excluded', true)
    .order('occurred_at', { ascending: false });

  const filtered = ((data ?? []) as BehaviorEventDB[]).filter(
    (e) => (e.students as { organization_id?: string } | undefined)?.organization_id === orgId
  );

  return filtered.map((e) => ({
    id: e.id,
    thumbnail: {
      id: e.id,
      time: new Date(e.occurred_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      imageUrl: e.thumbnail_url ?? '',
      label: e.label,
    },
  }));
}

export async function confirmEvent(eventId: string, studentId: string): Promise<void> {
  await supabase
    .from('behavior_events')
    .update({ confirmed: true, student_id: studentId })
    .eq('id', eventId);
}

export async function excludeEvent(eventId: string): Promise<void> {
  await supabase
    .from('behavior_events')
    .update({ excluded: true })
    .eq('id', eventId);
}

export async function getEventGroup(orgId: string): Promise<EventGroupDB | null> {
  const { data } = await supabase
    .from('event_groups')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at')
    .limit(1)
    .single();
  return (data as EventGroupDB | null);
}

export async function updateEventGroup(id: string, updates: Partial<EventGroupDB>): Promise<void> {
  await supabase.from('event_groups').update(updates).eq('id', id);
}

export async function getBehaviorStats(orgId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await supabase
    .from('behavior_events')
    .select('*, students(organization_id)')
    .gte('occurred_at', thirtyDaysAgo.toISOString())
    .eq('confirmed', true);

  const filtered = ((data ?? []) as BehaviorEventDB[]).filter(
    (e) => (e.students as { organization_id?: string } | undefined)?.organization_id === orgId
  );

  const stats = {
    self_harm: 0,
    harm_others: 0,
    obsession: 0,
    total: 0,
    byDate: new Map<string, number>(),
  };

  filtered.forEach((e) => {
    stats[e.type]++;
    stats.total++;
    const d = e.occurred_at.slice(0, 10);
    stats.byDate.set(d, (stats.byDate.get(d) ?? 0) + 1);
  });

  return stats;
}

/** 특정 학생의 행동 이벤트 (보호자 뷰) */
export async function getBehaviorEventsByStudent(studentId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from('behavior_events')
    .select('*')
    .eq('student_id', studentId)
    .eq('confirmed', true)
    .gte('occurred_at', since.toISOString())
    .order('occurred_at', { ascending: false });

  return (data ?? []) as BehaviorEventDB[];
}

/** 특정 학생의 행동 통계 (일별 집계) */
export async function getStudentBehaviorStats(studentId: string, days = 30) {
  const events = await getBehaviorEventsByStudent(studentId, days);

  const stats = {
    self_harm: 0,
    harm_others: 0,
    obsession: 0,
    total: events.length,
    byDate: new Map<string, number>(),
    byType: new Map<string, { self_harm: number; harm_others: number; obsession: number }>(),
  };

  events.forEach((e) => {
    stats[e.type]++;
    const d = e.occurred_at.slice(0, 10);
    stats.byDate.set(d, (stats.byDate.get(d) ?? 0) + 1);

    if (!stats.byType.has(d)) {
      stats.byType.set(d, { self_harm: 0, harm_others: 0, obsession: 0 });
    }
    stats.byType.get(d)![e.type]++;
  });

  return stats;
}

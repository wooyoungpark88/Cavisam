import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getStudentsByParent } from '../lib/api/students';
import type { StudentDB } from '../lib/api/students';
import { getMessages } from '../lib/api/messages';
import type { MessageDB } from '../lib/api/messages';
import { getMorningReports } from '../lib/api/reports';
import type { MorningReportDB } from '../lib/api/reports';
import { getBehaviorEventsByStudent } from '../lib/api/events';
import type { BehaviorEventDB } from '../lib/api/events';
import { getCareTeam } from '../lib/api/team';
import type { CareTeamMemberDB } from '../lib/api/team';
import { supabase } from '../lib/supabase';

interface ParentData {
  loading: boolean;
  /** 보호자의 자녀 목록 */
  children: StudentDB[];
  /** 현재 선택된 자녀 */
  activeChild: StudentDB | null;
  /** 자녀의 오늘 일일기록 */
  todayRecord: {
    sleep: string;
    condition: string;
    meal: string;
    bowel: string;
    note: string;
    medication: string;
  } | null;
  /** 소통방 메시지 */
  messages: MessageDB[];
  /** 등원 전 한마디 기록 */
  morningReports: MorningReportDB[];
  /** 행동 이벤트 (30일) */
  behaviorEvents: BehaviorEventDB[];
  /** 케어팀 */
  careTeam: CareTeamMemberDB[];
  /** 안읽은 메시지 수 */
  unreadCount: number;
  /** 데이터 새로고침 */
  refresh: () => Promise<void>;
}

const ParentDataContext = createContext<ParentData | null>(null);

export function useParentData(): ParentData {
  const ctx = useContext(ParentDataContext);
  if (!ctx) throw new Error('useParentData must be used within ParentDataProvider');
  return ctx;
}

export function ParentDataProvider({ children: reactChildren }: { children: ReactNode }) {
  const { session, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [childList, setChildList] = useState<StudentDB[]>([]);
  const [messages, setMessages] = useState<MessageDB[]>([]);
  const [morningReports, setMorningReports] = useState<MorningReportDB[]>([]);
  const [behaviorEvents, setBehaviorEvents] = useState<BehaviorEventDB[]>([]);
  const [careTeam, setCareTeam] = useState<CareTeamMemberDB[]>([]);
  const [todayRecord, setTodayRecord] = useState<ParentData['todayRecord']>(null);

  const activeChild = childList[0] ?? null;

  const isDemo = !session && !!profile;

  async function fetchAll() {
    if (!profile || isDemo) {
      setLoading(false);
      return;
    }

    const kids = await getStudentsByParent(profile.id);
    setChildList(kids);

    if (kids.length === 0) {
      setLoading(false);
      return;
    }

    const kid = kids[0];
    const today = new Date().toISOString().slice(0, 10);

    const [msgs, reports, events, team] = await Promise.all([
      getMessages(kid.id, profile.id),
      getMorningReports(kid.id, 30),
      getBehaviorEventsByStudent(kid.id, 30),
      getCareTeam(kid.id),
    ]);

    setMessages(msgs);
    setMorningReports(reports);
    setBehaviorEvents(events);
    setCareTeam(team);

    // 오늘 일일기록
    const { data: rec } = await supabase
      .from('daily_records')
      .select('*')
      .eq('student_id', kid.id)
      .eq('date', today)
      .single();

    if (rec) {
      setTodayRecord({
        sleep: rec.sleep,
        condition: rec.condition,
        meal: rec.meal,
        bowel: rec.bowel,
        note: rec.note,
        medication: rec.medication,
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, [profile?.id]);

  const unreadCount = messages.filter((m) => !m.is_read && m.receiver_id === profile?.id).length;

  return (
    <ParentDataContext.Provider
      value={{
        loading,
        children: childList,
        activeChild,
        todayRecord,
        messages,
        morningReports,
        behaviorEvents,
        careTeam,
        unreadCount,
        refresh: fetchAll,
      }}
    >
      {reactChildren}
    </ParentDataContext.Provider>
  );
}

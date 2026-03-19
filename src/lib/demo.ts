/**
 * 데모 모드용 고정 UUID & 풀백 데이터
 * Supabase가 비어있거나 접속 불가일 때 앱이 즉시 체험 가능하도록 함
 */
import type { Student } from '../types';
import type { MessageDB } from './api/messages';
import type { StudentDB } from './api/students';

// ───── 고정 UUID ─────
export const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001';
export const DEMO_TEACHER_ID = '00000000-0000-0000-0000-000000000010';
export const DEMO_PARENT_ID = '00000000-0000-0000-0000-000000000020';

export const STUDENT_IDS = {
  김민준: '00000000-0000-0000-0001-000000000001',
  이서연: '00000000-0000-0000-0001-000000000002',
  박지호: '00000000-0000-0000-0001-000000000003',
  최수아: '00000000-0000-0000-0001-000000000004',
  정도현: '00000000-0000-0000-0001-000000000005',
} as const;

// ───── 오늘 날짜 ─────
const todayKR = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
});

// ───── 데모 학생 (대시보드용) ─────
export const DEMO_STUDENTS: Student[] = [
  {
    id: STUDENT_IDS.김민준, name: '김민준', phone: '010-1234-5678', date: todayKR,
    sleep: '8시간', condition: 'good', meal: 'good', bowel: 'normal',
    note: '미술 시간에 집중력이 좋았음', medication: '리스페리돈 0.5mg',
  },
  {
    id: STUDENT_IDS.이서연, name: '이서연', phone: '010-2345-6789', date: todayKR,
    sleep: '5시간', condition: 'bad', meal: 'normal', bowel: 'normal',
    note: '어제 잠을 잘 못 잤다고 함, 오전에 짜증 잦음', medication: '아리피프라졸 5mg',
  },
  {
    id: STUDENT_IDS.박지호, name: '박지호', phone: '010-3456-7890', date: todayKR,
    sleep: '7시간', condition: 'normal', meal: 'good', bowel: 'normal',
    note: '', medication: '',
  },
  {
    id: STUDENT_IDS.최수아, name: '최수아', phone: '010-4567-8901', date: todayKR,
    sleep: '9시간', condition: 'good', meal: 'good', bowel: 'normal',
    note: '오늘 활발하고 기분 좋은 모습', medication: '',
  },
  {
    id: STUDENT_IDS.정도현, name: '정도현', phone: '010-5678-9012', date: todayKR,
    sleep: '4시간', condition: 'very_bad', meal: 'none', bowel: 'none',
    note: '자해 행동 2회 관찰, 긴급 개입 필요', medication: '클로나제팜 0.25mg',
  },
];

// ───── 보호자용: 자녀 목록 ─────
export const DEMO_PARENT_STUDENTS: StudentDB[] = [
  {
    id: STUDENT_IDS.김민준, name: '김민준', phone: '010-1234-5678',
    organization_id: DEMO_ORG_ID, parent_id: DEMO_PARENT_ID, avatar_url: null, created_at: '',
  },
];

// ───── 데모 메시지 (김민준 소통방) ─────
function demoTime(hoursAgo: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export function getDemoMessages(studentId: string): MessageDB[] {
  if (studentId !== STUDENT_IDS.김민준) {
    return [
      {
        id: 'demo-empty-1', student_id: studentId,
        sender_id: DEMO_TEACHER_ID, receiver_id: DEMO_PARENT_ID,
        content: '안녕하세요! 소통방이 개설되었습니다. 언제든 연락주세요.',
        message_type: 'text', is_read: true, created_at: demoTime(48),
        sender: { name: '김태희', avatar_url: null },
      },
    ];
  }

  return [
    {
      id: 'demo-msg-1', student_id: studentId,
      sender_id: DEMO_TEACHER_ID, receiver_id: DEMO_PARENT_ID,
      content: '안녕하세요, 민준이 어머니! 오늘 민준이가 미술 시간에 그림을 아주 잘 그렸어요. 집중력이 많이 좋아졌습니다.',
      message_type: 'text', is_read: true, created_at: demoTime(5),
      sender: { name: '김태희', avatar_url: null },
    },
    {
      id: 'demo-msg-2', student_id: studentId,
      sender_id: DEMO_PARENT_ID, receiver_id: DEMO_TEACHER_ID,
      content: '감사합니다 선생님! 어제 일찍 재워서 그런지 컨디션이 좋은 것 같아요 😊',
      message_type: 'text', is_read: true, created_at: demoTime(4.5),
      sender: { name: '김민준 어머니', avatar_url: null },
    },
    {
      id: 'demo-msg-3', student_id: studentId,
      sender_id: DEMO_PARENT_ID, receiver_id: DEMO_TEACHER_ID,
      content: '약은 아침에 먹이고 보냈습니다. 점심 후에도 한 번 복용해야 해요.',
      message_type: 'text', is_read: true, created_at: demoTime(4),
      sender: { name: '김민준 어머니', avatar_url: null },
    },
    {
      id: 'demo-msg-4', student_id: studentId,
      sender_id: DEMO_TEACHER_ID, receiver_id: DEMO_PARENT_ID,
      content: '네, 알겠습니다! 점심 후 약 복용 챙기겠습니다.',
      message_type: 'text', is_read: true, created_at: demoTime(3.5),
      sender: { name: '김태희', avatar_url: null },
    },
    {
      id: 'demo-msg-5', student_id: studentId,
      sender_id: DEMO_TEACHER_ID, receiver_id: DEMO_PARENT_ID,
      content: JSON.stringify({
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        sleep: '23:00 ~ 07:00',
        bowel: '정상',
        condition: '좋음',
        meal: '잘 먹음',
        note: '미술 시간 집중력 좋았음. 점심 후 약 복용 완료.',
        teacherName: '김태희',
      }),
      message_type: 'daily_report', is_read: true, created_at: demoTime(1),
      sender: { name: '김태희', avatar_url: null },
    },
    {
      id: 'demo-msg-6', student_id: studentId,
      sender_id: DEMO_PARENT_ID, receiver_id: DEMO_TEACHER_ID,
      content: '일일보고 감사합니다! 오늘도 수고하셨어요 선생님 🙏',
      message_type: 'text', is_read: false, created_at: demoTime(0.5),
      sender: { name: '김민준 어머니', avatar_url: null },
    },
  ];
}

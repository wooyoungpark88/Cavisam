export type MemberRole =
  | "담임교사"
  | "특수교사"
  | "언어치료사"
  | "작업치료사"
  | "사회복지사"
  | "행동지원전문가";

export interface TeamMember {
  id: number;
  name: string;
  initial: string;
  avatarColor: string;
  role: MemberRole;
  department: string;
  phone: string;
  email: string;
  assignedStudentIds: number[];
  specialty: string;
  availableTime: string;
  isMe?: boolean;
}

export interface StudentAssignment {
  studentId: number;
  studentName: string;
  initial: string;
  avatarColor: string;
  primaryTeacherId: number;
  assignedMemberIds: number[];
  priority: "일반" | "집중" | "긴급";
}

export interface TeamMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "정기회의" | "사례회의" | "보호자간담회" | "외부협력";
  participants: number[];
  agenda: string[];
  isUpcoming: boolean;
  location: string;
  notes?: string;
}

export interface TeamActivity {
  id: number;
  memberId: number;
  memberName: string;
  memberColor: string;
  memberInitial: string;
  action: string;
  target: string;
  time: string;
  type: "note" | "report" | "meeting" | "alert" | "update";
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "김수진",
    initial: "김",
    avatarColor: "#026eff",
    role: "담임교사",
    department: "교육팀 3반",
    phone: "010-2231-5541",
    email: "sujin.kim@haeorun.kr",
    assignedStudentIds: [1, 2, 3, 4, 5, 6, 7],
    specialty: "발달장애 행동지원, 구조화 교육",
    availableTime: "평일 09:00 ~ 17:00",
    isMe: true,
  },
  {
    id: 2,
    name: "이민준",
    initial: "이",
    avatarColor: "#10b981",
    role: "특수교사",
    department: "교육팀 보조",
    phone: "010-3345-7782",
    email: "minjun.lee@haeorun.kr",
    assignedStudentIds: [2, 5, 7],
    specialty: "중증 발달장애 개별교육, AAC 활용",
    availableTime: "평일 09:00 ~ 16:00",
  },
  {
    id: 3,
    name: "박지영",
    initial: "박",
    avatarColor: "#8b5cf6",
    role: "언어치료사",
    department: "치료지원팀",
    phone: "010-9912-3384",
    email: "jiyoung.park@haeorun.kr",
    assignedStudentIds: [1, 3, 6, 7],
    specialty: "AAC, 의사소통 증진, 구강 운동",
    availableTime: "화·목 10:00 ~ 16:00",
  },
  {
    id: 4,
    name: "최현우",
    initial: "최",
    avatarColor: "#f59e0b",
    role: "작업치료사",
    department: "치료지원팀",
    phone: "010-4478-9921",
    email: "hyunwoo.choi@haeorun.kr",
    assignedStudentIds: [2, 4, 5],
    specialty: "감각통합, 소근육 발달, 일상생활 훈련",
    availableTime: "월·수·금 09:30 ~ 15:30",
  },
  {
    id: 5,
    name: "정소연",
    initial: "정",
    avatarColor: "#ec4899",
    role: "사회복지사",
    department: "복지지원팀",
    phone: "010-6623-8845",
    email: "soyeon.jung@haeorun.kr",
    assignedStudentIds: [1, 2, 3, 4, 5, 6, 7],
    specialty: "가족지원, 지역사회 자원 연계, 보호자 상담",
    availableTime: "평일 09:00 ~ 18:00",
  },
  {
    id: 6,
    name: "한태양",
    initial: "한",
    avatarColor: "#ef4444",
    role: "행동지원전문가",
    department: "행동지원팀",
    phone: "010-7721-4430",
    email: "taeyang.han@haeorun.kr",
    assignedStudentIds: [2, 5, 7],
    specialty: "PBS, 위기행동 개입, 행동지원계획(BSP) 수립",
    availableTime: "평일 10:00 ~ 17:00",
  },
];

export const mockStudentAssignments: StudentAssignment[] = [
  {
    studentId: 1,
    studentName: "김민조",
    initial: "민",
    avatarColor: "#026eff",
    primaryTeacherId: 1,
    assignedMemberIds: [1, 3, 5],
    priority: "일반",
  },
  {
    studentId: 2,
    studentName: "이서연",
    initial: "서",
    avatarColor: "#10b981",
    primaryTeacherId: 1,
    assignedMemberIds: [1, 2, 4, 5, 6],
    priority: "집중",
  },
  {
    studentId: 3,
    studentName: "박지호",
    initial: "지",
    avatarColor: "#f59e0b",
    primaryTeacherId: 1,
    assignedMemberIds: [1, 3, 5],
    priority: "일반",
  },
  {
    studentId: 4,
    studentName: "최수아",
    initial: "수",
    avatarColor: "#8b5cf6",
    primaryTeacherId: 1,
    assignedMemberIds: [1, 4, 5],
    priority: "일반",
  },
  {
    studentId: 5,
    studentName: "정도현",
    initial: "도",
    avatarColor: "#ef4444",
    primaryTeacherId: 1,
    assignedMemberIds: [1, 2, 4, 5, 6],
    priority: "긴급",
  },
  {
    studentId: 6,
    studentName: "한유진",
    initial: "유",
    avatarColor: "#06b6d4",
    primaryTeacherId: 1,
    assignedMemberIds: [1, 3, 5],
    priority: "집중",
  },
  {
    studentId: 7,
    studentName: "오태민",
    initial: "태",
    avatarColor: "#e879f9",
    primaryTeacherId: 1,
    assignedMemberIds: [1, 2, 3, 5, 6],
    priority: "집중",
  },
];

export const mockTeamMeetings: TeamMeeting[] = [
  {
    id: 1,
    title: "3월 정기 사례 회의",
    date: "2026. 3. 20",
    time: "오후 3:00 ~ 4:30",
    type: "사례회의",
    participants: [1, 2, 3, 4, 5, 6],
    agenda: [
      "정도현 이용인 자해행동 증가 원인 분석 및 BSP 긴급 검토",
      "이서연 이용인 수면 문제 개선 방안 논의",
      "오태민 이용인 등원 불안 전환 루틴 수립",
    ],
    isUpcoming: true,
    location: "3층 회의실 A",
  },
  {
    id: 2,
    title: "보호자 간담회 — 3반",
    date: "2026. 3. 27",
    time: "오전 10:00 ~ 12:00",
    type: "보호자간담회",
    participants: [1, 5],
    agenda: [
      "1분기 이용인 발달 현황 공유",
      "가정 연계 지원 방향 논의",
      "2분기 목표 설정 및 개별교육계획(IEP) 안내",
    ],
    isUpcoming: true,
    location: "1층 상담실",
  },
  {
    id: 3,
    title: "2월 정기 팀 회의",
    date: "2026. 2. 20",
    time: "오후 3:00 ~ 4:30",
    type: "정기회의",
    participants: [1, 2, 3, 4, 5, 6],
    agenda: [
      "2월 이용인 행동 통계 공유",
      "치료 계획 업데이트",
      "3월 운영 일정 조율",
    ],
    isUpcoming: false,
    location: "3층 회의실 A",
    notes: "정도현 이용인 행동지원 계획 임시 수정 완료. 한태양 전문가 BSP 재수립 착수.",
  },
  {
    id: 4,
    title: "외부 협력기관 연계 회의",
    date: "2026. 2. 14",
    time: "오후 2:00 ~ 3:00",
    type: "외부협력",
    participants: [1, 5],
    agenda: [
      "지역사회 전환 프로그램 연계 논의",
      "방과후 활동 연계 기관 소개",
    ],
    isUpcoming: false,
    location: "온라인 (Zoom)",
    notes: "오태민 이용인 방과후 취미 프로그램 연계 추진 결정. 정소연 복지사 담당.",
  },
];

export const mockTeamActivities: TeamActivity[] = [
  {
    id: 1,
    memberId: 6,
    memberName: "한태양",
    memberColor: "#ef4444",
    memberInitial: "한",
    action: "BSP 검토 요청",
    target: "정도현 이용인 — 자해행동 3주 연속 증가",
    time: "오늘 오후 2:10",
    type: "alert",
  },
  {
    id: 2,
    memberId: 1,
    memberName: "김수진",
    memberColor: "#026eff",
    memberInitial: "김",
    action: "생활 알리미 발송",
    target: "정도현 이용인 — 특이사항 보고",
    time: "오늘 오전 10:35",
    type: "report",
  },
  {
    id: 3,
    memberId: 3,
    memberName: "박지영",
    memberColor: "#8b5cf6",
    memberInitial: "박",
    action: "언어치료 세션 노트 작성",
    target: "오태민 이용인 — AAC 기기 활용 5문장 표현 성공",
    time: "오늘 오전 11:00",
    type: "note",
  },
  {
    id: 4,
    memberId: 4,
    memberName: "최현우",
    memberColor: "#f59e0b",
    memberInitial: "최",
    action: "작업치료 세션 노트 작성",
    target: "이서연 이용인 — 감각통합 활동 참여도 향상 관찰",
    time: "어제 오후 3:20",
    type: "note",
  },
  {
    id: 5,
    memberId: 5,
    memberName: "정소연",
    memberColor: "#ec4899",
    memberInitial: "정",
    action: "보호자 상담 완료",
    target: "정도현 이용인 보호자 — 행동 증가 원인 탐색 전화 상담",
    time: "어제 오후 4:00",
    type: "meeting",
  },
  {
    id: 6,
    memberId: 1,
    memberName: "김수진",
    memberColor: "#026eff",
    memberInitial: "김",
    action: "개별교육계획(IEP) 업데이트",
    target: "최수아 이용인 — 1분기 목표 달성으로 2분기 목표 상향",
    time: "어제 오전 10:15",
    type: "update",
  },
  {
    id: 7,
    memberId: 2,
    memberName: "이민준",
    memberColor: "#10b981",
    memberInitial: "이",
    action: "수업 지원 기록 작성",
    target: "이서연·정도현 이용인 — 오전 수업 보조 지원",
    time: "어제 오후 1:30",
    type: "report",
  },
  {
    id: 8,
    memberId: 3,
    memberName: "박지영",
    memberColor: "#8b5cf6",
    memberInitial: "박",
    action: "언어치료 계획 수정",
    target: "한유진 이용인 — 단문 표현 목표 달성, 복문 훈련으로 전환",
    time: "3일 전",
    type: "update",
  },
];

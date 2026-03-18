export type ConditionLevel = "매우좋음" | "좋음" | "보통" | "나쁨" | "매우나쁨";
export type MealLevel = "완식" | "평소처럼" | "보통" | "조금" | "안먹음";
export type BowelLevel = "정상" | "무른편" | "딱딱함" | "없음";
export type SleepLevel = "충분" | "보통" | "부족";

export interface StudentDailyReport {
  id: number;
  name: string;
  initial: string;
  avatarColor: string;
  reportDate: string;
  sleep: string;
  sleepLevel: SleepLevel;
  condition: ConditionLevel;
  meal: MealLevel;
  bowel: BowelLevel;
  note: string;
  medication: string;
  needsAttention: boolean;
}

export const mockStudents: StudentDailyReport[] = [
  {
    id: 1,
    name: "김민조",
    initial: "민",
    avatarColor: "#026eff",
    reportDate: "2026년 3월 18일",
    sleep: "8시간",
    sleepLevel: "충분",
    condition: "좋음",
    meal: "평소처럼",
    bowel: "정상",
    note: "미술 시간에 집중력이 좋았음",
    medication: "리스페리돈 0.5mg",
    needsAttention: false,
  },
  {
    id: 2,
    name: "이서연",
    initial: "서",
    avatarColor: "#10b981",
    reportDate: "2026년 3월 18일",
    sleep: "5시간",
    sleepLevel: "부족",
    condition: "나쁨",
    meal: "보통",
    bowel: "정상",
    note: "어제 삼을 잘 못 잤다고 함, 오선체 과중 찾음",
    medication: "아리피프라졸 5mg",
    needsAttention: true,
  },
  {
    id: 3,
    name: "박지호",
    initial: "지",
    avatarColor: "#f59e0b",
    reportDate: "2026년 3월 18일",
    sleep: "7시간",
    sleepLevel: "보통",
    condition: "보통",
    meal: "평소처럼",
    bowel: "정상",
    note: "-",
    medication: "-",
    needsAttention: false,
  },
  {
    id: 4,
    name: "최수아",
    initial: "수",
    avatarColor: "#8b5cf6",
    reportDate: "2026년 3월 18일",
    sleep: "9시간",
    sleepLevel: "충분",
    condition: "좋음",
    meal: "평소처럼",
    bowel: "정상",
    note: "오늘 활발하고 기분 좋은 모습",
    medication: "-",
    needsAttention: false,
  },
  {
    id: 5,
    name: "정도현",
    initial: "도",
    avatarColor: "#ef4444",
    reportDate: "2026년 3월 18일",
    sleep: "4시간",
    sleepLevel: "부족",
    condition: "매우나쁨",
    meal: "안먹음",
    bowel: "없음",
    note: "자해 행동 2회 관찰, 긴급 개입 필요",
    medication: "클로니제밤 0.25mg",
    needsAttention: true,
  },
  {
    id: 6,
    name: "한유진",
    initial: "유",
    avatarColor: "#06b6d4",
    reportDate: "2026년 3월 18일",
    sleep: "8시간",
    sleepLevel: "충분",
    condition: "좋음",
    meal: "평소처럼",
    bowel: "무른편",
    note: "점심 후 배가 아프다는 제스처 있었음",
    medication: "메틸페니데이트 10mg",
    needsAttention: false,
  },
  {
    id: 7,
    name: "오태민",
    initial: "태",
    avatarColor: "#e879f9",
    reportDate: "2026년 3월 18일",
    sleep: "6시간",
    sleepLevel: "보통",
    condition: "나쁨",
    meal: "조금",
    bowel: "정상",
    note: "등원 시 울음 반응, 안정화 10분 소요",
    medication: "발프로산 250mg",
    needsAttention: true,
  },
];

export const mockTeacherInfo = {
  name: "김수진",
  initial: "김",
  facility: "해오름 발달장애인복지관",
  class: "3반",
};

export const mockDailyStatsSummary = {
  total: 7,
  needsAttention: 3,
  goodCondition: 3,
  reportSubmitted: 7,
};

export const mockWeeklyStatsSummary = {
  totalBehaviors: 59,
  prevWeekBehaviors: 75,
  changeRate: -21,
  avgSleepHours: 6.9,
  sleepTrend: -0.4,
  conditionAvg: "보통",
  conditionScore: 2.9,
  conditionTrend: -0.3,
  reportRate: 100,
  attentionDays: 4,
  mostImprovedName: "최수아",
  mostImprovedRate: -80,
  mostWorsenedName: "정도현",
  mostWorsenedRate: 17,
  dailyBehaviors: [
    { day: "월", count: 13 },
    { day: "화", count: 12 },
    { day: "수", count: 12 },
    { day: "목", count: 10 },
    { day: "금", count: 5 },
    { day: "토", count: 3 },
    { day: "일", count: 4 },
  ],
};

export const mockMonthlyStatsSummary = {
  totalBehaviors: 248,
  prevMonthBehaviors: 312,
  changeRate: -21,
  reportSubmitRate: 97,
  avgAttentionPerWeek: 2.8,
  emergencyInterventions: 8,
  mostImprovedName: "최수아",
  mostImprovedRate: -78,
  mostImprovedColor: "#8b5cf6",
  leastImprovedName: "정도현",
  leastImprovedRate: 15,
  leastImprovedColor: "#ef4444",
  weeklyBehaviors: [
    { week: "1주", count: 78 },
    { week: "2주", count: 65 },
    { week: "3주", count: 46 },
    { week: "4주", count: 59 },
  ],
  conditionTrend: [
    { week: "1주", score: 2.6 },
    { week: "2주", score: 2.9 },
    { week: "3주", score: 3.2 },
    { week: "4주", score: 2.9 },
  ],
};

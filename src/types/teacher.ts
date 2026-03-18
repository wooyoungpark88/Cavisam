export type ConditionLevel = "매우좋음" | "좋음" | "보통" | "나쁨" | "매우나쁨";
export type MealLevel = "완식" | "평소처럼" | "보통" | "조금" | "안먹음";
export type BowelLevel = "정상" | "무른편" | "딱딱함" | "없음";
export type SleepLevel = "충분" | "보통" | "부족";

export interface StudentDailyReport {
  id: number | string;
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

export interface StudentBehaviorStat {
  id: number | string;
  name: string;
  initial: string;
  color: string;
  thisWeek: number;
  lastWeek: number;
  change: number;
  daily: number[];
  mainType: string;
  mainTypeColor: string;
}

export interface BehaviorTypeStat {
  name: string;
  count: number;
  color: string;
}

export interface BehaviorSummary {
  totalThisWeek: number;
  totalLastWeek: number;
  changeRate: number;
  mostFrequentType: string;
  mostFrequentTypeColor: string;
  needsAttentionCount: number;
  mostImprovedName: string;
  mostImprovedChange: number;
}

export interface WeeklyDailyDataPoint {
  day: string;
  [studentName: string]: string | number;
}

export const BEHAVIOR_COLORS: Record<string, string> = {
  "자해행동": "#ef4444",
  "타해행동": "#f59e0b",
  "이탈행동": "#8b5cf6",
  "집착행동": "#06b6d4",
  "소리지르기": "#ec4899",
};

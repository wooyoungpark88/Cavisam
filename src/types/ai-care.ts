export type CareLevel = "우수" | "양호" | "주의" | "위험";

export interface AiInsight {
  icon: string;
  color: string;
  title: string;
  desc: string;
}

export interface AiRecommendation {
  priority: "high" | "medium" | "low";
  icon: string;
  title: string;
  detail: string;
}

export interface AiPatternItem {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  good: boolean;
}

export interface AiWeeklyBehaviorBar {
  day: string;
  count: number;
}

export interface AiCareReport {
  studentId: number | string;
  generatedAt: string;
  careLevel: CareLevel;
  careLevelScore: number;
  summary: string;
  patterns: AiPatternItem[];
  insights: AiInsight[];
  recommendations: AiRecommendation[];
  weeklyBehavior: AiWeeklyBehaviorBar[];
  riskAlerts: string[];
  positiveHighlights: string[];
}

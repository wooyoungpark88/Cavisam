export interface ReportAttachment {
  name: string;
  type: "image" | "document";
  url?: string;
  ext: string;
}

export interface SentReport {
  id: number | string;
  studentId: number | string;
  studentName: string;
  type: string;
  typeIcon: string;
  typeColor: string;
  content: string;
  sentAt: string;
  confirmed: boolean;
  confirmedAt?: string;
  attachments?: ReportAttachment[];
}

export const REPORT_TYPES = [
  { key: "positive", label: "긍정행동", icon: "ri-star-smile-line", color: "#10b981" },
  { key: "behavior", label: "행동기록", icon: "ri-file-list-3-line", color: "#026eff" },
  { key: "incident", label: "특이사항", icon: "ri-alert-line", color: "#ef4444" },
  { key: "medicine", label: "약복용", icon: "ri-medicine-bottle-line", color: "#8b5cf6" },
  { key: "meal", label: "식사기록", icon: "ri-restaurant-line", color: "#f59e0b" },
  { key: "activity", label: "활동기록", icon: "ri-palette-line", color: "#06b6d4" },
] as const;

export type ReportTypeKey = typeof REPORT_TYPES[number]["key"];

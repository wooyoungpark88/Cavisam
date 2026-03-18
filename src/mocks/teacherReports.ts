export interface ReportAttachment {
  name: string;
  type: "image" | "document";
  url?: string; // object URL for images
  ext: string;
}

export interface SentReport {
  id: number;
  studentId: number;
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

export const mockSentReports: SentReport[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "김민조",
    type: "긍정행동",
    typeIcon: "ri-star-smile-line",
    typeColor: "#10b981",
    content: "미술 시간에 집중력이 매우 좋았어요. 점토로 고양이를 만들며 약 40분간 집중했고 완성도 높은 작품을 만들었습니다. 칭찬해 주세요!",
    sentAt: "오늘 오후 2:30",
    confirmed: true,
    confirmedAt: "오후 3:05",
  },
  {
    id: 2,
    studentId: 1,
    studentName: "김민조",
    type: "약복용",
    typeIcon: "ri-medicine-bottle-line",
    typeColor: "#8b5cf6",
    content: "점심 식사 후 리스페리돈 0.5mg 복용 완료했습니다.",
    sentAt: "오늘 오후 1:10",
    confirmed: true,
    confirmedAt: "오후 1:45",
  },
  {
    id: 3,
    studentId: 5,
    studentName: "정도현",
    type: "특이사항",
    typeIcon: "ri-alert-line",
    typeColor: "#ef4444",
    content: "오전 10시경 자해 행동(머리 박기) 1회 관찰됐습니다. 즉시 개입하여 3분 내 안정됐습니다. 행동지원 전문가에게도 공유했습니다.",
    sentAt: "오늘 오전 10:35",
    confirmed: false,
  },
  {
    id: 4,
    studentId: 2,
    studentName: "이서연",
    type: "행동기록",
    typeIcon: "ri-file-list-3-line",
    typeColor: "#026eff",
    content: "오전 수업 중 자리 이탈 2회 관찰. 언어적 촉구로 복귀했습니다. 피로도가 높아 보이며 수면 보충이 필요할 것 같습니다.",
    sentAt: "오늘 오전 11:20",
    confirmed: true,
    confirmedAt: "오전 11:52",
  },
  {
    id: 5,
    studentId: 4,
    studentName: "최수아",
    type: "활동기록",
    typeIcon: "ri-palette-line",
    typeColor: "#06b6d4",
    content: "오늘 체육 시간에 친구들과 함께 공 던지기 활동에 참여했어요. 두 번이나 먼저 친구에게 공을 넘겨주는 모습을 보였습니다. 사회성이 많이 향상됐어요!",
    sentAt: "오늘 오전 9:50",
    confirmed: true,
    confirmedAt: "오전 10:20",
  },
  {
    id: 6,
    studentId: 3,
    studentName: "박지호",
    type: "식사기록",
    typeIcon: "ri-restaurant-line",
    typeColor: "#f59e0b",
    content: "점심: 밥, 국, 반찬 대부분 섭취. 평소와 비슷한 식사량입니다. 특이사항 없음.",
    sentAt: "오늘 오후 12:45",
    confirmed: false,
  },
  {
    id: 7,
    studentId: 6,
    studentName: "김지우",
    type: "긍정행동",
    typeIcon: "ri-star-smile-line",
    typeColor: "#10b981",
    content: "국어 시간에 자발적으로 손을 들고 발표했습니다! 또렷한 발음으로 의사 표현을 했어요. 집에서도 꼭 칭찬해 주시면 더욱 동기부여가 될 것 같아요.",
    sentAt: "오늘 오전 10:30",
    confirmed: true,
    confirmedAt: "오전 11:02",
  },
  {
    id: 8,
    studentId: 6,
    studentName: "김지우",
    type: "약복용",
    typeIcon: "ri-medicine-bottle-line",
    typeColor: "#8b5cf6",
    content: "점심 식사 후 처방약 복용 완료했습니다. 거부감 없이 잘 복용했어요.",
    sentAt: "오늘 오후 1:15",
    confirmed: true,
    confirmedAt: "오후 1:40",
  },
  {
    id: 9,
    studentId: 6,
    studentName: "김지우",
    type: "활동기록",
    typeIcon: "ri-palette-line",
    typeColor: "#06b6d4",
    content: "오후 미술활동에서 점토로 고양이를 만들며 40분간 집중했어요! 친구에게 먼저 재료를 건네주는 모습도 보였습니다. 완성도 높은 작품이 나왔으니 오늘 꼭 여쭤봐 주세요.",
    sentAt: "오늘 오후 2:20",
    confirmed: false,
  },
  {
    id: 10,
    studentId: 6,
    studentName: "김지우",
    type: "행동기록",
    typeIcon: "ri-file-list-3-line",
    typeColor: "#026eff",
    content: "수학 활동 중 자리 이탈 시도 1회 관찰됐습니다. 언어적 촉구 한 번으로 바로 자리에 돌아왔어요. 전반적으로 오늘 집중력이 좋은 편입니다.",
    sentAt: "오늘 오전 11:40",
    confirmed: false,
  },
];

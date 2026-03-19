export interface ChatMessage {
  id: number | string;
  sender: "teacher" | "parent";
  senderName: string;
  text: string;
  time: string;
  type: "text" | "daily-report" | "attachment";
  reportData?: {
    sleep: string;
    bowel: string;
    condition: string;
    meal: string;
    note: string;
    sentBy: string;
    sentTime: string;
  };
  attachmentUrl?: string;
  attachmentType?: "image" | "video";
}

export interface StudentConversation {
  studentId: number | string;
  studentName: string;
  initial: string;
  avatarColor: string;
  parentName: string;
  /** 보호자 profile id — 메시지 발송 시 receiver_id로 사용 */
  _parentId?: string;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  weeklyStats: {
    sleep: string;
    sleepChange: string;
    sleepPositive: boolean;
    condition: string;
    conditionChange: string;
    conditionPositive: boolean;
    meal: string;
    mealChange: string;
    mealPositive: boolean;
  };
  messages: ChatMessage[];
}

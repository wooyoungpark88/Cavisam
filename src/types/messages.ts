export interface ChatMessage {
  id: number | string;
  sender: "teacher" | "parent";
  senderName: string;
  text: string;
  time: string;
  type: "text" | "daily-report";
  reportData?: {
    sleep: string;
    bowel: string;
    condition: string;
    meal: string;
    note: string;
    sentBy: string;
    sentTime: string;
  };
}

export interface StudentConversation {
  studentId: number | string;
  studentName: string;
  initial: string;
  avatarColor: string;
  parentName: string;
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

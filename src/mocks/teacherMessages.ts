export interface ChatMessage {
  id: number;
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
  studentId: number;
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

export const mockConversations: StudentConversation[] = [
  {
    studentId: 1,
    studentName: "김민조",
    initial: "민",
    avatarColor: "#026eff",
    parentName: "김민조 어머니",
    unreadCount: 2,
    lastMessage: "일일보고 감사합니다",
    lastTime: "오전 5:45",
    weeklyStats: {
      sleep: "8시간",
      sleepChange: "+1h",
      sleepPositive: true,
      condition: "4/5",
      conditionChange: "-0.5",
      conditionPositive: false,
      meal: "100%",
      mealChange: "→",
      mealPositive: true,
    },
    messages: [
      {
        id: 1,
        sender: "teacher",
        senderName: "김태의 선생님",
        text: "안녕하세요, 김민준 이용인 케어톡입니다.",
        time: "오전 1:45",
        type: "text",
      },
      {
        id: 2,
        sender: "teacher",
        senderName: "김태의 선생님",
        text: "안녕하세요, 민주이 어머니! 오늘 민주이가 미술 시간에 그림을 아주 잘 그렸어요. 집중력이 많이 좋아졌습니다.",
        time: "오전 1:45",
        type: "text",
      },
      {
        id: 3,
        sender: "parent",
        senderName: "김민준 어머니",
        text: "감사합니다 선생님! 어제 일찍 재워서 그런지 컨디션이 좋은 것 같아요 😊",
        time: "오전 1:45",
        type: "text",
      },
      {
        id: 4,
        sender: "parent",
        senderName: "김민준 어머니",
        text: "약은 아침에 먹이고 보냈습니다. 점심 후에도 한 번 복용해야 해요",
        time: "오전 2:45",
        type: "text",
      },
      {
        id: 5,
        sender: "teacher",
        senderName: "김태의 선생님",
        text: "네, 알겠습니다! 점심 후 약 복용 챙기겠습니다.",
        time: "오전 2:45",
        type: "text",
      },
      {
        id: 6,
        sender: "teacher",
        senderName: "김태의 선생님",
        text: "",
        time: "오전 5:47",
        type: "daily-report",
        reportData: {
          sleep: "23:00 - 07:00",
          bowel: "정상",
          condition: "좋음",
          meal: "잘 먹음",
          note: "미술 시간 집중력 좋았음. 점심 후 약 복용 완료.",
          sentBy: "김태의 선생님",
          sentTime: "오전 5:47",
        },
      },
      {
        id: 7,
        sender: "parent",
        senderName: "김민준 어머니",
        text: "일일보고 감사합니다 오늘도 수고하셨어요 선생님 🙏",
        time: "오전 5:45",
        type: "text",
      },
    ],
  },
  {
    studentId: 2,
    studentName: "이서연",
    initial: "서",
    avatarColor: "#10b981",
    parentName: "이서연 어머니",
    unreadCount: 0,
    lastMessage: "오늘 컨디션이 좋지 않아서...",
    lastTime: "오전 9:10",
    weeklyStats: {
      sleep: "5시간",
      sleepChange: "-2h",
      sleepPositive: false,
      condition: "2/5",
      conditionChange: "-1",
      conditionPositive: false,
      meal: "60%",
      mealChange: "-20%",
      mealPositive: false,
    },
    messages: [
      {
        id: 1,
        sender: "parent",
        senderName: "이서연 어머니",
        text: "선생님 안녕하세요. 어제 서연이가 잠을 잘 못 잤어요. 오늘 컨디션이 좋지 않아서 주의 부탁드립니다.",
        time: "오전 7:30",
        type: "text",
      },
      {
        id: 2,
        sender: "teacher",
        senderName: "김태의 선생님",
        text: "네, 알겠습니다. 오늘 좀 더 세심하게 살펴볼게요. 피곤해하면 휴식 시간을 충분히 드릴게요.",
        time: "오전 9:10",
        type: "text",
      },
    ],
  },
  {
    studentId: 3,
    studentName: "박지호",
    initial: "지",
    avatarColor: "#f59e0b",
    parentName: "박지호 아버지",
    unreadCount: 1,
    lastMessage: "오늘도 잘 부탁드립니다",
    lastTime: "오전 8:15",
    weeklyStats: {
      sleep: "7시간",
      sleepChange: "+0.5h",
      sleepPositive: true,
      condition: "3/5",
      conditionChange: "+0.5",
      conditionPositive: true,
      meal: "80%",
      mealChange: "+10%",
      mealPositive: true,
    },
    messages: [
      {
        id: 1,
        sender: "parent",
        senderName: "박지호 아버지",
        text: "선생님, 오늘도 잘 부탁드립니다. 지호가 오늘 기분이 좋아 보여요.",
        time: "오전 8:15",
        type: "text",
      },
    ],
  },
  {
    studentId: 4,
    studentName: "최수아",
    initial: "수",
    avatarColor: "#8b5cf6",
    parentName: "최수아 어머니",
    unreadCount: 0,
    lastMessage: "감사해요 선생님!",
    lastTime: "어제",
    weeklyStats: {
      sleep: "9시간",
      sleepChange: "+1h",
      sleepPositive: true,
      condition: "5/5",
      conditionChange: "+1",
      conditionPositive: true,
      meal: "100%",
      mealChange: "→",
      mealPositive: true,
    },
    messages: [
      {
        id: 1,
        sender: "teacher",
        senderName: "김태의 선생님",
        text: "수아가 오늘 친구들과 사이좋게 잘 어울렸어요. 정말 대견하네요 😊",
        time: "어제 오후 4:30",
        type: "text",
      },
      {
        id: 2,
        sender: "parent",
        senderName: "최수아 어머니",
        text: "감사해요 선생님! 집에서도 선생님 이야기를 자주 해요 ❤️",
        time: "어제 오후 5:00",
        type: "text",
      },
    ],
  },
  {
    studentId: 5,
    studentName: "정도현",
    initial: "도",
    avatarColor: "#ef4444",
    parentName: "정도현 어머니",
    unreadCount: 3,
    lastMessage: "자해 행동이 있었나요?",
    lastTime: "오전 10:20",
    weeklyStats: {
      sleep: "4시간",
      sleepChange: "-3h",
      sleepPositive: false,
      condition: "1/5",
      conditionChange: "-2",
      conditionPositive: false,
      meal: "30%",
      mealChange: "-40%",
      mealPositive: false,
    },
    messages: [
      {
        id: 1,
        sender: "parent",
        senderName: "정도현 어머니",
        text: "선생님, 오늘 도현이가 자해 행동이 있었나요? 어제도 집에서 한 번 있었어요.",
        time: "오전 10:20",
        type: "text",
      },
      {
        id: 2,
        sender: "teacher",
        senderName: "김태의 선생님",
        text: "네 어머니, 오늘 오전에 1회 관찰됐어요. 즉시 개입해서 3분 내로 안정됐습니다. 행동지원 전문가에게도 공유했어요.",
        time: "오전 10:35",
        type: "text",
      },
      {
        id: 3,
        sender: "parent",
        senderName: "정도현 어머니",
        text: "알려주셔서 감사해요. 집에서도 주의 깊게 살펴볼게요. 혹시 촉발 원인이 있었나요?",
        time: "오전 10:40",
        type: "text",
      },
    ],
  },
];

export const quickReplies = [
  "오늘 활동 중 특이사항을 알려드립니다",
  "점심 식사 잘 마쳤습니다",
  "약 복용 완료했습니다",
  "오늘 컨디션이 좋았어요 😊",
  "확인해 주셔서 감사합니다 🙏",
  "내일도 잘 부탁드립니다",
];

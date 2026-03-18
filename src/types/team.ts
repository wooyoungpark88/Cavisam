export type MemberRole =
  | "담임교사"
  | "특수교사"
  | "언어치료사"
  | "작업치료사"
  | "사회복지사"
  | "행동지원전문가";

export interface TeamMember {
  id: number | string;
  name: string;
  initial: string;
  avatarColor: string;
  role: MemberRole;
  department: string;
  phone: string;
  email: string;
  assignedStudentIds: (number | string)[];
  specialty: string;
  availableTime: string;
  isMe?: boolean;
}

export interface StudentAssignment {
  studentId: number | string;
  studentName: string;
  initial: string;
  avatarColor: string;
  primaryTeacherId: number | string;
  assignedMemberIds: (number | string)[];
  priority: "일반" | "집중" | "긴급";
}

export interface TeamMeeting {
  id: number | string;
  title: string;
  date: string;
  time: string;
  type: "정기회의" | "사례회의" | "보호자간담회" | "외부협력";
  participants: (number | string)[];
  agenda: string[];
  isUpcoming: boolean;
  location: string;
  notes?: string;
}

export interface TeamActivity {
  id: number | string;
  memberId: number | string;
  memberName: string;
  memberColor: string;
  memberInitial: string;
  action: string;
  target: string;
  time: string;
  type: "note" | "report" | "meeting" | "alert" | "update";
}

export type UserRole = "teacher" | "parent" | "unassigned";
export type UserStatus = "approved" | "pending" | "suspended";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  registeredAt: string;
  approvedAt?: string;
  linkedStudents?: string[];
  avatarColor: string;
  initial: string;
  department?: string;
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: 1,
    name: "박지혜",
    email: "jihye.park@haeoreum.or.kr",
    phone: "010-1234-5678",
    role: "teacher",
    status: "approved",
    registeredAt: "2025.01.08",
    approvedAt: "2025.01.09",
    avatarColor: "#026eff",
    initial: "박",
    department: "생활재활팀",
  },
  {
    id: 2,
    name: "이수민",
    email: "sumin.lee@haeoreum.or.kr",
    phone: "010-2345-6789",
    role: "teacher",
    status: "approved",
    registeredAt: "2025.01.08",
    approvedAt: "2025.01.09",
    avatarColor: "#8b5cf6",
    initial: "이",
    department: "사회적응팀",
  },
  {
    id: 3,
    name: "최준호",
    email: "junho.choi@haeoreum.or.kr",
    phone: "010-3456-7890",
    role: "teacher",
    status: "approved",
    registeredAt: "2025.02.03",
    approvedAt: "2025.02.04",
    avatarColor: "#10b981",
    initial: "최",
    department: "직업재활팀",
  },
  {
    id: 4,
    name: "김영희",
    email: "younghee.kim@naver.com",
    phone: "010-4567-8901",
    role: "parent",
    status: "approved",
    registeredAt: "2025.01.15",
    approvedAt: "2025.01.16",
    linkedStudents: ["김민조"],
    avatarColor: "#f59e0b",
    initial: "김",
  },
  {
    id: 5,
    name: "이미경",
    email: "mikyung.lee@gmail.com",
    phone: "010-5678-9012",
    role: "parent",
    status: "approved",
    registeredAt: "2025.01.20",
    approvedAt: "2025.01.21",
    linkedStudents: ["이서연"],
    avatarColor: "#ec4899",
    initial: "이",
  },
  {
    id: 6,
    name: "박성호",
    email: "sungho.park@kakao.com",
    phone: "010-6789-0123",
    role: "parent",
    status: "approved",
    registeredAt: "2025.02.10",
    approvedAt: "2025.02.11",
    linkedStudents: ["박지호"],
    avatarColor: "#06b6d4",
    initial: "박",
  },
  {
    id: 7,
    name: "정은주",
    email: "eunju.jung@naver.com",
    phone: "010-7890-1234",
    role: "parent",
    status: "approved",
    registeredAt: "2025.02.14",
    approvedAt: "2025.02.15",
    linkedStudents: ["정도현"],
    avatarColor: "#ef4444",
    initial: "정",
  },
  {
    id: 8,
    name: "강민석",
    email: "minseok.kang@gmail.com",
    phone: "010-8901-2345",
    role: "unassigned",
    status: "pending",
    registeredAt: "2026.03.15",
    avatarColor: "#6b7280",
    initial: "강",
  },
  {
    id: 9,
    name: "윤지현",
    email: "jihyun.yoon@naver.com",
    phone: "010-9012-3456",
    role: "unassigned",
    status: "pending",
    registeredAt: "2026.03.16",
    avatarColor: "#6b7280",
    initial: "윤",
  },
  {
    id: 10,
    name: "한상훈",
    email: "sanghoon.han@kakao.com",
    phone: "010-0123-4567",
    role: "unassigned",
    status: "pending",
    registeredAt: "2026.03.17",
    avatarColor: "#6b7280",
    initial: "한",
  },
  {
    id: 11,
    name: "오지은",
    email: "jieun.oh@gmail.com",
    phone: "010-1122-3344",
    role: "parent",
    status: "suspended",
    registeredAt: "2025.03.01",
    approvedAt: "2025.03.02",
    linkedStudents: ["최수아"],
    avatarColor: "#9ca3af",
    initial: "오",
  },
];

export const MOCK_STUDENTS_FOR_LINK = [
  "김민조", "이서연", "박지호", "최수아", "정도현", "김지우", "홍나은",
];

import { useState, useEffect } from "react";
import { type AdminUser, type UserRole, type UserStatus } from "../../mocks/adminUsers";
import AdminSidebar, { type AdminTab } from "./components/AdminSidebar";
import AdminOverview from "./components/AdminOverview";
import UserManagement from "./components/UserManagement";
import PendingApprovals from "./components/PendingApprovals";
import { supabase } from "../../lib/supabase";

const MOBILE_TABS: { key: AdminTab; icon: string; label: string }[] = [
  { key: "overview", icon: "ri-dashboard-3-line", label: "대시보드" },
  { key: "users", icon: "ri-group-line", label: "사용자" },
  { key: "pending", icon: "ri-time-line", label: "승인대기" },
];

const ROLE_COLORS: Record<string, string> = {
  teacher: "#026eff", parent: "#ea580c", admin: "#9ca3af", unassigned: "#6b7280",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Supabase에서 프로필 목록 로드
  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, name, role, status, organization_id, avatar_url, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        setUsers(
          data.map((p, i) => ({
            id: i + 1,
            name: p.name || "이름 없음",
            email: "",
            phone: "",
            role: (p.role === "teacher" || p.role === "parent" ? p.role : "unassigned") as UserRole,
            status: (p.status === "approved" || p.status === "pending" ? p.status : "suspended") as UserStatus,
            registeredAt: new Date(p.created_at).toLocaleDateString("ko-KR"),
            approvedAt: p.status === "approved" ? new Date(p.created_at).toLocaleDateString("ko-KR") : undefined,
            avatarColor: ROLE_COLORS[p.role] ?? "#6b7280",
            initial: (p.name || "?").charAt(0),
            _profileId: p.id, // Supabase ID 보존
          }))
        );
      });
  }, []);

  const pendingCount = users.filter((u) => u.status === "pending").length;

  const handleUpdate = async (
    id: number,
    role: UserRole,
    status: UserStatus,
    linkedStudents?: string[]
  ) => {
    const user = users.find((u) => u.id === id);
    const profileId = (user as AdminUser & { _profileId?: string })?._profileId;

    // Supabase 업데이트
    if (profileId) {
      const dbRole = role === "unassigned" ? "teacher" : role;
      const dbStatus = status === "suspended" ? "rejected" : status;
      await supabase.from("profiles").update({ role: dbRole, status: dbStatus }).eq("id", profileId);
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              role,
              status,
              linkedStudents,
              approvedAt: status === "approved" ? "방금" : u.approvedAt,
              avatarColor: ROLE_COLORS[role] ?? "#9ca3af",
            }
          : u
      )
    );
  };

  const handleApprove = (id: number, role: UserRole, linkedStudents?: string[]) => {
    handleUpdate(id, role, "approved", linkedStudents);
  };

  const handleReject = async (id: number) => {
    const user = users.find((u) => u.id === id);
    const profileId = (user as AdminUser & { _profileId?: string })?._profileId;
    if (profileId) {
      await supabase.from("profiles").update({ status: "rejected" }).eq("id", profileId);
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const activeLabel = MOBILE_TABS.find((t) => t.key === activeTab)?.label ?? "";

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#f8fafc]">
      {/* Sidebar — desktop only */}
      <div className="hidden lg:flex">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingCount={pendingCount}
        />
      </div>

      {/* Mobile top header */}
      <header className="lg:hidden flex-shrink-0 h-14 bg-[#0f172a] flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#026eff]/90 flex items-center justify-center">
            <i className="ri-shield-keyhole-line text-white text-sm" />
          </div>
          <span className="text-sm font-bold text-white">관리자 콘솔</span>
        </div>
        <span className="text-xs text-white/50 font-medium">{activeLabel}</span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden pb-16 lg:pb-0">
        {activeTab === "overview" && (
          <AdminOverview
            users={users}
            onGoUsers={() => setActiveTab("users")}
            onGoPending={() => setActiveTab("pending")}
          />
        )}
        {activeTab === "users" && (
          <UserManagement users={users} onUpdate={handleUpdate} />
        )}
        {activeTab === "pending" && (
          <PendingApprovals
            users={users}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch"
        style={{ background: "#0f172a", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {MOBILE_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 cursor-pointer transition-all relative"
              style={{ color: isActive ? "#60a5fa" : "rgba(255,255,255,0.4)" }}
            >
              <div className="w-5 h-5 flex items-center justify-center relative">
                <i className={`${tab.icon} text-base`} />
                {tab.key === "pending" && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-orange-400 flex items-center justify-center text-white text-[8px] font-bold leading-none">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

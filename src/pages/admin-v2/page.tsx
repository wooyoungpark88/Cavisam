import { useState } from "react";
import { mockAdminUsers, type AdminUser, type UserRole, type UserStatus } from "../../mocks/adminUsers";
import AdminSidebar, { type AdminTab } from "./components/AdminSidebar";
import AdminOverview from "./components/AdminOverview";
import UserManagement from "./components/UserManagement";
import PendingApprovals from "./components/PendingApprovals";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);

  const pendingCount = users.filter((u) => u.status === "pending").length;

  const handleUpdate = (
    id: number,
    role: UserRole,
    status: UserStatus,
    linkedStudents?: string[]
  ) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              role,
              status,
              linkedStudents,
              approvedAt: status === "approved" ? "방금" : u.approvedAt,
              avatarColor:
                role === "teacher"
                  ? "#026eff"
                  : role === "parent"
                  ? "#ea580c"
                  : "#9ca3af",
            }
          : u
      )
    );
  };

  const handleApprove = (id: number, role: UserRole, linkedStudents?: string[]) => {
    handleUpdate(id, role, "approved", linkedStudents);
  };

  const handleReject = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingCount}
      />

      <main className="flex-1 flex overflow-hidden">
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
    </div>
  );
}

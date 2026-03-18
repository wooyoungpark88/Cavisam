import { type AdminUser } from "../../../mocks/adminUsers";

interface AdminOverviewProps {
  users: AdminUser[];
  onGoUsers: () => void;
  onGoPending: () => void;
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
  onClick,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex items-center gap-4 cursor-pointer hover:border-gray-200 transition-colors"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        <i className={`${icon} text-xl`} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-semibold text-gray-600 mt-0.5">{label}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default function AdminOverview({ users, onGoUsers, onGoPending }: AdminOverviewProps) {
  const total = users.length;
  const teachers = users.filter((u) => u.role === "teacher" && u.status === "approved").length;
  const parents = users.filter((u) => u.role === "parent" && u.status === "approved").length;
  const pending = users.filter((u) => u.status === "pending").length;
  const suspended = users.filter((u) => u.status === "suspended").length;

  const recentPending = users
    .filter((u) => u.status === "pending")
    .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">운영 대시보드</h1>
        <p className="text-sm text-gray-500 mt-0.5">전체 사용자 현황과 가입 승인 요청을 확인하세요.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard
          icon="ri-group-line"
          iconBg="#f0f4ff"
          iconColor="#026eff"
          label="전체 사용자"
          value={total}
          sub="승인 · 대기 · 정지 포함"
          onClick={onGoUsers}
        />
        <StatCard
          icon="ri-user-settings-line"
          iconBg="#ecfdf5"
          iconColor="#10b981"
          label="교사"
          value={teachers}
          sub="승인된 교사 계정"
          onClick={onGoUsers}
        />
        <StatCard
          icon="ri-parent-line"
          iconBg="#fff7ed"
          iconColor="#ea580c"
          label="보호자"
          value={parents}
          sub="승인된 보호자 계정"
          onClick={onGoUsers}
        />
        <StatCard
          icon="ri-time-line"
          iconBg="#fefce8"
          iconColor="#d97706"
          label="승인 대기"
          value={pending}
          sub="역할 미지정 신규 가입"
          onClick={onGoPending}
        />
      </div>

      {/* 최근 가입 승인 대기 */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900">최근 승인 대기 요청</p>
            <p className="text-[11px] text-gray-400 mt-0.5">신규 가입자의 역할을 지정해 주세요</p>
          </div>
          {pending > 0 && (
            <button
              onClick={onGoPending}
              className="text-xs font-semibold text-[#026eff] cursor-pointer whitespace-nowrap hover:underline"
            >
              전체 보기 →
            </button>
          )}
        </div>

        {recentPending.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center mb-3">
              <i className="ri-checkbox-circle-line text-green-400 text-lg" />
            </div>
            <p className="text-sm text-gray-500 font-medium">대기 중인 승인 요청이 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">모든 가입자의 역할이 지정되었어요.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentPending.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "#9ca3af" }}
                >
                  {u.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{u.email}</p>
                </div>
                <span className="hidden sm:block text-[11px] text-gray-400 flex-shrink-0">{u.registeredAt} 가입</span>
                <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-500 text-[11px] font-semibold whitespace-nowrap">
                  역할 미지정
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 상태 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 역할 분포 */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 sm:px-6 py-5">
          <p className="text-sm font-bold text-gray-900 mb-4">역할 분포</p>
          <div className="space-y-3">
            {[
              { label: "교사", count: teachers, color: "#026eff", icon: "ri-user-settings-line" },
              { label: "보호자", count: parents, color: "#ea580c", icon: "ri-parent-line" },
              { label: "역할 미지정", count: pending, color: "#d97706", icon: "ri-time-line" },
              { label: "정지 계정", count: suspended, color: "#9ca3af", icon: "ri-forbid-line" },
            ].map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icon} text-xs`} style={{ color: item.color }} />
                  </div>
                  <p className="text-xs text-gray-600 w-20 flex-shrink-0">{item.label}</p>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: item.color }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-5 text-right flex-shrink-0">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 최근 승인된 사용자 */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 sm:px-6 py-5">
          <p className="text-sm font-bold text-gray-900 mb-4">최근 승인된 사용자</p>
          <div className="space-y-3">
            {users
              .filter((u) => u.status === "approved" && u.approvedAt)
              .sort((a, b) => (b.approvedAt ?? "").localeCompare(a.approvedAt ?? ""))
              .slice(0, 4)
              .map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: u.avatarColor }}
                  >
                    {u.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{u.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{u.approvedAt} 승인</p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: u.role === "teacher" ? "#eff6ff" : "#fff7ed",
                      color: u.role === "teacher" ? "#026eff" : "#ea580c",
                    }}
                  >
                    {u.role === "teacher" ? "교사" : "보호자"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

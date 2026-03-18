type AdminTab = "overview" | "users" | "pending";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  pendingCount: number;
}

const NAV_ITEMS: {
  key: AdminTab;
  icon: string;
  label: string;
  sub?: string;
}[] = [
  { key: "overview", icon: "ri-dashboard-3-line", label: "대시보드", sub: "전체 현황" },
  { key: "users", icon: "ri-group-line", label: "사용자 관리", sub: "역할 조회 · 변경" },
  { key: "pending", icon: "ri-time-line", label: "승인 대기", sub: "신규 가입 검토" },
];

export default function AdminSidebar({ activeTab, onTabChange, pendingCount }: AdminSidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 h-full flex flex-col bg-[#0f172a]">
      {/* Logo area */}
      <div className="px-5 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-[#026eff]/90 flex items-center justify-center">
            <i className="ri-shield-keyhole-line text-white text-sm" />
          </div>
          <span className="text-sm font-bold text-white">관리자 콘솔</span>
        </div>
        <p className="text-[10px] text-white/40 pl-0.5">해오름 발달장애인복지관</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer whitespace-nowrap transition-all text-left"
              style={{
                background: isActive ? "rgba(2,110,255,0.18)" : "transparent",
              }}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i
                  className={`${item.icon} text-base`}
                  style={{ color: isActive ? "#60a5fa" : "rgba(255,255,255,0.45)" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-semibold leading-tight"
                  style={{ color: isActive ? "#93c5fd" : "rgba(255,255,255,0.75)" }}
                >
                  {item.label}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {item.sub}
                </p>
              </div>
              {item.key === "pending" && pendingCount > 0 && (
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-white text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#026eff]/30 flex items-center justify-center flex-shrink-0">
            <i className="ri-admin-line text-[#60a5fa] text-xs" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-white/80 truncate">슈퍼 관리자</p>
            <p className="text-[9px] text-white/30 truncate">admin@haeoreum.or.kr</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export type { AdminTab };

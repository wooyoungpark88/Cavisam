import { mockTeacherInfo } from "../../../mocks/teacherDashboard";

export type TeacherMenuKey = "children" | "parent-reports" | "messages" | "behavior" | "team";

interface MenuItem {
  key: TeacherMenuKey;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { key: "children", label: "이용인 관리", icon: "ri-user-heart-line" },
  { key: "parent-reports", label: "보호자 보고", icon: "ri-file-text-line" },
  { key: "messages", label: "소통방", icon: "ri-chat-3-line" },
  { key: "behavior", label: "행동 추이", icon: "ri-line-chart-line" },
  { key: "team", label: "돌봄 팀", icon: "ri-team-line" },
];

interface TeacherSidebarProps {
  active: TeacherMenuKey;
  onSelect: (key: TeacherMenuKey) => void;
  onSwitchToParent: () => void;
}

export default function TeacherSidebar({ active, onSelect, onSwitchToParent }: TeacherSidebarProps) {
  return (
    <aside
      className="flex flex-col h-screen flex-shrink-0"
      style={{ width: 168, background: "#12192b" }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-[#026eff]">
            <i className="ri-heart-pulse-line text-white text-xs" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">CareVia</span>
        </div>
        <p className="text-white/30 text-[10px] pl-8">교사 대시보드</p>
      </div>

      {/* Teacher info */}
      <div
        className="px-4 py-3 mx-3 mt-4 rounded-xl"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-[#026eff]/30 text-[#6aaeff] text-xs font-bold">
            {mockTeacherInfo.initial}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold leading-tight truncate">
              {mockTeacherInfo.name} 선생님
            </p>
            <p className="text-white/30 text-[10px] leading-tight truncate">{mockTeacherInfo.class}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 mt-5 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer whitespace-nowrap"
              style={{
                background: isActive ? "rgba(2,110,255,0.18)" : "transparent",
                color: isActive ? "#6aaeff" : "rgba(255,255,255,0.45)",
              }}
            >
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <i className={`${item.icon} text-sm`} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1 h-4 rounded-full bg-[#026eff] flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: switch to parent view */}
      <div className="px-3 pb-5 pt-3 border-t border-white/5 mt-2">
        <button
          onClick={onSwitchToParent}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            <i className="ri-exchange-line text-sm" />
          </div>
          <span className="text-xs font-medium">보호자 뷰로 전환</span>
        </button>
      </div>
    </aside>
  );
}

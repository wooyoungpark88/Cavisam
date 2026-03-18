import { mockTeacherInfo } from "../../../mocks/teacherDashboard";

export type TeacherMenuKey = "children" | "parent-reports" | "messages" | "behavior" | "team";

interface MenuItem {
  key: TeacherMenuKey;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { key: "children", label: "이용인 관리", icon: "ri-user-heart-line" },
  { key: "parent-reports", label: "생활 알리미", icon: "ri-file-text-line" },
  { key: "messages", label: "케어톡", icon: "ri-chat-3-line" },
  { key: "behavior", label: "도전행동 추이", icon: "ri-line-chart-line" },
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
      className="relative flex flex-col h-screen flex-shrink-0 overflow-hidden"
      style={{
        width: 168,
        background: "linear-gradient(180deg, #e8f0ff 0%, #eef3ff 50%, #f0f4ff 100%)",
        borderRight: "1px solid rgba(2,110,255,0.1)",
      }}
    >
      {/* 배경 도트 패턴 */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #a5b4fc 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* 블루 오브 */}
      <div
        className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(2,110,255,0.15) 0%, transparent 65%)",
          filter: "blur(24px)",
        }}
      />
      <div
        className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 60%, rgba(2,110,255,0.10) 0%, transparent 65%)",
          filter: "blur(20px)",
        }}
      />

      {/* Logo */}
      <div
        className="relative z-10 px-5 pt-5 pb-4"
        style={{ borderBottom: "1px solid rgba(2,110,255,0.1)" }}
      >
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-[#026eff]">
            <i className="ri-heart-pulse-line text-white text-xs" />
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: "#0f172a" }}>CareVia</span>
        </div>
        <p className="text-[10px] pl-8" style={{ color: "rgba(2,110,255,0.5)" }}>교사 대시보드</p>
      </div>

      {/* Teacher info */}
      <div
        className="relative z-10 px-4 py-3 mx-3 mt-4 rounded-xl"
        style={{
          background: "rgba(2,110,255,0.07)",
          border: "1px solid rgba(2,110,255,0.12)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold"
            style={{ background: "rgba(2,110,255,0.15)", color: "#026eff" }}
          >
            {mockTeacherInfo.initial}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight truncate" style={{ color: "#1e293b" }}>
              {mockTeacherInfo.name} 선생님
            </p>
            <p className="text-[10px] leading-tight truncate" style={{ color: "rgba(2,110,255,0.5)" }}>
              {mockTeacherInfo.class}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="relative z-10 flex-1 px-3 mt-5 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer whitespace-nowrap"
              style={{
                background: isActive ? "rgba(2,110,255,0.12)" : "transparent",
                color: isActive ? "#026eff" : "rgba(30,41,59,0.5)",
                border: isActive ? "1px solid rgba(2,110,255,0.18)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(2,110,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#026eff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(30,41,59,0.5)";
                }
              }}
            >
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <i className={`${item.icon} text-sm`} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <span
                  className="ml-auto w-1 h-4 rounded-full flex-shrink-0"
                  style={{ background: "#026eff" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: switch to parent view */}
      <div
        className="relative z-10 px-3 pb-5 pt-3 mt-2"
        style={{ borderTop: "1px solid rgba(2,110,255,0.1)" }}
      >
        <button
          onClick={onSwitchToParent}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          style={{ color: "rgba(30,41,59,0.4)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#026eff";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(2,110,255,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(30,41,59,0.4)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
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

import { useNavigate } from "react-router-dom";
import { useParentData } from "../../../contexts/ParentDataContext";

export type MenuKey = "timeline" | "morning" | "incidents" | "behavior-stats" | "care-team";

interface MenuItem {
  key: MenuKey;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { key: "timeline", label: "타임라인", icon: "ri-home-5-line" },
  { key: "morning", label: "등원 전 한마디", icon: "ri-sun-line" },
  { key: "incidents", label: "케어톡", icon: "ri-chat-3-line" },
  { key: "behavior-stats", label: "우리 아이 이야기", icon: "ri-heart-3-line" },
  { key: "care-team", label: "돌봄 팀", icon: "ri-team-line" },
];

interface SidebarProps {
  active: MenuKey;
  onSelect: (key: MenuKey) => void;
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
  const navigate = useNavigate();
  const { activeChild } = useParentData();
  const childName = activeChild?.name ?? "자녀";
  const childInitial = childName.charAt(0);

  return (
    <aside
      className="relative flex flex-col h-screen flex-shrink-0 overflow-hidden"
      style={{
        width: 168,
        background: "linear-gradient(180deg, #fff7ed 0%, #fef3e8 50%, #fef9f5 100%)",
        borderRight: "1px solid rgba(234,88,12,0.1)",
      }}
    >
      {/* 배경 도트 패턴 */}
      <div
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fdba74 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* 오렌지 오브 */}
      <div
        className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(234,88,12,0.14) 0%, transparent 65%)",
          filter: "blur(24px)",
        }}
      />
      <div
        className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 60%, rgba(234,88,12,0.09) 0%, transparent 65%)",
          filter: "blur(20px)",
        }}
      />

      {/* Logo */}
      <div
        className="relative z-10 px-5 pt-5 pb-4"
        style={{ borderBottom: "1px solid rgba(234,88,12,0.1)" }}
      >
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-[#ea580c]">
            <i className="ri-heart-pulse-line text-white text-xs" />
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: "#0f172a" }}>CareVia</span>
        </div>
        <p className="text-[10px] pl-8" style={{ color: "rgba(234,88,12,0.5)" }}>보호자 대시보드</p>
      </div>

      {/* Child info */}
      <div
        className="relative z-10 px-4 py-3 mx-3 mt-4 rounded-xl"
        style={{
          background: "rgba(234,88,12,0.07)",
          border: "1px solid rgba(234,88,12,0.12)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold"
            style={{ background: "rgba(234,88,12,0.15)", color: "#ea580c" }}
          >
            {childInitial}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight truncate" style={{ color: "#1e293b" }}>
              {childName}
            </p>
            <p className="text-[10px] leading-tight truncate" style={{ color: "rgba(234,88,12,0.5)" }}>
              해오름 발달장애인복지관
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
                background: isActive ? "rgba(234,88,12,0.10)" : "transparent",
                color: isActive ? "#ea580c" : "rgba(30,41,59,0.5)",
                border: isActive ? "1px solid rgba(234,88,12,0.18)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(234,88,12,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#ea580c";
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
                  style={{ background: "#ea580c" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: switch to teacher view */}
      <div
        className="relative z-10 px-3 pb-5 pt-3 mt-2"
        style={{ borderTop: "1px solid rgba(234,88,12,0.1)" }}
      >
        <button
          onClick={() => navigate("/teacher")}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          style={{ color: "rgba(30,41,59,0.4)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#ea580c";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(234,88,12,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(30,41,59,0.4)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            <i className="ri-exchange-line text-sm" />
          </div>
          <span className="text-xs font-medium">교사 뷰로 전환</span>
        </button>
      </div>
    </aside>
  );
}

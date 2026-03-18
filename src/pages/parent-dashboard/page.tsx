import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar, { type MenuKey } from "./components/Sidebar";
import BehaviorStats from "./components/BehaviorStats";
import MorningReport from "./components/MorningReport";
import IncidentRoom from "./components/IncidentRoom";
import CareTeam from "./components/CareTeam";
import HomeTimeline from "./components/HomeTimeline";
import { mockChild, mockNotifications } from "../../mocks/parentDashboard";

const MOBILE_MENU: { key: MenuKey; label: string; icon: string }[] = [
  { key: "timeline", label: "홈", icon: "ri-home-5-line" },
  { key: "morning", label: "아침보고", icon: "ri-sun-line" },
  { key: "incidents", label: "소통방", icon: "ri-alarm-warning-line" },
  { key: "behavior-stats", label: "행동추이", icon: "ri-bar-chart-2-line" },
  { key: "care-team", label: "돌봄팀", icon: "ri-team-line" },
];

function TopBar({
  onBack,
  activeMenu: _activeMenu,
  onMenuSelect: _onMenuSelect,
}: {
  onBack: () => void;
  activeMenu: MenuKey;
  onMenuSelect: (k: MenuKey) => void;
}) {
  const [notiOpen, setNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notiRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id: number) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 gap-3">
      {/* Mobile: brand logo (visible only when sidebar is hidden) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-6 h-6 flex items-center justify-center rounded-md bg-[#026eff]">
          <i className="ri-heart-pulse-line text-white text-xs" />
        </div>
        <span className="text-sm font-bold text-gray-900 tracking-tight">CareVia</span>
      </div>

      {/* Desktop: spacer */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification */}
        <div className="relative" ref={notiRef}>
          <button
            onClick={() => setNotiOpen((v) => !v)}
            className="relative w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <i className={`ri-notification-3-line text-base transition-colors ${notiOpen ? "text-[#026eff]" : "text-gray-400"}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#026eff] flex items-center justify-center text-white text-[8px] font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {notiOpen && (
            <div
              className="absolute right-0 top-10 w-72 sm:w-80 bg-white rounded-2xl border border-gray-100 overflow-hidden z-50"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
            >
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">알림</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#026eff] text-white text-[9px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-[#026eff] hover:opacity-70 cursor-pointer whitespace-nowrap font-medium"
                  >
                    모두 읽음
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50/70 transition-colors cursor-pointer ${n.unread ? "bg-[#026eff]/[0.03]" : ""}`}
                  >
                    <div
                      className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-xl mt-0.5"
                      style={{ background: `${n.color}15` }}
                    >
                      <i className={`${n.icon} text-xs`} style={{ color: n.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className={`text-xs font-semibold leading-snug truncate ${n.unread ? "text-gray-900" : "text-gray-500"}`}>
                          {n.title}
                        </p>
                        {n.unread && <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#026eff]" />}
                      </div>
                      <p className="text-[10px] text-gray-400 leading-snug line-clamp-2">{n.desc}</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-50 text-center">
                <button className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap">
                  알림 전체 보기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#026eff]/10 text-[#026eff] text-xs font-bold flex-shrink-0">
            {mockChild.avatarInitial}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-tight">{mockChild.name} 보호자</p>
            <p className="text-[10px] text-gray-400">{mockChild.facility}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onBack}
          className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors cursor-pointer whitespace-nowrap ml-1"
        >
          <i className="ri-logout-box-r-line text-xs" />
          나가기
        </button>
      </div>
    </header>
  );
}

export default function ParentDashboardPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<MenuKey>("timeline");
  const [selectedMemberId, setSelectedMemberId] = useState<number>(1);

  const handleMemberMessage = (memberId: number) => {
    setSelectedMemberId(memberId);
    setActiveMenu("incidents");
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "timeline":
        return <HomeTimeline onMemberMessage={handleMemberMessage} />;
      case "morning":
        return <MorningReport />;
      case "incidents":
        return <IncidentRoom memberId={selectedMemberId} />;
      case "behavior-stats":
        return <BehaviorStats />;
      case "care-team":
        return <CareTeam />;
      default:
        return <HomeTimeline onMemberMessage={handleMemberMessage} />;
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'Noto Sans KR', sans-serif", background: "#f7f9fc" }}
    >
      {/* Sidebar — hidden on mobile, shown on lg+ */}
      <div className="hidden lg:flex">
        <Sidebar active={activeMenu} onSelect={setActiveMenu} />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          onBack={() => navigate("/")}
          activeMenu={activeMenu}
          onMenuSelect={setActiveMenu}
        />

        {/* Main scroll area — extra bottom padding on mobile for nav bar */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {renderContent()}
        </main>
      </div>

      {/* Mobile bottom navigation — hidden on lg+ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch"
        style={{ background: "#12192b", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {MOBILE_MENU.map((item) => {
          const isActive = activeMenu === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 cursor-pointer transition-all"
              style={{ color: isActive ? "#6aaeff" : "rgba(255,255,255,0.4)" }}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={`${item.icon} text-base`} />
              </div>
              <span className="text-[9px] font-medium leading-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full" style={{ background: "#6aaeff" }} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

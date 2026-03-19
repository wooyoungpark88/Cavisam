import { useState, useRef, useEffect } from "react";
import { useParentData } from "../../../contexts/ParentDataContext";
import { useAuth } from "../../../hooks/useAuth";

export default function DashboardHeader({ onBack }: { onBack: () => void }) {
  const { profile } = useAuth();
  const { activeChild, unreadCount: msgUnread } = useParentData();
  const childName = activeChild?.name ?? profile?.name ?? "";
  const childInitial = childName.charAt(0);
  const facility = "CareVia";

  const [notiOpen, setNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; type: string; icon: string; color: string; title: string; desc: string; time: string; unread: boolean }[]>([]);
  const notiRef = useRef<HTMLDivElement>(null);

  const unreadCount = msgUnread + notifications.filter((n) => n.unread).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="https://cavisam-production.up.railway.app/logo-carevia-figma.png"
            alt="CareVia"
            className="h-7"
          />
          <span className="text-xs text-gray-400">|</span>
          <span className="text-sm text-gray-500 font-medium">보호자</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <div className="relative" ref={notiRef}>
            <button
              onClick={() => setNotiOpen((v) => !v)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <i className={`ri-notification-3-line text-lg transition-colors ${notiOpen ? "text-[#026eff]" : "text-gray-500"}`} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#026eff] flex items-center justify-center text-white text-[11px] font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {notiOpen && (
              <div className="absolute right-0 top-12 w-[340px] bg-white rounded-2xl border border-gray-100 overflow-hidden z-50" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
                {/* Dropdown header */}
                <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">알림</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#026eff] text-white text-[12px] font-bold leading-none">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-[#026eff] hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap font-medium"
                    >
                      모두 읽음
                    </button>
                  )}
                </div>

                {/* Notification list */}
                <div className="divide-y divide-gray-50 max-h-[360px] overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/70 transition-colors cursor-pointer ${n.unread ? "bg-[#026eff]/[0.03]" : ""}`}
                    >
                      {/* Icon */}
                      <div
                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl mt-0.5"
                        style={{ background: `${n.color}15` }}
                      >
                        <i className={`${n.icon} text-sm`} style={{ color: n.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className={`text-xs font-semibold leading-snug ${n.unread ? "text-gray-900" : "text-gray-500"}`}>
                            {n.title}
                          </p>
                          {n.unread && (
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#026eff]" />
                          )}
                        </div>
                        <p className="text-[12.5px] text-gray-500 leading-snug line-clamp-2">{n.desc}</p>
                        <p className="text-[12px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-50 text-center">
                  <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer whitespace-nowrap">
                    알림 전체 보기
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#026eff]/10 text-[#026eff] text-sm font-bold">
              {childInitial}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{childName} 보호자</p>
              <p className="text-xs text-gray-500">{facility}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onBack}
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors ml-2 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-logout-box-r-line text-sm" />
            나가기
          </button>
        </div>
      </div>
    </header>
  );
}

export function StatsRow() {
  const { behaviorEvents, messages } = useParentData();
  const thisWeekEvents = behaviorEvents.filter((e) => {
    const d = new Date(e.occurred_at);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  });
  const teacherMsgs = messages.filter((m) => m.sender?.name?.includes("선생"));
  const stats = [
    { label: "이번 주 행동 기록", value: `${thisWeekEvents.length}건`, icon: "ri-file-list-3-line", color: "#026eff" },
    { label: "선생님 메시지", value: `${teacherMsgs.length}건`, icon: "ri-chat-1-line", color: "#10b981" },
    { label: "AI 리포트", value: "준비 중", icon: "ri-bar-chart-2-line", color: "#f59e0b" },
    { label: "총 행동 기록", value: `${behaviorEvents.length}건`, icon: "ri-calendar-check-line", color: "#8b5cf6" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl px-5 py-4 border border-gray-100 flex items-center gap-4"
        >
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: `${s.color}15` }}
          >
            <i className={`${s.icon} text-lg`} style={{ color: s.color }} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 leading-tight">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

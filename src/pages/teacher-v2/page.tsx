import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar, { type TeacherMenuKey } from "./components/TeacherSidebar";
import ChildManagement from "./components/ChildManagement";
import ParentReports from "./components/ParentReports";
import TeacherMessages from "./components/TeacherMessages";
import BehaviorTrend from "./components/BehaviorTrend";
import CareTeamView from "./components/CareTeamView";

const FACILITIES = [
  { value: "", label: "발달장애인복지시설을 선택하세요" },
  { value: "haeorun", label: "해오름 발달장애인복지관" },
];

const MOBILE_MENU: { key: TeacherMenuKey; label: string; icon: string }[] = [
  { key: "children", label: "이용인", icon: "ri-user-heart-line" },
  { key: "parent-reports", label: "보호자보고", icon: "ri-file-text-line" },
  { key: "messages", label: "소통방", icon: "ri-chat-3-line" },
  { key: "behavior", label: "행동추이", icon: "ri-line-chart-line" },
  { key: "team", label: "돌봄팀", icon: "ri-team-line" },
];

function TeacherDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeMenu, setActiveMenu] = useState<TeacherMenuKey>("children");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeMenu) {
      case "children":
        return <ChildManagement />;
      case "parent-reports":
        return <ParentReports />;
      case "messages":
        return <TeacherMessages />;
      case "behavior":
        return <BehaviorTrend />;
      case "team":
        return <CareTeamView />;
      default:
        return <ChildManagement />;
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'Noto Sans KR', sans-serif", background: "#f7f9fc" }}
    >
      {/* Sidebar */}
      <div className="hidden lg:flex">
        <TeacherSidebar
          active={activeMenu}
          onSelect={setActiveMenu}
          onSwitchToParent={() => navigate("/parent-dashboard")}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex-shrink-0 flex items-center justify-between px-4 sm:px-6">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-6 h-6 flex items-center justify-center rounded-md bg-[#026eff]">
              <i className="ri-heart-pulse-line text-white text-xs" />
            </div>
            <span className="text-gray-900 font-bold text-sm tracking-tight">CareVia</span>
          </div>
          <div className="hidden lg:block" />

          {/* Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-logout-box-r-line text-xs" />
              나가기
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden pb-16 lg:pb-0">
          {renderContent()}
        </main>
      </div>

      {/* Mobile bottom nav */}
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
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function LoginScreen({ onStart }: { onStart: () => void }) {
  const navigate = useNavigate();
  const [facility, setFacility] = useState("");
  const canStart = facility !== "";

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] min-h-screen px-12 py-14 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0a2a4a 0%, #1a5c8a 60%, #2b86c5 100%)" }}
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20">
            <i className="ri-heart-pulse-line text-white text-base" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">CareVia</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <p className="text-white/60 text-sm font-medium mb-3 tracking-widest uppercase">교사용 서비스</p>
            <h2 className="text-white text-3xl font-bold leading-snug">
              학생과 함께<br />성장하는<br />교사의 파트너
            </h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            케어비아와 함께 학생의<br />행동 변화를 체계적으로<br />기록하고 분석하세요.
          </p>

          <div className="flex flex-col gap-3 mt-2">
            {[
              { icon: "ri-edit-line", text: "이용인 행동 기록 및 관리" },
              { icon: "ri-group-line", text: "이용인 전체 현황 한눈에" },
              { icon: "ri-file-chart-line", text: "AI 기반 행동 분석 리포트" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15">
                  <i className={`${item.icon} text-white text-sm`} />
                </div>
                <span className="text-white/80 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-xs">해오름 발달장애인복지관</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#f7f9fc] px-6 py-14">
        <div className="lg:hidden mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a5c8a]">
              <i className="ri-heart-pulse-line text-white text-base" />
            </div>
            <span className="text-gray-900 font-bold text-lg tracking-tight">CareVia</span>
          </div>
          <p className="text-gray-400 text-sm">소속 시설을 선택해주세요</p>
        </div>

        <div className="w-full max-w-[400px]">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-s-line text-base" />
            홈으로 돌아가기
          </button>

          <div className="bg-white rounded-2xl p-8 border border-gray-100" style={{ boxShadow: "0 4px 24px rgba(26,92,138,0.07)" }}>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50">
                <i className="ri-user-settings-line text-[#1a5c8a] text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">교사용 시작하기</h2>
                <p className="text-sm text-gray-400">소속 시설을 선택해주세요</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                소속 시설
              </label>
              <div className="relative">
                <select
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1a5c8a]/30 focus:border-[#1a5c8a] transition-all"
                >
                  {FACILITIES.map((f) => (
                    <option key={f.value} value={f.value} disabled={f.value === ""} hidden={f.value === ""}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <i className="ri-arrow-down-s-line text-gray-400 text-lg" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-blue-50/70 rounded-xl px-4 py-3 mb-8">
              <i className="ri-information-line text-[#1a5c8a] text-sm mt-0.5" />
              <p className="text-xs text-[#1a5c8a]/80 leading-relaxed">
                교사 계정으로 로그인하면 담당 학급의 학생 목록과 행동 기록 기능을 이용할 수 있습니다.
              </p>
            </div>

            <button
              type="button"
              disabled={!canStart}
              onClick={() => canStart && onStart()}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
              style={{
                background: canStart
                  ? "linear-gradient(135deg, #1a5c8a 0%, #0a2a4a 100%)"
                  : "#1a5c8a",
              }}
            >
              시작하기
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">해오름 발달장애인복지관</p>
        </div>
      </div>
    </div>
  );
}

export default function TeacherPage() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <TeacherDashboard onLogout={() => setShowDashboard(false)} />;
  }

  return <LoginScreen onStart={() => setShowDashboard(true)} />;
}

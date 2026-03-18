import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar, { type TeacherMenuKey } from "./components/TeacherSidebar";
import ChildManagement from "./components/ChildManagement";
import ParentReports from "./components/ParentReports";
import TeacherMessages from "./components/TeacherMessages";
import BehaviorTrend from "./components/BehaviorTrend";
import CareTeamView from "./components/CareTeamView";
import { TeacherDataProvider } from "../../contexts/TeacherDataContext";

const FACILITIES = [
  { value: "", label: "발달장애인복지시설을 선택하세요" },
  { value: "haeorun", label: "해오름 발달장애인복지관" },
];

const MOBILE_MENU: { key: TeacherMenuKey; label: string; icon: string }[] = [
  { key: "children", label: "이용인", icon: "ri-user-heart-line" },
  { key: "parent-reports", label: "생활알리미", icon: "ri-file-text-line" },
  { key: "messages", label: "케어톡", icon: "ri-chat-3-line" },
  { key: "behavior", label: "행동추이", icon: "ri-line-chart-line" },
  { key: "team", label: "돌봄팀", icon: "ri-team-line" },
];

// PlaceholderView reserved for future use

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
        <main className="flex-1 flex flex-col overflow-hidden pb-16 lg:pb-0">
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
              <span className="text-[9px] font-medium leading-none whitespace-nowrap">{item.label}</span>
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
        style={{
          background: "linear-gradient(160deg, #dce8ff 0%, #e8f0ff 45%, #eef4ff 100%)",
          borderRight: "1px solid rgba(2,110,255,0.1)",
        }}
      >
        {/* 도트 패턴 */}
        <div
          className="absolute inset-0 opacity-[0.30] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #a5b4fc 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* 블루 오브 상단 */}
        <div
          className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(2,110,255,0.20) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        {/* 블루 오브 하단 */}
        <div
          className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at 60% 60%, rgba(2,110,255,0.12) 0%, transparent 65%)",
            filter: "blur(32px)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#026eff]">
            <i className="ri-heart-pulse-line text-white text-base" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "#0f172a" }}>CareVia</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-4"
              style={{
                background: "rgba(2,110,255,0.08)",
                color: "#026eff",
                border: "1px solid rgba(2,110,255,0.18)",
                letterSpacing: "0.12em",
              }}
            >
              교사용 서비스
            </span>
            <h2 className="text-3xl font-bold leading-snug" style={{ color: "#0f172a" }}>
              학생과 함께<br />성장하는<br />교사의 파트너
            </h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
            케어비아와 함께 학생의<br />행동 변화를 체계적으로<br />기록하고 분석하세요.
          </p>

          <div className="flex flex-col gap-3 mt-2">
            {[
              { icon: "ri-edit-line", text: "이용인 행동 기록 및 관리" },
              { icon: "ri-group-line", text: "이용인 전체 현황 한눈에" },
              { icon: "ri-file-chart-line", text: "AI 기반 행동 분석 리포트" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: "rgba(2,110,255,0.10)", color: "#026eff" }}
                >
                  <i className={`${item.icon} text-sm`} />
                </div>
                <span className="text-sm" style={{ color: "#334155" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: "rgba(2,110,255,0.45)" }}>해오름 발달장애인복지관</p>
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
            className="flex items-center gap-2 mb-6 cursor-pointer whitespace-nowrap transition-all group"
            style={{ color: "#475569" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#1a5c8a"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
          >
            <div
              className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-all"
              style={{ background: "rgba(26,92,138,0.08)" }}
            >
              <i className="ri-arrow-left-line text-sm" />
            </div>
            <span className="text-sm font-semibold">홈으로 돌아가기</span>
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
    return (
      <TeacherDataProvider>
        <TeacherDashboard onLogout={() => setShowDashboard(false)} />
      </TeacherDataProvider>
    );
  }

  return <LoginScreen onStart={() => setShowDashboard(true)} />;
}

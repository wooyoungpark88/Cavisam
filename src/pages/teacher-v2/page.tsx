import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { DEMO_TEACHER_ID, DEMO_ORG_ID } from "../../lib/demo";
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
              className="flex items-center gap-1.5 text-[12.5px] text-gray-400 hover:text-gray-700 transition-colors cursor-pointer whitespace-nowrap"
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
              <span className="text-[11px] font-medium leading-none whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function LoginScreen({ onStart }: { onStart: () => void }) {
  const navigate = useNavigate();
  const { session, profile, signIn } = useAuth();
  const [facility, setFacility] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);
  const canStart = facility !== "";
  const isLoggedIn = !!session && !!profile;

  async function handleGoogleLogin() {
    if (!canStart) return;
    setOauthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("OAuth error:", error.message);
      setOauthLoading(false);
    }
  }

  function handleDemoStart() {
    signIn({
      id: DEMO_TEACHER_ID,
      name: "김태희",
      role: "teacher",
      organization_id: DEMO_ORG_ID,
    });
    onStart();
  }

  const handleStartClick = () => {
    if (!canStart) return;
    if (isLoggedIn) {
      onStart();
    } else {
      handleGoogleLogin();
    }
  };

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
              className="text-[12px] font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-4"
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
              disabled={!canStart || oauthLoading}
              onClick={handleStartClick}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
              style={{
                background: canStart
                  ? "linear-gradient(135deg, #1a5c8a 0%, #0a2a4a 100%)"
                  : "#1a5c8a",
              }}
            >
              {oauthLoading ? "연결 중..." : isLoggedIn ? "시작하기" : "Google 계정으로 시작하기"}
            </button>

            {/* 로그인 상태 표시 */}
            {isLoggedIn ? (
              <div className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl bg-green-50 border border-green-100">
                <i className="ri-checkbox-circle-fill text-green-500 text-sm" />
                <span className="text-xs font-medium text-green-700">
                  {profile?.name ?? "사용자"}님으로 로그인됨
                </span>
              </div>
            ) : (
              <>
                {/* Google 로그인 안내 */}
                {canStart && (
                  <div className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-xl bg-blue-50/70 border border-blue-100/60">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-[12.5px] text-blue-600/70">시설 선택 후 Google 계정으로 로그인합니다</span>
                  </div>
                )}

                {/* 구분선 */}
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[12px] text-gray-300">또는</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* 체험 모드 */}
                <button
                  type="button"
                  onClick={handleDemoStart}
                  className="w-full mt-4 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                >
                  체험 모드로 둘러보기
                </button>
              </>
            )}
          </div>

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

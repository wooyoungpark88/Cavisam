import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { DEMO_PARENT_ID, DEMO_ORG_ID } from "../../lib/demo";

const FACILITIES = [
  { value: "", label: "발달장애인복지시설을 선택하세요" },
  { value: "00000000-0000-0000-0000-000000000001", label: "해오름 발달장애인복지관" },
];

export default function ParentPage() {
  const navigate = useNavigate();
  const { session, profile, signIn } = useAuth();
  const [facility, setFacility] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);

  const canStart = facility !== "";
  const isLoggedIn = !!session && !!profile;

  const handleStart = () => {
    if (!canStart) return;
    if (isLoggedIn) {
      navigate("/parent-dashboard");
    } else {
      handleGoogleLogin();
    }
  };

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
      id: DEMO_PARENT_ID,
      name: "김민준 어머니",
      role: "parent",
      organization_id: DEMO_ORG_ID,
    });
    navigate("/parent-dashboard", { replace: true });
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] min-h-screen px-12 py-14 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #fff0e6 0%, #fef3ea 45%, #fff8f5 100%)",
          borderRight: "1px solid rgba(234,88,12,0.1)",
        }}
      >
        {/* 도트 패턴 */}
        <div
          className="absolute inset-0 opacity-[0.28] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fdba74 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* 오렌지 오브 상단 */}
        <div
          className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(234,88,12,0.18) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        {/* 오렌지 오브 하단 */}
        <div
          className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at 60% 60%, rgba(234,88,12,0.10) 0%, transparent 65%)",
            filter: "blur(32px)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <img
            src="https://cavisam-production.up.railway.app/logo-carevia-figma.png"
            alt="CareVia"
            className="h-10"
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full inline-block mb-4"
              style={{
                background: "rgba(234,88,12,0.08)",
                color: "#ea580c",
                border: "1px solid rgba(234,88,12,0.18)",
                letterSpacing: "0.12em",
              }}
            >
              보호자 서비스
            </span>
            <h2 className="text-3xl font-bold leading-snug" style={{ color: "#0f172a" }}>
              어제보다 나은<br />내일을 만드는,<br />케어비아
            </h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
            자녀의 하루를 교사와 함께<br />실시간으로 확인하세요.
          </p>

          {/* Feature chips */}
          <div className="flex flex-col gap-3 mt-2">
            {[
              { icon: "ri-calendar-check-line", text: "자녀 일과 타임라인 확인" },
              { icon: "ri-chat-heart-line", text: "담당 교사와 실시간 소통" },
              { icon: "ri-bar-chart-2-line", text: "AI 기반 성장 리포트" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: "rgba(234,88,12,0.10)", color: "#ea580c" }}
                >
                  <i className={`${item.icon} text-sm`} />
                </div>
                <span className="text-sm" style={{ color: "#334155" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs" style={{ color: "rgba(234,88,12,0.45)" }}>CareVia · 보호자 서비스</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#f7f9fc] px-6 py-14">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10 text-center">
          <img
            src="https://cavisam-production.up.railway.app/logo-carevia-figma.png"
            alt="CareVia"
            className="h-9 mx-auto mb-3"
          />
          <p className="text-gray-400 text-sm">소속 시설을 선택해주세요</p>
        </div>

        <div className="w-full max-w-[400px]">
          {/* 뒤로 가기 버튼 */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 cursor-pointer whitespace-nowrap transition-all"
            style={{ color: "#475569" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#026eff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}
          >
            <div
              className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: "rgba(2,110,255,0.08)" }}
            >
              <i className="ri-arrow-left-line text-sm" />
            </div>
            <span className="text-sm font-semibold">홈으로 돌아가기</span>
          </button>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100" style={{ boxShadow: "0 4px 24px rgba(2,110,255,0.06)" }}>

            <div className="flex items-center gap-3 mb-7">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
                <img
                  src="https://cavisam-production.up.railway.app/icon-family.png"
                  alt="보호자"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">보호자로 시작하기</h2>
                <p className="text-sm text-gray-400">소속 시설을 선택해주세요</p>
              </div>
            </div>

            {/* Facility select */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                소속 시설
              </label>
              <div className="relative">
                <select
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#026eff]/30 focus:border-[#026eff] transition-all"
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

            {/* CTA Button */}
            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart || oauthLoading}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
              style={{
                background: canStart
                  ? "linear-gradient(135deg, #026eff 0%, #0258d4 100%)"
                  : "#026eff",
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
                    <span className="text-[11px] text-blue-600/70">시설 선택 후 Google 계정으로 로그인합니다</span>
                  </div>
                )}

                {/* 구분선 */}
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] text-gray-300">또는</span>
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

          {/* Bottom link */}
        </div>
      </div>
    </div>
  );
}

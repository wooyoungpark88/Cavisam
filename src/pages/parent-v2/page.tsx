import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FACILITIES = [
  { value: "", label: "발달장애인복지시설을 선택하세요" },
  { value: "00000000-0000-0000-0000-000000000001", label: "해오름 발달장애인복지관" },
];

export default function ParentPage() {
  const navigate = useNavigate();
  const [facility, setFacility] = useState("");

  const canStart = facility !== "";

  const handleStart = () => {
    if (!canStart) return;
    navigate("/parent-dashboard");
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] min-h-screen px-12 py-14 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #013ea0 0%, #026eff 60%, #4da3ff 100%)" }}
      >
        {/* Background circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <img
            src="https://cavisam-production.up.railway.app/logo-carevia-figma.png"
            alt="CareVia"
            className="h-10 brightness-0 invert"
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <p className="text-white/60 text-sm font-medium mb-3 tracking-widest uppercase">보호자 서비스</p>
            <h2 className="text-white text-3xl font-bold leading-snug">
              어제보다 나은<br />내일을 만드는,<br />케어비아
            </h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            자녀의 하루를 교사와 함께<br />실시간으로 확인하세요.
          </p>

          {/* Feature chips */}
          <div className="flex flex-col gap-3 mt-2">
            {[
              { icon: "ri-calendar-heart-line", text: "자녀 일과 타임라인 확인" },
              { icon: "ri-chat-heart-line", text: "담당 교사와 실시간 소통" },
              { icon: "ri-bar-chart-2-line", text: "AI 기반 성장 리포트" },
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

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">해오름 발달장애인복지관</p>
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
              disabled={!canStart}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed text-white cursor-pointer"
              style={{
                background: canStart
                  ? "linear-gradient(135deg, #026eff 0%, #0258d4 100%)"
                  : "#026eff",
              }}
            >
              시작하기
            </button>
          </div>

          {/* Bottom link */}
          <p className="text-center text-xs text-gray-400 mt-6">
            해오름 발달장애인복지관
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import BehaviorSummaryCards from "./BehaviorSummaryCards";
import BehaviorWeeklyChart from "./BehaviorWeeklyChart";
import BehaviorStudentRows from "./BehaviorStudentRows";
import CCTVPreviewModal from "./CCTVPreviewModal";

const PERIOD_OPTIONS = ["이번 주", "지난 2주", "이번 달"] as const;
type Period = (typeof PERIOD_OPTIONS)[number];

interface CCTVTarget {
  studentName?: string;
  behaviorType?: string;
  count?: number;
}

export default function BehaviorTrend() {
  const [period, setPeriod] = useState<Period>("이번 주");
  const [cctvTarget, setCctvTarget] = useState<CCTVTarget | null>(null);

  const handleShowCCTV = (studentName?: string, behaviorType?: string, count?: number) => {
    setCctvTarget({ studentName, behaviorType, count });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">도전행동 추이</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              담당 이용인 7명의 도전행동 주간 현황
            </p>
          </div>

          {/* Period selector */}
          <div
            className="flex items-center gap-0.5 p-1 rounded-xl flex-shrink-0"
            style={{ background: "#f3f4f6" }}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setPeriod(opt)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap transition-all"
                style={{
                  background: period === opt ? "white" : "transparent",
                  color: period === opt ? "#111827" : "#9ca3af",
                  boxShadow: period === opt ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* AI CCTV 안내 배너 */}
        <button
          onClick={() => handleShowCCTV(undefined, undefined, undefined)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-5 text-left cursor-pointer transition-all hover:opacity-90 active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
            border: "1px solid rgba(2,110,255,0.3)",
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(2,110,255,0.25)" }}
          >
            <i className="ri-vidicon-2-line text-[#60a5fa] text-base" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold leading-tight">AI CCTV로 도전행동 영상 확인</p>
            <p className="text-white/50 text-[12px] mt-0.5">케어비아 AI CCTV 서비스 이용자는 실시간 감지 영상을 바로 확인할 수 있어요</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="text-[12px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{ background: "rgba(2,110,255,0.3)", color: "#93c5fd" }}
            >
              미리보기
            </span>
            <i className="ri-arrow-right-s-line text-white/40 text-base" />
          </div>
        </button>

        {/* Summary cards */}
        <BehaviorSummaryCards onShowCCTV={handleShowCCTV} />

        {/* Weekly stacked chart + type distribution */}
        <BehaviorWeeklyChart />

        {/* Per-student table with sparklines */}
        <BehaviorStudentRows onShowCCTV={handleShowCCTV} />
      </div>

      {/* CCTV Preview Modal */}
      {cctvTarget && (
        <CCTVPreviewModal
          studentName={cctvTarget.studentName}
          behaviorType={cctvTarget.behaviorType}
          behaviorCount={cctvTarget.count}
          onClose={() => setCctvTarget(null)}
        />
      )}
    </div>
  );
}

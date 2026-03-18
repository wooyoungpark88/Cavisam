import { useEffect, useRef } from "react";
import { type AiCareReport, type CareLevel } from "../../../mocks/aiCareAnalysis";
import { type StudentDailyReport } from "../../../mocks/teacherDashboard";

interface AICareModalProps {
  student: StudentDailyReport;
  report: AiCareReport;
  onClose: () => void;
}

function careLevelStyle(level: CareLevel): {
  bg: string;
  color: string;
  border: string;
  badgeBg: string;
  label: string;
  icon: string;
} {
  switch (level) {
    case "우수":
      return {
        bg: "from-emerald-50 to-white",
        color: "#059669",
        border: "#d1fae5",
        badgeBg: "#f0fdf4",
        label: "우수",
        icon: "ri-medal-line",
      };
    case "양호":
      return {
        bg: "from-sky-50 to-white",
        color: "#0284c7",
        border: "#e0f2fe",
        badgeBg: "#f0f9ff",
        label: "양호",
        icon: "ri-shield-check-line",
      };
    case "주의":
      return {
        bg: "from-amber-50 to-white",
        color: "#d97706",
        border: "#fef3c7",
        badgeBg: "#fffbeb",
        label: "주의",
        icon: "ri-error-warning-line",
      };
    case "위험":
      return {
        bg: "from-red-50 to-white",
        color: "#dc2626",
        border: "#fee2e2",
        badgeBg: "#fef2f2",
        label: "위험",
        icon: "ri-alarm-warning-line",
      };
  }
}

function priorityStyle(p: "high" | "medium" | "low"): {
  label: string;
  color: string;
  bg: string;
} {
  switch (p) {
    case "high":
      return { label: "긴급", color: "#dc2626", bg: "#fef2f2" };
    case "medium":
      return { label: "권고", color: "#d97706", bg: "#fffbeb" };
    case "low":
      return { label: "참고", color: "#6b7280", bg: "#f9fafb" };
  }
}

function trendIcon(trend: "up" | "down" | "stable", good: boolean): {
  icon: string;
  color: string;
} {
  if (trend === "stable") return { icon: "ri-subtract-line", color: "#9ca3af" };
  if (trend === "up") {
    return good
      ? { icon: "ri-arrow-up-line", color: "#059669" }
      : { icon: "ri-arrow-up-line", color: "#dc2626" };
  }
  return good
    ? { icon: "ri-arrow-down-line", color: "#059669" }
    : { icon: "ri-arrow-down-line", color: "#dc2626" };
}

export default function AICareModal({ student, report, onClose }: AICareModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const lvStyle = careLevelStyle(report.careLevel);
  const maxBar = Math.max(...report.weeklyBehavior.map((d) => d.count), 1);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="relative bg-white rounded-2xl overflow-hidden flex flex-col"
        style={{
          width: 680,
          maxHeight: "90vh",
          border: `1.5px solid ${lvStyle.border}`,
        }}
      >
        {/* ── Header ── */}
        <div
          className={`flex-shrink-0 bg-gradient-to-b ${lvStyle.bg} px-6 pt-5 pb-4 border-b`}
          style={{ borderColor: lvStyle.border }}
        >
          {/* top row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: student.avatarColor }}
              >
                {student.initial}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-gray-900 text-base font-bold">{student.name}</h2>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ color: lvStyle.color, background: lvStyle.badgeBg }}
                  >
                    <i className={`${lvStyle.icon} text-[11px]`} />
                    {lvStyle.label}
                  </span>
                </div>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  <i className="ri-sparkling-2-line mr-0.5" />
                  AI 케어 분석 · {report.generatedAt}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <i className="ri-close-line text-base" />
            </button>
          </div>

          {/* Score bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${report.careLevelScore}%`,
                  background: lvStyle.color,
                }}
              />
            </div>
            <span className="text-sm font-bold flex-shrink-0" style={{ color: lvStyle.color }}>
              {report.careLevelScore}점
            </span>
            <span className="text-gray-400 text-[11px] flex-shrink-0">/ 100</span>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Risk alerts */}
          {report.riskAlerts.length > 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 space-y-1.5">
              <p className="text-[11px] font-bold text-red-600 uppercase tracking-wide flex items-center gap-1">
                <i className="ri-alarm-warning-fill" />
                즉각 대응 필요
              </p>
              {report.riskAlerts.map((alert) => (
                <div key={alert} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  <p className="text-red-700 text-[12px] leading-relaxed">{alert}</p>
                </div>
              ))}
            </div>
          )}

          {/* Positive highlights */}
          {report.positiveHighlights.length > 0 && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 space-y-1.5">
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                <i className="ri-sparkling-line" />
                긍정 하이라이트
              </p>
              {report.positiveHighlights.map((h) => (
                <div key={h} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <p className="text-emerald-700 text-[12px] leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <i className="ri-file-text-line" />
              AI 종합 분석
            </p>
            <p className="text-gray-700 text-[13px] leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              {report.summary}
            </p>
          </div>

          {/* Pattern stats */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <i className="ri-bar-chart-2-line" />
              핵심 지표
            </p>
            <div className="grid grid-cols-2 gap-2">
              {report.patterns.map((p) => {
                const tr = trendIcon(p.trend, p.good);
                return (
                  <div
                    key={p.label}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3.5 py-2.5"
                  >
                    <span className="text-gray-500 text-[12px]">{p.label}</span>
                    <div className="flex items-center gap-1">
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: p.good ? "#374151" : "#dc2626" }}
                      >
                        {p.value}
                      </span>
                      <div className="w-3.5 h-3.5 flex items-center justify-center">
                        <i className={`${tr.icon} text-xs`} style={{ color: tr.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly behavior chart */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <i className="ri-calendar-line" />
              이번 주 행동 빈도
            </p>
            <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 pt-4 pb-3">
              <div className="flex items-end gap-2 h-16">
                {report.weeklyBehavior.map((d) => {
                  const pct = maxBar === 0 ? 0 : (d.count / maxBar) * 100;
                  const lvColor =
                    report.careLevel === "위험"
                      ? "#ef4444"
                      : report.careLevel === "주의"
                      ? "#f59e0b"
                      : "#026eff";
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500 font-medium">{d.count}</span>
                      <div
                        className="w-full rounded-t-md"
                        style={{
                          height: `${Math.max(pct * 0.5, d.count === 0 ? 0 : 4)}px`,
                          background: d.count === 0 ? "#e5e7eb" : lvColor,
                          opacity: 0.85,
                          minHeight: d.count === 0 ? 2 : 4,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-1.5">
                {report.weeklyBehavior.map((d) => (
                  <div key={d.day} className="flex-1 text-center">
                    <span className="text-[10px] text-gray-400">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <i className="ri-lightbulb-line" />
              AI 인사이트
            </p>
            <div className="space-y-2">
              {report.insights.map((ins) => (
                <div
                  key={ins.title}
                  className="flex gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${ins.color}18` }}
                  >
                    <i className={`${ins.icon} text-sm`} style={{ color: ins.color }} />
                  </div>
                  <div>
                    <p className="text-gray-800 text-[12px] font-bold mb-0.5">{ins.title}</p>
                    <p className="text-gray-500 text-[11px] leading-relaxed">{ins.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <i className="ri-task-line" />
              케어 권고사항
            </p>
            <div className="space-y-2">
              {report.recommendations.map((rec) => {
                const ps = priorityStyle(rec.priority);
                return (
                  <div
                    key={rec.title}
                    className="rounded-xl border border-gray-100 bg-white px-4 py-3"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ background: "#f3f4f6" }}
                      >
                        <i className={`${rec.icon} text-[11px] text-gray-500`} />
                      </div>
                      <p className="text-gray-800 text-[12px] font-bold flex-1">{rec.title}</p>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ color: ps.color, background: ps.bg }}
                      >
                        {ps.label}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px] leading-relaxed pl-8">{rec.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer notice */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex items-start gap-2">
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-information-line text-xs text-gray-400" />
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              AI 분석은 축적된 아침 보고·행동 기록·발송 보고를 기반으로 생성됩니다. 최종 판단은 담당 교사의 전문적 소견을 따라 주세요.
            </p>
          </div>
        </div>

        {/* ── Footer action ── */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 cursor-pointer whitespace-nowrap hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap hover:opacity-85 transition-opacity"
            style={{ background: lvStyle.color }}
            onClick={onClose}
          >
            <i className="ri-send-plane-line text-sm" />
            보호자에게 분석 공유
          </button>
        </div>
      </div>
    </div>
  );
}

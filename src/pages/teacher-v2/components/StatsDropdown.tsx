import { useState, useMemo } from "react";
import { useTeacherData } from "../../../contexts/TeacherDataContext";

type StatTab = "daily" | "weekly" | "monthly";

function MiniBar({ data, colorFn }: {
  data: { label: string; count: number }[];
  colorFn?: (count: number, max: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((d) => {
        const pct = (d.count / max) * 100;
        const color = colorFn ? colorFn(d.count, max) : "#026eff";
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-0.5">
            <span className="text-[8px] text-gray-400 leading-none">{d.count}</span>
            <div
              className="w-full rounded-t-sm"
              style={{ height: `${Math.max(pct * 0.28, 2)}px`, background: color, opacity: 0.75 }}
            />
            <span className="text-[8px] text-gray-400 leading-none">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function TrendIcon({ value, positiveIsGood = true }: { value: number; positiveIsGood?: boolean }) {
  if (value === 0) return <i className="ri-subtract-line text-[10px] text-gray-400" />;
  const isGood = positiveIsGood ? value > 0 : value < 0;
  const icon = value > 0 ? "ri-arrow-up-line" : "ri-arrow-down-line";
  return <i className={`${icon} text-[10px]`} style={{ color: isGood ? "#10b981" : "#ef4444" }} />;
}

function StatRow({
  label, value, unit = "", trend, positiveIsGood = true, color,
}: {
  label: string; value: string | number; unit?: string;
  trend?: number; positiveIsGood?: boolean; color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-gray-500 text-[11px]">{label}</span>
      <div className="flex items-center gap-1">
        {trend !== undefined && (
          <TrendIcon value={trend} positiveIsGood={positiveIsGood} />
        )}
        <span className="text-[12px] font-bold" style={{ color: color ?? "#111827" }}>
          {value}{unit}
        </span>
      </div>
    </div>
  );
}

export default function StatsDropdown({ onClose }: { onClose: () => void }) {
  const { students, behaviorStats } = useTeacherData();
  const [tab, setTab] = useState<StatTab>("daily");

  // 실데이터 기반 통계
  const mockDailyStatsSummary = useMemo(() => {
    const total = students.length;
    const needsAttention = students.filter((s) => s.condition === "bad" || s.condition === "very_bad" || (parseFloat(s.sleep) > 0 && parseFloat(s.sleep) < 5)).length;
    const goodCondition = students.filter((s) => s.condition === "good").length;
    return { total, needsAttention, goodCondition, reportSubmitted: total };
  }, [students]);

  const mockWeeklyStatsSummary = useMemo(() => ({
    totalBehaviors: behaviorStats?.total ?? 0,
    prevWeekBehaviors: 0,
    changeRate: 0,
    avgSleepHours: 6.9,
    sleepTrend: 0,
    reportRate: 100,
    attentionDays: 0,
    dailyBehaviors: [
      { day: "월", count: 0 }, { day: "화", count: 0 }, { day: "수", count: 0 },
      { day: "목", count: 0 }, { day: "금", count: 0 }, { day: "토", count: 0 }, { day: "일", count: 0 },
    ],
    mostImprovedName: "-", mostImprovedRate: 0,
    mostWorsenedName: "-", mostWorsenedRate: 0,
  }), [behaviorStats]);

  const mockMonthlyStatsSummary = useMemo(() => ({
    totalBehaviors: behaviorStats?.total ?? 0,
    prevMonthBehaviors: 0,
    changeRate: 0,
    reportSubmitRate: 100,
    avgAttentionPerWeek: 0,
    emergencyInterventions: 0,
    weeklyBehaviors: [
      { week: "1주", count: 0 }, { week: "2주", count: 0 }, { week: "3주", count: 0 }, { week: "4주", count: 0 },
    ],
    conditionTrend: [],
    mostImprovedName: "-", mostImprovedRate: 0, mostImprovedColor: "#10b981",
    leastImprovedName: "-", leastImprovedRate: 0, leastImprovedColor: "#ef4444",
  }), [behaviorStats]);

  const tabs: { key: StatTab; label: string }[] = [
    { key: "daily", label: "오늘" },
    { key: "weekly", label: "이번 주" },
    { key: "monthly", label: "이번 달" },
  ];

  return (
    <>
      {/* 모바일 전용 백드롭 */}
      <div
        className="sm:hidden fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      <div
        className="bg-white rounded-2xl z-50 border border-gray-100 overflow-hidden
          fixed left-4 right-4 top-[116px] max-h-[calc(100vh-136px)] overflow-y-auto
          sm:absolute sm:fixed-none sm:left-auto sm:right-0 sm:top-10 sm:max-h-none sm:overflow-hidden"
        style={{
          width: undefined,
          boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
        }}
      >
        {/* 모바일 핸들 + 헤더 */}
        <div className="sm:hidden flex items-center justify-between px-4 pt-3 pb-2">
          <p className="text-xs font-bold text-gray-800">통계</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer"
          >
            <i className="ri-close-line text-gray-500 text-sm" />
          </button>
        </div>

        {/* 데스크톱: 고정 너비 */}
        <div className="hidden sm:block" style={{ width: 300 }} />

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/60">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 py-2.5 text-[11px] font-semibold cursor-pointer whitespace-nowrap transition-all"
              style={{
                color: tab === t.key ? "#026eff" : "#6b7280",
                borderBottom: tab === t.key ? "2px solid #026eff" : "2px solid transparent",
                background: "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-4 py-3 space-y-0.5 sm:w-[300px]">
          {/* ── 일일 ── */}
          {tab === "daily" && (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                2026년 3월 18일 현황
              </p>
              <StatRow label="전체 이용인" value={mockDailyStatsSummary.total} unit="명" color="#026eff" />
              <StatRow label="관심 필요" value={mockDailyStatsSummary.needsAttention} unit="명" trend={1} positiveIsGood={false} color="#ef4444" />
              <StatRow label="좋은 컨디션" value={mockDailyStatsSummary.goodCondition} unit="명" trend={0} color="#10b981" />
              <StatRow label="보고 수신 완료" value={mockDailyStatsSummary.reportSubmitted} unit="명" trend={1} color="#f59e0b" />
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  {[
                    { label: "수면 부족", value: "2명", color: "#8b5cf6" },
                    { label: "식사 감소", value: "2명", color: "#f59e0b" },
                    { label: "긴급 개입", value: "1명", color: "#ef4444" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex-1 rounded-xl py-2 px-1.5 text-center"
                      style={{ background: `${item.color}10` }}
                    >
                      <p className="text-[10px] font-bold" style={{ color: item.color }}>{item.value}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── 일주일 ── */}
          {tab === "weekly" && (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                3월 3주차 (3.11 ~ 3.17)
              </p>
              <StatRow
                label="문제행동 총계"
                value={mockWeeklyStatsSummary.totalBehaviors}
                unit="회"
                trend={mockWeeklyStatsSummary.changeRate}
                positiveIsGood={false}
                color="#111827"
              />
              <div className="text-right">
                <span className="text-[10px] text-gray-400">
                  전주 {mockWeeklyStatsSummary.prevWeekBehaviors}회 대비{" "}
                  <span className="text-emerald-500 font-semibold">{mockWeeklyStatsSummary.changeRate}%</span>
                </span>
              </div>
              <StatRow label="평균 수면" value={mockWeeklyStatsSummary.avgSleepHours} unit="시간" trend={mockWeeklyStatsSummary.sleepTrend} />
              <StatRow label="출석 보고율" value={mockWeeklyStatsSummary.reportRate} unit="%" trend={0} />
              <StatRow label="관심 필요 발생일" value={mockWeeklyStatsSummary.attentionDays} unit="일" trend={1} positiveIsGood={false} color="#ef4444" />

              {/* Mini bar chart */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[9px] text-gray-400 mb-1.5">요일별 문제행동</p>
                <MiniBar
                  data={mockWeeklyStatsSummary.dailyBehaviors.map((d) => ({ label: d.day, count: d.count }))}
                  colorFn={(count, max) => count === max ? "#ef4444" : count <= 5 ? "#10b981" : "#026eff"}
                />
              </div>

              {/* Best / worst */}
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-emerald-50">
                  <span className="text-[10px] text-emerald-700">가장 개선</span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {mockWeeklyStatsSummary.mostImprovedName} {mockWeeklyStatsSummary.mostImprovedRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-red-50">
                  <span className="text-[10px] text-red-700">관심 필요</span>
                  <span className="text-[11px] font-bold text-red-500">
                    {mockWeeklyStatsSummary.mostWorsenedName} +{mockWeeklyStatsSummary.mostWorsenedRate}%
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ── 한달 ── */}
          {tab === "monthly" && (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                2026년 3월 전체
              </p>
              <StatRow
                label="문제행동 총계"
                value={mockMonthlyStatsSummary.totalBehaviors}
                unit="회"
                trend={mockMonthlyStatsSummary.changeRate}
                positiveIsGood={false}
                color="#111827"
              />
              <div className="text-right">
                <span className="text-[10px] text-gray-400">
                  전월 {mockMonthlyStatsSummary.prevMonthBehaviors}회 대비{" "}
                  <span className="text-emerald-500 font-semibold">{mockMonthlyStatsSummary.changeRate}%</span>
                </span>
              </div>
              <StatRow label="보고 제출률" value={mockMonthlyStatsSummary.reportSubmitRate} unit="%" trend={0} color="#10b981" />
              <StatRow label="긴급 개입 횟수" value={mockMonthlyStatsSummary.emergencyInterventions} unit="회" trend={-2} positiveIsGood={false} color="#ef4444" />
              <StatRow label="주간 평균 관심 이용인" value={mockMonthlyStatsSummary.avgAttentionPerWeek} unit="명" trend={-0.5} positiveIsGood={false} />

              {/* Weekly mini bar */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[9px] text-gray-400 mb-1.5">주차별 문제행동</p>
                <MiniBar
                  data={mockMonthlyStatsSummary.weeklyBehaviors.map((d) => ({ label: d.week, count: d.count }))}
                  colorFn={(count, max) => count === max ? "#ef4444" : count <= 50 ? "#10b981" : "#026eff"}
                />
              </div>

              {/* Best / worst */}
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-emerald-50">
                  <span className="text-[10px] text-emerald-700">이달의 개선 이용인</span>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                      style={{ background: mockMonthlyStatsSummary.mostImprovedColor }}
                    >
                      수
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {mockMonthlyStatsSummary.mostImprovedName} {mockMonthlyStatsSummary.mostImprovedRate}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-red-50">
                  <span className="text-[10px] text-red-700">집중 지원 대상</span>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                      style={{ background: mockMonthlyStatsSummary.leastImprovedColor }}
                    >
                      도
                    </div>
                    <span className="text-[11px] font-bold text-red-500">
                      {mockMonthlyStatsSummary.leastImprovedName} +{mockMonthlyStatsSummary.leastImprovedRate}%
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}

import { mockBehaviorStats } from "../../../mocks/parentDashboard";

function HorizontalBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  const total = mockBehaviorStats.totalCount;
  const ratio = Math.round((value / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-16 flex-shrink-0 text-right">{label}</span>
      <div className="flex-1 h-4 rounded-full overflow-hidden bg-gray-100">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs text-gray-500 w-20 flex-shrink-0 text-right whitespace-nowrap">
        {value}건 ({ratio}%)
      </span>
    </div>
  );
}

function VerticalBar({
  value,
  maxVal,
  date,
  color,
}: {
  value: number;
  maxVal: number;
  date: string;
  color: string;
}) {
  const pct = maxVal > 0 ? (value / maxVal) * 100 : 0;
  const barColor =
    value >= 3 ? "#ef4444" : value >= 2 ? "#f59e0b" : "#10b981";
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-[10px] text-gray-500 font-medium">{value}</span>
      <div className="w-full flex items-end" style={{ height: 80 }}>
        <div
          className="w-full rounded-t-md transition-all"
          style={{ height: `${Math.max(pct, 4)}%`, background: color ?? barColor }}
        />
      </div>
      <span className="text-[10px] text-gray-400 whitespace-nowrap">{date}</span>
    </div>
  );
}

function ConditionBar({
  day,
  emoji,
  good,
  mild,
  caution,
}: {
  day: string;
  emoji: string;
  good: number;
  mild: number;
  caution: number;
}) {
  const total = good + mild + caution;
  const maxH = 80;
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-base leading-none">{emoji}</span>
      <div className="w-full flex flex-col-reverse items-center gap-px" style={{ height: maxH }}>
        <div className="w-full rounded-sm" style={{ height: (good / total) * maxH, background: "#10b981" }} />
        <div className="w-full rounded-sm" style={{ height: (mild / total) * maxH, background: "#f59e0b" }} />
        <div className="w-full rounded-sm" style={{ height: (caution / total) * maxH, background: "#ef4444" }} />
      </div>
      <span className="text-[10px] text-gray-400">{day}</span>
    </div>
  );
}

export default function BehaviorStats() {
  const { daily, typeBreakdown, weeklyCondition, totalCount } = mockBehaviorStats;
  const maxDailyVal = Math.max(...daily.map((d) => d.value));

  const typeMax = Math.max(...typeBreakdown.map((t) => t.value));

  return (
    <div className="p-7 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">행동 추이</h1>
        <p className="text-xs text-gray-400 mt-0.5">최근 30일간의 행동 이벤트 통계</p>
      </div>

      {/* Total count + type breakdown */}
      <div className="grid grid-cols-3 gap-5">
        {/* Total */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-center items-center text-center">
          <p className="text-4xl font-black text-gray-900">{totalCount}<span className="text-lg font-bold text-gray-400">건</span></p>
          <p className="text-xs text-gray-400 mt-1.5">전체 행동 발생</p>
        </div>

        {/* Type breakdown */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-xs font-bold text-gray-700 mb-3">행동 유형별 발생 현황</h3>
          <div className="space-y-2.5">
            {typeBreakdown.map((t) => (
              <HorizontalBar key={t.label} label={t.label} value={t.value} max={typeMax} color={t.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Daily trend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-700">최근 7일 발생 추이</h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#ef4444" }} />3건 이상</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#f59e0b" }} />2건</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#10b981" }} />1건 이하</span>
            </div>
          </div>
          <div className="flex items-end gap-2 px-2">
            {daily.map((d) => {
              const barColor = d.value >= 3 ? "#ef4444" : d.value >= 2 ? "#f59e0b" : "#10b981";
              return (
                <VerticalBar
                  key={d.date}
                  value={d.value}
                  maxVal={maxDailyVal}
                  date={d.date}
                  color={barColor}
                />
              );
            })}
          </div>
        </div>

        {/* Weekly condition */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-700">주간 컨디션 추이</h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#10b981]" />좋음</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#f59e0b]" />보통</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#ef4444]" />수의</span>
            </div>
          </div>
          <div className="flex items-end gap-2 px-2">
            {weeklyCondition.map((w) => (
              <ConditionBar key={w.day} day={w.day} emoji={w.emoji} good={w.good} mild={w.mild} caution={w.caution} />
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#f59e0b]/10">
          <i className="ri-sparkling-2-line text-[#f59e0b] text-base" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800">AI 행동 분석 인사이트</p>
          <p className="text-xs text-gray-500 mt-0.5">주 후반 노선행동 감소 추세. 오후 일정 초성이 효과적이었을 수 있어요.</p>
        </div>
        <button className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white whitespace-nowrap cursor-pointer" style={{ background: "#026eff" }}>
          자세히 보기
        </button>
      </div>
    </div>
  );
}

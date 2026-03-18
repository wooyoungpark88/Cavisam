import { mockMorningReportHistory } from "../../../mocks/parentDashboard";

type HistoryItem = typeof mockMorningReportHistory[0];

function countValues(field: keyof HistoryItem) {
  const counts: Record<string, number> = {};
  mockMorningReportHistory.forEach((item) => {
    const v = String(item[field]);
    counts[v] = (counts[v] || 0) + 1;
  });
  return counts;
}

function StatBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs text-gray-500 w-14 text-right flex-shrink-0">{value}회 ({pct}%)</span>
    </div>
  );
}

function MiniWeekChart() {
  const conditionColors: Record<string, string> = {
    "좋음": "#10b981",
    "보통": "#f59e0b",
    "안좋음": "#ef4444",
  };
  const recent7 = mockMorningReportHistory.slice(0, 7).reverse();
  return (
    <div className="flex items-end gap-2 h-16">
      {recent7.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md"
            style={{ height: d.condition === "좋음" ? 48 : d.condition === "보통" ? 32 : 16, background: conditionColors[d.condition] ?? "#d1d5db" }}
          />
          <span className="text-[9px] text-gray-400 whitespace-nowrap">{d.date.slice(3)}</span>
        </div>
      ))}
    </div>
  );
}

export default function MorningReportDashboard() {
  const total = mockMorningReportHistory.length;
  const sleepCounts = countValues("sleep");
  const conditionCounts = countValues("condition");
  const mealCounts = countValues("meal");
  const medicineCounts = countValues("medicine");

  const goodDays = (conditionCounts["좋음"] || 0);
  const avgGoodPct = Math.round((goodDays / total) * 100);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Summary cards — 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "이번 달 발송", value: `${total}회`, icon: "ri-send-plane-line", color: "#026eff" },
          { label: "좋은 컨디션", value: `${avgGoodPct}%`, icon: "ri-sun-line", color: "#f59e0b" },
          { label: "완식률", value: `${Math.round(((mealCounts["전부"] || 0) / total) * 100)}%`, icon: "ri-restaurant-line", color: "#10b981" },
          { label: "약 복용 완료", value: `${Math.round(((medicineCounts["복용 완료"] || 0) / total) * 100)}%`, icon: "ri-capsule-line", color: "#8b5cf6" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${s.color}15` }}>
              <i className={`${s.icon} text-sm sm:text-base`} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-gray-900">{s.value}</p>
              <p className="text-[9px] sm:text-[10px] text-gray-400 leading-tight mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly condition chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
        <h3 className="text-xs font-bold text-gray-700 mb-4">최근 7일 컨디션 추이</h3>
        <MiniWeekChart />
        <div className="flex items-center gap-4 mt-3">
          {[["좋음", "#10b981"], ["보통", "#f59e0b"], ["안좋음", "#ef4444"]].map(([l, c]) => (
            <span key={l} className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Distribution charts — 1-col on mobile, 2-col on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Sleep */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ background: "#8b5cf615" }}>
              <i className="ri-moon-line text-xs" style={{ color: "#8b5cf6" }} />
            </div>
            <h3 className="text-xs font-bold text-gray-700">수면 패턴</h3>
          </div>
          <div className="space-y-2">
            <StatBar label="충분" value={sleepCounts["충분"] || 0} total={total} color="#8b5cf6" />
            <StatBar label="보통" value={sleepCounts["보통"] || 0} total={total} color="#a78bfa" />
            <StatBar label="부족" value={sleepCounts["부족"] || 0} total={total} color="#ef4444" />
          </div>
        </div>

        {/* Meal */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ background: "#ef444415" }}>
              <i className="ri-restaurant-line text-xs" style={{ color: "#ef4444" }} />
            </div>
            <h3 className="text-xs font-bold text-gray-700">아침 식사 패턴</h3>
          </div>
          <div className="space-y-2">
            <StatBar label="전부" value={mealCounts["전부"] || 0} total={total} color="#10b981" />
            <StatBar label="대부분" value={mealCounts["대부분"] || 0} total={total} color="#f59e0b" />
            <StatBar label="조금" value={mealCounts["조금"] || 0} total={total} color="#f97316" />
            <StatBar label="안먹음" value={mealCounts["안먹음"] || 0} total={total} color="#ef4444" />
          </div>
        </div>
      </div>

      {/* Recent history list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-50">
          <h3 className="text-xs font-bold text-gray-700">최근 발송 이력</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {mockMorningReportHistory.slice(0, 7).map((item) => {
            const condColor = item.condition === "좋음" ? "#10b981" : item.condition === "보통" ? "#f59e0b" : "#ef4444";
            const condEmoji = item.condition === "좋음" ? "☀️" : item.condition === "보통" ? "🌤️" : "🌧️";
            return (
              <div key={item.date} className="px-4 sm:px-5 py-3 flex items-center gap-3">
                <span className="text-xs text-gray-400 w-10 sm:w-12 flex-shrink-0">{item.date}</span>
                <span className="text-sm flex-shrink-0">{condEmoji}</span>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 flex-wrap min-w-0">
                  {[
                    { val: item.sleep, prefix: "수면" },
                    { val: item.meal, prefix: "식사" },
                    { val: item.medicine, prefix: "약" },
                  ].map((tag) => (
                    <span
                      key={tag.prefix}
                      className="px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100 text-[9px] sm:text-[10px] text-gray-500 whitespace-nowrap"
                    >
                      {tag.prefix}: {tag.val}
                    </span>
                  ))}
                </div>
                {item.note && (
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <i className="ri-sticky-note-line text-xs text-gray-400" />
                  </div>
                )}
                <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: condColor }}>
                  {item.condition}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

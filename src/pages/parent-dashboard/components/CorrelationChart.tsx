import { useState, useMemo } from "react";
import { useParentData } from "../../../contexts/ParentDataContext";

// scoring helpers (reserved for future analysis)
void function cScore(v: string) { return v === "좋음" ? 3 : v === "보통" ? 2 : 1; };
void function sScore(v: string) { return v === "충분" ? 3 : v === "보통" ? 2 : 1; };

type JoinedDay = {
  date: string; count: number; condition: string; sleep: string; meal: string;
};

function avg(arr: number[]) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

/* ────────────────────────────────────────
   1. SYNCHRONIZED 3-ROW CHART
──────────────────────────────────────── */
function ComboChart({ data }: { data: JoinedDay[] }) {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const reversed = [...data].reverse();
  const n = reversed.length;

  const W = 560, ML = 52, MR = 12;
  const cW = W - ML - MR;
  const slotW = cW / n;
  const gap = 2;
  const blockW = slotW - gap;

  // Row geometry (top-down)
  const barTop = 10, barH = 68;
  const condTop = barTop + barH + 10;
  const condH = 18;
  const sleepTop = condTop + condH + 4;
  const sleepH = 18;
  const labelY = sleepTop + sleepH + 14;
  const H = labelY + 4;

  const maxCount = Math.max(...reversed.map((d) => d.count), 1);
  const toBarH = (c: number) => Math.max((c / maxCount) * barH, c > 0 ? 3 : 0);
  const toBarY = (c: number) => barTop + barH - toBarH(c);
  const slotX = (i: number) => ML + i * slotW;
  const centerX = (i: number) => ML + i * slotW + slotW / 2;

  const countColor = (c: number) => c >= 7 ? "#ef4444" : c >= 4 ? "#f59e0b" : "#10b981";
  const condColor = (v: string) => v === "좋음" ? "#10b981" : v === "보통" ? "#f59e0b" : "#ef4444";
  const sleepColor = (v: string) => v === "충분" ? "#8b5cf6" : v === "보통" ? "#f59e0b" : "#ef4444";

  const hovData = hovIdx !== null ? reversed[hovIdx] : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-gray-800">도전행동과 컨디션·수면의 관계</h3>
          <p className="text-[12.5px] text-gray-400 mt-0.5">
            막대가 높은 날 아래 블록이 주황·빨강이면 컨디션·수면이 영향을 준 거예요
          </p>
        </div>
        <div className="flex items-center gap-2.5 text-[12px] text-gray-400 flex-shrink-0 ml-4">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981] inline-block" />좋음
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b] inline-block" />보통
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444] inline-block" />주의/많음
          </span>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[380px]" style={{ overflow: "visible" }}>

          {/* Row labels */}
          <text x={ML - 6} y={barTop + barH / 2 + 3.5} textAnchor="end" fontSize="9" fontWeight="700" fill="#9ca3af">도전행동</text>
          <text x={ML - 6} y={condTop + condH / 2 + 3.5} textAnchor="end" fontSize="9" fontWeight="700" fill="#9ca3af">컨디션</text>
          <text x={ML - 6} y={sleepTop + sleepH / 2 + 3.5} textAnchor="end" fontSize="9" fontWeight="700" fill="#9ca3af">수면</text>

          {/* Bar grid lines */}
          {[0, Math.round(maxCount / 2), maxCount].map((v) => (
            <g key={v}>
              <line x1={ML} y1={toBarY(v)} x2={W - MR} y2={toBarY(v)} stroke="#f3f4f6" strokeWidth="1" />
              <text x={ML - 4} y={toBarY(v) + 3} textAnchor="end" fontSize="7" fill="#d1d5db">{v}</text>
            </g>
          ))}

          {/* Hover column highlight */}
          {hovIdx !== null && (
            <rect
              x={slotX(hovIdx) + gap / 2}
              y={barTop - 4}
              width={blockW}
              height={sleepTop + sleepH - barTop + 4}
              fill="#f1f5f9"
              rx="3"
            />
          )}

          {/* ── Row 1: Behavior bars ── */}
          {reversed.map((d, i) => (
            <rect
              key={`bar-${i}`}
              x={slotX(i) + gap / 2}
              y={toBarY(d.count)}
              width={blockW}
              height={toBarH(d.count)}
              rx="2"
              fill={countColor(d.count)}
              opacity={hovIdx === null ? 0.85 : hovIdx === i ? 1 : 0.2}
              style={{ transition: "opacity 0.1s" }}
            />
          ))}

          {/* ── Row 2: Condition blocks ── */}
          {reversed.map((d, i) => (
            <rect
              key={`cond-${i}`}
              x={slotX(i) + gap / 2}
              y={condTop}
              width={blockW}
              height={condH}
              rx="2"
              fill={condColor(d.condition)}
              opacity={hovIdx === null ? 0.75 : hovIdx === i ? 1 : 0.2}
              style={{ transition: "opacity 0.1s" }}
            />
          ))}

          {/* ── Row 3: Sleep blocks ── */}
          {reversed.map((d, i) => (
            <rect
              key={`sleep-${i}`}
              x={slotX(i) + gap / 2}
              y={sleepTop}
              width={blockW}
              height={sleepH}
              rx="2"
              fill={sleepColor(d.sleep)}
              opacity={hovIdx === null ? 0.75 : hovIdx === i ? 1 : 0.2}
              style={{ transition: "opacity 0.1s" }}
            />
          ))}

          {/* Invisible hit areas */}
          {reversed.map((_, i) => (
            <rect
              key={`hit-${i}`}
              x={slotX(i)}
              y={barTop}
              width={slotW}
              height={sleepTop + sleepH - barTop}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovIdx(i)}
              onMouseLeave={() => setHovIdx(null)}
            />
          ))}

          {/* X date labels every 5 */}
          {reversed.map((d, i) =>
            i % 5 === 0 ? (
              <text key={i} x={centerX(i)} y={labelY} textAnchor="middle" fontSize="8" fill="#9ca3af">
                {d.date}
              </text>
            ) : null
          )}
        </svg>

        {/* Tooltip */}
        {hovData !== null && hovIdx !== null && (
          <div
            className="absolute top-0 z-20 pointer-events-none"
            style={{
              left: `${Math.min(Math.max((hovIdx / n) * 100, 6), 72)}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="bg-gray-900 text-white rounded-xl px-3.5 py-3 text-[12.5px] whitespace-nowrap">
              <p className="font-bold text-center mb-2 pb-1.5 border-b border-white/10">{hovData.date}</p>
              <div className="space-y-1.5">
                {[
                  { label: "도전행동", value: `${hovData.count}건`, color: countColor(hovData.count) },
                  { label: "컨디션",   value: hovData.condition,    color: condColor(hovData.condition) },
                  { label: "수면",     value: hovData.sleep,        color: sleepColor(hovData.sleep) },
                  { label: "식사",     value: hovData.meal,         color: "#f59e0b" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: row.color }} />
                    <span className="text-white/50 w-14">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Read guide */}
      <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-3 gap-3">
        {[
          { icon: "ri-arrow-up-line",   color: "#ef4444", bg: "#fef2f2", text: "막대가 높을수록 도전행동 많은 날" },
          { icon: "ri-arrow-down-line", color: "#10b981", bg: "#f0fdf4", text: "컨디션·수면 블록이 초록이면 좋은 날" },
          { icon: "ri-focus-3-line",    color: "#f59e0b", bg: "#fffbeb", text: "같은 열이 모두 빨간 날 주목하세요" },
        ].map((g) => (
          <div key={g.text} className="flex items-start gap-2 rounded-xl p-2.5" style={{ background: g.bg }}>
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className={`${g.icon} text-xs`} style={{ color: g.color }} />
            </div>
            <p className="text-[12px] leading-snug" style={{ color: g.color }}>{g.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────
   2. AVERAGE BEHAVIOR BY GROUP (3 panels)
──────────────────────────────────────── */
function AvgBar({ label, value, max, color, n }: { label: string; value: number; max: number; color: string; n: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5 mb-2 last:mb-0">
      <span className="text-[12px] text-gray-500 w-16 flex-shrink-0 text-right leading-tight">{label}<br /><span className="text-gray-300">({n}일)</span></span>
      <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[12.5px] font-bold text-gray-700 w-10 text-right whitespace-nowrap flex-shrink-0">{value.toFixed(1)}건</span>
    </div>
  );
}

function AverageAnalysis({ data }: { data: JoinedDay[] }) {
  const panels = [
    {
      title: "컨디션별 평균 도전행동", icon: "ri-sun-line", icolor: "#10b981",
      groups: [
        { label: "좋음", color: "#10b981", items: data.filter((d) => d.condition === "좋음") },
        { label: "보통", color: "#f59e0b", items: data.filter((d) => d.condition === "보통") },
        { label: "주의", color: "#ef4444", items: data.filter((d) => d.condition === "안좋음") },
      ],
    },
    {
      title: "수면별 평균 도전행동", icon: "ri-moon-line", icolor: "#8b5cf6",
      groups: [
        { label: "충분", color: "#8b5cf6", items: data.filter((d) => d.sleep === "충분") },
        { label: "보통", color: "#f59e0b", items: data.filter((d) => d.sleep === "보통") },
        { label: "부족", color: "#ef4444", items: data.filter((d) => d.sleep === "부족") },
      ],
    },
    {
      title: "식사별 평균 도전행동", icon: "ri-restaurant-line", icolor: "#f59e0b",
      groups: [
        { label: "완식", color: "#f59e0b", items: data.filter((d) => d.meal === "전부" || d.meal === "대부분") },
        { label: "조금", color: "#fb923c", items: data.filter((d) => d.meal === "조금") },
        { label: "안먹음", color: "#ef4444", items: data.filter((d) => d.meal === "안먹음") },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {panels.map((panel) => {
        const avgs = panel.groups.map((g) => ({ ...g, avgVal: avg(g.items.map((d) => d.count)) }));
        const maxAvg = Math.max(...avgs.map((g) => g.avgVal), 0.1);
        const sorted = [...avgs].sort((a, b) => b.avgVal - a.avgVal);
        const diff = sorted[0].avgVal - sorted[sorted.length - 1].avgVal;
        return (
          <div key={panel.title} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className={`${panel.icon} text-sm`} style={{ color: panel.icolor }} />
              </div>
              <p className="text-[12.5px] font-bold text-gray-700">{panel.title}</p>
            </div>
            {avgs.map((g) => (
              <AvgBar key={g.label} label={g.label} value={g.avgVal} max={maxAvg} color={g.color} n={g.items.length} />
            ))}
            <div className="border-t border-gray-50 pt-2.5 mt-3">
              <p className="text-[12px] text-gray-400 leading-snug">
                <strong className="text-gray-600">{sorted[0].label}</strong>일이{" "}
                <strong className="text-gray-600">{sorted[sorted.length - 1].label}</strong>일보다{" "}
                평균 <strong style={{ color: "#ef4444" }}>{diff.toFixed(1)}건</strong> 더 많이 발생
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────
   3. CONDITION IMPACT CHART (replaces scatter)
──────────────────────────────────────── */
function ConditionImpactChart({ data }: { data: JoinedDay[] }) {
  const groups = [
    { label: "주의", emoji: "😟", condition: "안좋음", color: "#ef4444", bg: "#fef2f2" },
    { label: "보통", emoji: "😐", condition: "보통",   color: "#f59e0b", bg: "#fffbeb" },
    { label: "좋음", emoji: "😊", condition: "좋음",   color: "#10b981", bg: "#f0fdf4" },
  ];

  const stats = groups.map((g) => {
    const items = data.filter((d) => d.condition === g.condition);
    const avgCount = items.length ? items.reduce((a, d) => a + d.count, 0) / items.length : 0;
    return { ...g, avgCount, days: items.length };
  });

  const maxAvg = Math.max(...stats.map((s) => s.avgCount), 1);
  const ratio = stats[0].avgCount > 0 && stats[2].avgCount > 0
    ? (stats[0].avgCount / stats[2].avgCount).toFixed(1)
    : "-";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xs font-bold text-gray-700">컨디션에 따른 도전행동 변화</h3>
        <p className="text-[12px] text-gray-400 mt-0.5">컨디션이 나쁜 날, 도전행동이 얼마나 늘어날까요?</p>
      </div>

      {/* Visual bars */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        {stats.map((s) => {
          const pct = maxAvg > 0 ? (s.avgCount / maxAvg) * 100 : 0;
          return (
            <div key={s.label}>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-base leading-none">{s.emoji}</span>
                <span className="text-[12.5px] font-bold w-8" style={{ color: s.color }}>{s.label}</span>
                <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: s.bg }}>
                  <div
                    className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-700"
                    style={{ width: `${Math.max(pct, 8)}%`, background: s.color }}
                  >
                    <span className="text-white text-[12.5px] font-bold whitespace-nowrap">
                      평균 {s.avgCount.toFixed(1)}건
                    </span>
                  </div>
                </div>
                <span className="text-[12px] text-gray-400 w-10 text-right flex-shrink-0">{s.days}일</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key insight */}
      <div className="mt-4 pt-3 border-t border-gray-50">
        <div className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: "#fef2f2", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-alarm-warning-line text-[#ef4444] text-sm" />
          </div>
          <p className="text-[12.5px] text-gray-700 leading-relaxed">
            컨디션 <strong className="text-[#ef4444]">주의</strong>인 날은{" "}
            <strong className="text-[#10b981]">좋음</strong>인 날보다{" "}
            도전행동이 평균 <strong className="text-[#ef4444]">{ratio}배</strong> 많아요
          </p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────
   4. KEY FINDINGS PANEL
──────────────────────────────────────── */
function KeyFindings({ data }: { data: JoinedDay[] }) {
  const condGoodAvg = avg(data.filter((d) => d.condition === "좋음").map((d) => d.count));
  const condBadAvg = avg(data.filter((d) => d.condition === "안좋음").map((d) => d.count));
  const sleepGoodAvg = avg(data.filter((d) => d.sleep === "충분").map((d) => d.count));
  const sleepBadAvg = avg(data.filter((d) => d.sleep === "부족").map((d) => d.count));
  const mealGoodAvg = avg(data.filter((d) => d.meal === "전부" || d.meal === "대부분").map((d) => d.count));
  const mealBadAvg = avg(data.filter((d) => d.meal === "조금" || d.meal === "안먹음").map((d) => d.count));

  const findings = [
    {
      icon: "ri-sun-line", color: "#10b981", bg: "#f0fdf4",
      title: "컨디션 영향",
      body: `주의일 평균 ${condBadAvg.toFixed(1)}건 vs 좋음일 ${condGoodAvg.toFixed(1)}건 (${Math.round(condBadAvg / Math.max(condGoodAvg, 0.1))}배 차이)`,
    },
    {
      icon: "ri-moon-line", color: "#8b5cf6", bg: "#faf5ff",
      title: "수면 영향",
      body: `부족일 평균 ${sleepBadAvg.toFixed(1)}건 vs 충분일 ${sleepGoodAvg.toFixed(1)}건 (${Math.round(sleepBadAvg / Math.max(sleepGoodAvg, 0.1))}배 차이)`,
    },
    {
      icon: "ri-restaurant-line", color: "#f59e0b", bg: "#fffbeb",
      title: "식사 영향",
      body: `불완전 식사일 평균 ${mealBadAvg.toFixed(1)}건 vs 완식일 ${mealGoodAvg.toFixed(1)}건 (${Math.round(mealBadAvg / Math.max(mealGoodAvg, 0.1))}배 차이)`,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full flex flex-col justify-between">
      <p className="text-[12.5px] font-bold text-gray-700 mb-3">핵심 발견 요약</p>
      <div className="space-y-2.5 flex-1">
        {findings.map((item) => (
          <div key={item.title} className="rounded-xl p-3" style={{ background: item.bg }}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <i className={`${item.icon} text-xs`} style={{ color: item.color }} />
              </div>
              <p className="text-[12.5px] font-bold" style={{ color: item.color }}>{item.title}</p>
            </div>
            <p className="text-[12px] text-gray-600 leading-snug">{item.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-50">
        <p className="text-[12px] text-gray-400 leading-relaxed">
          30일 데이터 기반 분석이며 개인차가 있을 수 있어요. 추세 파악 목적으로 활용해 주세요.
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════ */
export default function CorrelationChart() {
  const { behaviorEvents, morningReports, loading } = useParentData();

  const behaviorHistory30 = useMemo(() => {
    const days: { date: string; count: number }[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const fullDate = d.toISOString().slice(0, 10);
      const count = behaviorEvents.filter(e => e.occurred_at.startsWith(fullDate)).length;
      days.push({ date: dateStr, count });
    }
    return days.reverse();
  }, [behaviorEvents]);

  const morningReportHistory = useMemo(() => {
    return morningReports.map(r => {
      const d = new Date(r.created_at);
      const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const conditionMap: Record<string, string> = { good: "좋음", normal: "보통", bad: "안좋음", very_bad: "매우나쁨" };
      const mealMap: Record<string, string> = { good: "전부", normal: "대부분", none: "안먹음" };
      const bowelMap: Record<string, string> = { normal: "정상", none: "없음" };
      return {
        date: dateStr,
        sleep: r.sleep_time || "보통",
        condition: conditionMap[r.condition || ""] || "보통",
        meal: mealMap[r.meal || ""] || "대부분",
        bowel: bowelMap[r.bowel || ""] || "정상",
        medication: r.medication || "",
        note: r.note || "",
      };
    });
  }, [morningReports]);

  const data = useMemo(() => {
    const histMap = new Map(morningReportHistory.map((h) => [h.date, h]));
    return behaviorHistory30.map((b) => {
      const h = histMap.get(b.date);
      return { date: b.date, count: b.count, condition: h?.condition ?? "보통", sleep: h?.sleep ?? "보통", meal: h?.meal ?? "대부분" };
    });
  }, [behaviorHistory30, morningReportHistory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#026eff] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">교차 분석 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (behaviorEvents.length === 0 && morningReports.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[12.5px] text-gray-500 font-bold whitespace-nowrap flex items-center gap-1.5">
            <i className="ri-bar-chart-grouped-line text-xs" />
            도전행동 × 생활 알리미 교차 분석
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <i className="ri-bar-chart-grouped-line text-gray-300 text-lg" />
          </div>
          <p className="text-sm text-gray-400">아직 분석할 데이터가 없어요</p>
          <p className="text-[12.5px] text-gray-300 mt-1">기록이 쌓이면 교차 분석이 시작돼요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Section divider */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[12.5px] text-gray-500 font-bold whitespace-nowrap flex items-center gap-1.5">
          <i className="ri-bar-chart-grouped-line text-xs" />
          도전행동 × 생활 알리미 교차 분석
        </span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Callout */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#fef2f2] flex-shrink-0">
          <i className="ri-lightbulb-flash-line text-[#ef4444] text-sm" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800 mb-0.5">교차 분석이란?</p>
          <p className="text-[12px] text-gray-500 leading-relaxed">
            30일간의 선생님 생활 알리미 기록(컨디션·수면·식사)과 도전행동 발생 횟수를 날짜 기준으로 결합해,
            생활 상태가 도전행동에 미치는 영향을 시각적으로 분석합니다.
          </p>
        </div>
      </div>

      {/* Combo chart */}
      <ComboChart data={data} />

      {/* Average analysis cards */}
      <AverageAnalysis data={data} />

      {/* Scatter + Key findings */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <ConditionImpactChart data={data} />
        </div>
        <div className="lg:col-span-2">
          <KeyFindings data={data} />
        </div>
      </div>
    </div>
  );
}

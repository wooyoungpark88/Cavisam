import { useState, useMemo, useRef, useEffect } from "react";
import { useParentData } from "../../../contexts/ParentDataContext";

type RangeKey = "7일" | "14일" | "한달";
type HistoryItem = { date: string; sleep: string; condition: string; meal: string; bowel: string; medicine: string; note: string };

const COND_MAP: Record<string, string> = { good: "좋음", normal: "보통", bad: "안좋음", very_bad: "안좋음" };
const MEAL_MAP: Record<string, string> = { good: "전부", normal: "대부분", none: "안먹음" };
const BOWEL_MAP: Record<string, string> = { normal: "정상", none: "없음" };

const RANGES: RangeKey[] = ["7일", "14일", "한달"];

function condScore(c: string) {
  return c === "좋음" ? 3 : c === "보통" ? 2 : 1;
}
function condColor(c: string) {
  return c === "좋음" ? "#10b981" : c === "보통" ? "#f59e0b" : "#ef4444";
}

// ──────────────────────────────────────────
// Summary Cards
// ──────────────────────────────────────────
function SummaryCards({ data }: { data: HistoryItem[] }) {
  const total = data.length;
  const good = data.filter((d) => d.condition === "좋음").length;
  const goodPct = total > 0 ? Math.round((good / total) * 100) : 0;
  const fullMeal = data.filter((d) => d.meal === "전부" || d.meal === "대부분").length;
  const mealPct = total > 0 ? Math.round((fullMeal / total) * 100) : 0;
  const goodSleep = data.filter((d) => d.sleep === "충분").length;
  const sleepPct = total > 0 ? Math.round((goodSleep / total) * 100) : 0;

  const cards = [
    { label: "발송 일수", value: `${total}일`, icon: "ri-send-plane-line", color: "#026eff", sub: "기록된 등원 전 한마디" },
    { label: "좋은 컨디션", value: `${goodPct}%`, icon: "ri-sun-line", color: "#10b981", sub: `${good}일 / 전체 ${total}일` },
    { label: "식사 양호", value: `${mealPct}%`, icon: "ri-restaurant-line", color: "#f59e0b", sub: "전부+대부분 기준" },
    { label: "수면 충분", value: `${sleepPct}%`, icon: "ri-moon-line", color: "#8b5cf6", sub: "7시간 이상 수면" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: `${c.color}15` }}>
            <i className={`${c.icon} text-base`} style={{ color: c.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-base font-black text-gray-900 leading-none">{c.value}</p>
            <p className="text-[10px] font-semibold text-gray-600 mt-0.5 leading-tight">{c.label}</p>
            <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────
// Condition Trend Line Chart
// ──────────────────────────────────────────
function ConditionTrendChart({ data }: { data: HistoryItem[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setActiveIdx(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const svgW = 280, svgH = 92, padX = 30, padTop = 16, padBottom = 22;
  const chartH = svgH - padTop - padBottom;
  const n = data.length;
  const xStep = n > 1 ? (svgW - padX * 2) / (n - 1) : 0;
  const xs = data.map((_, i) => padX + i * xStep);
  const ys = data.map((d) => padTop + chartH - ((condScore(d.condition) - 1) / 2) * chartH);

  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const areaPath =
    n > 1
      ? `${linePath} L ${xs[n - 1].toFixed(1)},${(padTop + chartH).toFixed(1)} L ${xs[0].toFixed(1)},${(padTop + chartH).toFixed(1)} Z`
      : "";

  const bestIdx = data.reduce((bi, d, i) => (condScore(d.condition) > condScore(data[bi].condition) ? i : bi), 0);
  const worstIdx = data.reduce((wi, d, i) => (condScore(d.condition) < condScore(data[wi].condition) ? i : wi), 0);

  const dayLabelY = svgH - 4;
  const getAboveLabelY = (dotY: number) => Math.max(dotY - 11, 5);
  const getBelowLabelY = (dotY: number) => {
    const below = dotY + 13;
    return below < dayLabelY - 10 ? below : null;
  };

  const showLabel = (i: number) => {
    if (n <= 7) return true;
    if (n <= 14) return i % 2 === 0 || i === n - 1;
    return i === 0 || i % 5 === 0 || i === n - 1;
  };

  const getPopoverLeft = (i: number) => Math.min(Math.max((xs[i] / svgW) * 100, 14), 86);

  const yGuides = [
    { score: 3, label: "좋음", color: "#10b981" },
    { score: 2, label: "보통", color: "#f59e0b" },
    { score: 1, label: "주의", color: "#ef4444" },
  ];

  return (
    <div ref={containerRef} className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="mb-3">
        <h3 className="text-xs font-bold text-gray-700">컨디션 변화 추이</h3>
        <p className="text-[10px] text-gray-400 mt-0.5">
          날짜별 컨디션 흐름을 한눈에 파악하고 컨디션이 나빴던 날의 원인을 찾아보세요
          <span className="ml-1.5 text-gray-300">· 도트 클릭 시 상세 정보</span>
        </p>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" overflow="visible">
          <defs>
            <linearGradient id="condTrendGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.13" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Y-axis guides + labels */}
          {yGuides.map((g) => {
            const gy = padTop + chartH - ((g.score - 1) / 2) * chartH;
            return (
              <g key={g.score}>
                <line x1={padX} y1={gy} x2={svgW - 6} y2={gy} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3,2" />
                <text x={padX - 4} y={gy + 3} textAnchor="end" fontSize="7" fill={g.color} fontWeight="600">
                  {g.label}
                </text>
              </g>
            );
          })}

          {n > 1 && <path d={areaPath} fill="url(#condTrendGrad2)" />}
          {n > 1 && (
            <path d={linePath} fill="none" stroke="#d1fae5" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          )}
          {n > 1 && (
            <path d={linePath} fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          )}

          {xs.map((x, i) => {
            const color = condColor(data[i].condition);
            const isActive = i === activeIdx;
            const isBest = i === bestIdx;
            const isWorst = i === worstIdx;
            const aboveY = getAboveLabelY(ys[i]);
            const belowY = getBelowLabelY(ys[i]);

            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => setActiveIdx(activeIdx === i ? null : i)}>
                <circle cx={x} cy={ys[i]} r={11} fill="transparent" />
                {(isBest || isWorst) && !isActive && (
                  <circle cx={x} cy={ys[i]} r={8} fill={color} opacity="0.15" />
                )}
                {isActive && <circle cx={x} cy={ys[i]} r={9} fill={color} opacity="0.20" />}
                <circle cx={x} cy={ys[i]} r={isActive ? 6 : 5} fill={color} />
                <circle cx={x} cy={ys[i]} r={isActive ? 2.5 : 2} fill="white" />
                {isBest && !isActive && (
                  <text x={x} y={aboveY} textAnchor="middle" fontSize="7.5" fill={color} fontWeight="700">
                    최고
                  </text>
                )}
                {isWorst && bestIdx !== worstIdx && !isActive &&
                  (() => {
                    const labelY = belowY !== null ? belowY : aboveY;
                    return (
                      <text x={x} y={labelY} textAnchor="middle" fontSize="7.5" fill={color} fontWeight="700">
                        최저
                      </text>
                    );
                  })()}
              </g>
            );
          })}

          {xs.map(
            (x, i) =>
              showLabel(i) && (
                <text
                  key={i}
                  x={x}
                  y={svgH - 4}
                  textAnchor="middle"
                  fontSize="8"
                  fill={i === activeIdx ? "#374151" : "#9ca3af"}
                  fontWeight={i === activeIdx ? "700" : "400"}
                >
                  {data[i].date.slice(3)}
                </text>
              )
          )}
        </svg>

        {/* Popover */}
        {activeIdx !== null &&
          (() => {
            const d = data[activeIdx];
            const color = condColor(d.condition);
            return (
              <div
                className="absolute z-20 bottom-[calc(100%-4px)] mb-1 bg-white rounded-xl border border-gray-100 p-3 w-[152px]"
                style={{
                  left: `${getPopoverLeft(activeIdx)}%`,
                  transform: "translateX(-50%)",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
                }}
              >
                <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800">{d.date}</span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${color}18`, color }}
                  >
                    {d.condition}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { icon: "ri-moon-line", label: "수면", value: d.sleep, color: "#8b5cf6" },
                    { icon: "ri-restaurant-line", label: "식사", value: d.meal, color: "#ef4444" },
                    { icon: "ri-capsule-line", label: "약 복용", value: d.medicine, color: "#026eff" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-1.5">
                      <i className={`${row.icon} text-[10px] flex-shrink-0`} style={{ color: row.color }} />
                      <span className="text-[10px] text-gray-400 flex-1">{row.label}</span>
                      <span className="text-[10px] font-semibold text-gray-700">{row.value}</span>
                    </div>
                  ))}
                </div>
                {d.note && (
                  <p className="mt-2 pt-2 border-t border-gray-50 text-[9px] text-gray-400 leading-relaxed line-clamp-2">
                    {d.note}
                  </p>
                )}
              </div>
            );
          })()}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Sleep × Condition Correlation
// ──────────────────────────────────────────
function SleepConditionCorrelation({ data }: { data: HistoryItem[] }) {
  const sleepLevels = ["충분", "보통", "부족"];
  const condLabels = ["좋음", "보통", "안좋음"];

  const matrix = useMemo(() => {
    const m: Record<string, Record<string, number>> = {
      충분: { 좋음: 0, 보통: 0, 안좋음: 0 },
      보통: { 좋음: 0, 보통: 0, 안좋음: 0 },
      부족: { 좋음: 0, 보통: 0, 안좋음: 0 },
    };
    data.forEach((d) => {
      if (m[d.sleep]) m[d.sleep][d.condition] = (m[d.sleep][d.condition] || 0) + 1;
    });
    return m;
  }, [data]);

  const sleepColor: Record<string, string> = { 충분: "#8b5cf6", 보통: "#a78bfa", 부족: "#ef4444" };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="mb-4">
        <h3 className="text-xs font-bold text-gray-700">수면 → 컨디션 연관성</h3>
        <p className="text-[10px] text-gray-400 mt-0.5">
          수면이 충분할수록 좋은 컨디션 비율이 높아지는지 확인해보세요
        </p>
      </div>
      <div className="space-y-4">
        {sleepLevels.map((sleep) => {
          const counts = matrix[sleep];
          const total = Object.values(counts).reduce((a, b) => a + b, 0);
          if (total === 0) return null;
          return (
            <div key={sleep}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: sleepColor[sleep] }}
                  />
                  <span className="text-[11px] font-semibold text-gray-600">수면 {sleep}</span>
                </div>
                <span className="text-[10px] text-gray-400">{total}일</span>
              </div>
              {/* Proportion bar */}
              <div className="flex h-5 rounded-lg overflow-hidden">
                {condLabels.map((cond) => {
                  const count = counts[cond] || 0;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  if (pct === 0) return null;
                  return (
                    <div
                      key={cond}
                      className="flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ width: `${pct}%`, background: condColor(cond) }}
                    >
                      {pct >= 18 ? `${Math.round(pct)}%` : ""}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex gap-3 mt-1.5">
                {condLabels.map((cond) => {
                  const count = counts[cond] || 0;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  if (count === 0) return null;
                  return (
                    <span key={cond} className="flex items-center gap-1 text-[9px] text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: condColor(cond) }} />
                      {cond} {pct}%
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Distribution Charts (Sleep & Meal)
// ──────────────────────────────────────────
function DistributionBar({
  label,
  value,
  total,
  color,
  sublabel,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  sublabel?: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-16 flex-shrink-0 text-right">
        <span className="text-[11px] font-semibold text-gray-600">{label}</span>
        {sublabel && <p className="text-[9px] text-gray-400 leading-tight">{sublabel}</p>}
      </div>
      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] text-gray-500 w-16 text-right flex-shrink-0 whitespace-nowrap">
        {value}일 ({pct}%)
      </span>
    </div>
  );
}

function DistributionCharts({ data }: { data: HistoryItem[] }) {
  const total = data.length;

  const countField = (field: keyof HistoryItem) => {
    const c: Record<string, number> = {};
    data.forEach((d) => {
      const v = String(d[field]);
      c[v] = (c[v] || 0) + 1;
    });
    return c;
  };

  const sleep = countField("sleep");
  const meal = countField("meal");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Sleep */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ background: "#8b5cf615" }}>
            <i className="ri-moon-line text-xs" style={{ color: "#8b5cf6" }} />
          </div>
          <h3 className="text-xs font-bold text-gray-700">수면 패턴 분포</h3>
        </div>
        <p className="text-[10px] text-gray-400 mb-3 ml-8">수면 상태가 얼마나 자주 어떻게 나타났는지 비율로 보여줘요</p>
        <div className="space-y-2.5">
          <DistributionBar label="충분" sublabel="7시간 이상" value={sleep["충분"] || 0} total={total} color="#8b5cf6" />
          <DistributionBar label="보통" sublabel="5~7시간" value={sleep["보통"] || 0} total={total} color="#a78bfa" />
          <DistributionBar label="부족" sublabel="5시간 미만" value={sleep["부족"] || 0} total={total} color="#ef4444" />
        </div>
      </div>

      {/* Meal */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ background: "#f5941415" }}>
            <i className="ri-restaurant-line text-xs" style={{ color: "#f59414" }} />
          </div>
          <h3 className="text-xs font-bold text-gray-700">아침 식사 패턴 분포</h3>
        </div>
        <p className="text-[10px] text-gray-400 mb-3 ml-8">아이가 아침을 얼마나 먹었는지 빈도로 파악해요</p>
        <div className="space-y-2.5">
          <DistributionBar label="전부" sublabel="완식" value={meal["전부"] || 0} total={total} color="#10b981" />
          <DistributionBar label="대부분" sublabel="거의 다" value={meal["대부분"] || 0} total={total} color="#34d399" />
          <DistributionBar label="조금" sublabel="반 이하" value={meal["조금"] || 0} total={total} color="#f59e0b" />
          <DistributionBar label="안먹음" sublabel="거부" value={meal["안먹음"] || 0} total={total} color="#ef4444" />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// History List
// ──────────────────────────────────────────
function HistoryList({ data }: { data: HistoryItem[] }) {
  const recent = [...data].reverse().slice(0, 10);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-700">발송 이력</h3>
        <span className="text-[10px] text-gray-400">최근 {recent.length}건</span>
      </div>
      <div className="divide-y divide-gray-50">
        {recent.map((item) => {
          const cc = condColor(item.condition);
          const sleepBg = item.sleep === "충분" ? "#f3f0ff" : item.sleep === "부족" ? "#fef2f2" : "#f9fafb";
          const sleepText = item.sleep === "충분" ? "#7c3aed" : item.sleep === "부족" ? "#dc2626" : "#6b7280";
          return (
            <div key={item.date} className="px-5 py-3 flex items-center gap-3">
              <span className="text-[11px] text-gray-400 w-10 flex-shrink-0 font-medium">{item.date}</span>
              {/* Condition badge */}
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
                style={{ background: `${cc}18`, color: cc }}
              >
                {item.condition}
              </span>
              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-1 flex-wrap min-w-0">
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap"
                  style={{ background: sleepBg, color: sleepText }}
                >
                  수면 {item.sleep}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 whitespace-nowrap">
                  식사 {item.meal}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 whitespace-nowrap hidden sm:inline">
                  약 {item.medicine}
                </span>
              </div>
              {item.note && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <i className="ri-sticky-note-line text-[10px] text-gray-300" />
                  <span className="text-[9px] text-gray-400 max-w-[80px] truncate hidden md:block">{item.note}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Main Dashboard
// ──────────────────────────────────────────
export default function MorningReportDashboard() {
  const { morningReports } = useParentData();
  const [range, setRange] = useState<RangeKey>("7일");

  // DB 데이터를 HistoryItem 형식으로 변환
  const allData: HistoryItem[] = useMemo(() =>
    morningReports.map((r) => ({
      date: r.date.slice(5), // "03-17" 형식
      sleep: r.sleep_time?.includes("5") || r.sleep_time?.includes("4") ? "부족"
        : r.sleep_time?.includes("7") || r.sleep_time?.includes("8") || r.sleep_time?.includes("9") ? "충분" : "보통",
      condition: COND_MAP[r.condition ?? "normal"] ?? "보통",
      meal: MEAL_MAP[r.meal ?? "normal"] ?? "대부분",
      bowel: BOWEL_MAP[r.bowel ?? "normal"] ?? "정상",
      medicine: r.medication ?? "복용 완료",
      note: r.note ?? "",
    })),
  [morningReports]);

  const filteredData = useMemo(() => {
    const n = range === "7일" ? 7 : range === "14일" ? 14 : allData.length;
    // slice newest-first then reverse for oldest-first chronological order
    return allData.slice(0, n).reverse();
  }, [range, allData]);

  return (
    <div className="space-y-4">
      {/* Range selector */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">
            <strong className="text-gray-700">{filteredData.length}일</strong>간의 등원 전 한마디 데이터를 분석했어요
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              style={{
                background: range === r ? "#fff" : "transparent",
                color: range === r ? "#111827" : "#6b7280",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <SummaryCards data={filteredData} />

      {/* Condition trend (full width) */}
      <ConditionTrendChart data={filteredData} />

      {/* Sleep × Condition correlation */}
      <SleepConditionCorrelation data={filteredData} />

      {/* Distribution charts */}
      <DistributionCharts data={filteredData} />

      {/* History list */}
      <HistoryList data={filteredData} />
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useParentData } from "../../../contexts/ParentDataContext";

const TYPE_CONFIG = [
  { key: "자해" as const, label: "자해행동", color: "#ef4444" },
  { key: "타해" as const, label: "타해행동", color: "#f59e0b" },
  { key: "집착" as const, label: "집착행동", color: "#026eff" },
];

type DailyEntry = {
  date: string;
  value: number;
  day: string;
  breakdown: Record<string, number>;
};

export function DailyBehaviorChart({ data }: { data: DailyEntry[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getColor = (v: number) => (v >= 5 ? "#ef4444" : v >= 3 ? "#f59e0b" : "#10b981");
  const getSeverity = (v: number) => (v >= 5 ? "주의" : v >= 3 ? "보통" : "양호");

  const svgW = 280, svgH = 88, padX = 20, padTop = 14, padBottom = 22;
  const chartH = svgH - padTop - padBottom;
  const n = data.length;
  const xStep = (svgW - padX * 2) / (n - 1);
  const xs = data.map((_, i) => padX + i * xStep);
  const maxVal = Math.max(...data.map((d) => d.value));
  const ys = data.map((d) => padTop + chartH - (d.value / maxVal) * chartH);

  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${xs[n - 1].toFixed(1)},${(padTop + chartH).toFixed(1)} L ${xs[0].toFixed(1)},${(padTop + chartH).toFixed(1)} Z`;

  const worstIdx = data.reduce((bi, d, i) => (d.value > data[bi].value ? i : bi), 0);
  const bestIdx = data.reduce((bi, d, i) => (d.value < data[bi].value ? i : bi), 0);

  const dayLabelY = svgH - 4;
  const minTopLabelY = 6;
  const getAboveLabelY = (dotY: number) => Math.max(dotY - 11, minTopLabelY);
  const getBelowLabelY = (dotY: number) => {
    const below = dotY + 17;
    return below < dayLabelY - 10 ? below : null;
  };

  const totalWeek = data.reduce((s, d) => s + d.value, 0);
  const avgPerDay = (totalWeek / data.length).toFixed(1);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setActiveIdx(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 팝오버 픽셀 위치 계산 — 화면 경계 클램핑
  const getPopoverStyle = (i: number, popoverW: number) => {
    const containerW = containerRef.current?.clientWidth ?? 300;
    const dotXPx = (xs[i] / svgW) * containerW;
    const margin = 4;
    const leftPx = Math.min(
      Math.max(dotXPx - popoverW / 2, margin),
      containerW - popoverW - margin,
    );
    // 화살표가 항상 도트를 가리키도록
    const arrowLeft = Math.min(
      Math.max(dotXPx - leftPx, 12),
      popoverW - 12,
    );
    return { leftPx, arrowLeft };
  };

  return (
    <div ref={containerRef} className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between mb-1">
        <div>
          <h3 className="text-xs font-bold text-gray-700">최근 7일 도전행동 추이</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            이번 주 총&nbsp;<strong className="text-gray-600">{totalWeek}건</strong>
            <span className="text-gray-300 mx-1.5">·</span>
            일평균&nbsp;<strong className="text-gray-600">{avgPerDay}건</strong>
            <span className="hidden sm:inline ml-1.5 text-gray-300">· 도트를 클릭해 세부 확인</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 sm:flex-shrink-0">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#ef4444]" />5↑</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#f59e0b]" />3~4</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#10b981]" />2↓</span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" overflow="visible">
          <defs>
            <linearGradient id="dailyAreaGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {[0, 0.5, 1].map((t) => {
            const gy = padTop + chartH * (1 - t);
            return <line key={t} x1={padX} y1={gy} x2={svgW - padX} y2={gy} stroke="#f3f4f6" strokeWidth="1" />;
          })}
          <path d={areaPath} fill="url(#dailyAreaGrad2)" />
          <path d={linePath} fill="none" stroke="#fecaca" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          <path d={linePath} fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" opacity="0.7" />
          {xs.map((x, i) => {
            const color = getColor(data[i].value);
            const isActive = i === activeIdx;
            const isWorst = i === worstIdx;
            const isBest = i === bestIdx;
            const aboveY = getAboveLabelY(ys[i]);
            const belowY = getBelowLabelY(ys[i]);
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => setActiveIdx(activeIdx === i ? null : i)}>
                <circle cx={x} cy={ys[i]} r={14} fill="transparent" />
                {(isWorst || isBest) && !isActive && <circle cx={x} cy={ys[i]} r={9} fill={color} opacity="0.15" />}
                {isActive && <circle cx={x} cy={ys[i]} r={10} fill={color} opacity="0.2" />}
                <circle cx={x} cy={ys[i]} r={isActive ? 7 : 6} fill={color} />
                <circle cx={x} cy={ys[i]} r={isActive ? 3 : 2.5} fill="white" />
                {isWorst && !isActive && <text x={x} y={aboveY} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">최다</text>}
                {isBest && bestIdx !== worstIdx && !isActive && (() => {
                  const labelY = belowY !== null ? belowY : aboveY;
                  return <text x={x} y={labelY} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">최저</text>;
                })()}
              </g>
            );
          })}
          {xs.map((x, i) => (
            <text key={i} x={x} y={svgH - 4} textAnchor="middle" fontSize="9"
              fill={i === activeIdx ? "#374151" : "#9ca3af"} fontWeight={i === activeIdx ? "700" : "400"}>
              {data[i].day}
            </text>
          ))}
        </svg>

        {activeIdx !== null && (() => {
          const d = data[activeIdx];
          const color = getColor(d.value);
          const severity = getSeverity(d.value);
          const popoverW = 152;
          const { leftPx, arrowLeft } = getPopoverStyle(activeIdx, popoverW);
          return (
            <div
              className="absolute z-20 bottom-[calc(100%-4px)] mb-1 bg-white rounded-xl border border-gray-100 p-3"
              style={{
                left: leftPx,
                width: popoverW,
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
              }}
            >
              {/* 화살표 — 도트 위치 추적 */}
              <div
                className="absolute -bottom-[6px] w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45"
                style={{ left: arrowLeft, transform: "translateX(-50%)" }}
              />
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-800">{d.day}요일 ({d.date})</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>{severity}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2.5">
                <span className="text-2xl font-black leading-none" style={{ color }}>{d.value}</span>
                <span className="text-xs text-gray-400">건 발생</span>
              </div>
              <div className="space-y-1.5">
                {TYPE_CONFIG.map((tc) => (
                  <div key={tc.key} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tc.color }} />
                    <span className="text-[11px] text-gray-500 flex-1">{tc.label}</span>
                    <div className="w-14 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.value > 0 ? (d.breakdown[tc.key] / d.value) * 100 : 0}%`, background: tc.color }} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700 w-5 text-right">{d.breakdown[tc.key]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between">
                <span className="text-[10px] text-gray-400">총 발생</span>
                <span className="text-[11px] font-bold text-gray-700">{d.value}건</span>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[11px] font-bold text-gray-600">요일별 행동 유형 구성</p>
          <p className="text-[10px] text-gray-400">막대 높이 = 총 발생 수 · 색상 = 행동 유형</p>
        </div>
        <div className="flex gap-2 items-end">
          {data.map((d, i) => {
            const barMaxH = 56;
            const barH = d.value > 0 ? Math.max((d.value / maxVal) * barMaxH, 10) : 10;
            const isActive = i === activeIdx;
            const color = getColor(d.value);
            const severity = getSeverity(d.value);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => setActiveIdx(activeIdx === i ? null : i)}>
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-gray-700" : "text-gray-400"}`}>{d.value}건</span>
                <div className="w-full flex justify-center items-end" style={{ height: barMaxH }}>
                  <div className="w-full rounded-md overflow-hidden flex flex-col-reverse transition-all duration-200"
                    style={{ height: barH, outline: isActive ? `2px solid ${color}` : "2px solid transparent", outlineOffset: "2px" }}>
                    {d.breakdown.집착 > 0 && <div style={{ flex: d.breakdown.집착, background: "#026eff", minHeight: 3 }} />}
                    {d.breakdown.타해 > 0 && <div style={{ flex: d.breakdown.타해, background: "#f59e0b", minHeight: 3 }} />}
                    {d.breakdown.자해 > 0 && <div style={{ flex: d.breakdown.자해, background: "#ef4444", minHeight: 3 }} />}
                  </div>
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-gray-800" : "text-gray-500"}`}>{d.day}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap" style={{ background: `${color}1a`, color }}>{severity}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 justify-end">
          {TYPE_CONFIG.map((tc) => (
            <span key={tc.key} className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: tc.color }} />{tc.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WeeklyConditionChart({ data }: { data: { day: string; good: number; mild: number; caution: number }[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scores = data.map((d) => {
    const total = d.good + d.mild + d.caution;
    return total > 0 ? (d.good * 3 + d.mild * 2 + d.caution * 1) / total : 2;
  });

  const getColor = (score: number) => (score >= 2.5 ? "#10b981" : score >= 1.8 ? "#f59e0b" : "#ef4444");
  const getLabel = (score: number) => (score >= 2.5 ? "좋음" : score >= 1.8 ? "보통" : "주의");

  const totalGood = data.reduce((acc, d) => acc + d.good, 0);
  const totalAll = data.reduce((acc, d) => acc + d.good + d.mild + d.caution, 0);
  const goodPct = Math.round((totalGood / totalAll) * 100);

  const svgW = 280, svgH = 88, padX = 20, padTop = 14, padBottom = 22;
  const chartH = svgH - padTop - padBottom;
  const n = scores.length;
  const xStep = (svgW - padX * 2) / (n - 1);
  const xs = scores.map((_, i) => padX + i * xStep);
  const ys = scores.map((s) => padTop + chartH - ((s - 1) / 2) * chartH);

  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${xs[n - 1].toFixed(1)},${(padTop + chartH).toFixed(1)} L ${xs[0].toFixed(1)},${(padTop + chartH).toFixed(1)} Z`;

  const bestIdx = scores.indexOf(Math.max(...scores));
  const worstIdx = scores.indexOf(Math.min(...scores));

  const dayLabelY = svgH - 4;
  const minTopLabelY = 6;
  const getAboveLabelY = (dotY: number) => Math.max(dotY - 11, minTopLabelY);
  const getBelowLabelY = (dotY: number) => {
    const below = dotY + 18;
    return below < dayLabelY - 10 ? below : null;
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setActiveIdx(null);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // 팝오버 픽셀 위치 계산 — 화면 경계 클램핑
  const getPopoverStyle = (i: number, popoverW: number) => {
    const containerW = containerRef.current?.clientWidth ?? 300;
    const dotXPx = (xs[i] / svgW) * containerW;
    const margin = 4;
    const leftPx = Math.min(
      Math.max(dotXPx - popoverW / 2, margin),
      containerW - popoverW - margin,
    );
    const arrowLeft = Math.min(
      Math.max(dotXPx - leftPx, 12),
      popoverW - 12,
    );
    return { leftPx, arrowLeft };
  };

  return (
    <div ref={containerRef} className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between mb-1">
        <div>
          <h3 className="text-xs font-bold text-gray-700">주간 컨디션 추이</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            이번 주 전체 관찰 중 <strong className="text-[#10b981]">좋음 {goodPct}%</strong>
            <span className="hidden sm:inline ml-1.5 text-gray-300">· 도트를 클릭해 세부 확인</span>
          </p>
        </div>
        <div className="flex items-center gap-2.5 text-[10px] text-gray-400 sm:flex-shrink-0">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#10b981]" />좋음</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#f59e0b]" />보통</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-[#ef4444]" />주의</span>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" overflow="visible">
          <defs>
            <linearGradient id="condAreaGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {[0, 0.5, 1].map((t) => {
            const gy = padTop + chartH * (1 - t);
            return <line key={t} x1={padX} y1={gy} x2={svgW - padX} y2={gy} stroke="#f3f4f6" strokeWidth="1" />;
          })}
          <path d={areaPath} fill="url(#condAreaGrad2)" />
          <path d={linePath} fill="none" stroke="#d1fae5" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          {xs.map((x, i) => {
            const color = getColor(scores[i]);
            const isBest = i === bestIdx;
            const isWorst = i === worstIdx;
            const isActive = i === activeIdx;
            const aboveY = getAboveLabelY(ys[i]);
            const belowY = getBelowLabelY(ys[i]);
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => setActiveIdx(activeIdx === i ? null : i)}>
                <circle cx={x} cy={ys[i]} r={14} fill="transparent" />
                {(isBest || isWorst) && !isActive && <circle cx={x} cy={ys[i]} r={9} fill={color} opacity="0.15" />}
                {isActive && <circle cx={x} cy={ys[i]} r={10} fill={color} opacity="0.2" />}
                <circle cx={x} cy={ys[i]} r={isActive ? 7 : 6} fill={color} />
                <circle cx={x} cy={ys[i]} r={isActive ? 3 : 2.5} fill="white" />
                {isBest && !isActive && <text x={x} y={aboveY} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">최고</text>}
                {isWorst && bestIdx !== worstIdx && !isActive && (() => {
                  const labelY = belowY !== null ? belowY : aboveY;
                  return <text x={x} y={labelY} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">주의</text>;
                })()}
              </g>
            );
          })}
          {xs.map((x, i) => (
            <text key={i} x={x} y={svgH - 4} textAnchor="middle" fontSize="9" fill={i === activeIdx ? "#374151" : "#9ca3af"} fontWeight={i === activeIdx ? "700" : "400"}>
              {data[i].day}
            </text>
          ))}
        </svg>

        {activeIdx !== null && (() => {
          const d = data[activeIdx];
          const total = d.good + d.mild + d.caution;
          const score = scores[activeIdx];
          const color = getColor(score);
          const label = getLabel(score);
          const popoverW = 136;
          const { leftPx, arrowLeft } = getPopoverStyle(activeIdx, popoverW);
          const rows = [
            { label: "좋음", value: d.good, color: "#10b981" },
            { label: "보통", value: d.mild, color: "#f59e0b" },
            { label: "주의", value: d.caution, color: "#ef4444" },
          ];
          return (
            <div
              className="absolute z-20 bottom-[calc(100%-4px)] mb-1 bg-white rounded-xl border border-gray-100 p-3"
              style={{
                left: leftPx,
                width: popoverW,
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
              }}
            >
              {/* 화살표 — 도트 위치 추적 */}
              <div
                className="absolute -bottom-[6px] w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45"
                style={{ left: arrowLeft, transform: "translateX(-50%)" }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-800">{d.day}요일 컨디션</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>{label}</span>
              </div>
              <div className="space-y-1.5">
                {rows.map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                    <span className="text-[11px] text-gray-500 flex-1">{r.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${total > 0 ? (r.value / total) * 100 : 0}%`, background: r.color }} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700 w-8 text-right whitespace-nowrap">{r.value}건</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] text-gray-400">총 관찰</span>
                <span className="text-[11px] font-bold text-gray-700">{total}건</span>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[11px] font-bold text-gray-600">요일별 컨디션 구성</p>
          <p className="text-[10px] text-gray-400">막대 높이 = 총 관찰 수 · 색상 = 컨디션 비율</p>
        </div>
        <div className="flex gap-2 items-end">
          {data.map((d, i) => {
            const total = d.good + d.mild + d.caution;
            const maxTotal = Math.max(...data.map((x) => x.good + x.mild + x.caution));
            const barMaxH = 56;
            const barH = total > 0 ? Math.max((total / maxTotal) * barMaxH, 10) : 10;
            const isActive = i === activeIdx;
            const score = scores[i];
            const color = getColor(score);
            const label = getLabel(score);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => setActiveIdx(activeIdx === i ? null : i)}>
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-gray-700" : "text-gray-400"}`}>{total}건</span>
                <div className="w-full flex justify-center items-end" style={{ height: barMaxH }}>
                  <div className="w-full rounded-md overflow-hidden flex flex-col-reverse transition-all duration-200"
                    style={{ height: barH, outline: isActive ? `2px solid ${color}` : "2px solid transparent", outlineOffset: "2px" }}>
                    {d.good > 0 && <div style={{ flex: d.good, background: "#10b981", minHeight: 3 }} />}
                    {d.mild > 0 && <div style={{ flex: d.mild, background: "#f59e0b", minHeight: 3 }} />}
                    {d.caution > 0 && <div style={{ flex: d.caution, background: "#ef4444", minHeight: 3 }} />}
                  </div>
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-gray-800" : "text-gray-500"}`}>{d.day}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap" style={{ background: `${color}1a`, color }}>{label}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 justify-end">
          {[{ label: "좋음 (아래)", color: "#10b981" }, { label: "보통", color: "#f59e0b" }, { label: "주의 (위)", color: "#ef4444" }].map((leg) => (
            <span key={leg.label} className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: leg.color }} />{leg.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Export stats card for reuse ── */
function HorizontalBar({ label, value, max, color, total }: { label: string; value: number; max: number; color: string; total: number }) {
  const pct = Math.round((value / max) * 100);
  const ratio = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-16 flex-shrink-0 text-right">{label}</span>
      <div className="flex-1 h-4 rounded-full overflow-hidden bg-gray-100">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs text-gray-500 w-20 flex-shrink-0 text-right whitespace-nowrap">{value}건 ({ratio}%)</span>
    </div>
  );
}

export function BehaviorTypeCard() {
  const { behaviorEvents } = useParentData();
  const totalCount = behaviorEvents.length;
  const selfHarm = behaviorEvents.filter((e) => e.type === "self_harm").length;
  const harmOthers = behaviorEvents.filter((e) => e.type === "harm_others").length;
  const obsession = behaviorEvents.filter((e) => e.type === "obsession").length;
  const typeBreakdown = [
    { label: "자해행동", value: selfHarm, color: "#ef4444" },
    { label: "타해행동", value: harmOthers, color: "#f59e0b" },
    { label: "집착행동", value: obsession, color: "#026eff" },
  ];
  const typeMax = Math.max(...typeBreakdown.map((t) => t.value));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-center items-center text-center">
        <p className="text-4xl font-black text-gray-900">
          {totalCount}<span className="text-lg font-bold text-gray-400">건</span>
        </p>
        <p className="text-xs text-gray-400 mt-1.5">전체 행동 발생</p>
        <p className="text-[10px] text-gray-300 mt-1">최근 30일</p>
      </div>
      <div className="sm:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-700 mb-3">행동 유형별 발생 현황</h3>
        <div className="space-y-2.5">
          {typeBreakdown.map((t) => (
            <HorizontalBar key={t.label} label={t.label} value={t.value} max={typeMax} color={t.color} total={totalCount} />
          ))}
        </div>
      </div>
    </div>
  );
}

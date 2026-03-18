import { useState } from "react";
import {
  mockMorningReportHistory,
  mockMorningReports,
  mockBehaviorStats,
  mockChild,
} from "../../../mocks/parentDashboard";
import { DailyBehaviorChart, WeeklyConditionChart, BehaviorTypeCard } from "./BehaviorCharts";
import CorrelationChart from "./CorrelationChart";

type HistoryEntry = typeof mockMorningReportHistory[number];

/* ════════════════════════════════════════
   0. MONTHLY STORY REPORT
════════════════════════════════════════ */
function Hi({ c, children }: { c: string; children: React.ReactNode }) {
  return (
    <strong className="font-bold" style={{ color: c }}>
      {children}
    </strong>
  );
}

function MonthlyStoryReport({ data }: { data: HistoryEntry[] }) {
  const total = data.length;
  const name = mockChild.name.replace("김", "").replace("이", ""); void name;

  // ── raw counts ──
  const condGood  = data.filter((d) => d.condition === "좋음").length;
  const condMid: number = data.filter((d) => d.condition === "보통").length; void condMid;
  const condBad   = data.filter((d) => d.condition === "안좋음").length;
  const sleepGood = data.filter((d) => d.sleep === "충분").length;
  const sleepBad  = data.filter((d) => d.sleep === "부족").length;
  const mealGood  = data.filter((d) => d.meal === "전부" || d.meal === "대부분").length;
  const mealBad   = data.filter((d) => d.meal === "조금" || d.meal === "안먹음").length;
  const medOk     = data.filter((d) => d.medicine === "복용 완료").length;

  // sleep → next-day condition
  const sleepBadNextBadCond = data.slice(0, -1).filter(
    (d, i) => d.sleep === "부족" && data[i + 1].condition === "안좋음"
  ).length;

  // ── overall grade ──
  const score = (condGood / total) * 40 + (sleepGood / total) * 30 + (mealGood / total) * 30;
  const isGreat  = score >= 65;
  const isGood   = score >= 50 && score < 65;

  // ── keyword chips ──
  const keywords: { label: string; color: string; bg: string }[] = [];
  if (condGood >= 18)  keywords.push({ label: "컨디션 좋음", color: "#059669", bg: "#d1fae5" });
  else if (condBad >= 6) keywords.push({ label: "컨디션 기복", color: "#dc2626", bg: "#fee2e2" });
  else                 keywords.push({ label: "컨디션 보통", color: "#d97706", bg: "#fef3c7" });

  if (sleepGood >= 18) keywords.push({ label: "수면 안정", color: "#7c3aed", bg: "#ede9fe" });
  else if (sleepBad >= 7) keywords.push({ label: "수면 부족 잦음", color: "#dc2626", bg: "#fee2e2" });
  else                 keywords.push({ label: "수면 양호", color: "#7c3aed", bg: "#ede9fe" });

  if (mealGood >= 23)  keywords.push({ label: "식욕 안정", color: "#b45309", bg: "#fef3c7" });
  else if (mealBad >= 8) keywords.push({ label: "식욕 저조", color: "#dc2626", bg: "#fee2e2" });

  if (medOk >= 25)     keywords.push({ label: "약복용 우수", color: "#1d4ed8", bg: "#dbeafe" });

  if (sleepBadNextBadCond >= 4) keywords.push({ label: "수면-컨디션 연관", color: "#6d28d9", bg: "#ede9fe" });

  // ── opening sentence ──
  const opening =
    isGreat
      ? `이번 달 지우는 아주 잘 지냈어요! ${total}일 중 `
      : isGood
      ? `이번 달 지우는 전반적으로 안정적인 한 달을 보냈어요. ${total}일 중 `
      : `이번 달은 좋은 날과 힘든 날이 섞인 한 달이었어요. ${total}일 중 `;

  // ── sleep sentence ──
  const sleepSentence =
    sleepGood >= 18
      ? `수면도 아주 안정적이었어요. `
      : sleepBad >= 7
      ? `수면이 부족한 날이 `
      : `수면은 대체로 양호했어요. `;

  // ── meal sentence ──
  const mealSentence =
    mealGood >= 23
      ? `식사는 이번 달 내내 정말 잘 먹었어요. `
      : mealBad >= 8
      ? `식사량이 적은 날이 다소 있었어요. `
      : `식사는 꽤 잘 먹은 편이에요. `;

  // ── closing ──
  const closing =
    isGreat
      ? `이번 달은 정말 뿌듯한 한 달이에요. 가정에서 충분한 수면 루틴과 꾸준한 칭찬을 유지해 주시면 다음 달도 더 좋아질 거예요.`
      : isGood
      ? `전반적으로 잘 버텨준 한 달이에요. 수면 시간을 일정하게 유지하면 컨디션 관리에 가장 큰 도움이 돼요.`
      : `힘든 날도 있었지만 지우가 잘 이겨냈어요. 수면 루틴 점검과 취침 시간 조율이 다음 달 컨디션 개선의 핵심이 될 것 같아요.`;

  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "#fffdf5", borderColor: "#f0e4c0" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ background: "#fef3c7" }}
          >
            <i className="ri-sparkling-2-fill text-sm" style={{ color: "#d97706" }} />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900">
              이번 달 {mockChild.name}는 어땠나요?
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              2026년 2월 16일 – 3월 17일 · 생활 알리미 {total}일 분석
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap flex-shrink-0"
            style={{ background: "#fef3c7", color: "#92400e" }}
          >
            <i className="ri-ai-generate text-[10px]" />
            AI 자동 생성
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: "#f0e4c0" }} />

      {/* Body */}
      <div className="px-5 py-4 space-y-3.5">

        {/* Paragraph 1 — overall + condition */}
        <p className="text-[13px] text-gray-700 leading-relaxed">
          {opening}
          <Hi c="#059669">{condGood}일</Hi>이 컨디션 좋음이었고,{" "}
          {condBad > 0 && (
            <>주의가 필요한 날은 <Hi c="#dc2626">{condBad}일</Hi>이었어요. </>
          )}
          {isGreat
            ? `선생님도 밝고 활발한 모습이 많았다고 하셨어요.`
            : isGood
            ? `기복은 있었지만 전반적으로 잘 적응해 줬어요.`
            : `컨디션이 좋지 않은 날엔 선생님이 세심하게 살펴봐 주셨어요.`}
        </p>

        {/* Paragraph 2 — sleep */}
        <p className="text-[13px] text-gray-700 leading-relaxed">
          {sleepSentence}
          {sleepGood >= 18 ? (
            <><Hi c="#7c3aed">{sleepGood}일</Hi> 충분히 자고 왔다고 기록됐어요.</>
          ) : sleepBad >= 7 ? (
            <>
              <Hi c="#dc2626">{sleepBad}일</Hi>이나 있었어요.{" "}
              {sleepBadNextBadCond >= 3 && (
                <>
                  실제로 수면이 부족한 다음 날 컨디션이 저조한 경우가{" "}
                  <Hi c="#dc2626">{sleepBadNextBadCond}번</Hi> 관찰됐어요.{" "}
                </>
              )}
              취침 시간을 일정하게 유지하면 컨디션 개선에 직접적인 도움이 돼요.
            </>
          ) : (
            <><Hi c="#7c3aed">{sleepGood}일</Hi> 충분히 잤고, 부족한 날은 <Hi c="#f59e0b">{sleepBad}일</Hi>이었어요.</>
          )}
        </p>

        {/* Paragraph 3 — meal + medicine */}
        <p className="text-[13px] text-gray-700 leading-relaxed">
          {mealSentence}
          <Hi c="#b45309">{mealGood}일</Hi> 완식에 가깝게 먹었고,{" "}
          약 복용도 <Hi c="#1d4ed8">{medOk}일</Hi> 빠짐없이 챙겨졌어요.
          {mealGood >= 23
            ? " 규칙적인 식사가 컨디션 유지에 도움이 되고 있어요."
            : " 식사량이 컨디션과 연관되는 날이 있으니 계속 주의 깊게 봐주세요."}
        </p>

        {/* Paragraph 4 — closing (expandable) */}
        {expanded && (
          <p className="text-[13px] text-gray-700 leading-relaxed">
            {closing}
          </p>
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
          style={{ color: "#d97706" }}
        >
          <i className={`${expanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-xs`} />
          {expanded ? "접기" : "선생님 제언 더 보기"}
        </button>
      </div>

      {/* Keywords */}
      <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-gray-400 font-semibold mr-1">이번 달 키워드</span>
        {keywords.map((k) => (
          <span
            key={k.label}
            className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
            style={{ background: k.bg, color: k.color }}
          >
            {k.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   1. MULTI-ROW HEATMAP TREND (30 days)
════════════════════════════════════════ */
function TrendChart({ data }: { data: HistoryEntry[] }) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const reversed = [...data].reverse(); // oldest → newest (left → right)

  const getCondColor = (v: string) =>
    v === "좋음" ? "#10b981" : v === "보통" ? "#f59e0b" : "#ef4444";
  const getSleepColor = (v: string) =>
    v === "충분" ? "#8b5cf6" : v === "보통" ? "#f59e0b" : "#ef4444";
  const getMealColor = (v: string) =>
    v === "전부" || v === "대부분" ? "#f59e0b" : v === "조금" ? "#fb923c" : "#ef4444";
  const getMedColor = (v: string) =>
    v === "복용 완료" ? "#60a5fa" : v === "기관 요청" ? "#f59e0b" : "#d1d5db";

  const getCondLabel = (v: string) => v;
  const getSleepLabel = (v: string) => v;
  const getMealLabel = (v: string) => v;
  const getMedLabel = (v: string) => v;

  const metrics = [
    {
      key: "condition",
      label: "컨디션",
      icon: "ri-sun-line",
      getColor: (d: HistoryEntry) => getCondColor(d.condition),
      getVal: (d: HistoryEntry) => getCondLabel(d.condition),
      goodCount: data.filter((d) => d.condition === "좋음").length,
      goodLabel: "좋음",
      levels: [
        { label: "좋음", color: "#10b981" },
        { label: "보통", color: "#f59e0b" },
        { label: "주의", color: "#ef4444" },
      ],
      trend: (() => {
        const recent = [...data].slice(0, 15).filter((d) => d.condition === "좋음").length;
        const prev = [...data].slice(15).filter((d) => d.condition === "좋음").length;
        return recent > prev ? "up" : recent < prev ? "down" : "same";
      })(),
    },
    {
      key: "sleep",
      label: "수면",
      icon: "ri-moon-line",
      getColor: (d: HistoryEntry) => getSleepColor(d.sleep),
      getVal: (d: HistoryEntry) => getSleepLabel(d.sleep),
      goodCount: data.filter((d) => d.sleep === "충분").length,
      goodLabel: "충분",
      levels: [
        { label: "충분", color: "#8b5cf6" },
        { label: "보통", color: "#f59e0b" },
        { label: "부족", color: "#ef4444" },
      ],
      trend: (() => {
        const recent = [...data].slice(0, 15).filter((d) => d.sleep === "충분").length;
        const prev = [...data].slice(15).filter((d) => d.sleep === "충분").length;
        return recent > prev ? "up" : recent < prev ? "down" : "same";
      })(),
    },
    {
      key: "meal",
      label: "식사",
      icon: "ri-restaurant-line",
      getColor: (d: HistoryEntry) => getMealColor(d.meal),
      getVal: (d: HistoryEntry) => getMealLabel(d.meal),
      goodCount: data.filter((d) => d.meal === "전부" || d.meal === "대부분").length,
      goodLabel: "완식",
      levels: [
        { label: "완식", color: "#f59e0b" },
        { label: "조금", color: "#fb923c" },
        { label: "안먹음", color: "#ef4444" },
      ],
      trend: (() => {
        const recent = [...data].slice(0, 15).filter((d) => d.meal === "전부" || d.meal === "대부분").length;
        const prev = [...data].slice(15).filter((d) => d.meal === "전부" || d.meal === "대부분").length;
        return recent > prev ? "up" : recent < prev ? "down" : "same";
      })(),
    },
    {
      key: "medicine",
      label: "약복용",
      icon: "ri-capsule-line",
      getColor: (d: HistoryEntry) => getMedColor(d.medicine),
      getVal: (d: HistoryEntry) => getMedLabel(d.medicine),
      goodCount: data.filter((d) => d.medicine === "복용 완료").length,
      goodLabel: "완료",
      levels: [
        { label: "완료", color: "#60a5fa" },
        { label: "기관 요청", color: "#f59e0b" },
        { label: "없음", color: "#d1d5db" },
      ],
      trend: (() => {
        const recent = [...data].slice(0, 15).filter((d) => d.medicine === "복용 완료").length;
        const prev = [...data].slice(15).filter((d) => d.medicine === "복용 완료").length;
        return recent > prev ? "up" : recent < prev ? "down" : "same";
      })(),
    },
  ];

  const trendIcon = (t: string) =>
    t === "up" ? "ri-arrow-up-line" : t === "down" ? "ri-arrow-down-line" : "ri-subtract-line";
  const trendColor = (t: string) =>
    t === "up" ? "#10b981" : t === "down" ? "#ef4444" : "#9ca3af";

  // 탭(모바일) + 호버(데스크톱) 통합 활성 셀
  const activeCell = selected || hovered;

  const hovEntry = activeCell !== null ? reversed[activeCell.col] : null;
  const hovMetric = activeCell !== null ? metrics[activeCell.row] : null;

  const handleCellClick = (row: number, col: number) => {
    if (selected?.row === row && selected?.col === col) {
      setSelected(null);
    } else {
      setSelected({ row, col });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-5">
      {/* Header */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-5">
        <div>
          <h3 className="text-sm font-bold text-gray-800">30일 생활 패턴</h3>
          {/* 데스크톱 설명 */}
          <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
            각 칸이 하루예요 — 색이 진할수록 좋은 날, 빨간색은 주의가 필요한 날이에요
          </p>
          {/* 모바일 설명 */}
          <p className="text-[11px] text-gray-400 mt-0.5 sm:hidden">
            칸을 탭하면 그날 상세 정보를 볼 수 있어요
          </p>
        </div>
        {/* legend */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] text-gray-400 sm:flex-shrink-0 sm:ml-4">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#10b981]" />좋음
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#f59e0b]" />보통
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#ef4444]" />주의
          </span>
        </div>
      </div>

      {/* Date axis — top */}
      <div className="flex items-center mb-2 ml-16 sm:ml-[88px] mr-16 sm:mr-[90px]">
        {reversed.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            {i % 5 === 0 && (
              <span className="text-[9px] text-gray-300 leading-none">{d.date.slice(-2)}</span>
            )}
          </div>
        ))}
      </div>

      {/* Metric rows */}
      <div className="space-y-2 sm:space-y-2.5">
        {metrics.map((m, rowIdx) => (
          <div key={m.key} className="flex items-center gap-2 sm:gap-3">
            {/* Label */}
            <div className="w-16 sm:w-[88px] flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <i className={`${m.icon} text-[10px] sm:text-[11px] text-gray-400`} />
              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-600 whitespace-nowrap">{m.label}</span>
            </div>

            {/* Blocks */}
            <div className="flex flex-1 gap-[1px] sm:gap-[2px] relative">
              {reversed.map((d, colIdx) => {
                const color = m.getColor(d);
                const isHov = hovered?.row === rowIdx && hovered?.col === colIdx;
                const isSel = selected?.row === rowIdx && selected?.col === colIdx;
                const isActive = isHov || isSel;
                return (
                  <div
                    key={colIdx}
                    className="flex-1 rounded-[3px] cursor-pointer transition-all duration-100"
                    style={{
                      height: 20,
                      background: color,
                      opacity: isActive ? 1 : 0.78,
                      transform: isActive ? "scaleY(1.25)" : "scaleY(1)",
                      outline: isSel ? `2px solid ${color}` : isHov ? `2px solid ${color}` : "none",
                      outlineOffset: isSel ? 2 : 1,
                    }}
                    onMouseEnter={() => setHovered({ row: rowIdx, col: colIdx })}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                  />
                );
              })}
            </div>

            {/* Summary */}
            <div className="w-16 sm:w-[90px] flex items-center gap-1 sm:gap-1.5 flex-shrink-0 justify-end">
              <div className="text-right">
                <p className="text-[10px] sm:text-[11px] font-bold text-gray-700 whitespace-nowrap">
                  {m.goodLabel} <span className="text-gray-900">{m.goodCount}일</span>
                </p>
                <p className="text-[9px] text-gray-400">
                  {Math.round((m.goodCount / data.length) * 100)}%
                </p>
              </div>
              <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                <i
                  className={`${trendIcon(m.trend)} text-[11px] sm:text-xs`}
                  style={{ color: trendColor(m.trend) }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Date axis — bottom */}
      <div className="mt-2 ml-16 sm:ml-[88px] mr-16 sm:mr-[90px]">
        {/* 데스크톱 */}
        <div className="hidden sm:flex items-center">
          {reversed.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              {(i === 0 || i === reversed.length - 1) && (
                <span className="text-[9px] text-gray-300 leading-none">{d.date}</span>
              )}
            </div>
          ))}
        </div>
        {/* 모바일: 시작~오늘 범위 레이블 */}
        <div className="flex sm:hidden items-center justify-between">
          <span className="text-[9px] text-gray-400 font-medium">
            {reversed[0]?.date.slice(5).replace("-", "/")} 시작
          </span>
          <span className="text-[9px] text-gray-300 mx-2 flex-1 text-center">· · · · · 30일 · · · · ·</span>
          <span className="text-[9px] text-gray-400 font-medium">
            오늘 {reversed[reversed.length - 1]?.date.slice(5).replace("-", "/")}
          </span>
        </div>
      </div>

      {/* Trend caption */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-50 gap-2">
        <p className="text-[10px] text-gray-400">
          <span className="font-semibold text-gray-600">최근 15일</span> vs{" "}
          <span className="font-semibold text-gray-600">이전 15일</span> 비교 — 화살표로 추세 표시
        </p>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-[#10b981]">
            <i className="ri-arrow-up-line" /> 개선
          </span>
          <span className="flex items-center gap-1 text-[#ef4444]">
            <i className="ri-arrow-down-line" /> 주의
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <i className="ri-subtract-line" /> 유지
          </span>
        </div>
      </div>

      {/* Tooltip — 호버(데스크톱) + 탭(모바일) 공통 */}
      {hovEntry && hovMetric && activeCell && (
        <div className="mt-3 rounded-xl bg-gray-50 border border-gray-100 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <p className="text-xs font-bold text-gray-700">{hovEntry.date}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 flex-shrink-0 hidden sm:block" />
          {[
            { label: "컨디션", value: hovEntry.condition, color: getCondColor(hovEntry.condition) },
            { label: "수면",   value: hovEntry.sleep,     color: getSleepColor(hovEntry.sleep) },
            { label: "식사",   value: hovEntry.meal,      color: getMealColor(hovEntry.meal) },
            { label: "약복용", value: hovEntry.medicine,  color: getMedColor(hovEntry.medicine) },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: row.color }} />
              <span className="text-[10px] text-gray-400">{row.label}</span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: row.color + "20", color: row.color }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 모바일: 탭 안내 힌트 (툴팁 없을 때만 표시) */}
      {!activeCell && (
        <div className="mt-3 sm:hidden flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50/80">
          <i className="ri-hand-coin-line text-[11px] text-gray-400" />
          <span className="text-[10px] text-gray-400">원하는 날짜 칸을 탭해 보세요</span>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   2. DONUT DISTRIBUTION CHARTS
════════════════════════════════════════ */
function DonutRing({
  pct,
  color,
  size = 72,
}: {
  pct: number;
  color: string;
  size?: number;
}) {
  const r = (size - 10) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
      />
      <text x={cx} y={cx + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1f2937">
        {pct}%
      </text>
    </svg>
  );
}

function DistributionGrid({ data }: { data: HistoryEntry[] }) {
  const total = data.length;
  const condGood = Math.round((data.filter((d) => d.condition === "좋음").length / total) * 100);
  const sleepGood = Math.round((data.filter((d) => d.sleep === "충분").length / total) * 100);
  const mealGood = Math.round((data.filter((d) => d.meal === "전부" || d.meal === "대부분").length / total) * 100);
  const medOk = Math.round((data.filter((d) => d.medicine === "복용 완료").length / total) * 100);
  const bowelOk = Math.round((data.filter((d) => d.bowel === "정상").length / total) * 100);

  const items = [
    {
      label: "컨디션 좋음", pct: condGood, color: "#10b981",
      rows: [
        { l: "좋음", v: data.filter((d) => d.condition === "좋음").length, c: "#10b981" },
        { l: "보통", v: data.filter((d) => d.condition === "보통").length, c: "#f59e0b" },
        { l: "주의", v: data.filter((d) => d.condition === "안좋음").length, c: "#ef4444" },
      ],
    },
    {
      label: "수면 충분", pct: sleepGood, color: "#8b5cf6",
      rows: [
        { l: "충분", v: data.filter((d) => d.sleep === "충분").length, c: "#8b5cf6" },
        { l: "보통", v: data.filter((d) => d.sleep === "보통").length, c: "#f59e0b" },
        { l: "부족", v: data.filter((d) => d.sleep === "부족").length, c: "#ef4444" },
      ],
    },
    {
      label: "식사 완식", pct: mealGood, color: "#f59e0b",
      rows: [
        { l: "완식", v: data.filter((d) => d.meal === "전부" || d.meal === "대부분").length, c: "#f59e0b" },
        { l: "조금", v: data.filter((d) => d.meal === "조금").length, c: "#fb923c" },
        { l: "안먹음", v: data.filter((d) => d.meal === "안먹음").length, c: "#ef4444" },
      ],
    },
    {
      label: "약 복용 완료", pct: medOk, color: "#60a5fa",
      rows: [
        { l: "복용 완료", v: data.filter((d) => d.medicine === "복용 완료").length, c: "#60a5fa" },
        { l: "기관 요청", v: data.filter((d) => d.medicine === "기관 요청").length, c: "#f59e0b" },
        { l: "기록 없음", v: data.filter((d) => d.medicine === "약 없음").length, c: "#9ca3af" },
      ],
    },
    {
      label: "배변 정상", pct: bowelOk, color: "#34d399",
      rows: [
        { l: "정상", v: data.filter((d) => d.bowel === "정상").length, c: "#34d399" },
        { l: "무른편", v: data.filter((d) => d.bowel === "무른편").length, c: "#f59e0b" },
        { l: "이상", v: data.filter((d) => d.bowel !== "정상" && d.bowel !== "무른편").length, c: "#ef4444" },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="text-xs font-bold text-gray-700 mb-4">항목별 30일 분포</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <DonutRing pct={item.pct} color={item.color} />
            <p className="text-[11px] font-bold text-gray-700 text-center">{item.label}</p>
            <div className="w-full space-y-1">
              {item.rows.map((row) => (
                <div key={row.l} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: row.c }} />
                  <span className="text-[10px] text-gray-500 flex-1 truncate whitespace-nowrap">{row.l}</span>
                  <span className="text-[10px] font-semibold text-gray-700">{row.v}일</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   GALAXY WATCH MOCK SECTION
════════════════════════════════════════ */
function GalaxyWatchSection() {
  // Mock heart rate sparkline (last 24h, hourly)
  const hrValues = [72, 68, 65, 63, 61, 60, 62, 70, 85, 92, 88, 82, 79, 95, 88, 84, 80, 77, 75, 82, 86, 79, 74, 71];
  const W = 200, H = 36, PX = 4, PY = 4;
  const chartW = W - PX * 2;
  const chartH = H - PY * 2;
  const minHR = Math.min(...hrValues);
  const maxHR = Math.max(...hrValues);
  const toX = (i: number) => PX + (i / (hrValues.length - 1)) * chartW;
  const toY = (v: number) => PY + chartH - ((v - minHR) / (maxHR - minHR)) * chartH;
  const hrPath = hrValues.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const hrArea = `${hrPath} L ${toX(hrValues.length - 1).toFixed(1)},${(PY + chartH).toFixed(1)} L ${PX},${(PY + chartH).toFixed(1)} Z`;

  // Sleep stages mock (minutes)
  const sleepStages = [
    { label: "깊은잠", minutes: 130, color: "#4f46e5" },
    { label: "REM",   minutes: 105, color: "#8b5cf6" },
    { label: "얕은잠", minutes: 210, color: "#a78bfa" },
    { label: "깨짐",    minutes: 25,  color: "#e5e7eb" },
  ];
  const totalSleep = sleepStages.reduce((s, x) => s + x.minutes, 0);
  const toHM = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;

  const stressLvl = 34;
  const steps = 4521;
  const stepGoal = 6000;

  return (
    <div className="mt-5 pt-5 border-t border-gray-100">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Watch icon */}
          <div className="w-7 h-7 flex items-center justify-center rounded-xl bg-gray-900">
            <i className="ri-watch-line text-white text-xs" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">갤럭시 워치 생체 데이터</p>
            <p className="text-[10px] text-gray-400">어제 · 목 3월 17일 기준</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 whitespace-nowrap flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
          연동 준비 중
        </span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">

        {/* Heart rate card */}
        <div className="rounded-xl bg-red-50/60 border border-red-100/80 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <i className="ri-heart-pulse-line text-red-400 text-xs" />
            <p className="text-[10px] font-semibold text-gray-600">심박수</p>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-black text-gray-800">78</span>
            <span className="text-[10px] text-gray-400">bpm 평균</span>
          </div>
          {/* Sparkline */}
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 36 }}>
            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.00" />
              </linearGradient>
            </defs>
            <path d={hrArea} fill="url(#hrGrad)" />
            <path d={hrPath} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-400">최저 {minHR}</span>
            <span className="text-[9px] text-red-400 font-semibold">최고 {maxHR}</span>
          </div>
        </div>

        {/* Sleep stages card */}
        <div className="rounded-xl bg-indigo-50/60 border border-indigo-100/80 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <i className="ri-zzz-line text-indigo-400 text-xs" />
            <p className="text-[10px] font-semibold text-gray-600">수면 단계</p>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xl font-black text-gray-800">{toHM(totalSleep)}</span>
          </div>
          {/* Stacked bar */}
          <div className="flex rounded-full overflow-hidden h-3 mb-2.5 gap-[2px]">
            {sleepStages.map((s) => (
              <div
                key={s.label}
                style={{ width: `${(s.minutes / totalSleep) * 100}%`, background: s.color }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ background: "#4f46e5" }} />
              <span className="text-[9px] text-gray-500 whitespace-nowrap">깊은잠</span>
              <span className="text-[9px] font-semibold text-gray-700 ml-auto whitespace-nowrap">{toHM(sleepStages[0].minutes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ background: "#8b5cf6" }} />
              <span className="text-[9px] text-gray-500 whitespace-nowrap">REM</span>
              <span className="text-[9px] font-semibold text-gray-700 ml-auto whitespace-nowrap">{toHM(sleepStages[1].minutes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ background: "#a78bfa" }} />
              <span className="text-[9px] text-gray-500 whitespace-nowrap">얕은잠</span>
              <span className="text-[9px] font-semibold text-gray-700 ml-auto whitespace-nowrap">{toHM(sleepStages[2].minutes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ background: "#e5e7eb" }} />
              <span className="text-[9px] text-gray-500 whitespace-nowrap">깨짐</span>
              <span className="text-[9px] font-semibold text-gray-700 ml-auto whitespace-nowrap">{toHM(sleepStages[3].minutes)}</span>
            </div>
          </div>
        </div>

        {/* Stress card */}
        <div className="rounded-xl bg-amber-50/60 border border-amber-100/80 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <i className="ri-mental-health-line text-amber-400 text-xs" />
            <p className="text-[10px] font-semibold text-gray-600">스트레스 지수</p>
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-xl font-black text-gray-800">{stressLvl}</span>
            <span className="text-[10px] text-gray-400">/ 100</span>
            <span className="ml-auto text-[10px] font-bold text-amber-500 px-1.5 py-0.5 bg-amber-100 rounded-full">보통</span>
          </div>
          {/* Gradient bar */}
          <div className="relative w-full h-2.5 rounded-full overflow-hidden mb-1.5" style={{
            background: "linear-gradient(to right, #10b981, #f59e0b, #ef4444)"
          }}>
            <div
              className="absolute top-0 h-full w-0.5 bg-white rounded-full"
              style={{ left: `${stressLvl}%`, transform: "translateX(-50%)" }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400">
            <span>안정</span><span>보통</span><span>높음</span>
          </div>
        </div>

        {/* Steps card */}
        <div className="rounded-xl bg-emerald-50/60 border border-emerald-100/80 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <i className="ri-walk-line text-emerald-400 text-xs" />
            <p className="text-[10px] font-semibold text-gray-600">활동량</p>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-xl font-black text-gray-800">{steps.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400">걸음</span>
          </div>
          <p className="text-[9px] text-gray-400 mb-2.5">목표 {stepGoal.toLocaleString()} 걸음 중</p>
          {/* Progress ring */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
                <circle cx="20" cy="20" r="15" fill="none" stroke="#d1fae5" strokeWidth="5" />
                <circle
                  cx="20" cy="20" r="15"
                  fill="none" stroke="#10b981" strokeWidth="5"
                  strokeDasharray={`${(steps / stepGoal) * 94.2} 94.2`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-emerald-600">
                {Math.round((steps / stepGoal) * 100)}%
              </span>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 leading-relaxed">
                목표까지<br />
                <strong className="text-gray-700">{(stepGoal - steps).toLocaleString()}걸음</strong> 남았어요
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Preview notice */}
      <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
        <i className="ri-information-line text-gray-400 text-xs flex-shrink-0" />
        <p className="text-[10px] text-gray-400 leading-relaxed">
          위 데이터는 연동 후 표시될 내용의 <strong className="text-gray-600">미리보기</strong>예요. 갤럭시 워치를 연동하면 매일 실제 생체 데이터가 자동으로 기록돼요.
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   3. 30일 CONDITION CALENDAR
════════════════════════════════════════ */
function LifeCalendar({ data }: { data: HistoryEntry[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const reversed = [...data].reverse();
  const dotColor = (v: string) => (v === "좋음" ? "#10b981" : v === "보통" ? "#f59e0b" : "#ef4444");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-700">30일 컨디션 달력</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">선생님이 관찰한 매일의 컨디션</p>
        </div>
        <div className="flex items-center gap-2.5 text-[10px] text-gray-400">
          {[{ l: "좋음", c: "#10b981" }, { l: "보통", c: "#f59e0b" }, { l: "주의", c: "#ef4444" }].map((t) => (
            <span key={t.l} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: t.c }} />{t.l}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {reversed.map((entry, i) => {
          const color = dotColor(entry.condition);
          const isHov = hovered === i;
          return (
            <div
              key={entry.date}
              className="relative flex flex-col items-center gap-1"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-150 cursor-default"
                style={{
                  background: color,
                  opacity: isHov ? 1 : 0.72,
                  transform: isHov ? "scale(1.18)" : "scale(1)",
                }}
              >
                <span className="text-[9px] font-bold">{entry.date.split("-")[1].replace(/^0/, "")}</span>
              </div>
              <span className="text-[8px] text-gray-400 leading-none">{entry.date}</span>
              {isHov && (
                <div
                  className="absolute z-20 bottom-full mb-1.5 bg-gray-900 text-white rounded-lg px-2.5 py-2 text-[10px] pointer-events-none"
                  style={{ transform: "translateX(-20%)", minWidth: 140 }}
                >
                  <p className="font-bold mb-1">{entry.date}</p>
                  <div className="space-y-0.5">
                    <p className="text-white/80">컨디션 <strong className="text-white">{entry.condition}</strong></p>
                    <p className="text-white/80">수면 <strong className="text-white">{entry.sleep}</strong></p>
                    <p className="text-white/80">식사 <strong className="text-white">{entry.meal}</strong></p>
                    <p className="text-white/80">약복용 <strong className="text-white">{entry.medicine}</strong></p>
                  </div>
                  <div className="absolute top-full left-[25%] -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Galaxy Watch section */}
      <GalaxyWatchSection />
    </div>
  );
}

/* ════════════════════════════════════════
   4. RECENT 생활알리미 REPORTS
════════════════════════════════════════ */
function RecentReports() {
  const reports = mockMorningReports;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 flex items-center justify-center rounded-lg" style={{ background: "#eff6ff" }}>
          <i className="ri-notification-2-line text-[#026eff] text-xs" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-700">최근 생활 알리미</h3>
          <p className="text-[10px] text-gray-400">선생님이 보내주신 최근 보고</p>
        </div>
      </div>
      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="rounded-xl border border-gray-100 p-3.5">
            <div className="flex items-center gap-3 mb-3">
              {/* mood circle */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${report.moodColor}18` }}
              >
                {report.moodEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{report.mood}</span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${report.moodColor}18`, color: report.moodColor }}
                  >
                    {report.date.replace("2026년 ", "")}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">{report.teacher}</p>
              </div>
            </div>
            {/* items */}
            <div className="grid grid-cols-2 gap-1.5 mb-2.5">
              {report.items.map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg px-2.5 py-1.5">
                  <p className="text-[9px] text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-[11px] font-semibold text-gray-700">{item.value}</p>
                </div>
              ))}
            </div>
            {report.note && (
              <p className="text-[10px] text-gray-500 leading-relaxed border-t border-gray-50 pt-2">{report.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   5. TOP STAT CARDS
════════════════════════════════════════ */
function StatCards({ data }: { data: HistoryEntry[] }) {
  const total = data.length;
  const cards = [
    {
      label: "컨디션 좋음", icon: "ri-sun-line",
      value: data.filter((d) => d.condition === "좋음").length,
      color: "#10b981", bg: "#f0fdf4",
      sub: `보통 ${data.filter((d) => d.condition === "보통").length}일 · 주의 ${data.filter((d) => d.condition === "안좋음").length}일`,
    },
    {
      label: "수면 충분", icon: "ri-moon-line",
      value: data.filter((d) => d.sleep === "충분").length,
      color: "#8b5cf6", bg: "#faf5ff",
      sub: `보통 ${data.filter((d) => d.sleep === "보통").length}일 · 부족 ${data.filter((d) => d.sleep === "부족").length}일`,
    },
    {
      label: "완식한 날", icon: "ri-restaurant-line",
      value: data.filter((d) => d.meal === "전부" || d.meal === "대부분").length,
      color: "#f59e0b", bg: "#fffbeb",
      sub: `조금 ${data.filter((d) => d.meal === "조금").length}일 · 안먹음 ${data.filter((d) => d.meal === "안먹음").length}일`,
    },
    {
      label: "약 복용 완료", icon: "ri-capsule-line",
      value: data.filter((d) => d.medicine === "복용 완료").length,
      color: "#60a5fa", bg: "#eff6ff",
      sub: `기관 요청 ${data.filter((d) => d.medicine === "기관 요청").length}일 · 없음 ${data.filter((d) => d.medicine === "약 없음").length}일`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const pct = Math.round((c.value / total) * 100);
        return (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: c.bg }}>
                <i className={`${c.icon} text-sm`} style={{ color: c.color }} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>
                {pct}%
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-2xl font-black text-gray-900">{c.value}</span>
              <span className="text-xs text-gray-400">일</span>
              <span className="text-[10px] text-gray-300">/ {total}일</span>
            </div>
            <p className="text-xs font-semibold text-gray-700 mb-2">{c.label}</p>
            <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1.5">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
            </div>
            <p className="text-[10px] text-gray-400">{c.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════
   6. AI INSIGHT BANNER
════════════════════════════════════════ */
function InsightBanner({ data }: { data: HistoryEntry[] }) {
  const badSleepDays = data.filter((d) => d.sleep === "부족");
  const badCondOnBadSleep = badSleepDays.filter((d) => d.condition !== "좋음").length;
  const sleepCondCorr = badSleepDays.length > 0
    ? Math.round((badCondOnBadSleep / badSleepDays.length) * 100)
    : 0;

  const insights = [
    { icon: "ri-link-m",          color: "#026eff", bg: "#eff6ff", title: `수면 부족 → 컨디션 저조 ${sleepCondCorr}%`,   desc: "수면이 부족할 때 컨디션이 저조한 비율이에요. 취침 루틴 일관성을 유지하면 컨디션 개선에 도움이 돼요." },
    { icon: "ri-arrow-up-line",   color: "#10b981", bg: "#f0fdf4", title: "주 후반 컨디션 상승 패턴",                    desc: "데이터 상 목·금요일 컨디션 좋음 비율이 주 초반보다 높아요. 루틴 안정화 효과로 분석됩니다." },
    { icon: "ri-restaurant-line", color: "#f59e0b", bg: "#fffbeb", title: "완식일 도전행동 발생률 낮음",                  desc: "식사를 완식한 날 도전행동 발생률이 평균 대비 낮게 관찰돼요. 식사량과 정서 안정의 상관관계를 주목해 주세요." },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 flex items-center justify-center rounded-xl bg-[#f59e0b]/10">
          <i className="ri-sparkling-2-line text-[#f59e0b] text-sm" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-gray-700">AI 생활 패턴 인사이트</h3>
          <p className="text-[10px] text-gray-400">30일 생활 알리미 기록 분석 · 주요 패턴</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {insights.map((ins) => (
          <div key={ins.title} className="rounded-xl p-3.5" style={{ background: ins.bg }}>
            <div className="flex items-start gap-2 mb-1.5">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className={`${ins.icon} text-sm`} style={{ color: ins.color }} />
              </div>
              <p className="text-[11px] font-bold leading-snug" style={{ color: ins.color }}>{ins.title}</p>
            </div>
            <p className="text-[10px] text-gray-600 leading-relaxed">{ins.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function BehaviorStats() {
  const { daily, weeklyCondition } = mockBehaviorStats;
  const data = mockMorningReportHistory;

  return (
    <div className="relative">
      {/* ── 모바일 전용 Sticky 헤더 ── */}
      <div className="sticky top-0 z-20 sm:hidden bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-black text-gray-900 leading-tight">우리 아이 이야기</h1>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-none">
            {mockChild.name} · 30일 생활 알리미 분석
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 text-[10px] text-gray-500 whitespace-nowrap flex-shrink-0">
          <i className="ri-calendar-line text-[11px]" />
          최근 30일
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6 pb-10">
        {/* Header — 데스크톱 전용 */}
        <div className="hidden sm:flex items-end justify-between">
          <div>
            <h1 className="text-lg font-black text-gray-900">우리 아이 이야기</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {mockChild.name}의 30일 생활 알리미 기록 분석 · 선생님 관찰 기반
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] text-gray-500 whitespace-nowrap flex-shrink-0">
            <i className="ri-calendar-line text-xs" />
            최근 30일
          </div>
        </div>

        {/* 0. Monthly story report */}
        <MonthlyStoryReport data={data} />

        {/* 1. Stat cards */}
        <StatCards data={data} />

        {/* 2. Trend chart */}
        <TrendChart data={data} />

        {/* 3. Calendar + Recent reports */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <LifeCalendar data={data} />
          </div>
          <div className="lg:col-span-2">
            <RecentReports />
          </div>
        </div>

        {/* 4. Donut distribution */}
        <DistributionGrid data={data} />

        {/* 5. AI insight */}
        <InsightBanner data={data} />

        {/* 6. Cross-analysis correlation */}
        <CorrelationChart />

        {/* Divider */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap flex items-center gap-1.5">
            <i className="ri-bar-chart-2-line text-xs" />도전행동 기록
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* 7. Behavior charts */}
        <BehaviorTypeCard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <DailyBehaviorChart data={daily} />
          <WeeklyConditionChart data={weeklyCondition} />
        </div>
      </div>
    </div>
  );
}

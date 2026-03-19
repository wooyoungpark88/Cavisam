import { useState, useRef, useEffect, useMemo } from "react";
import StudentCard from "./StudentCard";
import StatsDropdown from "./StatsDropdown";
import { useTeacherData } from "../../../contexts/TeacherDataContext";
import type { StudentDailyReport, ConditionLevel, MealLevel, SleepLevel } from "../../../types/teacher";

const COND_MAP: Record<string, ConditionLevel> = { good: "좋음", normal: "보통", bad: "나쁨", very_bad: "매우나쁨" };
const MEAL_MAP: Record<string, MealLevel> = { good: "완식", normal: "평소처럼", none: "안먹음" };
const AVATAR_COLORS = ["#026eff", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#e879f9"];

function sleepLevel(s: string): SleepLevel {
  const h = parseFloat(s);
  if (!isNaN(h)) return h >= 7 ? "충분" : h >= 5 ? "보통" : "부족";
  if (s.includes("8") || s.includes("9") || s.includes("7")) return "충분";
  if (s.includes("5") || s.includes("4")) return "부족";
  return "보통";
}

export default function ChildManagement() {
  const { students: rawStudents } = useTeacherData();
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // DB Student → mock StudentDailyReport 형태로 변환
  const mockStudents: StudentDailyReport[] = useMemo(() =>
    rawStudents.map((s, i) => {
      const cond = COND_MAP[s.condition] ?? "보통";
      const sl = sleepLevel(s.sleep);
      const needsAttention = cond === "나쁨" || cond === "매우나쁨" || sl === "부족";
      const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
      return {
        id: i + 1,
        name: s.name,
        initial: s.name.charAt(0),
        avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
        reportDate: today,
        sleep: s.sleep || "-",
        sleepLevel: sl,
        condition: cond,
        meal: (MEAL_MAP[s.meal] ?? "평소처럼") as MealLevel,
        bowel: s.bowel === "normal" ? "정상" : "없음",
        note: s.note || "-",
        medication: s.medication || "-",
        needsAttention,
      };
    }),
  [rawStudents]);

  const attentionCount = mockStudents.filter((s) => s.needsAttention).length;

  const displayed = mockStudents
    .filter((s) => !attentionOnly || s.needsAttention)
    .filter((s) => s.name.includes(search.trim()));

  const isSearching = search.trim().length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!statsOpen) return;
    const handler = (e: MouseEvent) => {
      if (statsRef.current && !statsRef.current.contains(e.target as Node)) {
        setStatsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [statsOpen]);

  return (
    <div className="flex flex-col h-full">
      {/* Sub top bar */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-white gap-2">
        {/* Left: date */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-calendar-2-line text-[#026eff] text-sm" />
          </div>
          {/* 데스크톱: 풀 날짜 / 모바일: 짧은 날짜 */}
          <span className="hidden sm:inline text-gray-700 text-sm font-semibold whitespace-nowrap">2026년 3월 18일 수요일</span>
          <span className="sm:hidden text-gray-700 text-sm font-semibold whitespace-nowrap">3월 18일 (수)</span>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 관심 필요 badge-button */}
          <button
            onClick={() => setAttentionOnly((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all border"
            style={
              attentionOnly
                ? { background: "#fef2f2", color: "#dc2626", borderColor: "#fca5a5" }
                : { background: "#fff7ed", color: "#c2410c", borderColor: "#fed7aa" }
            }
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: attentionOnly ? "#dc2626" : "#f97316" }}
            />
            관심 필요
            <span
              className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              style={
                attentionOnly
                  ? { background: "#dc2626", color: "white" }
                  : { background: "#f97316", color: "white" }
              }
            >
              {attentionCount}
            </span>
            {attentionOnly && (
              <span className="ml-0.5 text-[10px] text-red-400 font-medium hidden sm:inline">필터 중</span>
            )}
          </button>

          {/* Stats dropdown */}
          <div className="relative" ref={statsRef}>
            <button
              onClick={() => setStatsOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all border"
              style={
                statsOpen
                  ? { background: "#026eff", color: "white", borderColor: "#026eff" }
                  : { background: "white", color: "#374151", borderColor: "#e5e7eb" }
              }
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <i className="ri-bar-chart-2-line text-xs" />
              </div>
              통계
              <div className="w-3 h-3 flex items-center justify-center">
                <i className={`ri-arrow-${statsOpen ? "up" : "down"}-s-line text-xs`} />
              </div>
            </button>

            {statsOpen && (
              <StatsDropdown onClose={() => setStatsOpen(false)} />
            )}
          </div>

          {/* Total count badge */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
            <i className="ri-group-line text-[11px] text-gray-400" />
            <span className="text-[11px] font-semibold text-gray-600">
              {displayed.length}<span className="text-gray-400 font-normal"> / {mockStudents.length}명</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex-shrink-0 px-4 sm:px-5 py-2.5 border-b border-gray-100 bg-white">
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all"
          style={{
            background: isSearching ? "#eff6ff" : "#f9fafb",
            border: `1px solid ${isSearching ? "#bfdbfe" : "#e5e7eb"}`,
          }}
        >
          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            <i className="ri-search-line text-sm" style={{ color: isSearching ? "#026eff" : "#9ca3af" }} />
          </div>
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="이용인 이름으로 검색"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          {isSearching && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-semibold text-[#026eff]">{displayed.length}명</span>
              <button
                onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer transition-colors"
              >
                <i className="ri-close-line text-white text-[10px]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards grid area */}
      <div className="flex-1 overflow-y-auto">
        {displayed.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div
                className="w-12 h-12 flex items-center justify-center mx-auto mb-3 rounded-2xl"
                style={{ background: isSearching ? "#eff6ff" : "#f0fdf4" }}
              >
                <i className={`text-xl ${isSearching ? "ri-search-line text-[#026eff]" : "ri-check-double-line text-[#10b981]"}`} />
              </div>
              <p className="text-gray-500 text-sm font-medium">
                {isSearching ? `"${search.trim()}" 검색 결과가 없어요` : "관심 필요 이용인이 없어요"}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {isSearching ? "다른 이름으로 다시 검색해 보세요" : "모든 이용인 상태가 양호합니다"}
              </p>
              {isSearching && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium text-[#026eff] bg-blue-50 cursor-pointer whitespace-nowrap hover:bg-blue-100 transition-colors"
                >
                  검색 초기화
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 sm:p-5">
            {displayed.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

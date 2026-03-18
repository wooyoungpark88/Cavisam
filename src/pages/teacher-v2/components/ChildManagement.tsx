import { useState, useRef, useEffect } from "react";
import StudentCard from "./StudentCard";
import StatsDropdown from "./StatsDropdown";
import { mockStudents, mockDailyStatsSummary } from "../../../mocks/teacherDashboard";

export default function ChildManagement() {
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white gap-4">
        {/* Left: date */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-calendar-2-line text-[#026eff] text-sm" />
          </div>
          <span className="text-gray-700 text-sm font-semibold">2026년 3월 18일 수요일</span>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
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
              <span className="ml-0.5 text-[10px] text-red-400 font-medium">필터 중</span>
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
              {displayed.length}<span className="text-gray-400 font-normal"> / {mockDailyStatsSummary.total}명</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex-shrink-0 px-5 py-2.5 border-b border-gray-100 bg-white">
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
          <div className="grid gap-3 p-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {displayed.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

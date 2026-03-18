import { useState } from "react";
import { type StudentDailyReport, type ConditionLevel, type MealLevel, type SleepLevel } from "../../../mocks/teacherDashboard";
import { mockAiCareReports } from "../../../mocks/aiCareAnalysis";
import AICareModal from "./AICareModal";

function conditionStyle(level: ConditionLevel): { color: string; bg: string; label: string } {
  switch (level) {
    case "매우좋음": return { color: "#059669", bg: "#f0fdf4", label: "매우좋음" };
    case "좋음":     return { color: "#10b981", bg: "#f0fdf4", label: "좋음" };
    case "보통":     return { color: "#6b7280", bg: "#f9fafb", label: "보통" };
    case "나쁨":     return { color: "#d97706", bg: "#fffbeb", label: "나쁨" };
    case "매우나쁨": return { color: "#ef4444", bg: "#fef2f2", label: "매우나쁨" };
  }
}

function mealStyle(level: MealLevel): { color: string; label: string } {
  switch (level) {
    case "완식":     return { color: "#059669", label: "완식" };
    case "평소처럼": return { color: "#10b981", label: "평소처럼" };
    case "보통":     return { color: "#6b7280", label: "보통" };
    case "조금":     return { color: "#d97706", label: "조금" };
    case "안먹음":   return { color: "#ef4444", label: "안 먹음" };
  }
}

function sleepEmoji(level: SleepLevel): string {
  switch (level) {
    case "충분": return "🌙";
    case "보통": return "😴";
    case "부족": return "😵";
  }
}

interface StudentCardProps {
  student: StudentDailyReport;
}

export default function StudentCard({ student }: StudentCardProps) {
  const [showAI, setShowAI] = useState(false);
  const condStyle = conditionStyle(student.condition);
  const mlStyle = mealStyle(student.meal);
  const aiReport = mockAiCareReports.find((r) => r.studentId === student.id);

  const hasNote = student.note && student.note !== "-";
  const hasMed  = student.medication && student.medication !== "-";

  return (
    <>
      <div
        className="flex flex-col rounded-xl border bg-white overflow-hidden"
        style={{
          borderColor: student.needsAttention ? "rgba(239,68,68,0.28)" : "#e5e7eb",
        }}
      >
        {/* ── Header row ── */}
        <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ background: student.avatarColor }}
          >
            {student.initial}
          </div>
          <p className="text-gray-900 text-sm font-bold flex-1 leading-none">{student.name}</p>
          {student.needsAttention ? (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
            >
              관심필요
            </span>
          ) : (
            <span className="text-[9px] text-gray-300 whitespace-nowrap flex-shrink-0">
              {student.reportDate.replace("2026년 ", "").replace("일", "")}
            </span>
          )}
        </div>

        {/* ── Compact stats grid ── */}
        <div className="grid grid-cols-4 gap-px mx-3.5 mb-2.5 rounded-lg overflow-hidden border border-gray-100">
          {[
            { emoji: sleepEmoji(student.sleepLevel), label: "수면", value: student.sleep.replace("시간", "h") },
            { emoji: "😊", label: "컨디션", value: condStyle.label, color: condStyle.color },
            { emoji: "🍱", label: "식사", value: mlStyle.label, color: mlStyle.color },
            {
              emoji: "🚽", label: "배변", value: student.bowel,
              color: student.bowel === "없음" ? "#d97706" : undefined,
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center py-2 px-1 bg-gray-50 gap-0.5">
              <span className="text-xs leading-none">{item.emoji}</span>
              <span className="text-[9px] text-gray-400 leading-none">{item.label}</span>
              <span
                className="text-[10px] font-bold leading-none text-center"
                style={{ color: item.color ?? "#374151" }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Note ── */}
        {(hasNote || hasMed) && (
          <div className="mx-3.5 mb-2.5 space-y-1">
            {hasNote && (
              <div
                className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{
                  background: student.needsAttention ? "rgba(239,68,68,0.06)" : "#f9fafb",
                  borderLeft: `2px solid ${student.needsAttention ? "#ef4444" : "#e5e7eb"}`,
                }}
              >
                <i
                  className="ri-information-line text-[10px] mt-0.5 flex-shrink-0"
                  style={{ color: student.needsAttention ? "#ef4444" : "#9ca3af" }}
                />
                <p
                  className="text-[10px] leading-snug line-clamp-1"
                  style={{ color: student.needsAttention ? "#dc2626" : "#6b7280" }}
                >
                  {student.note}
                </p>
              </div>
            )}
            {hasMed && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50">
                <span className="text-[10px] leading-none">💊</span>
                <p className="text-[10px] text-purple-700 leading-none truncate">{student.medication}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="flex gap-1.5 px-3.5 pb-3 mt-auto">
          <button
            onClick={() => aiReport && setShowAI(true)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold text-white cursor-pointer whitespace-nowrap transition-opacity hover:opacity-85"
            style={{ background: "#026eff" }}
          >
            <i className="ri-sparkling-2-line text-[10px]" />
            AI 케어
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold text-gray-600 bg-gray-100 cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-200"
          >
            <i className="ri-chat-3-line text-[10px]" />
            케어톡
          </button>
        </div>
      </div>

      {showAI && aiReport && (
        <AICareModal
          student={student}
          report={aiReport}
          onClose={() => setShowAI(false)}
        />
      )}
    </>
  );
}

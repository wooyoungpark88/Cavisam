import { useState, useEffect } from "react";
import {
  mockDailyStatus,
  mockTimelineEntries,
  mockAIWeeklyInsights,
  mockCareTeam,
} from "../../../mocks/parentDashboard";
import { mockSentReports } from "../../../mocks/teacherReports";
import ReportDetailPanel, { type ReportDetail } from "./ReportDetailPanel";
import MorningReportForm from "./MorningReportForm";

interface TimelineEntry {
  id: number;
  time: string;
  period: string;
  type: string;
  actor: string;
  actorInitial: string;
  actorColor: string;
  content: string;
  hasPhoto: boolean;
  photoUrl: string;
  aiSummary: string;
  teacherConfirmed: string;
  aiInsight: string;
  reportType?: string;
  reportTypeColor?: string;
  reportTypeIcon?: string;
  isConfirmed?: boolean;
}

/** Parse "HH:MM" → total minutes for sorting */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Convert teacher sent reports for 김지우 (studentId 6) into TimelineEntry format */
const reportTimeMap: Record<number, { time: string; period: string }> = {
  7: { time: "10:30", period: "am" },
  8: { time: "13:15", period: "pm" },
  9: { time: "14:20", period: "pm" },
  10: { time: "11:40", period: "am" },
};

const teacherReportEntries: TimelineEntry[] = mockSentReports
  .filter((r) => r.studentId === 6)
  .map((r) => ({
    id: 200 + r.id,
    time: reportTimeMap[r.id]?.time ?? "12:00",
    period: reportTimeMap[r.id]?.period ?? "pm",
    type: "report",
    actor: "박지영 선생님",
    actorInitial: "박",
    actorColor: "#10b981",
    content: r.content,
    hasPhoto: false,
    photoUrl: "",
    aiSummary: "",
    teacherConfirmed: "",
    aiInsight: "",
    reportType: r.type,
    reportTypeColor: r.typeColor,
    reportTypeIcon: r.typeIcon,
    isConfirmed: r.confirmed,
  }));

function getSortedEntries(period: string): TimelineEntry[] {
  const base = mockTimelineEntries.filter((e) => e.period === period) as TimelineEntry[];
  const reports = teacherReportEntries.filter((e) => e.period === period);
  return [...base, ...reports].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}

/* ─── Sub-components ─────────────────────────────────────── */

function StatusCards({ visible }: { visible: boolean }) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        maxHeight: visible ? "120px" : "0px",
        overflow: "hidden",
        marginBottom: visible ? undefined : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {mockDailyStatus.map((s) => (
        <div
          key={s.key}
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: s.bg }}
        >
          <span className="text-xl leading-none">{s.emoji}</span>
          <div>
            <p className="text-sm font-bold leading-tight" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Morning Report Modal ──────────────────────────────── */

function MorningFormModal({
  onClose,
  onSent,
}: {
  onClose: () => void;
  onSent: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay to trigger CSS transition
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSent = () => {
    setVisible(false);
    setTimeout(() => {
      onSent();
      onClose();
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.38)",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Slide-up panel */}
      <div
        className="fixed left-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          maxHeight: "92vh",
          borderRadius: "24px 24px 0 0",
          background: "#f7f9fc",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.32,0,0.67,0)",
          boxShadow: "0 -12px 48px rgba(0,0,0,0.14)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(251,146,60,0.12)" }}
            >
              <i className="ri-sun-line text-base" style={{ color: "#f97316" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">오늘 등원 전 한마디</p>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                박지영 선생님께 전달돼요
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
          >
            <i className="ri-close-line text-gray-400 text-lg" />
          </button>
        </div>

        {/* Form — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <MorningReportForm onSent={handleSent} />
        </div>
      </div>
    </>
  );
}

/* ─── Morning Report Banner ─────────────────────────────── */

function MorningReportBanner({
  isSent,
  onOpenForm,
}: {
  isSent: boolean;
  onOpenForm: () => void;
}) {
  if (isSent) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 transition-all"
        style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}
      >
        <div className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
          <i className="ri-checkbox-circle-fill text-[#10b981] text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#10b981] leading-tight">오늘 등원 전 한마디 완료</p>
          <p className="text-[11px] text-gray-400 mt-0.5">박지영 선생님께 전달됐어요</p>
        </div>
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
          style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
        >
          발송됨
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl mb-6 overflow-hidden"
      style={{
        border: "2px solid #fb923c",
        background: "linear-gradient(135deg, #fff7ed 0%, #fff3e0 100%)",
        boxShadow: "0 0 0 4px rgba(251,146,60,0.12)",
        animation: "morning-pulse 2.4s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes morning-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(251,146,60,0.12); }
          50% { box-shadow: 0 0 0 8px rgba(251,146,60,0.22); }
        }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>

      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #fb923c, #f97316)" }} />

      <div className="px-5 py-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "rgba(251,146,60,0.15)" }}
          >
            <i className="ri-alarm-warning-fill text-xl" style={{ color: "#f97316" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <p className="text-sm font-bold text-gray-900 leading-tight">
                오늘 등원 전 한마디가 아직 전달되지 않았어요
              </p>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                style={{ background: "#fee2e2", color: "#ef4444" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#ef4444", animation: "dot-blink 1s ease-in-out infinite" }}
                />
                미발송
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              선생님이 오늘 자녀의 상태를 파악하려면 등원 전 한마디가 필요해요. 등원 전이나 오전 중에 꼭 보내주세요.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { icon: "ri-moon-line", label: "수면 상태" },
            { icon: "ri-heart-pulse-line", label: "컨디션" },
            { icon: "ri-restaurant-line", label: "아침 식사" },
            { icon: "ri-medicine-bottle-line", label: "약 복용" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(251,146,60,0.2)" }}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className={`${item.icon} text-sm`} style={{ color: "#f97316" }} />
              </div>
              <span className="text-[11px] font-semibold text-gray-600 whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onOpenForm}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer whitespace-nowrap hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", minWidth: 180 }}
          >
            <i className="ri-edit-2-line text-sm" />
            지금 등원 전 한마디 작성하기
          </button>
          <p className="text-[11px] text-gray-400 leading-tight">
            선생님은 등원 전 한마디를 확인 후<br className="hidden sm:block" />
            당일 수업 계획에 반영해요
          </p>
        </div>
      </div>
    </div>
  );
}

function ParentEntry({ entry, onClick }: { entry: TimelineEntry; onClick: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
      style={{
        background: "rgba(2,110,255,0.05)",
        border: "1px solid rgba(2,110,255,0.12)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
          style={{ background: "#026eff" }}
        >
          {entry.actorInitial}
        </div>
        <span className="text-xs font-semibold text-gray-700 flex-1 truncate">{entry.actor}</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: "rgba(2,110,255,0.12)", color: "#026eff" }}
        >
          등원 전 한마디
        </span>
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-arrow-right-s-line text-gray-300 text-sm" />
        </div>
      </div>
      <div className="bg-white rounded-xl px-3 py-2.5 mb-2.5">
        <p className="text-[10px] font-semibold text-gray-400 mb-1">AI 요약</p>
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{entry.aiSummary}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-checkbox-circle-fill text-[#10b981] text-xs" />
        </div>
        <span className="text-[11px] text-gray-500 flex-1 truncate">{entry.teacherConfirmed}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmed(true); }}
          className="text-[10px] border px-2.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          style={{
            color: confirmed ? "#10b981" : "#9ca3af",
            borderColor: confirmed ? "#10b981" : "#e5e7eb",
            background: confirmed ? "rgba(16,185,129,0.06)" : "white",
          }}
        >
          {confirmed ? "확인됨" : "확인"}
        </button>
      </div>
    </div>
  );
}

function TeacherEntry({ entry, onClick }: { entry: TimelineEntry; onClick: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer transition-all hover:scale-[1.01]"
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
          style={{ background: entry.actorColor }}
        >
          {entry.actorInitial}
        </div>
        <span className="text-xs font-semibold text-gray-700 flex-1">{entry.actor}</span>
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-arrow-right-s-line text-gray-300 text-sm" />
        </div>
      </div>
      <p className="text-xs text-gray-700 leading-relaxed mb-2.5 line-clamp-2">{entry.content}</p>
      {entry.hasPhoto && entry.photoUrl && (
        <div className="w-full h-28 rounded-xl overflow-hidden mb-2.5 bg-gray-100">
          <img
            src={entry.photoUrl}
            alt="활동 사진"
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}
      <div className="flex items-center gap-1">
        <span className="text-sm leading-none">❤️</span>
        <span className="text-sm leading-none ml-0.5">👍</span>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmed(true); }}
          className="ml-auto text-[10px] border px-2.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          style={{
            color: confirmed ? "#10b981" : "#9ca3af",
            borderColor: confirmed ? "#10b981" : "#e5e7eb",
            background: confirmed ? "rgba(16,185,129,0.06)" : "white",
          }}
        >
          {confirmed ? "확인됨" : "확인"}
        </button>
      </div>
    </div>
  );
}

function ReportEntry({ entry, onClick }: { entry: TimelineEntry; onClick: () => void }) {
  const [confirmed, setConfirmed] = useState(entry.isConfirmed ?? false);
  const badgeBg = entry.reportTypeColor ? `${entry.reportTypeColor}18` : "#f3f4f6";

  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-4 bg-white cursor-pointer transition-all hover:scale-[1.01]"
      style={{ border: `1.5px solid ${entry.reportTypeColor ?? "#e5e7eb"}30` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
          style={{ background: entry.actorColor }}
        >
          {entry.actorInitial}
        </div>
        <span className="text-xs font-semibold text-gray-700 flex-1 truncate">{entry.actor}</span>
        {/* Type badge */}
        <span
          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: badgeBg, color: entry.reportTypeColor ?? "#6b7280" }}
        >
          {entry.reportTypeIcon && <i className={`${entry.reportTypeIcon} text-[11px]`} />}
          {entry.reportType}
        </span>
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-arrow-right-s-line text-gray-300 text-sm" />
        </div>
      </div>

      {/* Content preview */}
      <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-2">{entry.content}</p>

      {/* Reactions + confirm */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-sm leading-none cursor-pointer hover:scale-110 transition-transform"
        >❤️</button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-sm leading-none cursor-pointer hover:scale-110 transition-transform"
        >👍</button>
        <div className="flex-1" />
        {confirmed ? (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg"
            style={{ color: "#10b981", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <i className="ri-checkbox-circle-fill text-[11px]" />
            확인됨
          </span>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmed(true); }}
            className="text-[10px] border px-2.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
            style={{ color: "#9ca3af", borderColor: "#e5e7eb", background: "white" }}
          >
            확인
          </button>
        )}
      </div>
    </div>
  );
}

function AIEntry({ entry, onClick }: { entry: TimelineEntry; onClick: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
      style={{
        background: "rgba(245,158,11,0.06)",
        border: "1px solid rgba(245,158,11,0.2)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <i className="ri-alert-line text-[#f59e0b] text-sm" />
        </div>
        <span className="text-xs font-bold text-gray-800 flex-1">{entry.actor}</span>
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-arrow-right-s-line text-gray-300 text-sm" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmed(true); }}
          className="text-[10px] border px-2.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          style={{
            color: confirmed ? "#10b981" : "#9ca3af",
            borderColor: confirmed ? "#10b981" : "#e5e7eb",
            background: "white",
          }}
        >
          {confirmed ? "확인됨" : "확인"}
        </button>
      </div>
      <p
        className="text-xs font-semibold text-gray-800 leading-relaxed px-3 py-2 rounded-lg mb-2.5 line-clamp-2"
        style={{ background: "rgba(245,158,11,0.12)" }}
      >
        {entry.content}
      </p>
      <div className="bg-white rounded-xl px-3 py-2.5">
        <p className="text-[10px] font-semibold text-gray-400 mb-1">AI Insight</p>
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{entry.aiInsight}</p>
      </div>
    </div>
  );
}

function EntryRenderer({
  entry,
  onSelect,
}: {
  entry: TimelineEntry;
  onSelect: (e: TimelineEntry) => void;
}) {
  const handleClick = () => onSelect(entry);
  if (entry.type === "parent") return <ParentEntry entry={entry} onClick={handleClick} />;
  if (entry.type === "report") return <ReportEntry entry={entry} onClick={handleClick} />;
  if (entry.type === "teacher") return <TeacherEntry entry={entry} onClick={handleClick} />;
  if (entry.type === "ai") return <AIEntry entry={entry} onClick={handleClick} />;
  return null;
}

function TimelineColumn({
  entries,
  onSelect,
}: {
  entries: TimelineEntry[];
  onSelect: (e: TimelineEntry) => void;
}) {
  const getTypeColor = (type: string, reportTypeColor?: string) => {
    if (type === "parent") return "#026eff";
    if (type === "report") return reportTypeColor ?? "#10b981";
    if (type === "teacher") return "#10b981";
    if (type === "ai") return "#f59e0b";
    return "#9ca3af";
  };

  return (
    <div className="relative">
      {/* Vertical connector line */}
      {entries.length > 1 && (
        <div
          className="absolute left-[8px] top-[20px] bottom-10 w-px"
          style={{
            background:
              "linear-gradient(to bottom, #d1d5db 0%, #d1d5db 75%, transparent 100%)",
          }}
        />
      )}
      <div className="space-y-5">
        {entries.map((entry) => {
          const dotColor = getTypeColor(entry.type, entry.reportTypeColor);
          return (
            <div key={entry.id} className="relative pl-[26px]">
              {/* Timeline dot */}
              <div className="absolute left-0 top-[3px] w-[18px] h-[18px] flex items-center justify-center">
                <div
                  className="w-[10px] h-[10px] rounded-full border-[2px] border-white flex-shrink-0"
                  style={{
                    background: dotColor,
                    boxShadow: `0 0 0 2.5px ${dotColor}28`,
                  }}
                />
              </div>
              <p className="text-[11px] font-bold text-gray-400 mb-1.5 tracking-wide leading-none">
                {entry.time}
              </p>
              <EntryRenderer entry={entry} onSelect={onSelect} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AISidebar({ onMemberMessage }: { onMemberMessage?: (id: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h3 className="text-xs font-bold text-gray-800 mb-3">AI 주간 인사이트</h3>
        <div className="space-y-3.5">
          {mockAIWeeklyInsights.map((insight, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-gray-600">{insight.label}</span>
                <span className="text-xs font-bold" style={{ color: insight.color }}>
                  {insight.badge}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${insight.progress}%`, background: insight.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-800">돌봄 팀</h3>
          <span className="text-[10px] text-gray-400 font-medium">클릭 시 대화</span>
        </div>
        <div className="space-y-1">
          {mockCareTeam.slice(0, 3).map((member) => (
            <button
              key={member.id}
              onClick={() => onMemberMessage?.(member.id)}
              className="group w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-left -mx-2"
              style={{ width: "calc(100% + 16px)" }}
            >
              {/* Avatar with online dot for main teacher */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: member.color }}
                >
                  {member.initial}
                </div>
                {member.id === 1 && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-[1.5px] border-white" />
                )}
              </div>

              {/* Name / role */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-800 leading-tight truncate">
                  {member.name}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">{member.role}</p>
              </div>

              {/* Chat icon — appears on hover */}
              <div
                className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                style={{ background: `${member.color}18` }}
              >
                <i
                  className="ri-chat-1-line text-[11px]"
                  style={{ color: member.color }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeTimeline({ onMemberMessage }: { onMemberMessage?: (id: number) => void }) {
  const amEntries = getSortedEntries("am");
  const pmEntries = getSortedEntries("pm");
  const reportCount = teacherReportEntries.length;

  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);
  const [morningReportSent, setMorningReportSent] = useState(false);
  const [showMorningModal, setShowMorningModal] = useState(false);
  const [statusCardsVisible, setStatusCardsVisible] = useState(false);

  // 발송 완료 후 약간의 딜레이를 두고 StatusCards를 부드럽게 나타냄
  const handleMorningReportSent = () => {
    setMorningReportSent(true);
    setTimeout(() => setStatusCardsVisible(true), 150);
  };

  const toDetail = (entry: TimelineEntry): ReportDetail => ({
    id: entry.id,
    time: entry.time,
    type: entry.type,
    typeName: entry.reportType,
    typeColor: entry.reportTypeColor,
    typeIcon: entry.reportTypeIcon,
    actor: entry.actor,
    actorInitial: entry.actorInitial,
    actorColor: entry.actorColor,
    content: entry.content,
    hasPhoto: entry.hasPhoto,
    photoUrl: entry.photoUrl,
    aiSummary: entry.aiSummary,
    aiInsight: entry.aiInsight,
    teacherConfirmed: entry.teacherConfirmed,
    isConfirmed: entry.isConfirmed,
    sentAt: entry.time,
  });

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">홈 타임라인</h1>
          {reportCount > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
            >
              <i className="ri-mail-send-line text-[12px]" />
              선생님 보고 {reportCount}건
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-calendar-line text-xs" />
          </div>
          <span>2026년 3월 17일 (화)</span>
        </div>
      </div>

      {/* Morning report banner — 미발송이면 크게, 발송 완료면 컴팩트하게 */}
      <MorningReportBanner
        isSent={morningReportSent}
        onOpenForm={() => setShowMorningModal(true)}
      />

      {/* Status cards — 발송 완료 후에만 표시 */}
      <StatusCards visible={statusCardsVisible} />

      {/* Legend */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <span className="text-[11px] text-gray-400 font-medium">항목 유형</span>
        {[
          { color: "#026eff", label: "등원 전 한마디 (보호자)" },
          { color: "#10b981", label: "선생님 메시지" },
          { color: "#f59e0b", label: "AI 감지" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span className="w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-r from-[#10b981] to-[#06b6d4]" />
          선생님 보고서
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400 ml-auto">
          <i className="ri-cursor-line text-[11px]" />
          항목 클릭 시 상세 보기
        </span>
      </div>

      {/* Main layout */}
      <div className="flex gap-4 xl:gap-5 items-stretch">
        {/* Primary panel: Timeline */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Primary label bar */}
          <div
            className="flex items-center gap-2.5 px-4 xl:px-5 py-3 border-b border-gray-50"
            style={{ background: "rgba(255,255,255,0.9)" }}
          >
            <div className="w-1 h-[15px] rounded-full flex-shrink-0" style={{ background: "#1f2937" }} />
            <span className="text-xs font-bold text-gray-900">일일 기록</span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(31,41,55,0.07)", color: "#6b7280" }}
            >
              메인
            </span>
          </div>
          <div className="p-4 xl:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">오전</p>
                <TimelineColumn entries={amEntries} onSelect={setSelectedEntry} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">오후</p>
                <TimelineColumn entries={pmEntries} onSelect={setSelectedEntry} />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary panel: AI Insights + Care Team */}
        <div
          className="hidden xl:flex flex-col w-52 flex-shrink-0 rounded-2xl border border-gray-100 overflow-hidden"
          style={{ background: "#f8fafc" }}
        >
          {/* Secondary label bar */}
          <div
            className="flex items-center gap-2.5 px-4 py-3 border-b flex-shrink-0"
            style={{ borderColor: "#e9eef4", background: "rgba(248,250,252,0.9)" }}
          >
            <div className="w-1 h-[15px] rounded-full flex-shrink-0 bg-gray-300" />
            <span className="text-xs font-semibold text-gray-400">보조 정보</span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-auto"
              style={{ background: "rgba(156,163,175,0.12)", color: "#9ca3af" }}
            >
              참고
            </span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <AISidebar onMemberMessage={onMemberMessage} />
          </div>
        </div>
      </div>

      <div className="xl:hidden mt-6">
        <AISidebar onMemberMessage={onMemberMessage} />
      </div>

      {/* Detail panel */}
      <ReportDetailPanel
        report={selectedEntry ? toDetail(selectedEntry) : null}
        onClose={() => setSelectedEntry(null)}
      />

      {/* Morning report modal */}
      {showMorningModal && (
        <MorningFormModal
          onClose={() => setShowMorningModal(false)}
          onSent={() => {
            handleMorningReportSent();
            setShowMorningModal(false);
          }}
        />
      )}
    </div>
  );
}

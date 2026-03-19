import { useState, useEffect, useMemo } from "react";
import { useParentData } from "../../../contexts/ParentDataContext";
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

/* ─── Sub-components ─────────────────────────────────────── */

function StatusCards({ visible, dailyStatus }: { visible: boolean; dailyStatus: { key: string; label: string; value: string; emoji: string; bg: string; color: string }[] }) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        maxHeight: visible ? "120px" : "0px",
        overflow: "hidden",
        marginBottom: visible ? undefined : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {dailyStatus.map((s) => (
        <div
          key={s.key}
          className="rounded-xl px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3"
          style={{ background: s.bg }}
        >
          <span className="text-lg sm:text-xl leading-none">{s.emoji}</span>
          <div>
            <p className="text-xs sm:text-sm font-bold leading-tight" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-[12px] sm:text-[12.5px] text-gray-400 leading-tight mt-0.5">{s.label}</p>
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
              <p className="text-[12.5px] text-gray-400 leading-tight mt-0.5">
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
        className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 transition-all"
        style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}
      >
        <div className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
          <i className="ri-checkbox-circle-fill text-[#10b981] text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-[#10b981] leading-tight">오늘 등원 전 한마디 완료</p>
          <p className="text-[12.5px] text-gray-400 mt-0.5">박지영 선생님께 전달됐어요</p>
        </div>
        <span
          className="text-[12.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
          style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
        >
          발송됨
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl sm:rounded-2xl mb-4 sm:mb-6 overflow-hidden"
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

      <div className="px-3 py-3 sm:px-5 sm:py-4">
        {/* Header row */}
        <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "rgba(251,146,60,0.15)" }}
          >
            <i className="ri-alarm-warning-fill text-lg sm:text-xl" style={{ color: "#f97316" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 flex-wrap">
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                오늘 등원 전 한마디가 아직 전달되지 않았어요
              </p>
              <span
                className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                style={{ background: "#fee2e2", color: "#ef4444" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#ef4444", animation: "dot-blink 1s ease-in-out infinite" }}
                />
                미발송
              </span>
            </div>
            <p className="text-[12.5px] text-gray-500 leading-relaxed hidden sm:block">
              선생님이 오늘 자녀의 상태를 파악하려면 등원 전 한마디가 필요해요. 등원 전이나 오전 중에 꼭 보내주세요.
            </p>
            <p className="text-[12.5px] text-gray-500 leading-relaxed sm:hidden">
              선생님이 오늘 수업 계획에 반영할 수 있도록 보내주세요.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {[
            { icon: "ri-moon-line", label: "수면 상태" },
            { icon: "ri-heart-pulse-line", label: "컨디션" },
            { icon: "ri-restaurant-line", label: "아침 식사" },
            { icon: "ri-medicine-bottle-line", label: "약 복용" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl"
              style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(251,146,60,0.2)" }}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                <i className={`${item.icon} text-xs sm:text-sm`} style={{ color: "#f97316" }} />
              </div>
              <span className="text-[12px] sm:text-[12.5px] font-semibold text-gray-600 whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={onOpenForm}
            className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-white transition-all cursor-pointer whitespace-nowrap hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}
          >
            <i className="ri-edit-2-line text-xs sm:text-sm" />
            <span className="hidden sm:inline">지금 등원 전 한마디 작성하기</span>
            <span className="sm:hidden">등원 전 한마디 작성하기</span>
          </button>
          <p className="text-[12.5px] text-gray-400 leading-tight hidden sm:block">
            선생님은 등원 전 한마디를 확인 후<br />
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
      className="rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer transition-all active:scale-[0.99]"
      style={{
        background: "rgba(2,110,255,0.05)",
        border: "1px solid rgba(2,110,255,0.12)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: "#026eff" }}
        >
          {entry.actorInitial}
        </div>
        <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{entry.actor}</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: "rgba(2,110,255,0.12)", color: "#026eff" }}
        >
          등원 전 한마디
        </span>
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-arrow-right-s-line text-gray-300 text-sm" />
        </div>
      </div>
      <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-3.5 py-2.5 sm:py-3 mb-2.5 sm:mb-3" style={{ borderLeft: "3px solid #026eff" }}>
        <p className="text-xs font-semibold text-gray-400 mb-1.5">AI 요약</p>
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{entry.aiSummary}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-checkbox-circle-fill text-[#10b981] text-sm" />
        </div>
        <span className="text-xs text-gray-500 flex-1 truncate">{entry.teacherConfirmed}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmed(true); }}
          className="text-xs font-medium border px-2.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          style={{
            color: confirmed ? "#10b981" : "#6b7280",
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
      className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 cursor-pointer transition-all active:scale-[0.99]"
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: entry.actorColor }}
        >
          {entry.actorInitial}
        </div>
        <span className="text-sm font-semibold text-gray-800 flex-1">{entry.actor}</span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>선생님 메시지</span>
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-arrow-right-s-line text-gray-300 text-sm" />
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-2.5 sm:mb-3 line-clamp-2" style={{ borderLeft: "3px solid #10b981", paddingLeft: "10px" }}>{entry.content}</p>
      {entry.hasPhoto && entry.photoUrl && (
        <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden mb-2 sm:mb-2.5 bg-gray-100">
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
          className="ml-auto text-xs font-medium border px-2.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          style={{
            color: confirmed ? "#10b981" : "#6b7280",
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
      className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-white cursor-pointer transition-all active:scale-[0.99]"
      style={{ border: `1.5px solid ${entry.reportTypeColor ?? "#e5e7eb"}30` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: entry.actorColor }}
        >
          {entry.actorInitial}
        </div>
        <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{entry.actor}</span>
        {/* Type badge */}
        <span
          className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: badgeBg, color: entry.reportTypeColor ?? "#6b7280" }}
        >
          {entry.reportTypeIcon && <i className={`${entry.reportTypeIcon} text-xs`} />}
          {entry.reportType}
        </span>
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-arrow-right-s-line text-gray-300 text-sm" />
        </div>
      </div>

      {/* Content preview */}
      <p className="text-sm text-gray-700 leading-relaxed mb-2.5 sm:mb-3 line-clamp-2">{entry.content}</p>

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
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ color: "#10b981", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <i className="ri-checkbox-circle-fill text-xs" />
            확인됨
          </span>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmed(true); }}
            className="text-xs font-medium border px-2.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
            style={{ color: "#6b7280", borderColor: "#e5e7eb", background: "white" }}
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
      className="rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-pointer transition-all active:scale-[0.99]"
      style={{
        background: "rgba(245,158,11,0.06)",
        border: "1px solid rgba(245,158,11,0.2)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <i className="ri-alert-line text-[#f59e0b] text-base" />
        </div>
        <span className="text-sm font-bold text-gray-800 flex-1">{entry.actor}</span>
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-arrow-right-s-line text-gray-300 text-sm" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirmed(true); }}
          className="text-xs font-medium border px-2.5 py-1 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          style={{
            color: confirmed ? "#10b981" : "#6b7280",
            borderColor: confirmed ? "#10b981" : "#e5e7eb",
            background: "white",
          }}
        >
          {confirmed ? "확인됨" : "확인"}
        </button>
      </div>
      <p
        className="text-sm font-semibold text-gray-800 leading-relaxed px-3 py-2.5 rounded-lg mb-2.5 sm:mb-3 line-clamp-2"
        style={{ background: "rgba(245,158,11,0.12)", borderLeft: "3px solid #f59e0b" }}
      >
        {entry.content}
      </p>
      <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-3.5 py-2.5 sm:py-3">
        <p className="text-xs font-semibold text-gray-400 mb-1.5">AI Insight</p>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{entry.aiInsight}</p>
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
              <p className="text-xs font-bold text-gray-500 mb-1.5 tracking-wide leading-none">
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

function AISidebar({
  onMemberMessage,
  aiWeeklyInsights,
  careTeamDisplay,
}: {
  onMemberMessage?: (id: number) => void;
  aiWeeklyInsights: { label: string; badge: string; color: string; progress: number; subLabel: string }[];
  careTeamDisplay: { id: number; name: string; initial: string; role: string; department: string; color: string; contact: string[] }[];
}) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3">AI 주간 인사이트</h3>
        {aiWeeklyInsights.length === 0 ? (
          <p className="text-xs text-gray-400">아직 분석할 데이터가 없어요</p>
        ) : (
          <div className="space-y-3.5">
            {aiWeeklyInsights.map((insight, i) => (
              <div key={i}>
                {/* 라벨 + 변화율 배지 */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-700">{insight.label}</span>
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap"
                    style={{ background: `${insight.color}15`, color: insight.color }}
                  >
                    {insight.badge}
                  </span>
                </div>
                {/* 진행 막대 */}
                <div className="w-full h-1.5 rounded-full bg-gray-100 mb-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${insight.progress}%`, background: insight.color }}
                  />
                </div>
                {/* 막대 의미 설명 */}
                <p className="text-xs text-gray-400 leading-relaxed">{insight.subLabel}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800">돌봄 팀</h3>
          <span className="text-xs text-gray-400 font-medium">클릭 시 대화</span>
        </div>
        {careTeamDisplay.length === 0 ? (
          <p className="text-xs text-gray-400">돌봄 팀 정보가 없어요</p>
        ) : (
          <div className="flex gap-2 sm:block sm:space-y-1 overflow-x-auto pb-1 sm:pb-0">
            {careTeamDisplay.slice(0, 3).map((member) => (
              <button
                key={member.id}
                onClick={() => onMemberMessage?.(member.id)}
                className="group flex-shrink-0 sm:flex-shrink flex items-center gap-2 sm:gap-2.5 px-3 py-2.5 sm:px-2 sm:py-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-left sm:-mx-2 flex-col sm:flex-row min-w-[72px] sm:min-w-0 sm:w-[calc(100%+16px)]"
                style={{}}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: member.color }}
                  >
                    {member.initial}
                  </div>
                  {member.id === 1 && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-[1.5px] border-white" />
                  )}
                </div>
                {/* Name / role */}
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-400 leading-tight hidden sm:block">{member.role}</p>
                </div>
                {/* Chat icon */}
                <div
                  className="w-6 h-6 items-center justify-center rounded-full flex-shrink-0 hidden sm:flex opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: `${member.color}18` }}
                >
                  <i
                    className="ri-chat-1-line text-[12.5px]"
                    style={{ color: member.color }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomeTimeline({ onMemberMessage }: { onMemberMessage?: (id: number) => void }) {
  const { todayRecord, messages, behaviorEvents, careTeam, morningReports, activeChild, loading } = useParentData();

  const todayStr = new Date().toISOString().slice(0, 10);

  const dailyStatus = todayRecord ? [
    { key: "condition", label: "컨디션", value: todayRecord.condition || "\u2014", emoji: "☀️", bg: "#f0fdf4", color: "#16a34a" },
    { key: "challenge", label: "도전행동", value: `${behaviorEvents.filter(e => e.occurred_at.startsWith(todayStr)).length}회`, emoji: "⚠️", bg: "#fffbeb", color: "#d97706" },
    { key: "meal", label: "식사", value: todayRecord.meal || "\u2014", emoji: "🍱", bg: "#eff6ff", color: "#2563eb" },
    { key: "medicine", label: "약", value: todayRecord.medication ? "완료" : "\u2014", emoji: "💊", bg: "#faf5ff", color: "#7c3aed" },
  ] : [];

  const timelineEntries = useMemo(() => {
    const entries: TimelineEntry[] = [];

    const todayReport = morningReports.find(r => r.created_at.startsWith(todayStr));
    if (todayReport) {
      entries.push({
        id: 1,
        time: new Date(todayReport.created_at).toTimeString().slice(0, 5),
        period: "am",
        type: "parent",
        actor: "보호자",
        actorInitial: "보",
        actorColor: "#026eff",
        aiSummary: `컨디션 ${({good:"좋음",normal:"보통",bad:"안좋음",very_bad:"매우나쁨"} as Record<string,string>)[todayReport.condition || ""] || "\u2014"}. 수면 ${todayReport.sleep_time || "\u2014"}. 식사 ${({good:"전부",normal:"대부분",none:"안먹음"} as Record<string,string>)[todayReport.meal || ""] || "\u2014"}.`,
        teacherConfirmed: "",
        content: todayReport.note || "",
        hasPhoto: false,
        photoUrl: "",
        aiInsight: "",
      });
    }

    messages.filter(m => m.created_at.startsWith(todayStr) && m.message_type === 'text').forEach((m, i) => {
      entries.push({
        id: 100 + i,
        time: new Date(m.created_at).toTimeString().slice(0, 5),
        period: parseInt(new Date(m.created_at).toTimeString().slice(0, 2)) < 12 ? "am" : "pm",
        type: m.sender_id !== activeChild?.parent_id ? "teacher" : "parent",
        actor: m.sender?.name || "선생님",
        actorInitial: (m.sender?.name || "?").charAt(0),
        actorColor: "#10b981",
        content: m.content,
        hasPhoto: false,
        photoUrl: "",
        aiSummary: "",
        teacherConfirmed: "",
        aiInsight: "",
      });
    });

    const reportEntries: TimelineEntry[] = messages
      .filter(m => m.message_type === 'daily_report' && m.created_at.startsWith(todayStr))
      .map((m, i) => ({
        id: 200 + i,
        time: new Date(m.created_at).toTimeString().slice(0, 5),
        period: parseInt(new Date(m.created_at).toTimeString().slice(0, 2)) < 12 ? "am" : "pm",
        type: "report" as string,
        actor: m.sender?.name || "선생님",
        actorInitial: (m.sender?.name || "?").charAt(0),
        actorColor: "#026eff",
        content: m.content,
        hasPhoto: false,
        photoUrl: "",
        aiSummary: "",
        teacherConfirmed: "",
        aiInsight: "",
        reportType: "행동기록",
        reportTypeColor: "#026eff",
        reportTypeIcon: "ri-file-list-3-line",
        isConfirmed: m.is_read,
      }));

    entries.push(...reportEntries);
    entries.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    return entries;
  }, [messages, morningReports, behaviorEvents, activeChild, todayStr]);

  const amEntries = timelineEntries.filter(e => e.period === "am");
  const pmEntries = timelineEntries.filter(e => e.period === "pm");
  const reportCount = timelineEntries.filter(e => e.type === "report").length;

  const aiWeeklyInsights = useMemo(() => {
    if (behaviorEvents.length === 0) return [];
    const thisWeek = behaviorEvents.filter(e => {
      const d = new Date(e.occurred_at);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length;
    const lastWeek = behaviorEvents.filter(e => {
      const d = new Date(e.occurred_at);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 7 && diff <= 14;
    }).length;
    const change = lastWeek > 0 ? Math.round((thisWeek - lastWeek) / lastWeek * 100) : 0;
    return [
      {
        label: "도전행동",
        badge: change <= 0 ? `\u2193 ${Math.abs(change)}%` : `\u2191 ${change}%`,
        color: change <= 0 ? "#10b981" : "#ef4444",
        progress: Math.max(0, 100 - thisWeek * 5),
        subLabel: `전주 대비 ${Math.abs(change)}% ${change <= 0 ? "감소" : "증가"} \u00b7 이번 주 ${thisWeek}건`,
      },
    ];
  }, [behaviorEvents]);

  const careTeamDisplay = useMemo(() => {
    return careTeam.map((ct, i) => ({
      id: i + 1,
      name: ct.member?.name || "팀원",
      initial: (ct.member?.name || "?").charAt(0),
      role: ct.role === 'lead' ? '담당 교사' : ct.role === 'support' ? '보조 교사' : '관찰자',
      department: "",
      color: ["#026eff", "#10b981", "#f59e0b", "#8b5cf6"][i % 4],
      contact: [] as string[],
    }));
  }, [careTeam]);

  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);
  const [morningReportSent, setMorningReportSent] = useState(false);
  const [showMorningModal, setShowMorningModal] = useState(false);
  const [statusCardsVisible, setStatusCardsVisible] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#026eff] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">타임라인을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const dateObj = new Date();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dateLabel = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${dayNames[dateObj.getDay()]})`;
  const dateLabelShort = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${dayNames[dateObj.getDay()]})`;

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-base sm:text-lg font-bold text-gray-900">타임라인</h1>
          {reportCount > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold px-2 sm:px-2.5 py-1 rounded-full"
              style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
            >
              <i className="ri-mail-send-line text-[12px]" />
              보고 {reportCount}건
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-400">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-calendar-line text-xs" />
          </div>
          <span className="hidden sm:inline">{dateLabel}</span>
          <span className="sm:hidden">{dateLabelShort}</span>
        </div>
      </div>

      {/* Morning report banner */}
      <MorningReportBanner
        isSent={morningReportSent}
        onOpenForm={() => setShowMorningModal(true)}
      />

      {/* Status cards */}
      <StatusCards visible={statusCardsVisible} dailyStatus={dailyStatus} />

      {/* Legend — scrollable on mobile */}
      <div className="mb-4 sm:mb-5">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-[12.5px] text-gray-400 font-medium whitespace-nowrap flex-shrink-0">항목 유형</span>
          {[
            { color: "#026eff", label: "등원 전 한마디" },
            { color: "#10b981", label: "선생님 메시지" },
            { color: "#f59e0b", label: "AI 감지" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5 text-[12.5px] text-gray-500 whitespace-nowrap flex-shrink-0">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 text-[12.5px] text-gray-500 whitespace-nowrap flex-shrink-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-r from-[#10b981] to-[#06b6d4]" />
            선생님 보고서
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-[12.5px] text-gray-400 ml-auto flex-shrink-0">
            <i className="ri-cursor-line text-[12.5px]" />
            항목 클릭 시 상세 보기
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-3 xl:gap-5 items-stretch">
        {/* Primary panel: Timeline */}
        <div className="flex-1 min-w-0 bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden">
          {/* Primary label bar */}
          <div
            className="flex items-center gap-2.5 px-3 sm:px-4 xl:px-5 py-2.5 sm:py-3 border-b border-gray-50"
            style={{ background: "rgba(255,255,255,0.9)" }}
          >
            <div className="w-1 h-[15px] rounded-full flex-shrink-0" style={{ background: "#1f2937" }} />
            <span className="text-xs font-bold text-gray-900">일일 기록</span>
            <span
              className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(31,41,55,0.07)", color: "#6b7280" }}
            >
              메인
            </span>
          </div>
          <div className="p-3 sm:p-4 xl:p-5">
            {timelineEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <i className="ri-time-line text-gray-300 text-lg" />
                </div>
                <p className="text-sm text-gray-400">오늘의 기록이 아직 없어요</p>
                <p className="text-[12.5px] text-gray-300 mt-1">등원 전 한마디를 작성하면 타임라인이 시작돼요</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">오전</p>
                  <TimelineColumn entries={amEntries} onSelect={setSelectedEntry} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">오후</p>
                  <TimelineColumn entries={pmEntries} onSelect={setSelectedEntry} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Secondary panel: AI Insights + Care Team — xl only */}
        <div
          className="hidden xl:flex flex-col w-72 flex-shrink-0 rounded-2xl border border-gray-100 overflow-hidden"
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
              className="text-[12px] font-semibold px-2 py-0.5 rounded-full ml-auto"
              style={{ background: "rgba(156,163,175,0.12)", color: "#9ca3af" }}
            >
              참고
            </span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <AISidebar onMemberMessage={onMemberMessage} aiWeeklyInsights={aiWeeklyInsights} careTeamDisplay={careTeamDisplay} />
          </div>
        </div>
      </div>

      {/* AI Sidebar for mobile/tablet — collapsible */}
      <div className="xl:hidden mt-4 sm:mt-5">
        <button
          onClick={() => setAiSidebarOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-100 cursor-pointer mb-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-bar-chart-2-line text-sm text-gray-500" />
            </div>
            <span className="text-xs font-bold text-gray-700">AI 인사이트 &amp; 돌봄 팀</span>
          </div>
          <div className="w-5 h-5 flex items-center justify-center">
            <i className={`ri-arrow-${aiSidebarOpen ? "up" : "down"}-s-line text-gray-400 text-sm transition-transform`} />
          </div>
        </button>
        {aiSidebarOpen && (
          <div
            style={{
              animation: "fadeSlideDown 0.22s ease",
            }}
          >
            <style>{`
              @keyframes fadeSlideDown {
                from { opacity: 0; transform: translateY(-6px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <AISidebar onMemberMessage={onMemberMessage} aiWeeklyInsights={aiWeeklyInsights} careTeamDisplay={careTeamDisplay} />
          </div>
        )}
        {!aiSidebarOpen && (
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        )}
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

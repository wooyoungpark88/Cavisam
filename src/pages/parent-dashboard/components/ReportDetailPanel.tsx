import { useState, useEffect } from "react";

export interface ReportDetail {
  id: number;
  time: string;
  type: string;
  typeName?: string;
  typeColor?: string;
  typeIcon?: string;
  actor: string;
  actorInitial: string;
  actorColor: string;
  content: string;
  hasPhoto?: boolean;
  photoUrl?: string;
  aiSummary?: string;
  aiInsight?: string;
  teacherConfirmed?: string;
  isConfirmed?: boolean;
  sentAt?: string;
}

interface ReportDetailPanelProps {
  report: ReportDetail | null;
  onClose: () => void;
  onConfirm?: (id: number) => void;
}

const TYPE_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  parent:   { label: "아침 보고", icon: "ri-sun-line",             color: "#026eff", bg: "rgba(2,110,255,0.08)" },
  teacher:  { label: "선생님 메시지", icon: "ri-chat-3-line",      color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  report:   { label: "선생님 보고서", icon: "ri-file-text-line",   color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  ai:       { label: "AI 감지",    icon: "ri-robot-2-line",        color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
};

const REACTIONS = ["❤️", "👍", "😊", "👏", "🙏"];

function QuickReplies({ onSend }: { onSend: (msg: string) => void }) {
  const templates = [
    "감사합니다! 잘 전달받았어요.",
    "오늘도 잘 부탁드려요.",
    "집에서도 격려해 줄게요!",
    "추가로 확인이 필요한 사항 있나요?",
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {templates.map((t) => (
        <button
          key={t}
          onClick={() => onSend(t)}
          className="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#10b981] hover:text-[#10b981] hover:bg-[rgba(16,185,129,0.05)] transition-all cursor-pointer whitespace-nowrap"
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function ReportDetailPanel({
  report,
  onClose,
  onConfirm,
}: ReportDetailPanelProps) {
  const [visible, setVisible] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sentReply, setSentReply] = useState<string | null>(null);
  const [showAllContent, setShowAllContent] = useState(false);

  useEffect(() => {
    if (report) {
      setVisible(true);
      setConfirmed(report.isConfirmed ?? false);
      setSelectedReaction(null);
      setReplyText("");
      setSentReply(null);
      setShowAllContent(false);
    } else {
      setVisible(false);
    }
  }, [report]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    if (onConfirm && report) onConfirm(report.id);
  };

  const handleSendReply = (msg: string) => {
    if (!msg.trim()) return;
    setSentReply(msg.trim());
    setReplyText("");
    if (!confirmed) handleConfirm();
  };

  if (!report) return null;

  const typeMeta = TYPE_META[report.type] ?? {
    label: report.typeName ?? "보고",
    icon: report.typeIcon ?? "ri-file-text-line",
    color: report.typeColor ?? "#6b7280",
    bg: `${report.typeColor ?? "#6b7280"}14`,
  };

  const isLong = report.content.length > 120;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.22)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* Slide panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "min(420px, 92vw)",
          background: "#fafafa",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s cubic-bezier(0.32, 0, 0.67, 0)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.10)",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0"
              style={{ background: typeMeta.bg }}
            >
              <i className={`${typeMeta.icon} text-sm`} style={{ color: typeMeta.color }} />
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: typeMeta.color }}
            >
              {report.typeName ?? typeMeta.label}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-gray-400 text-lg" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          {/* Sender info + time */}
          <div
            className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: report.actorColor }}
            >
              {report.actorInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {report.actor}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                {report.sentAt ?? report.time}
              </p>
            </div>
            {confirmed ? (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                <i className="ri-checkbox-circle-fill text-[12px]" />
                확인됨
              </span>
            ) : (
              <button
                onClick={handleConfirm}
                className="text-[11px] font-semibold px-3 py-1 rounded-full border cursor-pointer whitespace-nowrap transition-all hover:bg-gray-50 flex-shrink-0"
                style={{ color: "#6b7280", borderColor: "#e5e7eb" }}
              >
                확인하기
              </button>
            )}
          </div>

          {/* Content */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <p className="text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wide">내용</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {isLong && !showAllContent
                ? `${report.content.slice(0, 120)}...`
                : report.content}
            </p>
            {isLong && (
              <button
                onClick={() => setShowAllContent((v) => !v)}
                className="mt-2 text-[11px] font-semibold cursor-pointer transition-colors"
                style={{ color: typeMeta.color }}
              >
                {showAllContent ? "접기" : "전체 보기"}
              </button>
            )}
          </div>

          {/* Photo if any */}
          {report.hasPhoto && report.photoUrl && (
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
              <img
                src={report.photoUrl}
                alt="활동 사진"
                className="w-full object-cover object-top"
                style={{ maxHeight: 220 }}
              />
            </div>
          )}

          {/* AI Summary / AI Insight */}
          {(report.aiSummary || report.aiInsight) && (
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)" }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-robot-2-line text-[#f59e0b] text-sm" />
                </div>
                <span className="text-[11px] font-bold text-[#b45309]">AI 요약</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {report.aiSummary || report.aiInsight}
              </p>
            </div>
          )}

          {/* Teacher confirmed note */}
          {report.teacherConfirmed && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)" }}>
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-checkbox-circle-fill text-[#10b981] text-xs" />
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">{report.teacherConfirmed}</p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-dashed border-gray-100" />

          {/* Reactions */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 mb-2.5 uppercase tracking-wide">반응</p>
            <div className="flex gap-2">
              {REACTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedReaction((prev) => (prev === r ? null : r))}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-lg border transition-all cursor-pointer"
                  style={{
                    borderColor: selectedReaction === r ? typeMeta.color : "#e5e7eb",
                    background: selectedReaction === r ? typeMeta.bg : "white",
                    transform: selectedReaction === r ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Sent reply preview */}
          {sentReply && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-check-double-line text-[#10b981] text-xs" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#10b981] mb-0.5">답장 전송됨</p>
                <p className="text-xs text-gray-600">{sentReply}</p>
              </div>
            </div>
          )}

          {/* Reply area */}
          {!sentReply && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 mb-2.5 uppercase tracking-wide">
                선생님께 답장
              </p>
              <QuickReplies onSend={handleSendReply} />
              <div className="flex items-end gap-2 mt-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value.slice(0, 200))}
                  placeholder="직접 입력하기..."
                  rows={2}
                  className="flex-1 resize-none text-xs text-gray-700 placeholder-gray-300 px-3 py-2.5 rounded-xl outline-none transition-all"
                  style={{
                    border: "1px solid",
                    borderColor: replyText ? typeMeta.color : "#e5e7eb",
                    background: "white",
                    fontSize: "13px",
                  }}
                />
                <button
                  onClick={() => handleSendReply(replyText)}
                  disabled={!replyText.trim()}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                  style={{
                    background: replyText.trim() ? typeMeta.color : "#f3f4f6",
                    color: replyText.trim() ? "white" : "#d1d5db",
                  }}
                >
                  <i className="ri-send-plane-fill text-sm" />
                </button>
              </div>
              <p className="text-right text-[10px] text-gray-300 mt-1">{replyText.length}/200</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

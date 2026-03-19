import { useState, useRef, useEffect } from "react";
import { type ChatMessage, type StudentConversation } from "../../../types/messages";
import { useAuth } from "../../../hooks/useAuth";
import { sendMessage } from "../../../lib/api/messages";
import { uploadAttachment, validateFile, getAttachmentType, getSignedUrl } from "../../../lib/api/attachments";
import CabiSaemModal from "../../../components/feature/CabiSaemModal";

const quickReplies = [
  "오늘 활동 중 특이사항을 알려드립니다",
  "점심 식사 잘 마쳤습니다",
  "약 복용 완료했습니다",
  "오늘 컨디션이 좋았어요",
  "확인해 주셔서 감사합니다",
  "내일도 잘 부탁드립니다",
];

interface Props {
  conversation: StudentConversation;
  onBack?: () => void;
}

// ── Daily report card ──────────────────────────────────────
function DailyReportCard({ data }: { data: NonNullable<ChatMessage["reportData"]> }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #026eff 0%, #0243c2 100%)",
        maxWidth: 280,
      }}
    >
      <div className="px-4 py-3 border-b border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="ri-file-list-2-line text-white text-xs" />
          <span className="text-white text-xs font-bold">일일 보고서</span>
        </div>
        <span className="text-white/60 text-[12px]">2026. 03. 18</span>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {[
          { icon: "ri-moon-line", label: "수면", value: data.sleep },
          { icon: "ri-drop-line", label: "배변", value: data.bowel },
          { icon: "ri-emotion-happy-line", label: "컨디션", value: data.condition },
          { icon: "ri-restaurant-line", label: "식사량", value: data.meal },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-white/50 text-[11px] font-medium mb-0.5 flex items-center gap-1">
              <i className={`${item.icon} text-[11px]`} /> {item.label}
            </p>
            <p className="text-white text-[12.5px] font-semibold">{item.value}</p>
          </div>
        ))}
        {data.note && (
          <div className="col-span-2">
            <p className="text-white/50 text-[11px] font-medium mb-0.5">특이사항</p>
            <p className="text-white text-[12.5px] leading-snug">{data.note}</p>
          </div>
        )}
      </div>
      <div className="px-4 py-2.5 border-t border-white/10">
        <p className="text-white/50 text-[12px]">{data.sentBy} · {data.sentTime}</p>
      </div>
    </div>
  );
}

// ── Attachment renderer ───────────────────────────────────
function AttachmentContent({ msg }: { msg: ChatMessage }) {
  const [url, setUrl] = useState(msg.attachmentUrl ?? '');

  // storage 경로인 경우 signed URL로 변환
  useEffect(() => {
    const raw = msg.attachmentUrl;
    if (!raw) return;
    // 이미 http URL이면 그대로 사용 (blob: 또는 data: 포함)
    if (raw.startsWith('http') || raw.startsWith('blob:') || raw.startsWith('data:')) {
      setUrl(raw);
    } else {
      getSignedUrl(raw).then((signed) => { if (signed) setUrl(signed); });
    }
  }, [msg.attachmentUrl]);

  if (!url) return null;

  if (msg.attachmentType === 'video') {
    return (
      <video
        src={url}
        controls
        preload="metadata"
        className="rounded-xl max-w-[260px] max-h-[200px] object-cover"
      />
    );
  }
  return (
    <img
      src={url}
      alt="첨부 이미지"
      className="rounded-xl max-w-[260px] max-h-[260px] object-cover cursor-pointer"
      loading="lazy"
      onClick={() => window.open(url, '_blank')}
    />
  );
}

// ── Message bubble ─────────────────────────────────────────
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isMe = msg.sender === "teacher";

  if (msg.type === "daily-report" && msg.reportData) {
    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
        {!isMe && (
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-[12px] font-bold flex-shrink-0 mr-2 mt-1 self-start">
            보
          </div>
        )}
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
          {!isMe && <p className="text-[12px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>}
          <DailyReportCard data={msg.reportData} />
          <p className="text-[12px] text-gray-400 mt-1 px-1">{msg.time}</p>
        </div>
      </div>
    );
  }

  // 첨부파일 메시지
  if (msg.type === "attachment" && msg.attachmentUrl) {
    return (
      <div className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2 mb-3`}>
        {!isMe && (
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-[12px] font-bold flex-shrink-0 self-end">
            보
          </div>
        )}
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[72%]`}>
          {!isMe && <p className="text-[12px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>}
          <AttachmentContent msg={msg} />
          {msg.text && (
            <div
              className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed mt-1"
              style={
                isMe
                  ? { background: "linear-gradient(135deg, #026eff, #0243c2)", color: "white", borderBottomRightRadius: 6 }
                  : { background: "#f3f4f6", color: "#1f2937", borderBottomLeftRadius: 6 }
              }
            >
              {msg.text}
            </div>
          )}
          <p className="text-[12px] text-gray-400 mt-1 px-1">{msg.time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2 mb-3`}>
      {!isMe && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-[12px] font-bold flex-shrink-0 self-end">
          보
        </div>
      )}
      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[72%]`}>
        {!isMe && <p className="text-[12px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>}
        <div
          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
          style={
            isMe
              ? {
                  background: "linear-gradient(135deg, #026eff, #0243c2)",
                  color: "white",
                  borderBottomRightRadius: 6,
                }
              : { background: "#f3f4f6", color: "#1f2937", borderBottomLeftRadius: 6 }
          }
        >
          {msg.text}
        </div>
        <p className="text-[12px] text-gray-400 mt-1 px-1">{msg.time}</p>
      </div>
    </div>
  );
}

// ── Compact stat badge (mobile) ────────────────────────────
function MiniStat({
  emoji,
  value,
  change,
  positive,
}: {
  emoji: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  const isNeutral = change === "→";
  return (
    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
      <span className="text-sm flex-shrink-0">{emoji}</span>
      <span className="text-xs font-bold text-gray-800 whitespace-nowrap">{value}</span>
      {!isNeutral && (
        <span
          className="text-[12px] font-semibold whitespace-nowrap"
          style={{ color: positive ? "#10b981" : "#ef4444" }}
        >
          {positive ? "↑" : "↓"}{change}
        </span>
      )}
    </div>
  );
}

// ── Main chat panel ────────────────────────────────────────
export default function MessageChatPanel({ conversation, onBack }: Props) {
  const { profile } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const [showCabiSaem, setShowCabiSaem] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.studentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // 같은 파일 재선택 허용

    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // 미리보기 취소
  const clearPending = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingFile) || !profile) return;

    const text = input.trim();
    const file = pendingFile;
    const preview = previewUrl;
    const fileType = file ? getAttachmentType(file) : null;

    setInput("");
    clearPending();

    // 첨부파일이 있는 경우
    if (file && fileType) {
      // 낙관적 업데이트 (미리보기 URL 사용)
      const tempMsg: ChatMessage = {
        id: Date.now(),
        sender: "teacher",
        senderName: profile.name || "선생님",
        text: text || "",
        time: "업로드 중...",
        type: "attachment",
        attachmentUrl: preview ?? undefined,
        attachmentType: fileType,
      };
      setMessages((prev) => [...prev, tempMsg]);
      setUploading(true);

      try {
        const { url: storagePath, type: attachType } = await uploadAttachment(file, profile.id);
        await sendMessage({
          student_id: String(conversation.studentId),
          sender_id: profile.id,
          receiver_id: conversation._parentId ?? "",
          content: text || (attachType === 'image' ? '사진' : '영상'),
          message_type: "attachment",
          attachment_url: storagePath,
          attachment_type: attachType,
        });
      } catch (e) {
        console.error("첨부파일 전송 실패:", e);
      } finally {
        setUploading(false);
      }
      return;
    }

    // 텍스트만 전송
    const tempMsg: ChatMessage = {
      id: Date.now(),
      sender: "teacher",
      senderName: profile.name || "선생님",
      text,
      time: "방금",
      type: "text",
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await sendMessage({
        student_id: String(conversation.studentId),
        sender_id: profile.id,
        receiver_id: conversation._parentId ?? "",
        content: text,
        message_type: "text",
      });
    } catch (e) {
      console.error("메시지 전송 실패:", e);
    }
  };

  const { weeklyStats: s } = conversation;

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">

        {/* ── Header ── */}
        <div className="flex-shrink-0 px-4 md:px-5 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">

            {/* Back button — mobile only */}
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
              >
                <i className="ri-arrow-left-s-line text-gray-700 text-xl" />
              </button>
            )}

            {/* Avatar + name */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: conversation.avatarColor }}
            >
              {conversation.initial}
            </div>
            <div className="min-w-0 flex-shrink-0">
              <p className="text-sm font-bold text-gray-900 leading-tight">{conversation.studentName}</p>
              <p className="text-[12px] text-gray-400">{conversation.parentName}</p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-gray-100 flex-shrink-0 mx-1" />

            {/* Weekly stats chips — desktop */}
            <div className="hidden md:flex items-center gap-2 flex-1 min-w-0">
              <MiniStat emoji="🌙" value={s.sleep} change={s.sleepChange} positive={s.sleepPositive} />
              <MiniStat emoji="😊" value={s.condition} change={s.conditionChange} positive={s.conditionPositive} />
              <MiniStat emoji="🍱" value={s.meal} change={s.mealChange} positive={s.mealPositive} />
            </div>

            {/* Spacer — mobile */}
            <div className="flex-1 md:hidden" />

            {/* AI 케어 button — desktop */}
            <button
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12.5px] font-semibold text-white cursor-pointer whitespace-nowrap transition-opacity hover:opacity-85 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #026eff 0%, #0243c2 100%)" }}
            >
              <i className="ri-sparkling-2-line text-xs" />
              AI 케어
            </button>

            {/* 캐비쌤 button */}
            <button
              onClick={() => setShowCabiSaem(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:opacity-90 flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "white",
              }}
            >
              <i className="ri-sparkling-2-fill text-sm" />
              <span className="hidden sm:inline">캐비쌤</span>
            </button>
          </div>

          {/* Mobile stats row */}
          <div className="md:hidden flex items-center gap-2 mt-2.5 overflow-x-auto pb-0.5">
            <MiniStat emoji="🌙" value={s.sleep} change={s.sleepChange} positive={s.sleepPositive} />
            <MiniStat emoji="😊" value={s.condition} change={s.conditionChange} positive={s.conditionPositive} />
            <MiniStat emoji="🍱" value={s.meal} change={s.mealChange} positive={s.mealPositive} />
          </div>
        </div>

        {/* ── Messages area ── */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* ── Quick replies ── */}
        <div className="flex-shrink-0 px-4 md:px-5 pt-2.5 pb-1 flex gap-2 overflow-x-auto border-t border-gray-100 bg-white">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => setInput(reply)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12.5px] font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* ── Attachment preview ── */}
        {previewUrl && pendingFile && (
          <div className="flex-shrink-0 px-4 md:px-5 pt-3 border-t border-gray-100 bg-white">
            <div className="relative inline-block">
              {getAttachmentType(pendingFile) === 'video' ? (
                <video src={previewUrl} className="h-24 rounded-xl object-cover" />
              ) : (
                <img src={previewUrl} alt="미리보기" className="h-24 rounded-xl object-cover" />
              )}
              <button
                onClick={clearPending}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow cursor-pointer hover:bg-red-600"
              >
                <i className="ri-close-line" />
              </button>
            </div>
          </div>
        )}

        {/* ── Input bar ── */}
        <div className="flex-shrink-0 px-4 md:px-5 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2 md:gap-3 bg-gray-50 rounded-2xl px-4 py-2.5">
            {/* 첨부 버튼 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#026eff] hover:bg-blue-50 cursor-pointer transition-colors flex-shrink-0 disabled:opacity-30"
            >
              <i className="ri-attachment-2 text-lg" />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              type="text"
              placeholder="보호자에게 메시지를 입력하세요"
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none min-w-0"
            />
            <button
              onClick={handleSend}
              disabled={(!input.trim() && !pendingFile) || uploading}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-white cursor-pointer whitespace-nowrap transition-all disabled:opacity-30 flex-shrink-0"
              style={{ background: "#026eff" }}
            >
              {uploading ? (
                <i className="ri-loader-4-line text-xs animate-spin" />
              ) : (
                <i className="ri-send-plane-fill text-xs" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 캐비쌤 modal */}
      {showCabiSaem && (
        <CabiSaemModal mode="teacher" onClose={() => setShowCabiSaem(false)} />
      )}
    </>
  );
}

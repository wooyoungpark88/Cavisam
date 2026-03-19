import { useState, useRef, useEffect, useMemo } from "react";
import { useParentData } from "../../../contexts/ParentDataContext";
import { useAuth } from "../../../hooks/useAuth";
import { sendMessage, markAsRead } from "../../../lib/api/messages";
import { uploadAttachment, validateFile, getAttachmentType } from "../../../lib/api/attachments";
import CabiSaemModal from "../../../components/feature/CabiSaemModal";

interface ParentChatMessage {
  id: number;
  sender: "teacher" | "parent";
  senderName: string;
  text: string;
  time: string;
  type: "text" | "report-card";
  reportCard?: {
    title: string;
    items: { label: string; emoji: string; value: string }[];
    note?: string;
  };
}

const parentQuickReplies = [
  "어젯밤에 잠을 잘 못 잤어요",
  "오늘 아침 컨디션이 안 좋아요",
  "약을 미처 먹이지 못했어요",
  "감사합니다 선생님",
  "오늘도 잘 부탁드립니다",
  "집에서 이야기 들었어요",
];

interface IncidentRoomProps {
  memberId?: number;
}

/* ────────────────────────────────── report card ── */
function ReportCard({ card }: { card: NonNullable<ParentChatMessage["reportCard"]> }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #026eff 0%, #0243c2 100%)",
        maxWidth: 272,
      }}
    >
      <div className="px-4 py-2.5 border-b border-white/15 flex items-center gap-2">
        <div className="w-4 h-4 flex items-center justify-center">
          <i className="ri-file-list-2-line text-white text-xs" />
        </div>
        <span className="text-white text-xs font-bold">{card.title}</span>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {card.items.map((item) => (
          <div key={item.label}>
            <p className="text-white/50 text-[11px] font-medium mb-0.5 flex items-center gap-1">
              <span>{item.emoji}</span>
              {item.label}
            </p>
            <p className="text-white text-[12.5px] font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
      {card.note && (
        <div className="px-4 pb-3">
          <div className="border-t border-white/15 pt-2.5">
            <p className="text-white/50 text-[11px] font-medium mb-1">선생님 한마디</p>
            <p className="text-white/90 text-[12.5px] leading-relaxed">{card.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────── message bubble ── */
function MessageBubble({
  msg,
  teacherInitial,
  teacherColor,
}: {
  msg: ParentChatMessage;
  teacherInitial: string;
  teacherColor: string;
}) {
  const isTeacher = msg.sender === "teacher";

  if (msg.type === "report-card" && msg.reportCard) {
    return (
      <div className={`flex ${isTeacher ? "flex-row" : "flex-row-reverse"} items-end gap-2 mb-4`}>
        {isTeacher && (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0 self-end"
            style={{ background: teacherColor }}
          >
            {teacherInitial}
          </div>
        )}
        <div className={`flex flex-col ${isTeacher ? "items-start" : "items-end"}`}>
          {isTeacher && (
            <p className="text-[12px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>
          )}
          <ReportCard card={msg.reportCard} />
          <p className="text-[12px] text-gray-400 mt-1 px-1">{msg.time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isTeacher ? "flex-row" : "flex-row-reverse"} items-end gap-2 mb-3`}>
      {isTeacher && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0 self-end"
          style={{ background: teacherColor }}
        >
          {teacherInitial}
        </div>
      )}
      <div
        className={`flex flex-col ${isTeacher ? "items-start" : "items-end"} max-w-[80%] sm:max-w-[68%]`}
      >
        {isTeacher && (
          <p className="text-[12px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>
        )}
        <div
          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words"
          style={
            isTeacher
              ? { background: "#f3f4f6", color: "#1f2937", borderBottomLeftRadius: 6 }
              : {
                  background: "linear-gradient(135deg, #026eff, #0243c2)",
                  color: "white",
                  borderBottomRightRadius: 6,
                }
          }
        >
          {msg.text}
        </div>
        <p className="text-[12px] text-gray-400 mt-1 px-1">{msg.time}</p>
      </div>
    </div>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

/* ────────────────────────────────── member list ── */
function MemberList({
  selectedId,
  onSelect,
  childName,
  careTeamMembers,
  messagesByMember,
}: {
  selectedId: number;
  onSelect: (id: number) => void;
  childName: string;
  careTeamMembers: { id: number; name: string; initial: string; role: string; color: string; department: string }[];
  messagesByMember: Record<number, ParentChatMessage[]>;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">케어톡</h2>
        <p className="text-[12.5px] text-gray-400 mt-0.5">{childName} · 돌봄 팀 채팅</p>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto py-2">
        {careTeamMembers.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-400">돌봄 팀 정보가 없어요</p>
          </div>
        ) : (
          careTeamMembers.map((member) => {
            const msgs = messagesByMember[member.id] ?? [];
            const last = msgs[msgs.length - 1];
            const unread = member.id === 1 ? 2 : 0;
            const isSelected = member.id === selectedId;

            return (
              <button
                key={member.id}
                onClick={() => onSelect(member.id)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer text-left"
                style={{ background: isSelected ? "rgba(2,110,255,0.06)" : "transparent" }}
              >
                {/* avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: member.color }}
                  >
                    {member.initial}
                  </div>
                  {member.id === 1 && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                  )}
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-[11px] font-bold">
                      {unread}
                    </span>
                  )}
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-0.5 gap-1">
                    <p className="text-sm font-semibold text-gray-900 break-words leading-snug">
                      {member.name} 선생님
                    </p>
                    {last && (
                      <span className="text-[12px] text-gray-400 flex-shrink-0 mt-0.5">
                        {last.time.startsWith("오늘")
                          ? last.time.replace("오늘 ", "")
                          : last.time.split(" ").slice(-1)[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-[12.5px] text-gray-500 break-words leading-snug line-clamp-2 flex-1">
                      {last
                        ? last.type === "report-card"
                          ? "[활동 보고카드]"
                          : last.text
                        : "메시지 없음"}
                    </p>
                    <span
                      className="flex-shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap mt-0.5"
                      style={{ background: `${member.color}14`, color: member.color }}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* arrow (mobile only) */}
                <div className="w-4 h-4 flex items-center justify-center md:hidden flex-shrink-0">
                  <i className="ri-arrow-right-s-line text-gray-400 text-base" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────── chat panel ── */
function ChatPanel({
  memberId,
  onBack,
  showBackButton,
  childName,
  careTeamMembers,
  messagesByMember,
  studentId,
  senderId,
  memberProfileIds,
}: {
  memberId: number;
  onBack: () => void;
  showBackButton: boolean;
  childName: string;
  careTeamMembers: { id: number; name: string; initial: string; role: string; color: string; department: string }[];
  messagesByMember: Record<number, ParentChatMessage[]>;
  studentId?: string;
  senderId?: string;
  memberProfileIds: Record<number, string>;
}) {
  const member = careTeamMembers.find((m) => m.id === memberId) ?? careTeamMembers[0];
  const initialMessages = messagesByMember[member?.id] ?? [];

  const [messages, setMessages] = useState<ParentChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showCabiSaem, setShowCabiSaem] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(messagesByMember[member?.id] ?? []);
    setInput("");
  }, [member?.id, messagesByMember]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const error = validateFile(file);
    if (error) { alert(error); return; }
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearPending = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingFile)) return;
    const text = input.trim();
    const file = pendingFile;
    const fileType = file ? getAttachmentType(file) : null;

    setInput("");
    clearPending();

    // 첨부파일 전송
    if (file && fileType && studentId && senderId && member) {
      const newMsg: ParentChatMessage = {
        id: messages.length + 100,
        sender: "parent",
        senderName: "나",
        text: text || (fileType === 'image' ? '📷 사진' : '🎬 영상'),
        time: "업로드 중...",
        type: "text",
      };
      setMessages((prev) => [...prev, newMsg]);
      setUploading(true);
      try {
        const { url: storagePath, type: attachType } = await uploadAttachment(file, senderId);
        const receiverId = memberProfileIds[member.id] ?? "";
        await sendMessage({
          student_id: studentId,
          sender_id: senderId,
          receiver_id: receiverId,
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
    const newMsg: ParentChatMessage = {
      id: messages.length + 100,
      sender: "parent",
      senderName: "나",
      text,
      time: "방금",
      type: "text",
    };
    setMessages((prev) => [...prev, newMsg]);

    if (studentId && senderId && member) {
      try {
        const receiverId = memberProfileIds[member.id] ?? "";
        await sendMessage({
          student_id: studentId,
          sender_id: senderId,
          receiver_id: receiverId,
          content: text,
          message_type: "text",
        });
      } catch (e) {
        console.error("메시지 전송 실패:", e);
      }
    }
  };

  const groupedMessages = (() => {
    const groups: { dateLabel: string; msgs: ParentChatMessage[] }[] = [];
    const dateMap: Record<string, ParentChatMessage[]> = {};
    const dateOrder: string[] = [];

    messages.forEach((msg) => {
      const t = msg.time;
      const dateKey = t.startsWith("오늘") || t.startsWith("방금")
        ? "오늘"
        : t.includes("3월 10일") ? "3월 10일"
        : t.includes("3월 11일") ? "3월 11일"
        : t.includes("3월 12일") ? "3월 12일"
        : t.includes("3월 13일") ? "3월 13일"
        : t.includes("3월 14일") ? "3월 14일"
        : t.includes("3월 15일") ? "3월 15일"
        : t.includes("3월 16일") ? "3월 16일"
        : "기타";

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = [];
        dateOrder.push(dateKey);
      }
      dateMap[dateKey].push(msg);
    });

    dateOrder.forEach((key) => groups.push({ dateLabel: key, msgs: dateMap[key] }));
    return groups;
  })();

  if (!member) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-sm text-gray-400">돌봄 팀 정보가 없어요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Chat Header ── */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-white flex items-center gap-3">
        {/* back button (mobile) */}
        {showBackButton && (
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
          >
            <i className="ri-arrow-left-s-line text-gray-600 text-xl" />
          </button>
        )}

        {/* avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: member.color }}
          >
            {member.initial}
          </div>
          {member.id === 1 && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
          )}
        </div>

        {/* name / role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-gray-900 text-sm font-bold break-words">{member.name} 선생님</p>
            {member.id === 1 ? (
              <span className="text-[12px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                온라인
              </span>
            ) : (
              <span
                className="text-[12px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap hidden sm:inline"
                style={{ background: `${member.color}14`, color: member.color }}
              >
                {member.role}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-[12.5px] break-words leading-snug">
            {member.id === 1
              ? `${childName} 담임`
              : member.department}
          </p>
        </div>

        {/* action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* 캐비쌤 */}
          <button
            onClick={() => setShowCabiSaem(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white" }}
          >
            <i className="ri-sparkling-2-fill text-sm" />
            <span className="hidden sm:inline">캐비쌤</span>
          </button>
          <button className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            <i className="ri-phone-line text-xs" />
            전화하기
          </button>
          {/* phone icon only on mobile */}
          <button className="sm:hidden w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <i className="ri-phone-line text-gray-500 text-sm" />
          </button>
        </div>
      </div>

      {/* ── Notice bar ── */}
      <div
        className="flex-shrink-0 px-4 py-2 flex items-center gap-2 border-b border-gray-100"
        style={{ background: "#fffbeb" }}
      >
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-information-line text-[#d97706] text-xs" />
        </div>
        <p className="text-[12.5px] text-amber-700 leading-relaxed">
          <strong>{member.name} 선생님</strong>과의 전용 대화창이에요. 긴급 상황엔 전화를 이용해 주세요.
        </p>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {groupedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <i className="ri-chat-3-line text-gray-300 text-lg" />
            </div>
            <p className="text-sm text-gray-400">아직 대화 내용이 없어요</p>
            <p className="text-[12.5px] text-gray-300 mt-1">먼저 인사를 건네보세요</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.dateLabel}>
              <DateDivider label={group.dateLabel} />
              {group.msgs.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  teacherInitial={member.initial}
                  teacherColor={member.color}
                />
              ))}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick replies ── */}
      <div className="flex-shrink-0 px-4 pt-2.5 pb-1 flex gap-2 overflow-x-auto border-t border-gray-100 bg-white">
        {parentQuickReplies.map((reply) => (
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
        <div className="flex-shrink-0 px-4 pt-3 border-t border-gray-100 bg-white">
          <div className="relative inline-block">
            {getAttachmentType(pendingFile) === 'video' ? (
              <video src={previewUrl} className="h-20 rounded-xl object-cover" />
            ) : (
              <img src={previewUrl} alt="미리보기" className="h-20 rounded-xl object-cover" />
            )}
            <button
              onClick={clearPending}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow cursor-pointer hover:bg-red-600"
            >
              <i className="ri-close-line" />
            </button>
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 px-4 py-3 bg-white">
        <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
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
            title="사진/영상 첨부"
          >
            <i className="ri-image-add-line text-lg" />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            type="text"
            placeholder={`${member.name} 선생님께 메시지를 보내세요`}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !pendingFile) || uploading}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white cursor-pointer whitespace-nowrap transition-all disabled:opacity-30 flex-shrink-0"
            style={{ background: member.color }}
          >
            {uploading ? (
              <i className="ri-loader-4-line text-xs animate-spin" />
            ) : (
              <i className="ri-send-plane-fill text-xs" />
            )}
          </button>
        </div>
      </div>

      {/* 캐비쌤 Modal */}
      {showCabiSaem && (
        <CabiSaemModal mode="parent" onClose={() => setShowCabiSaem(false)} />
      )}
    </div>
  );
}

/* ────────────────────────────────── main component ── */
export default function IncidentRoom({ memberId = 1 }: IncidentRoomProps) {
  const { activeChild, careTeam, messages: contextMessages, loading } = useParentData();
  const { profile } = useAuth();

  const childName = activeChild?.name || "자녀";

  // care team member의 profile id 매핑 (메시지 전송 시 receiver_id로 사용)
  const memberProfileIds = useMemo(() => {
    const map: Record<number, string> = {};
    careTeam.forEach((ct, i) => {
      map[i + 1] = ct.member_id;
    });
    return map;
  }, [careTeam]);

  const careTeamMembers = useMemo(() => {
    return careTeam.map((ct, i) => ({
      id: i + 1,
      name: ct.member?.name || "팀원",
      initial: (ct.member?.name || "?").charAt(0),
      role: ct.role === 'lead' ? '담당 교사' : ct.role === 'support' ? '보조 교사' : '관찰자',
      color: ["#026eff", "#10b981", "#f59e0b", "#8b5cf6"][i % 4],
      department: "",
    }));
  }, [careTeam]);

  const messagesByMember = useMemo(() => {
    const result: Record<number, ParentChatMessage[]> = {};
    careTeamMembers.forEach((member) => {
      const ct = careTeam[member.id - 1];
      if (!ct) return;
      const memberMsgs = contextMessages
        .filter(m => m.sender_id === ct.member_id || m.receiver_id === ct.member_id)
        .map((m, i) => {
          const isFromTeacher = m.sender_id === ct.member_id;
          const createdDate = new Date(m.created_at);
          const todayStr = new Date().toISOString().slice(0, 10);
          const isToday = m.created_at.startsWith(todayStr);
          const timeStr = isToday
            ? `오늘 ${createdDate.toTimeString().slice(0, 5)}`
            : `${createdDate.getMonth() + 1}월 ${createdDate.getDate()}일 ${createdDate.toTimeString().slice(0, 5)}`;

          return {
            id: i + 1,
            sender: (isFromTeacher ? "teacher" : "parent") as "teacher" | "parent",
            senderName: isFromTeacher ? `${member.name} 선생님` : "나",
            text: m.content,
            time: timeStr,
            type: "text" as const,
          };
        });
      result[member.id] = memberMsgs;
    });
    return result;
  }, [careTeamMembers, careTeam, contextMessages]);

  const [selectedId, setSelectedId] = useState(memberId);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setSelectedId(memberId);
    setMobileView("chat");
  }, [memberId]);

  // 채팅방 진입 시 읽음 처리
  useEffect(() => {
    if (activeChild?.id && profile?.id) {
      markAsRead(activeChild.id, profile.id).catch(() => {});
    }
  }, [activeChild?.id, profile?.id, selectedId]);

  const handleSelectMember = (id: number) => {
    setSelectedId(id);
    setMobileView("chat");
  };

  const handleBack = () => {
    setMobileView("list");
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#026eff] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">케어톡을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* ── Desktop: member list panel (always visible md+) ── */}
      <div
        className={`
          md:flex md:flex-col md:border-r md:border-gray-100
          ${mobileView === "list" ? "flex flex-col flex-1" : "hidden"}
          md:w-64 lg:w-72 md:flex-shrink-0
        `}
        style={{ background: "#fff" }}
      >
        {/* Mobile header for list view */}
        <div className="md:hidden flex-shrink-0 px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center rounded-md bg-[#026eff]">
            <i className="ri-chat-3-line text-white text-xs" />
          </div>
          <span className="text-sm font-bold text-gray-900">케어톡</span>
        </div>

        <MemberList
          selectedId={selectedId}
          onSelect={handleSelectMember}
          childName={childName}
          careTeamMembers={careTeamMembers}
          messagesByMember={messagesByMember}
        />
      </div>

      {/* ── Desktop: chat panel (always visible md+) / Mobile: conditional ── */}
      <div
        className={`
          flex-1 flex flex-col overflow-hidden min-w-0
          ${mobileView === "chat" ? "flex" : "hidden md:flex"}
        `}
        style={{ background: "#fafbfc" }}
      >
        <ChatPanel
          memberId={selectedId}
          onBack={handleBack}
          showBackButton={mobileView === "chat"}
          childName={childName}
          careTeamMembers={careTeamMembers}
          messagesByMember={messagesByMember}
          studentId={activeChild?.id}
          senderId={profile?.id}
          memberProfileIds={memberProfileIds}
        />
      </div>
    </div>
  );
}

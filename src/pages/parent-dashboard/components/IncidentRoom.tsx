import { useState, useRef, useEffect } from "react";
import {
  type ParentChatMessage,
  mockCareTeamMessages,
  mockCareTeam,
  parentQuickReplies,
  mockChild,
} from "../../../mocks/parentDashboard";
import CabiSaemModal from "../../../components/feature/CabiSaemModal";

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
            <p className="text-white/50 text-[9px] font-medium mb-0.5 flex items-center gap-1">
              <span>{item.emoji}</span>
              {item.label}
            </p>
            <p className="text-white text-[11px] font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
      {card.note && (
        <div className="px-4 pb-3">
          <div className="border-t border-white/15 pt-2.5">
            <p className="text-white/50 text-[9px] font-medium mb-1">선생님 한마디</p>
            <p className="text-white/90 text-[11px] leading-relaxed">{card.note}</p>
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
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 self-end"
            style={{ background: teacherColor }}
          >
            {teacherInitial}
          </div>
        )}
        <div className={`flex flex-col ${isTeacher ? "items-start" : "items-end"}`}>
          {isTeacher && (
            <p className="text-[10px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>
          )}
          <ReportCard card={msg.reportCard} />
          <p className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isTeacher ? "flex-row" : "flex-row-reverse"} items-end gap-2 mb-3`}>
      {isTeacher && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 self-end"
          style={{ background: teacherColor }}
        >
          {teacherInitial}
        </div>
      )}
      <div
        className={`flex flex-col ${isTeacher ? "items-start" : "items-end"} max-w-[80%] sm:max-w-[68%]`}
      >
        {isTeacher && (
          <p className="text-[10px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>
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
        <p className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</p>
      </div>
    </div>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

/* ────────────────────────────────── member list ── */
function MemberList({
  selectedId,
  onSelect,
}: {
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">케어톡</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">{mockChild.name} · 돌봄 팀 채팅</p>
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto py-2">
        {mockCareTeam.map((member) => {
          const messages = mockCareTeamMessages[member.id] ?? [];
          const last = messages[messages.length - 1];
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
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
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
                    <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">
                      {last.time.startsWith("오늘")
                        ? last.time.replace("오늘 ", "")
                        : last.time.split(" ").slice(-1)[0]}
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[11px] text-gray-500 break-words leading-snug line-clamp-2 flex-1">
                    {last
                      ? last.type === "report-card"
                        ? "[활동 보고카드]"
                        : last.text
                      : "메시지 없음"}
                  </p>
                  <span
                    className="flex-shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap mt-0.5"
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
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────── chat panel ── */
function ChatPanel({
  memberId,
  onBack,
  showBackButton,
}: {
  memberId: number;
  onBack: () => void;
  showBackButton: boolean;
}) {
  const member = mockCareTeam.find((m) => m.id === memberId) ?? mockCareTeam[0];
  const initialMessages = mockCareTeamMessages[member.id] ?? [];

  const [messages, setMessages] = useState<ParentChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showCabiSaem, setShowCabiSaem] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(mockCareTeamMessages[member.id] ?? []);
    setInput("");
  }, [member.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ParentChatMessage = {
      id: messages.length + 100,
      sender: "parent",
      senderName: "나",
      text: input.trim(),
      time: "방금",
      type: "text",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
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
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                온라인
              </span>
            ) : (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap hidden sm:inline"
                style={{ background: `${member.color}14`, color: member.color }}
              >
                {member.role}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-[11px] break-words leading-snug">
            {member.id === 1
              ? `${mockChild.name} 담임 · ${mockChild.facility}`
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
        <p className="text-[11px] text-amber-700 leading-relaxed">
          <strong>{member.name} 선생님</strong>과의 전용 대화창이에요. 긴급 상황엔 전화를 이용해 주세요.
        </p>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {groupedMessages.map((group) => (
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
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick replies ── */}
      <div className="flex-shrink-0 px-4 pt-2.5 pb-1 flex gap-2 overflow-x-auto border-t border-gray-100 bg-white">
        {parentQuickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => setInput(reply)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 px-4 py-3 bg-white">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
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
            disabled={!input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white cursor-pointer whitespace-nowrap transition-all disabled:opacity-30 flex-shrink-0"
            style={{ background: member.color }}
          >
            <i className="ri-send-plane-fill text-xs" />
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
  const [selectedId, setSelectedId] = useState(memberId);
  // mobile: "list" | "chat"
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const isFirstMount = useRef(true);

  // Sync incoming memberId prop (but only navigate to chat when prop changes externally)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setSelectedId(memberId);
    setMobileView("chat");
  }, [memberId]);

  const handleSelectMember = (id: number) => {
    setSelectedId(id);
    setMobileView("chat");
  };

  const handleBack = () => {
    setMobileView("list");
  };

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
        />
      </div>
    </div>
  );
}

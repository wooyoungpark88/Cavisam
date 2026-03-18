import { useState, useRef, useEffect } from "react";
import {
  type ParentChatMessage,
  mockCareTeamMessages,
  mockCareTeam,
  parentQuickReplies,
  mockChild,
} from "../../../mocks/parentDashboard";

interface IncidentRoomProps {
  memberId?: number;
}

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
        className={`flex flex-col ${isTeacher ? "items-start" : "items-end"} max-w-[68%]`}
      >
        {isTeacher && (
          <p className="text-[10px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>
        )}
        <div
          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
          style={
            isTeacher
              ? {
                  background: "#f3f4f6",
                  color: "#1f2937",
                  borderBottomLeftRadius: 6,
                }
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

export default function IncidentRoom({ memberId = 1 }: IncidentRoomProps) {
  const member = mockCareTeam.find((m) => m.id === memberId) ?? mockCareTeam[0];
  const initialMessages = mockCareTeamMessages[member.id] ?? [];

  const [messages, setMessages] = useState<ParentChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset messages when memberId changes
  useEffect(() => {
    const newInitial = mockCareTeamMessages[member.id] ?? [];
    setMessages(newInitial);
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

  const handleQuickReply = (text: string) => {
    setInput(text);
  };

  const groupedMessages = (() => {
    const groups: { dateLabel: string; msgs: ParentChatMessage[] }[] = [];
    const dateMap: Record<string, ParentChatMessage[]> = {};
    const dateOrder: string[] = [];

    messages.forEach((msg) => {
      const t = msg.time;
      const dateKey = t.startsWith("오늘") || t.startsWith("방금")
        ? "오늘"
        : t.includes("3월 10일")
        ? "3월 10일"
        : t.includes("3월 11일")
        ? "3월 11일"
        : t.includes("3월 12일")
        ? "3월 12일"
        : t.includes("3월 13일")
        ? "3월 13일"
        : t.includes("3월 14일")
        ? "3월 14일"
        : t.includes("3월 15일")
        ? "3월 15일"
        : t.includes("3월 16일")
        ? "3월 16일"
        : "기타";

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = [];
        dateOrder.push(dateKey);
      }
      dateMap[dateKey].push(msg);
    });

    dateOrder.forEach((key) => {
      groups.push({ dateLabel: key, msgs: dateMap[key] });
    });

    return groups;
  })();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Chat Header ── */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: member.color }}
            >
              {member.initial}
            </div>
            {/* Online dot — only for main teacher */}
            {member.id === 1 && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-gray-900 text-sm font-bold">{member.name} 선생님</p>
              {member.id === 1 ? (
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  온라인
                </span>
              ) : (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                  style={{ background: `${member.color}14`, color: member.color }}
                >
                  {member.role}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-[11px]">
              {member.id === 1
                ? `${mockChild.name} 담임 · ${mockChild.facility}`
                : `${member.department}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            <i className="ri-phone-line text-xs" />
            전화하기
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">
            <i className="ri-file-list-3-line text-xs" />
            기록 보기
          </button>
        </div>
      </div>

      {/* ── Notice bar ── */}
      <div
        className="flex-shrink-0 px-5 py-2.5 flex items-center gap-2 border-b border-gray-100"
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
      <div className="flex-1 overflow-y-auto px-6 py-5">
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
      <div className="flex-shrink-0 px-5 pt-3 pb-1 flex gap-2 overflow-x-auto border-t border-gray-100 bg-white">
        {parentQuickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => handleQuickReply(reply)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 px-5 py-3 bg-white">
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
    </div>
  );
}

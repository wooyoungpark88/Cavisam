import { useState, useRef, useEffect } from "react";
import { type ChatMessage, type StudentConversation, quickReplies } from "../../../mocks/teacherMessages";

interface Props {
  conversation: StudentConversation;
}

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
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-file-list-2-line text-white text-xs" />
          </div>
          <span className="text-white text-xs font-bold">일일 보고서</span>
        </div>
        <span className="text-white/60 text-[10px]">2026. 03. 18</span>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <p className="text-white/50 text-[9px] font-medium mb-0.5 flex items-center gap-1">
            <i className="ri-moon-line text-[9px]" /> 수면
          </p>
          <p className="text-white text-[11px] font-semibold">{data.sleep}</p>
        </div>
        <div>
          <p className="text-white/50 text-[9px] font-medium mb-0.5 flex items-center gap-1">
            <i className="ri-drop-line text-[9px]" /> 배변
          </p>
          <p className="text-white text-[11px] font-semibold">{data.bowel}</p>
        </div>
        <div>
          <p className="text-white/50 text-[9px] font-medium mb-0.5 flex items-center gap-1">
            <i className="ri-emotion-happy-line text-[9px]" /> 컨디션
          </p>
          <p className="text-white text-[11px] font-semibold">{data.condition}</p>
        </div>
        <div>
          <p className="text-white/50 text-[9px] font-medium mb-0.5 flex items-center gap-1">
            <i className="ri-restaurant-line text-[9px]" /> 식사량
          </p>
          <p className="text-white text-[11px] font-semibold">{data.meal}</p>
        </div>
        {data.note && (
          <div className="col-span-2">
            <p className="text-white/50 text-[9px] font-medium mb-0.5">특이사항</p>
            <p className="text-white text-[11px] leading-snug">{data.note}</p>
          </div>
        )}
      </div>
      <div className="px-4 py-2.5 border-t border-white/10">
        <p className="text-white/50 text-[10px]">{data.sentBy} · {data.sentTime}</p>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isTeacher = msg.sender === "teacher";

  if (msg.type === "daily-report" && msg.reportData) {
    return (
      <div className={`flex ${isTeacher ? "justify-start" : "justify-end"} mb-4`}>
        {isTeacher && (
          <div className="w-7 h-7 rounded-full bg-[#026eff]/10 flex items-center justify-center text-[#026eff] text-[10px] font-bold flex-shrink-0 mr-2 mt-1 self-start">
            師
          </div>
        )}
        <div>
          {isTeacher && (
            <p className="text-[10px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>
          )}
          <DailyReportCard data={msg.reportData} />
          <p className="text-[10px] text-gray-400 mt-1 ml-1">{msg.time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isTeacher ? "flex-row" : "flex-row-reverse"} items-end gap-2 mb-3`}>
      {isTeacher && (
        <div className="w-7 h-7 rounded-full bg-[#026eff]/10 flex items-center justify-center text-[#026eff] text-[10px] font-bold flex-shrink-0 self-end">
          師
        </div>
      )}
      <div className={`flex flex-col ${isTeacher ? "items-start" : "items-end"} max-w-[68%]`}>
        {isTeacher && (
          <p className="text-[10px] text-gray-400 mb-1 ml-1">{msg.senderName}</p>
        )}
        <div
          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
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

export default function MessageChatPanel({ conversation }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.studentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: messages.length + 1,
      sender: "teacher",
      senderName: "김태의 선생님",
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Chat header */}
      <div className="flex-shrink-0 px-6 py-3.5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">
            {conversation.studentName} 소통방
          </p>
          <p className="text-[11px] text-gray-400">{conversation.parentName}와 대화 중</p>
        </div>
        <button
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
        >
          <i className="ri-file-list-2-line text-xs" />
          일일보고
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="flex-shrink-0 px-5 pt-2.5 pb-1 flex gap-2 overflow-x-auto">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => handleQuickReply(reply)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            type="text"
            placeholder="자리비움  메시지를 입력하세요"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white cursor-pointer whitespace-nowrap transition-all disabled:opacity-30 flex-shrink-0"
            style={{ background: "#026eff" }}
          >
            <i className="ri-send-plane-fill text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

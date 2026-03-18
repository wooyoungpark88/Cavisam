import { useState } from "react";
import { useParentData } from "../../../contexts/ParentDataContext";
import { useAuth } from "../../../hooks/useAuth";

export default function MessagePanel() {
  const { profile } = useAuth();
  const { messages } = useParentData();
  const [input, setInput] = useState("");

  // 최근 메시지 5개만 표시
  const recentMessages = messages.slice(-5);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#10b981]/10">
            <i className="ri-chat-1-line text-[#10b981] text-sm" />
          </div>
          <h2 className="text-sm font-bold text-gray-900">선생님과 대화</h2>
        </div>
        <span className="text-[11px] text-gray-400">{messages.length > 0 ? `${messages.length}개 메시지` : "새 대화"}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-4 space-y-3 overflow-y-auto" style={{ maxHeight: 280 }}>
        {recentMessages.length === 0 && (
          <div className="text-center py-8">
            <i className="ri-chat-3-line text-3xl text-gray-200 mb-2" />
            <p className="text-xs text-gray-400">아직 메시지가 없습니다</p>
          </div>
        )}
        {recentMessages.map((msg) => {
          const isMe = msg.sender_id === profile?.id;
          const senderInitial = msg.sender?.name?.charAt(0) ?? "?";
          const time = new Date(msg.created_at).toLocaleString("ko-KR", {
            month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
          });

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
            >
              {!isMe && (
                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-[#026eff]/10 text-[#026eff] text-xs font-bold mt-0.5">
                  {senderInitial}
                </div>
              )}
              <div className={`max-w-[75%] ${isMe ? "items-end" : ""} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "text-white rounded-tr-sm"
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}
                  style={isMe ? { background: "linear-gradient(135deg, #026eff, #0258d4)" } : {}}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-300 px-1">{time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="선생님께 메시지 보내기..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#026eff] text-white transition-opacity hover:opacity-80 cursor-pointer flex-shrink-0 disabled:opacity-30"
            disabled={!input.trim()}
          >
            <i className="ri-send-plane-fill text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { type StudentConversation } from "../../../types/messages";

interface Props {
  conversations: StudentConversation[];
  selectedId: string | number;
  onSelect: (id: string | number) => void;
}

export default function MessageStudentList({ conversations, selectedId, onSelect }: Props) {
  return (
    <div
      className="flex flex-col flex-1 min-h-0 border-r border-gray-100 w-full md:w-[180px] flex-shrink-0"
    >
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-900">케어톡</p>
        <p className="text-[12px] text-gray-400 mt-0.5">담당 아동 보호자</p>
      </div>

      {/* Student list */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.map((conv) => {
          const isActive = conv.studentId === selectedId;
          return (
            <button
              key={conv.studentId}
              onClick={() => onSelect(conv.studentId)}
              className="w-full flex items-center gap-3 px-4 py-3.5 md:py-3 transition-colors cursor-pointer text-left"
              style={{
                background: isActive ? "rgba(2,110,255,0.07)" : "transparent",
                borderLeft: isActive ? "3px solid #026eff" : "3px solid transparent",
              }}
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-sm md:text-xs font-bold flex-shrink-0 relative"
                style={{ background: conv.avatarColor }}
              >
                {conv.initial}
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ef4444] flex items-center justify-center text-white text-[11px] font-bold">
                    {conv.unreadCount}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className="text-sm md:text-xs font-semibold truncate"
                    style={{ color: isActive ? "#026eff" : "#111827" }}
                  >
                    {conv.studentName}
                  </p>
                  <span className="text-[12px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                    {conv.lastTime}
                  </span>
                </div>
                <p className="text-xs md:text-[12px] text-gray-400 truncate mt-0.5">
                  {conv.lastMessage}
                </p>
              </div>

              {/* Arrow — mobile only */}
              <i className="ri-arrow-right-s-line text-gray-300 text-base flex-shrink-0 md:hidden" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

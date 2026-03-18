import { type StudentConversation } from "../../../mocks/teacherMessages";

interface Props {
  conversations: StudentConversation[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export default function MessageStudentList({ conversations, selectedId, onSelect }: Props) {
  return (
    <div
      className="flex flex-col h-full border-r border-gray-100 flex-shrink-0"
      style={{ width: 180 }}
    >
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-900">소통방</p>
        <p className="text-[10px] text-gray-400 mt-0.5">담당 아동 보호자</p>
      </div>

      {/* Student list */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.map((conv) => {
          const isActive = conv.studentId === selectedId;
          return (
            <button
              key={conv.studentId}
              onClick={() => onSelect(conv.studentId)}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer text-left"
              style={{
                background: isActive ? "rgba(2,110,255,0.07)" : "transparent",
                borderLeft: isActive ? "3px solid #026eff" : "3px solid transparent",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: conv.avatarColor }}
              >
                {conv.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: isActive ? "#026eff" : "#111827" }}
                  >
                    {conv.studentName}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 ml-1 w-4 h-4 rounded-full bg-[#026eff] flex items-center justify-center text-white text-[9px] font-bold">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

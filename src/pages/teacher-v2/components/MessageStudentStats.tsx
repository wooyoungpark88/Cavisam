import { type StudentConversation } from "../../../mocks/teacherMessages";

interface Props {
  conversation: StudentConversation;
}

function StatRow({
  emoji,
  label,
  value,
  change,
  positive,
}: {
  emoji: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  const isNeutral = change === "→";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-gray-400">
        <span className="text-xs">{emoji}</span>
        <span className="text-[10px] font-medium">{label}</span>
        {!isNeutral && (
          <span
            className="text-[9px] font-bold"
            style={{ color: positive ? "#10b981" : "#ef4444" }}
          >
            지난주 대비 {change}
          </span>
        )}
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-2xl font-bold text-gray-900 leading-none">{value}</span>
        {!isNeutral && (
          <span
            className="text-sm font-bold leading-none mb-0.5"
            style={{ color: positive ? "#10b981" : "#ef4444" }}
          >
            {positive ? "↑" : "↓"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function MessageStudentStats({ conversation }: Props) {
  const { weeklyStats: s } = conversation;

  return (
    <div
      className="flex flex-col h-full border-r border-gray-100 flex-shrink-0 bg-white"
      style={{ width: 224 }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: conversation.avatarColor }}
        >
          {conversation.initial}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{conversation.studentName}</p>
          <p className="text-[10px] text-gray-400">{conversation.parentName}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-6 overflow-y-auto">
        <StatRow
          emoji="🌙"
          label="평균 수면"
          value={s.sleep}
          change={s.sleepChange}
          positive={s.sleepPositive}
        />
        <StatRow
          emoji="😊"
          label="평균 컨디션"
          value={s.condition}
          change={s.conditionChange}
          positive={s.conditionPositive}
        />
        <StatRow
          emoji="🍱"
          label="평균 식사"
          value={s.meal}
          change={s.mealChange}
          positive={s.mealPositive}
        />
      </div>

      {/* AI care button */}
      <div className="px-4 pb-5 pt-2">
        <button
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-opacity hover:opacity-85"
          style={{ background: "linear-gradient(135deg, #026eff 0%, #0243c2 100%)" }}
        >
          <i className="ri-sparkling-2-line text-xs" />
          AI 케어 보기
        </button>
      </div>
    </div>
  );
}

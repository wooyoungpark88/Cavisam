import { useParentData } from "../../../contexts/ParentDataContext";

const TYPE_CONFIG: Record<string, { category: string; color: string }> = {
  self_harm: { category: "자해 행동", color: "#ef4444" },
  harm_others: { category: "타해 행동", color: "#f59e0b" },
  obsession: { category: "집착 행동", color: "#026eff" },
};

export default function BehaviorRecords() {
  const { behaviorEvents } = useParentData();
  const recent = behaviorEvents.slice(0, 10);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#026eff]/10">
            <i className="ri-file-list-3-line text-[#026eff] text-sm" />
          </div>
          <h2 className="text-sm font-bold text-gray-900">최근 행동 기록</h2>
        </div>
        <span className="text-xs text-gray-400">{behaviorEvents.length}건</span>
      </div>

      {/* Records */}
      <div className="divide-y divide-gray-50">
        {recent.length === 0 && (
          <div className="px-6 py-8 text-center text-xs text-gray-400">기록이 없습니다</div>
        )}
        {recent.map((event) => {
          const config = TYPE_CONFIG[event.type] ?? { category: event.type, color: "#6b7280" };
          const date = new Date(event.occurred_at).toLocaleString("ko-KR", {
            month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
          });

          return (
            <div key={event.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap flex-shrink-0"
                  style={{ background: `${config.color}15`, color: config.color }}
                >
                  {config.category}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 mb-0.5">{event.label || config.category}</p>
                  <p className="text-[11px] text-gray-300 mt-1">{date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

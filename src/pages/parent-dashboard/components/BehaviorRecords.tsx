import { mockRecords } from "../../../mocks/parentDashboard";

export default function BehaviorRecords() {
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
        <button className="text-xs text-[#026eff] font-medium hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap">
          전체 보기
        </button>
      </div>

      {/* Records */}
      <div className="divide-y divide-gray-50">
        {mockRecords.map((record) => (
          <div key={record.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-start gap-3">
              {/* Category badge */}
              <span
                className="mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap flex-shrink-0"
                style={{
                  background: `${record.categoryColor}15`,
                  color: record.categoryColor,
                }}
              >
                {record.category}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 mb-0.5">{record.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{record.detail}</p>
                <p className="text-[11px] text-gray-300 mt-1.5">{record.date} · {record.teacher}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

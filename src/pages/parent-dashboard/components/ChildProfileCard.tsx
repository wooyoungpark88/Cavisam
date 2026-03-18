import { mockChild, mockAIReport } from "../../../mocks/parentDashboard";

export default function ChildProfileCard() {
  return (
    <div
      className="rounded-2xl px-6 py-5 flex items-center gap-5 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #013ea0 0%, #026eff 100%)" }}
    >
      {/* Background circle */}
      <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

      {/* Avatar */}
      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-2xl bg-white/20 text-white text-2xl font-bold">
        {mockChild.avatarInitial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white/70 text-xs mb-0.5">담당 자녀</p>
        <p className="text-white text-lg font-bold leading-tight">
          {mockChild.name}
          <span className="text-white/60 text-sm font-normal ml-2">{mockChild.grade}</span>
        </p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-white/70 text-xs">
            <i className="ri-map-pin-line text-xs" />
            {mockChild.facility}
          </span>
          <span className="flex items-center gap-1 text-white/70 text-xs">
            <i className="ri-user-line text-xs" />
            담임 {mockChild.teacher}
          </span>
        </div>
      </div>

      {/* AI Report badge */}
      <div className="flex-shrink-0 bg-white/15 rounded-xl px-3 py-2 text-center hidden sm:block">
        <p className="text-white/70 text-[10px] mb-0.5">성장 단계</p>
        <p className="text-white text-sm font-bold">긍정 향상 중</p>
      </div>
    </div>
  );
}

export function AIReportCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#f59e0b]/10">
            <i className="ri-sparkling-2-line text-[#f59e0b] text-sm" />
          </div>
          <h2 className="text-sm font-bold text-gray-900">AI 성장 리포트</h2>
        </div>
        <span className="text-[11px] text-gray-400">{mockAIReport.period}</span>
      </div>

      <div className="px-6 py-5">
        {/* Highlights */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {mockAIReport.highlights.map((h) => (
            <div key={h.label} className="bg-gray-50 rounded-xl px-3 py-3 text-center">
              <p
                className="text-base font-bold mb-0.5"
                style={{ color: h.positive ? "#10b981" : "#ef4444" }}
              >
                {h.value}
              </p>
              <p className="text-[10px] text-gray-400 leading-snug">{h.label}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <p className="text-xs text-gray-500 leading-relaxed">{mockAIReport.summary}</p>

        <button className="mt-4 w-full py-2.5 rounded-xl border border-[#026eff]/30 text-[#026eff] text-xs font-semibold hover:bg-[#026eff]/5 transition-colors cursor-pointer whitespace-nowrap">
          전체 리포트 보기
        </button>
      </div>
    </div>
  );
}

import { mockBehaviorSummary } from "../../../mocks/teacherBehavior";

interface Props {
  onShowCCTV: (studentName?: string, behaviorType?: string, count?: number) => void;
}

export default function BehaviorSummaryCards({ onShowCCTV }: Props) {
  const s = mockBehaviorSummary;

  const cards = [
    {
      icon: "ri-bar-chart-grouped-line",
      label: "이번 주 도전행동",
      value: `${s.totalThisWeek}건`,
      sub: `전주 대비 ${s.changeRate}%`,
      subColor: s.changeRate < 0 ? "#10b981" : "#ef4444",
      subIcon: s.changeRate < 0 ? "ri-arrow-down-line" : "ri-arrow-up-line",
      bg: "rgba(2,110,255,0.06)",
      iconColor: "#026eff",
      cctvHint: true,
    },
    {
      icon: "ri-arrow-down-circle-line",
      label: "전주 대비 감소율",
      value: `${Math.abs(s.changeRate)}%↓`,
      sub: `${s.totalLastWeek}건 → ${s.totalThisWeek}건`,
      subColor: "#10b981",
      subIcon: "",
      bg: "rgba(16,185,129,0.06)",
      iconColor: "#10b981",
      cctvHint: false,
    },
    {
      icon: "ri-alert-line",
      label: "가장 많은 유형",
      value: s.mostFrequentType,
      sub: "이번 주 22건",
      subColor: s.mostFrequentTypeColor,
      subIcon: "",
      bg: "rgba(239,68,68,0.06)",
      iconColor: s.mostFrequentTypeColor,
      cctvHint: true,
    },
    {
      icon: "ri-user-star-line",
      label: "가장 많이 개선",
      value: s.mostImprovedName,
      sub: `${s.mostImprovedChange}% 감소`,
      subColor: "#10b981",
      subIcon: "",
      bg: "rgba(139,92,246,0.06)",
      iconColor: "#8b5cf6",
      cctvHint: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <button
          key={card.label}
          onClick={() => onShowCCTV(
            card.label === "가장 많이 개선" ? s.mostImprovedName : undefined,
            card.label === "가장 많은 유형" ? s.mostFrequentType : undefined,
            card.label === "이번 주 도전행동" ? s.totalThisWeek : undefined
          )}
          className="group bg-white rounded-2xl px-5 py-4 border border-gray-100 text-left transition-all hover:border-[#026eff]/30 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
          style={{ boxShadow: "none" }}
        >
          {/* CCTV hint badge */}
          {card.cctvHint && (
            <div
              className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
              style={{ background: "rgba(2,110,255,0.1)" }}
            >
              <i className="ri-vidicon-2-line text-[#026eff]" style={{ fontSize: 10 }} />
              <span className="text-[9px] font-bold text-[#026eff] whitespace-nowrap">영상 보기</span>
            </div>
          )}

          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: card.bg }}
            >
              <i className={`${card.icon} text-sm`} style={{ color: card.iconColor }} />
            </div>
            <p className="text-xs text-gray-500 leading-tight">{card.label}</p>
          </div>
          <p className="text-xl font-bold text-gray-900 leading-tight mb-1">{card.value}</p>
          <p className="text-[11px] font-semibold" style={{ color: card.subColor }}>
            {card.subIcon && <i className={`${card.subIcon} text-[10px] mr-0.5`} />}
            {card.sub}
          </p>
        </button>
      ))}
    </div>
  );
}

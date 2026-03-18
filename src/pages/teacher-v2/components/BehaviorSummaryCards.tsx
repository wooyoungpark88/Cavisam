import { mockBehaviorSummary } from "../../../mocks/teacherBehavior";

export default function BehaviorSummaryCards() {
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
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl px-5 py-4 border border-gray-100"
        >
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
        </div>
      ))}
    </div>
  );
}

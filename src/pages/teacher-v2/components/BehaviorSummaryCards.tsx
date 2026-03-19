import { useMemo } from "react";
import { useTeacherData } from "../../../contexts/TeacherDataContext";
import { BEHAVIOR_COLORS } from "../../../types/behavior";
import type { BehaviorSummary } from "../../../types/behavior";

interface Props {
  onShowCCTV: (studentName?: string, behaviorType?: string, count?: number) => void;
}

function getWeekRange(offset: number): [Date, Date] {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon + offset * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return [monday, sunday];
}

const TYPE_MAP: Record<string, string> = {
  self_harm: "자해행동",
  harm_others: "타해행동",
  obsession: "집착행동",
};

export default function BehaviorSummaryCards({ onShowCCTV }: Props) {
  const { behaviorStats, students } = useTeacherData();

  const s: BehaviorSummary = useMemo(() => {
    if (!behaviorStats) {
      return {
        totalThisWeek: 0,
        totalLastWeek: 0,
        changeRate: 0,
        mostFrequentType: "—",
        mostFrequentTypeColor: "#6b7280",
        needsAttentionCount: 0,
        mostImprovedName: "—",
        mostImprovedChange: 0,
      };
    }

    const [thisMonday, thisSunday] = getWeekRange(0);
    const [lastMonday, lastSunday] = getWeekRange(-1);

    let totalThisWeek = 0;
    let totalLastWeek = 0;

    behaviorStats.byDate.forEach((count, dateStr) => {
      const d = new Date(dateStr + "T00:00:00");
      if (d >= thisMonday && d <= thisSunday) totalThisWeek += count;
      if (d >= lastMonday && d <= lastSunday) totalLastWeek += count;
    });

    const changeRate = totalLastWeek > 0
      ? Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100)
      : 0;

    const typeCounts: Record<string, number> = {
      self_harm: behaviorStats.self_harm,
      harm_others: behaviorStats.harm_others,
      obsession: behaviorStats.obsession,
    };

    let maxKey = "self_harm";
    let maxVal = 0;
    for (const [key, val] of Object.entries(typeCounts)) {
      if (val > maxVal) {
        maxVal = val;
        maxKey = key;
      }
    }

    const mostFrequentType = TYPE_MAP[maxKey] ?? "—";
    const mostFrequentTypeColor = BEHAVIOR_COLORS[mostFrequentType] ?? "#6b7280";

    const mostImprovedName = students.length > 0 ? students[0].name : "—";

    return {
      totalThisWeek,
      totalLastWeek,
      changeRate,
      mostFrequentType,
      mostFrequentTypeColor,
      needsAttentionCount: 0,
      mostImprovedName,
      mostImprovedChange: 0,
    };
  }, [behaviorStats, students]);

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
      sub: `이번 주 ${s.totalThisWeek}건`,
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
              <i className="ri-vidicon-2-line text-[#026eff]" style={{ fontSize: 12 }} />
              <span className="text-[11px] font-bold text-[#026eff] whitespace-nowrap">영상 보기</span>
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
          <p className="text-[12.5px] font-semibold" style={{ color: card.subColor }}>
            {card.subIcon && <i className={`${card.subIcon} text-[12px] mr-0.5`} />}
            {card.sub}
          </p>
        </button>
      ))}
    </div>
  );
}

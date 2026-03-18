import { useState } from "react";
import BehaviorSummaryCards from "./BehaviorSummaryCards";
import BehaviorWeeklyChart from "./BehaviorWeeklyChart";
import BehaviorStudentRows from "./BehaviorStudentRows";

const PERIOD_OPTIONS = ["이번 주", "지난 2주", "이번 달"] as const;
type Period = (typeof PERIOD_OPTIONS)[number];

export default function BehaviorTrend() {
  const [period, setPeriod] = useState<Period>("이번 주");

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">행동 추이</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              담당 이용인 7명의 도전행동 주간 현황
            </p>
          </div>

          {/* Period selector */}
          <div
            className="flex items-center gap-0.5 p-1 rounded-xl"
            style={{ background: "#f3f4f6" }}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setPeriod(opt)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer whitespace-nowrap transition-all"
                style={{
                  background: period === opt ? "white" : "transparent",
                  color: period === opt ? "#111827" : "#9ca3af",
                  boxShadow: period === opt ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <BehaviorSummaryCards />

        {/* Weekly stacked chart + type distribution */}
        <BehaviorWeeklyChart />

        {/* Per-student table with sparklines */}
        <BehaviorStudentRows />
      </div>
    </div>
  );
}

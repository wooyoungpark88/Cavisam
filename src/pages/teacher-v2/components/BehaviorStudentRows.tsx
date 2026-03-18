import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { mockStudentBehaviorStats } from "../../../mocks/teacherBehavior";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ day: DAYS[i], v }));
  return (
    <ResponsiveContainer width={80} height={36}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
        />
        <Tooltip
          contentStyle={{ fontSize: 10, border: "none", borderRadius: 8, padding: "2px 6px" }}
          itemStyle={{ color: "#374151" }}
          labelStyle={{ display: "none" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function BehaviorStudentRows() {
  const sorted = [...mockStudentBehaviorStats].sort((a, b) => b.thisWeek - a.thisWeek);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">이용인별 상세 현황</h3>
        <span className="text-[11px] text-gray-400">이번 주 vs 지난 주</span>
      </div>

      {/* Table header */}
      <div className="px-6 py-2 bg-gray-50/70 grid grid-cols-12 gap-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        <div className="col-span-3">이용인</div>
        <div className="col-span-2 text-center">이번 주</div>
        <div className="col-span-2 text-center">지난 주</div>
        <div className="col-span-2 text-center">변화</div>
        <div className="col-span-2 text-center">주요 유형</div>
        <div className="col-span-1 text-center">추이</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {sorted.map((student) => {
          const isWorse = student.change > 0;
          const isNeutral = student.change === 0;
          const changePct = student.lastWeek > 0
            ? Math.round(((student.thisWeek - student.lastWeek) / student.lastWeek) * 100)
            : 0;

          return (
            <div
              key={student.id}
              className="px-6 py-3.5 grid grid-cols-12 gap-3 items-center hover:bg-gray-50/50 transition-colors"
            >
              {/* Student */}
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: student.color }}
                >
                  {student.initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
                </div>
              </div>

              {/* This week */}
              <div className="col-span-2 text-center">
                <span
                  className="text-sm font-bold"
                  style={{ color: isWorse ? "#ef4444" : "#374151" }}
                >
                  {student.thisWeek}건
                </span>
              </div>

              {/* Last week */}
              <div className="col-span-2 text-center">
                <span className="text-sm text-gray-400">{student.lastWeek}건</span>
              </div>

              {/* Change */}
              <div className="col-span-2 text-center">
                <span
                  className="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: isNeutral ? "#6b7280" : isWorse ? "#ef4444" : "#10b981",
                    background: isNeutral
                      ? "#f3f4f6"
                      : isWorse
                      ? "rgba(239,68,68,0.08)"
                      : "rgba(16,185,129,0.08)",
                  }}
                >
                  {!isNeutral && (
                    <i className={`${isWorse ? "ri-arrow-up-line" : "ri-arrow-down-line"} text-[10px]`} />
                  )}
                  {isNeutral ? "→" : `${Math.abs(changePct)}%`}
                </span>
              </div>

              {/* Main type */}
              <div className="col-span-2 text-center">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{
                    color: student.mainTypeColor,
                    background: `${student.mainTypeColor}12`,
                  }}
                >
                  {student.mainType}
                </span>
              </div>

              {/* Sparkline */}
              <div className="col-span-1 flex justify-center">
                <Sparkline data={student.daily} color={student.color} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

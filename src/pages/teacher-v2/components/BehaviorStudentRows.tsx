import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { mockStudentBehaviorStats } from "../../../mocks/teacherBehavior";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

interface Props {
  onShowCCTV: (studentName: string, behaviorType: string, count: number) => void;
}

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

export default function BehaviorStudentRows({ onShowCCTV }: Props) {
  const sorted = [...mockStudentBehaviorStats].sort((a, b) => b.thisWeek - a.thisWeek);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">이용인별 상세 현황</h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">이번 주 vs 지난 주</span>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: "rgba(2,110,255,0.08)", color: "#026eff" }}
          >
            <i className="ri-vidicon-2-line text-[10px]" />
            클릭 시 AI CCTV 영상
          </span>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid px-6 py-2 bg-gray-50/70 grid-cols-12 gap-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
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
            <button
              key={student.id}
              onClick={() => onShowCCTV(student.name, student.mainType, student.thisWeek)}
              className="w-full text-left px-6 py-3.5 transition-all cursor-pointer group hover:bg-blue-50/40"
            >
              {/* Desktop: grid layout */}
              <div className="hidden sm:grid grid-cols-12 gap-3 items-center">
                {/* Student */}
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: student.color }}
                  >
                    {student.initial}
                  </div>
                  <div className="min-w-0 flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
                    <i className="ri-vidicon-2-line text-[#026eff] text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </div>

                {/* This week */}
                <div className="col-span-2 text-center">
                  <span className="text-sm font-bold" style={{ color: isWorse ? "#ef4444" : "#374151" }}>
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
                      background: isNeutral ? "#f3f4f6" : isWorse ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
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
                    style={{ color: student.mainTypeColor, background: `${student.mainTypeColor}12` }}
                  >
                    {student.mainType}
                  </span>
                </div>

                {/* Sparkline */}
                <div className="col-span-1 flex justify-center">
                  <Sparkline data={student.daily} color={student.color} />
                </div>
              </div>

              {/* Mobile: card-style row */}
              <div className="flex sm:hidden items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: student.color }}
                >
                  {student.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{ color: student.mainTypeColor, background: `${student.mainTypeColor}12` }}
                    >
                      {student.mainType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold" style={{ color: isWorse ? "#ef4444" : "#374151" }}>
                      {student.thisWeek}건
                    </span>
                    <span className="text-[10px] text-gray-400">/ 지난주 {student.lastWeek}건</span>
                    <span
                      className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        color: isNeutral ? "#6b7280" : isWorse ? "#ef4444" : "#10b981",
                        background: isNeutral ? "#f3f4f6" : isWorse ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                      }}
                    >
                      {isNeutral ? "→" : `${Math.abs(changePct)}%`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Sparkline data={student.daily} color={student.color} />
                  <i className="ri-vidicon-2-line text-[#026eff] text-sm" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

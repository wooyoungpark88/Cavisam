import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { mockWeeklyDailyData, mockBehaviorTypes, mockStudentBehaviorStats } from "../../../mocks/teacherBehavior";

const STUDENTS = mockStudentBehaviorStats.map((s) => ({
  name: s.name,
  color: s.color,
}));

function BehaviorTypeBar() {
  const total = mockBehaviorTypes.reduce((sum, t) => sum + t.count, 0);
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 h-full">
      <h3 className="text-sm font-bold text-gray-900 mb-4">행동 유형 분포</h3>
      <div className="space-y-3.5">
        {mockBehaviorTypes.map((type) => {
          const pct = Math.round((type.count / total) * 100);
          return (
            <div key={type.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: type.color }}
                  />
                  <span className="text-xs text-gray-700 font-medium">{type.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">{type.count}건</span>
                  <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: type.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">총합</span>
        <span className="text-sm font-bold text-gray-900">{total}건</span>
      </div>
    </div>
  );
}

export default function BehaviorWeeklyChart() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-6">
      {/* Stacked bar chart */}
      <div className="xl:col-span-3 bg-white rounded-2xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">이용인별 주간 도전행동 추이</h3>
          <span className="text-[11px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
            2026년 3월 2주차
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={mockWeeklyDailyData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            barSize={12}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                fontSize: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
            />
            {STUDENTS.map((s) => (
              <Bar key={s.name} dataKey={s.name} stackId="a" fill={s.color} radius={s.name === STUDENTS[STUDENTS.length - 1].name ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Type distribution */}
      <div className="xl:col-span-2">
        <BehaviorTypeBar />
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { useTeacherData } from "../../../contexts/TeacherDataContext";
import { supabase } from "../../../lib/supabase";
import { BEHAVIOR_COLORS } from "../../../types/behavior";
import type { BehaviorTypeStat, WeeklyDailyDataPoint } from "../../../types/behavior";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

const AVATAR_COLORS = [
  "#026eff", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899",
];

const TYPE_MAP: Record<string, string> = {
  self_harm: "자해행동",
  harm_others: "타해행동",
  obsession: "집착행동",
};

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

function getWeekDates(): string[] {
  const [monday] = getWeekRange(0);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function getWeekLabel(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const weekOfMonth = Math.ceil(now.getDate() / 7);
  return `${year}년 ${month}월 ${weekOfMonth}주차`;
}

interface StudentInfo {
  name: string;
  color: string;
}

function BehaviorTypeBar({ types }: { types: BehaviorTypeStat[] }) {
  const total = types.reduce((sum, t) => sum + t.count, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 h-full">
        <h3 className="text-sm font-bold text-gray-900 mb-4">행동 유형 분포</h3>
        <div className="py-12 text-center text-sm text-gray-400">데이터가 없습니다</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 h-full">
      <h3 className="text-sm font-bold text-gray-900 mb-4">행동 유형 분포</h3>
      <div className="space-y-3.5">
        {types.map((type) => {
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
  const { students, orgId } = useTeacherData();
  const [weeklyData, setWeeklyData] = useState<WeeklyDailyDataPoint[]>([]);
  const [behaviorTypes, setBehaviorTypes] = useState<BehaviorTypeStat[]>([]);
  const [studentList, setStudentList] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const weekLabel = useMemo(() => getWeekLabel(), []);

  useEffect(() => {
    if (!orgId || students.length === 0) {
      setLoading(false);
      return;
    }

    const [thisMonday, thisSunday] = getWeekRange(0);
    const weekDates = getWeekDates();

    supabase
      .from("behavior_events")
      .select("student_id, type, occurred_at, students(name, organization_id)")
      .eq("confirmed", true)
      .gte("occurred_at", thisMonday.toISOString())
      .lte("occurred_at", thisSunday.toISOString())
      .then(({ data }) => {
        if (!data) {
          setLoading(false);
          return;
        }

        const filtered = data.filter((e: any) => e.students?.organization_id === orgId);

        const studentColorMap = new Map<string, { name: string; color: string }>();
        let colorIdx = 0;
        for (const s of students) {
          studentColorMap.set(String(s.id), {
            name: s.name,
            color: AVATAR_COLORS[colorIdx % AVATAR_COLORS.length],
          });
          colorIdx++;
        }

        const dailyByStudent = new Map<string, Map<string, number>>();
        const typeCountMap = new Map<string, number>();

        for (const event of filtered) {
          const sid = event.student_id as string;
          const dateStr = (event.occurred_at as string).slice(0, 10);
          const info = studentColorMap.get(sid);
          if (!info) continue;

          if (!dailyByStudent.has(info.name)) {
            dailyByStudent.set(info.name, new Map());
          }
          const dayMap = dailyByStudent.get(info.name)!;
          dayMap.set(dateStr, (dayMap.get(dateStr) ?? 0) + 1);

          const typeKey = event.type as string;
          const typeName = TYPE_MAP[typeKey] ?? typeKey;
          typeCountMap.set(typeName, (typeCountMap.get(typeName) ?? 0) + 1);
        }

        const activeStudents: StudentInfo[] = [];
        for (const s of students) {
          const info = studentColorMap.get(String(s.id));
          if (info && dailyByStudent.has(info.name)) {
            activeStudents.push(info);
          }
        }
        setStudentList(activeStudents);

        const weekly: WeeklyDailyDataPoint[] = weekDates.map((date, i) => {
          const point: WeeklyDailyDataPoint = { day: DAYS[i] };
          for (const [name, dayMap] of dailyByStudent) {
            point[name] = dayMap.get(date) ?? 0;
          }
          return point;
        });
        setWeeklyData(weekly);

        const types: BehaviorTypeStat[] = [];
        for (const [name, count] of typeCountMap) {
          types.push({
            name,
            count,
            color: BEHAVIOR_COLORS[name] ?? "#6b7280",
          });
        }
        types.sort((a, b) => b.count - a.count);
        setBehaviorTypes(types);

        setLoading(false);
      });
  }, [orgId, students.length]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-6">
        <div className="xl:col-span-3 bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">이용인별 주간 도전행동 추이</h3>
          <div className="py-12 text-center text-sm text-gray-400">데이터를 불러오는 중...</div>
        </div>
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 h-full">
            <h3 className="text-sm font-bold text-gray-900 mb-4">행동 유형 분포</h3>
            <div className="py-12 text-center text-sm text-gray-400">데이터를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  const hasData = weeklyData.length > 0 && studentList.length > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-6">
      {/* Stacked bar chart */}
      <div className="xl:col-span-3 bg-white rounded-2xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">이용인별 주간 도전행동 추이</h3>
          <span className="text-[11px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
            {weekLabel}
          </span>
        </div>
        {hasData ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={weeklyData}
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
              {studentList.map((s, idx) => (
                <Bar
                  key={s.name}
                  dataKey={s.name}
                  stackId="a"
                  fill={s.color}
                  radius={idx === studentList.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="py-12 text-center text-sm text-gray-400">데이터가 없습니다</div>
        )}
      </div>

      {/* Type distribution */}
      <div className="xl:col-span-2">
        <BehaviorTypeBar types={behaviorTypes} />
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { useTeacherData } from "../../../contexts/TeacherDataContext";
import { supabase } from "../../../lib/supabase";
import { BEHAVIOR_COLORS } from "../../../types/behavior";
import type { StudentBehaviorStat } from "../../../types/behavior";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

const AVATAR_COLORS = [
  "#026eff", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899",
];

const TYPE_MAP: Record<string, string> = {
  self_harm: "자해행동",
  harm_others: "타해행동",
  obsession: "집착행동",
};

interface Props {
  onShowCCTV: (studentName: string, behaviorType: string, count: number) => void;
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
          contentStyle={{ fontSize: 12, border: "none", borderRadius: 8, padding: "2px 6px" }}
          itemStyle={{ color: "#374151" }}
          labelStyle={{ display: "none" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function BehaviorStudentRows({ onShowCCTV }: Props) {
  const { students, orgId } = useTeacherData();
  const [stats, setStats] = useState<StudentBehaviorStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId || students.length === 0) {
      setLoading(false);
      return;
    }

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const [thisMonday, thisSunday] = getWeekRange(0);
    const [lastMonday, lastSunday] = getWeekRange(-1);
    const weekDates = getWeekDates();

    supabase
      .from("behavior_events")
      .select("student_id, type, occurred_at, students(name, organization_id)")
      .eq("confirmed", true)
      .gte("occurred_at", fourteenDaysAgo.toISOString())
      .then(({ data }) => {
        if (!data) {
          setLoading(false);
          return;
        }

        const filtered = data.filter((e: any) => e.students?.organization_id === orgId);

        const byStudent = new Map<string, {
          name: string;
          thisWeek: number;
          lastWeek: number;
          dailyMap: Map<string, number>;
          typeCounts: Map<string, number>;
        }>();

        for (const event of filtered) {
          const sid = event.student_id as string;
          const name = (event as any).students?.name ?? "?";
          if (!byStudent.has(sid)) {
            byStudent.set(sid, {
              name,
              thisWeek: 0,
              lastWeek: 0,
              dailyMap: new Map(),
              typeCounts: new Map(),
            });
          }
          const entry = byStudent.get(sid)!;
          const d = new Date(event.occurred_at as string);
          const dateStr = (event.occurred_at as string).slice(0, 10);

          if (d >= thisMonday && d <= thisSunday) entry.thisWeek++;
          if (d >= lastMonday && d <= lastSunday) entry.lastWeek++;

          entry.dailyMap.set(dateStr, (entry.dailyMap.get(dateStr) ?? 0) + 1);

          const typeKey = event.type as string;
          entry.typeCounts.set(typeKey, (entry.typeCounts.get(typeKey) ?? 0) + 1);
        }

        const studentMap = new Map(students.map((s) => [s.id, s]));

        const computed: StudentBehaviorStat[] = [];
        let colorIdx = 0;

        for (const student of students) {
          const sid = String(student.id);
          const entry = byStudent.get(sid);
          const color = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
          colorIdx++;

          const thisWeek = entry?.thisWeek ?? 0;
          const lastWeek = entry?.lastWeek ?? 0;
          const change = thisWeek - lastWeek;

          const daily = weekDates.map((date) => entry?.dailyMap.get(date) ?? 0);

          let mainTypeKey = "self_harm";
          let maxCount = 0;
          if (entry) {
            entry.typeCounts.forEach((cnt, key) => {
              if (cnt > maxCount) {
                maxCount = cnt;
                mainTypeKey = key;
              }
            });
          }
          const mainType = TYPE_MAP[mainTypeKey] ?? mainTypeKey;
          const mainTypeColor = BEHAVIOR_COLORS[mainType] ?? "#6b7280";

          const nameStr = studentMap.get(student.id)?.name ?? student.name;
          const initial = nameStr.length >= 2 ? nameStr[1] : (nameStr[0] ?? "?");

          computed.push({
            id: student.id,
            name: nameStr,
            initial,
            color,
            thisWeek,
            lastWeek,
            change,
            daily,
            mainType,
            mainTypeColor,
          });
        }

        setStats(computed);
        setLoading(false);
      });
  }, [orgId, students.length]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">이용인별 상세 현황</h3>
        </div>
        <div className="px-6 py-12 text-center text-sm text-gray-400">
          데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">이용인별 상세 현황</h3>
        </div>
        <div className="px-6 py-12 text-center text-sm text-gray-400">
          데이터가 없습니다
        </div>
      </div>
    );
  }

  const sorted = [...stats].sort((a, b) => b.thisWeek - a.thisWeek);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">이용인별 상세 현황</h3>
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] text-gray-400">이번 주 vs 지난 주</span>
          <span
            className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: "rgba(2,110,255,0.08)", color: "#026eff" }}
          >
            <i className="ri-vidicon-2-line text-[12px]" />
            클릭 시 AI CCTV 영상
          </span>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid px-6 py-2 bg-gray-50/70 grid-cols-12 gap-3 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
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
                      <i className={`${isWorse ? "ri-arrow-up-line" : "ri-arrow-down-line"} text-[12px]`} />
                    )}
                    {isNeutral ? "→" : `${Math.abs(changePct)}%`}
                  </span>
                </div>

                {/* Main type */}
                <div className="col-span-2 text-center">
                  <span
                    className="text-[12px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
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
                      className="text-[12px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{ color: student.mainTypeColor, background: `${student.mainTypeColor}12` }}
                    >
                      {student.mainType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold" style={{ color: isWorse ? "#ef4444" : "#374151" }}>
                      {student.thisWeek}건
                    </span>
                    <span className="text-[12px] text-gray-400">/ 지난주 {student.lastWeek}건</span>
                    <span
                      className="inline-flex items-center gap-0.5 text-[12px] font-bold px-1.5 py-0.5 rounded-full"
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

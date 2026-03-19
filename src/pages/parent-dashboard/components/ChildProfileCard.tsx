import { useParentData } from "../../../contexts/ParentDataContext";

export default function ChildProfileCard() {
  const { activeChild, careTeam } = useParentData();
  const childName = activeChild?.name ?? "자녀";
  const childInitial = childName.charAt(0);
  const facility = "CareVia";
  const leadTeacher = careTeam.find((m) => m.role === "lead");
  const teacherName = leadTeacher?.member?.name ?? "담임 선생님";

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
        {childInitial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white/70 text-xs mb-0.5">담당 자녀</p>
        <p className="text-white text-lg font-bold leading-tight">
          {childName}
        </p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-white/70 text-xs">
            <i className="ri-map-pin-line text-xs" />
            {facility}
          </span>
          <span className="flex items-center gap-1 text-white/70 text-xs">
            <i className="ri-user-line text-xs" />
            담임 {teacherName}
          </span>
        </div>
      </div>

      {/* AI Report badge */}
      <div className="flex-shrink-0 bg-white/15 rounded-xl px-3 py-2 text-center hidden sm:block">
        <p className="text-white/70 text-[10px] mb-0.5">성장 단계</p>
        <p className="text-white text-sm font-bold">데이터 수집 중</p>
      </div>
    </div>
  );
}

export function AIReportCard() {
  const { behaviorEvents } = useParentData();
  const total = behaviorEvents.length;
  const thisWeek = behaviorEvents.filter((e) => {
    const d = new Date(e.occurred_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;
  const lastWeek = behaviorEvents.filter((e) => {
    const d = new Date(e.occurred_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    return d >= twoWeeksAgo && d < weekAgo;
  }).length;
  const changeRate = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#f59e0b]/10">
            <i className="ri-sparkling-2-line text-[#f59e0b] text-sm" />
          </div>
          <h2 className="text-sm font-bold text-gray-900">행동 분석 요약</h2>
        </div>
        <span className="text-[11px] text-gray-400">최근 30일</span>
      </div>

      <div className="px-6 py-5">
        {/* Highlights */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl px-3 py-3 text-center">
            <p className="text-base font-bold mb-0.5" style={{ color: changeRate <= 0 ? "#10b981" : "#ef4444" }}>
              {changeRate <= 0 ? `${changeRate}%` : `+${changeRate}%`}
            </p>
            <p className="text-[10px] text-gray-400 leading-snug">주간 변화율</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-3 text-center">
            <p className="text-base font-bold mb-0.5 text-[#026eff]">{thisWeek}건</p>
            <p className="text-[10px] text-gray-400 leading-snug">이번 주 행동</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-3 text-center">
            <p className="text-base font-bold mb-0.5 text-gray-700">{total}건</p>
            <p className="text-[10px] text-gray-400 leading-snug">30일 총 기록</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          최근 30일간 총 {total}건의 행동이 기록되었습니다.
          {changeRate <= 0 ? " 이번 주 행동 빈도가 감소 추세입니다." : " 이번 주 행동 빈도가 증가했으니 관찰이 필요합니다."}
        </p>
      </div>
    </div>
  );
}

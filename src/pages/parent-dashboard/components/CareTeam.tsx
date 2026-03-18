import { useParentData } from "../../../contexts/ParentDataContext";

const ROLE_LABELS: Record<string, string> = {
  lead: "주 담당",
  support: "보조 담당",
  observer: "참관",
};

const ROLE_COLORS: Record<string, string> = {
  lead: "#026eff",
  support: "#10b981",
  observer: "#f59e0b",
};

export default function CareTeam() {
  const { careTeam } = useParentData();

  return (
    <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900">돌봄 팀</h1>
        <p className="text-xs text-gray-400 mt-0.5">아이의 돌봄을 함께하는 전문가 팀</p>
      </div>

      {careTeam.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <i className="ri-team-line text-3xl text-gray-200 mb-2" />
          <p className="text-sm text-gray-400">아직 배정된 돌봄 팀원이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {careTeam.map((member) => {
            const color = ROLE_COLORS[member.role] ?? "#8b5cf6";
            const name = member.member?.name ?? "팀원";
            const initial = name.charAt(0);
            const roleLabel = ROLE_LABELS[member.role] ?? member.role;

            return (
              <div key={member.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-2xl text-white text-base font-bold"
                  style={{ background: color }}
                >
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{name}</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap" style={{ background: `${color}15`, color }}>
                      {roleLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-3 truncate">해오름 발달장애인복지관</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#026eff]/10">
            <i className="ri-information-line text-[#026eff] text-sm" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700 mb-1">긴급 연락 안내</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              응급 상황이나 긴급 문의는 담임 선생님에게 먼저 연락해 주세요.
              근무 외 시간에는 시설 대표번호 <span className="font-semibold text-gray-700">02-123-4567</span>로 연락 주시면 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

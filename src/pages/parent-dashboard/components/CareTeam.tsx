import { mockCareTeam } from "../../../mocks/parentDashboard";

export default function CareTeam() {
  return (
    <div className="p-7 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900">돌봄 팀</h1>
        <p className="text-xs text-gray-400 mt-0.5">아이의 돌봄을 함께하는 전문가 팀</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockCareTeam.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
            {/* Avatar */}
            <div
              className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl text-white text-base font-bold"
              style={{ background: member.color }}
            >
              {member.initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-gray-900">{member.name}</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: `${member.color}15`, color: member.color }}>
                  {member.role}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mb-3">{member.department}</p>
              <div className="space-y-1.5">
                {member.contact.map((c) => (
                  <div key={c.type} className="flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <i className={`${c.icon} text-xs text-gray-400`} />
                    </div>
                    <span className="text-xs text-gray-500">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact note */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#026eff]/10">
            <i className="ri-information-line text-[#026eff] text-sm" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700 mb-1">긴급 연락 안내</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              응급 상황이나 긴급 문의는 담임 교사(박선생님)에게 먼저 연락해 주세요.
              근무 외 시간에는 시설 대표번호 <span className="font-semibold text-gray-700">02-123-4567</span>로 연락 주시면 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

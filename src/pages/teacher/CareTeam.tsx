interface TeamMember {
  id: string;
  name: string;
  role: string;
  access: string;
  accessColor: 'blue' | 'green' | 'yellow' | 'gray';
  initial: string;
}

interface ScheduleItem {
  id: string;
  task: string;
  assignee: string;
  date: string;
}

const teamMembers: TeamMember[] = [
  { id: '1', name: '김민준 어머니', role: '보호자(엄마)', access: '전체 접근', accessColor: 'blue', initial: '김' },
  { id: '2', name: '김민준 아버지', role: '보호자(아빠)', access: '전체 접근', accessColor: 'blue', initial: '김' },
  { id: '3', name: '김태희', role: '담당 교사', access: '기록+열람', accessColor: 'green', initial: '김' },
  { id: '4', name: '박미영', role: 'BCBA 치료사', access: '행동분석', accessColor: 'yellow', initial: '박' },
  { id: '5', name: '정민호', role: '활동보조인', access: '일일기록', accessColor: 'gray', initial: '정' },
];

const scheduleItems: ScheduleItem[] = [
  { id: '1', task: 'OT 치료 데려가기', assignee: '김민준 아버지', date: '3/19 (목)' },
  { id: '2', task: '약 처방전 갱신', assignee: '김민준 어머니', date: '3/20 (금)' },
  { id: '3', task: '행동분석 보고서 검토', assignee: '박미영', date: '3/21 (토)' },
];

const accessBadgeClasses: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  green: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  gray: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
};

const avatarBgClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  gray: 'bg-gray-200 text-gray-600',
};

export function CareTeam() {
  return (
    <div className="h-full space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">돌봄 팀</h2>
        <p className="text-sm text-gray-500 mt-1">케어 빌리지</p>
      </div>

      {/* 팀원 목록 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">팀원 ({teamMembers.length}명)</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-4 flex items-center gap-3">
              {/* 아바타 */}
              <div
                className={`w-11 h-11 rounded-full ${avatarBgClasses[member.accessColor]} flex items-center justify-center shrink-0`}
              >
                <span className="text-sm font-bold">{member.initial}</span>
              </div>

              {/* 이름 + 역할 */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-sm">{member.name}</div>
                <div className="text-xs text-gray-500">{member.role}</div>
              </div>

              {/* 접근 권한 뱃지 */}
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${accessBadgeClasses[member.accessColor]}`}
              >
                {member.access}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 이번 주 돌봄 일정 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">이번 주 돌봄 일정</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {scheduleItems.map((item, index) => (
            <div key={item.id} className="p-4 flex items-start gap-3">
              {/* 번호 */}
              <div className="w-7 h-7 rounded-full bg-[#026eff]/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[#026eff]">{index + 1}</span>
              </div>

              {/* 일정 정보 */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-sm">{item.task}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.assignee}</div>
              </div>

              {/* 날짜 */}
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full shrink-0">
                {item.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

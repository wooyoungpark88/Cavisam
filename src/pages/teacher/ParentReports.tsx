import { useState } from 'react';

interface StudentReport {
  id: string;
  studentName: string;
  parentName: string;
  time: string;
  received: boolean;
  condition: 'good' | 'normal' | 'bad';
  alert: boolean;
  confirmed: boolean;
  medication: boolean;
  sleep: string;
  breakfast: string;
  parentNote: string;
  aiSummary: string;
}

const mockReports: StudentReport[] = [
  {
    id: '1',
    studentName: '김민준',
    parentName: '김민준 어머니',
    time: '07:45',
    received: true,
    condition: 'good',
    alert: false,
    confirmed: false,
    medication: true,
    sleep: '9시간 (21:00~06:00)',
    breakfast: '밥, 국, 반찬 골고루',
    parentNote: '',
    aiSummary: '컨디션 양호. 수면·식사 모두 안정적입니다.',
  },
  {
    id: '2',
    studentName: '이서연',
    parentName: '이서연 어머니',
    time: '08:10',
    received: true,
    condition: 'bad',
    alert: true,
    confirmed: false,
    medication: true,
    sleep: '5시간 (01:00~06:00)',
    breakfast: '우유만 조금',
    parentNote: '어젯밤 좀 뒤척였어요. 점심 약 복용 부탁드립니다.',
    aiSummary: '수면 부족 + 식사 불량. 오전 중 컨디션 저하 가능성 높습니다. 주의 관찰이 필요합니다.',
  },
  {
    id: '3',
    studentName: '박지호',
    parentName: '박지호 아버지',
    time: '08:25',
    received: true,
    condition: 'normal',
    alert: false,
    confirmed: false,
    medication: false,
    sleep: '7시간 (22:00~05:00)',
    breakfast: '빵, 우유',
    parentNote: '',
    aiSummary: '전반적으로 보통 컨디션. 특이사항 없음.',
  },
  {
    id: '4',
    studentName: '최수아',
    parentName: '최수아 어머니',
    time: '07:55',
    received: true,
    condition: 'good',
    alert: false,
    confirmed: false,
    medication: true,
    sleep: '10시간 (20:30~06:30)',
    breakfast: '밥, 계란, 과일',
    parentNote: '',
    aiSummary: '컨디션 매우 양호. 충분한 수면과 균형 잡힌 식사.',
  },
  {
    id: '5',
    studentName: '정도현',
    parentName: '정도현 어머니',
    time: '',
    received: false,
    condition: 'normal',
    alert: false,
    confirmed: false,
    medication: false,
    sleep: '',
    breakfast: '',
    parentNote: '',
    aiSummary: '',
  },
];

const conditionLabel = (c: 'good' | 'normal' | 'bad') =>
  c === 'good' ? '좋음' : c === 'normal' ? '보통' : '나쁨';
const conditionIcon = (c: 'good' | 'normal' | 'bad') =>
  c === 'good' ? '☀️' : c === 'normal' ? '🌤️' : '🌧️';

export function ParentReports() {
  const [reports, setReports] = useState<StudentReport[]>(mockReports);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const receivedCount = reports.filter((r) => r.received).length;
  const totalCount = reports.length;

  const handleConfirm = (id: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, confirmed: !r.confirmed } : r)));
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const conditionAvatarBg = (r: StudentReport) => {
    if (!r.received) return 'bg-gray-200';
    if (r.condition === 'good') return 'bg-green-100';
    if (r.condition === 'bad') return 'bg-red-100';
    return 'bg-yellow-100';
  };

  const conditionAvatarRing = (r: StudentReport) => {
    if (!r.received) return 'ring-gray-300';
    if (r.condition === 'good') return 'ring-green-400';
    if (r.condition === 'bad') return 'ring-red-400';
    return 'ring-yellow-400';
  };

  return (
    <div className="h-full max-w-5xl mx-auto space-y-5">
      {/* 헤더 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">보호자 아침 보고</h2>
        <p className="text-sm text-gray-500 mt-1">
          해오름반 · <span className="font-semibold text-[#026eff]">{receivedCount}/{totalCount}명</span> 수신
        </p>
      </div>

      {/* 퀵 오버뷰 */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] transition-shadow duration-300 p-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {reports.map((r) => (
            <div key={r.id} className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`w-11 h-11 rounded-full ${conditionAvatarBg(r)} ring-2 ${conditionAvatarRing(r)} flex items-center justify-center`}
              >
                <span className="text-sm font-bold text-gray-600">
                  {r.studentName.slice(0, 1)}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">{r.studentName}</span>
              {r.received ? (
                <span className="text-xs">{conditionIcon(r.condition)}</span>
              ) : (
                <span className="text-xs text-gray-400">미수신</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 수신된 보고 카드 */}
      <div className="space-y-3">
        {reports
          .filter((r) => r.received)
          .map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300 overflow-hidden"
            >
              {/* 카드 헤더 */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${conditionAvatarBg(r)} flex items-center justify-center`}
                    >
                      <span className="text-sm font-bold text-gray-600">
                        {r.studentName.slice(0, 1)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">{r.studentName}</span>
                        {r.alert && (
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                            주의
                          </span>
                        )}
                        {r.confirmed && (
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                            확인됨 ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {r.parentName} · {r.time}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(r.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${expandedId === r.id ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* 상태 뱃지 */}
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      r.condition === 'good'
                        ? 'bg-green-50 text-green-700'
                        : r.condition === 'bad'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    {conditionIcon(r.condition)} 컨디션 {conditionLabel(r.condition)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      r.medication ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    💊 약복용 {r.medication ? 'O' : 'X'}
                  </span>
                </div>

                {/* AI 요약 */}
                <div
                  className={`mt-3 rounded-xl p-3 ${
                    r.alert ? 'bg-red-50 border border-red-100' : 'bg-purple-50 border border-purple-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm shrink-0">🤖</span>
                    <p className={`text-xs leading-relaxed ${r.alert ? 'text-red-700' : 'text-purple-700'}`}>
                      {r.aiSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* 확장 상세 */}
              {expandedId === r.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
                  {/* 수면/식사/약 그리드 */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white rounded-xl p-3 text-center">
                      <div className="text-lg mb-1">😴</div>
                      <div className="text-xs text-gray-400 mb-0.5">수면</div>
                      <div className="text-xs font-medium text-gray-700">{r.sleep || '-'}</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center">
                      <div className="text-lg mb-1">🍚</div>
                      <div className="text-xs text-gray-400 mb-0.5">아침식사</div>
                      <div className="text-xs font-medium text-gray-700">{r.breakfast || '-'}</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center">
                      <div className="text-lg mb-1">💊</div>
                      <div className="text-xs text-gray-400 mb-0.5">약복용</div>
                      <div className="text-xs font-medium text-gray-700">
                        {r.medication ? '복용 완료' : '미복용'}
                      </div>
                    </div>
                  </div>

                  {/* 보호자 메모 */}
                  {r.parentNote && (
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <div className="text-xs text-gray-400 mb-1 font-medium">보호자 전달사항</div>
                      <p className="text-sm text-gray-700">{r.parentNote}</p>
                    </div>
                  )}

                  {/* 확인 완료 버튼 */}
                  <button
                    onClick={() => handleConfirm(r.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      r.confirmed
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        : 'bg-[#026eff] text-white hover:bg-blue-700'
                    }`}
                  >
                    {r.confirmed ? '확인 취소' : '확인 완료'}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* 미수신 보고 */}
      {reports
        .filter((r) => !r.received)
        .map((r) => (
          <div
            key={r.id}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-400">{r.studentName.slice(0, 1)}</span>
              </div>
              <div>
                <span className="font-bold text-gray-600">{r.studentName}</span>
                <p className="text-xs text-gray-400">{r.parentName}</p>
                <span className="text-xs text-gray-400 font-medium">아침 보고 미수신</span>
              </div>
            </div>
            <button className="text-xs font-bold text-[#026eff] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
              알림 보내기
            </button>
          </div>
        ))}
    </div>
  );
}

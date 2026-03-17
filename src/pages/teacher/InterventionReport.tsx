import { useState } from 'react';

const cardClass =
  'bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] border border-gray-200/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300';

const today = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

const summaryCards = [
  {
    label: '도전행동 발생',
    value: '3회',
    trend: 'down',
    trendLabel: '-2회',
    color: 'text-red-500',
    bgIcon: 'bg-red-50',
  },
  {
    label: '평균 안정 시간',
    value: '2.5분',
    trend: 'up',
    trendLabel: '+0.8분',
    color: 'text-blue-500',
    bgIcon: 'bg-blue-50',
  },
  {
    label: '중재 성공률',
    value: '85%',
    trend: 'up',
    trendLabel: '+12%',
    color: 'text-emerald-500',
    bgIcon: 'bg-emerald-50',
  },
  {
    label: '주간 변화',
    value: '-30%',
    trend: 'down',
    trendLabel: '개선',
    color: 'text-violet-500',
    bgIcon: 'bg-violet-50',
  },
];

const behaviorEvents = [
  {
    time: '09:42',
    type: '자해',
    typeColor: 'bg-red-100 text-red-700',
    severity: '높음',
    severityColor: 'bg-red-500',
    description: '머리를 책상에 반복적으로 부딪힘',
    intervention: '감각 대체 도구(스퀴시볼) 제공 → 2분 내 안정',
  },
  {
    time: '11:15',
    type: '집착',
    typeColor: 'bg-amber-100 text-amber-700',
    severity: '중간',
    severityColor: 'bg-amber-500',
    description: '특정 장난감을 놓지 않으려 하며 소리 지름',
    intervention: '타이머 시각 지원 + 대체 활동 제안 → 4분 내 전환 성공',
  },
  {
    time: '14:30',
    type: '타해',
    typeColor: 'bg-orange-100 text-orange-700',
    severity: '높음',
    severityColor: 'bg-red-500',
    description: '옆 친구를 밀침 (점심 후 이동 시)',
    intervention: '물리적 거리 확보 + 언어적 리디렉션 → 1분 내 안정',
  },
  {
    time: '15:50',
    type: '자해',
    typeColor: 'bg-red-100 text-red-700',
    severity: '낮음',
    severityColor: 'bg-yellow-500',
    description: '손등을 가볍게 깨물기 시작',
    intervention: '사전 휴식 제공(쿨다운 영역) → 즉시 안정',
  },
];

const strategies = [
  {
    name: '사전 감각 조절 루틴 도입',
    description:
      '오후 수업 시작 전 5분간 감각 조절 활동(스트레칭, 무거운 담요 감싸기)을 실시하여 피로 누적으로 인한 자해행동 발생을 사전에 예방합니다.',
    confidence: 92,
    priority: '높음',
    priorityColor: 'bg-red-100 text-red-700',
  },
  {
    name: '시각적 전환 스케줄 카드',
    description:
      '활동 전환 5분 전부터 시각적 타이머와 다음 활동 사진 카드를 제시하여, 전환 상황에서의 불안을 줄이고 집착 행동을 완화합니다.',
    confidence: 87,
    priority: '높음',
    priorityColor: 'bg-red-100 text-red-700',
  },
  {
    name: '또래 중재자 짝꿍 배치',
    description:
      '이동 시간에 민준이와 친밀한 또래를 짝꿍으로 배치하여, 타해행동이 발생하기 전 사회적 지지를 통해 안정감을 제공합니다.',
    confidence: 74,
    priority: '중간',
    priorityColor: 'bg-amber-100 text-amber-700',
  },
];

const insights = [
  {
    icon: '⏰',
    title: '시간대 패턴',
    text: '오후 2시~4시 피로 시간대에 자해행동이 집중 발생합니다. 해당 시간대 사전 휴식 또는 감각 조절 활동 제공을 권장합니다.',
  },
  {
    icon: '🔄',
    title: '전환 상황 민감도',
    text: '활동 간 전환 시점에서 도전행동 발생 확률이 평소 대비 2.4배 높습니다. 시각적 예고와 단계적 전환이 효과적입니다.',
  },
  {
    icon: '📈',
    title: '주간 개선 추이',
    text: '지난 4주간 도전행동 발생 빈도가 주당 평균 8회 → 3회로 62.5% 감소했습니다. 현재 중재 전략의 지속 적용이 효과적입니다.',
  },
];

export function InterventionReport() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">
            AI 행동중재 리포트
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-700">김민준</span> 학생
            &middot; {today}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI 분석 완료
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className={`${cardClass} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">
                {card.label}
              </span>
              <span className={`w-8 h-8 rounded-lg ${card.bgIcon} flex items-center justify-center`}>
                {card.trend === 'down' ? (
                  <svg className={`w-4 h-4 ${card.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                ) : (
                  <svg className={`w-4 h-4 ${card.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
              </span>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.trendLabel} (전주 대비)</p>
          </div>
        ))}
      </div>

      {/* 최근 행동 분석 */}
      <div className={`${cardClass} p-6`}>
        <h2 className="text-base font-bold text-[#0f172a] mb-4">
          최근 행동 분석
        </h2>
        <div className="space-y-3">
          {behaviorEvents.map((event, idx) => (
            <div key={idx}>
              <button
                className="w-full text-left"
                onClick={() =>
                  setExpandedEvent(expandedEvent === idx ? null : idx)
                }
              >
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                  <span className="text-xs font-mono text-gray-400 w-12 shrink-0">
                    {event.time}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${event.typeColor}`}>
                    {event.type}
                  </span>
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {event.description}
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${event.severityColor}`} />
                    <span className="text-xs text-gray-500">{event.severity}</span>
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedEvent === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {expandedEvent === idx && (
                <div className="ml-16 mt-2 mb-1 p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                  <p className="text-xs font-medium text-blue-700 mb-1">
                    적용된 중재
                  </p>
                  <p className="text-sm text-gray-700">{event.intervention}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI 추천 중재 전략 */}
      <div className={`${cardClass} p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-bold text-[#0f172a]">
            AI 추천 중재 전략
          </h2>
          <span className="text-xs text-gray-400 font-medium bg-gray-100 rounded-full px-2 py-0.5">
            GPT-4o 기반
          </span>
        </div>
        <div className="space-y-3">
          {strategies.map((strategy, idx) => (
            <div key={idx}>
              <button
                className="w-full text-left"
                onClick={() =>
                  setExpandedStrategy(expandedStrategy === idx ? null : idx)
                }
              >
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {strategy.name}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${strategy.priorityColor}`}>
                        {strategy.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {strategy.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">신뢰도</p>
                      <p className="text-sm font-bold text-[#026eff]">
                        {strategy.confidence}%
                      </p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${expandedStrategy === idx ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              {expandedStrategy === idx && (
                <div className="ml-4 mt-2 mb-1 p-4 rounded-lg bg-blue-50/60 border border-blue-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {strategy.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#026eff] rounded-full transition-all duration-500"
                        style={{ width: `${strategy.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#026eff]">
                      {strategy.confidence}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 행동 패턴 인사이트 */}
      <div className={`${cardClass} p-6`}>
        <h2 className="text-base font-bold text-[#0f172a] mb-4">
          행동 패턴 인사이트
        </h2>
        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-transparent"
            >
              <span className="text-lg shrink-0 mt-0.5">{insight.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {insight.title}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {insight.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          disabled
          className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
        >
          PDF 다운로드
        </button>
        <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#026eff] hover:bg-[#0254cc] transition-colors shadow-sm">
          보호자에게 공유
        </button>
      </div>
    </div>
  );
}

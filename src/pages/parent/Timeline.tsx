import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ───── Types ───── */
interface Reactions {
  heart: boolean;
  thumbsUp: boolean;
  pray: boolean;
  confirmed: boolean;
}

type CardType =
  | 'parent_report'
  | 'condition'
  | 'meal'
  | 'medication'
  | 'photo'
  | 'challenge'
  | 'ai_insight';

interface TimelineEntry {
  id: string;
  type: CardType;
  time: string;
  teacher: string;
  emoji: string;
  content: React.ReactNode;
}

/* ───── Mock Data ───── */
const TODAY = new Date();
const DATE_STRING = `${TODAY.getFullYear()}년 ${TODAY.getMonth() + 1}월 ${TODAY.getDate()}일`;

const SUMMARY_BADGES = [
  { label: '컨디션', value: '좋음', color: 'bg-emerald-50 text-emerald-700' },
  { label: '도전행동', value: '1회', color: 'bg-amber-50 text-amber-700' },
  { label: '식사', value: '양호', color: 'bg-blue-50 text-blue-700' },
  { label: '약', value: '완료', color: 'bg-purple-50 text-purple-700' },
];

const TIMELINE_DATA: TimelineEntry[] = [
  {
    id: '1',
    type: 'parent_report',
    time: '07:45',
    teacher: '보호자',
    emoji: '📋',
    content: null, // rendered inline
  },
  {
    id: '2',
    type: 'condition',
    time: '08:45',
    teacher: '김미영 선생님',
    emoji: '☀️',
    content: '아침에 밝은 표정으로 등원했어요',
  },
  {
    id: '3',
    type: 'meal',
    time: '12:10',
    teacher: '김미영 선생님',
    emoji: '🍽️',
    content: '점심 — 밥, 국, 반찬 대부분 먹음',
  },
  {
    id: '4',
    type: 'medication',
    time: '12:30',
    teacher: '김미영 선생님',
    emoji: '💊',
    content: '리스페리돈 0.5mg 복용 완료',
  },
  {
    id: '5',
    type: 'photo',
    time: '14:00',
    teacher: '박지은 선생님',
    emoji: '📸',
    content: '미술활동 — 점토로 동물 만들기',
  },
  {
    id: '6',
    type: 'challenge',
    time: '15:20',
    teacher: '김미영 선생님',
    emoji: '⚠️',
    content: '자해 행동 1회 감지 → 직원 즉시 개입',
  },
  {
    id: '7',
    type: 'condition',
    time: '16:30',
    teacher: '김미영 선생님',
    emoji: '🌤️',
    content: '하원 시 차분한 상태',
  },
  {
    id: '8',
    type: 'ai_insight',
    time: '18:00',
    teacher: 'AI 분석',
    emoji: '🤖',
    content: null, // rendered inline
  },
];

/* ───── Sub-Components ───── */
function ReactionBar({
  reactions,
  onToggle,
}: {
  reactions: Reactions;
  onToggle: (key: keyof Reactions) => void;
}) {
  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
      <button
        type="button"
        onClick={() => onToggle('heart')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
          reactions.heart
            ? 'bg-red-50 border-red-200 text-red-600'
            : 'bg-white border-gray-200 text-text-muted hover:border-gray-300'
        }`}
      >
        ❤️
      </button>
      <button
        type="button"
        onClick={() => onToggle('thumbsUp')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
          reactions.thumbsUp
            ? 'bg-blue-50 border-blue-200 text-blue-600'
            : 'bg-white border-gray-200 text-text-muted hover:border-gray-300'
        }`}
      >
        👍
      </button>
      <button
        type="button"
        onClick={() => onToggle('pray')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
          reactions.pray
            ? 'bg-amber-50 border-amber-200 text-amber-600'
            : 'bg-white border-gray-200 text-text-muted hover:border-gray-300'
        }`}
      >
        🙏
      </button>
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => onToggle('confirmed')}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
          reactions.confirmed
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-white border-gray-200 text-text-muted hover:border-gray-300'
        }`}
      >
        {reactions.confirmed ? '✅ 확인' : '확인'}
      </button>
    </div>
  );
}

function ParentReportContent() {
  const badges = [
    { label: '수면', value: '충분', icon: '🌙' },
    { label: '컨디션', value: '좋음', icon: '☀️' },
    { label: '식사', value: '전부', icon: '🍱' },
    { label: '약', value: '복용완료', icon: '💊' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <span className="text-sm">{b.icon}</span>
            <span className="text-xs text-text-muted">{b.label}</span>
            <span className="text-xs font-semibold text-text-primary ml-auto">{b.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-2">
        <p className="text-xs font-semibold text-purple-600 mb-1">🤖 AI 요약</p>
        <p className="text-xs text-purple-800 leading-relaxed">
          수면은 충분히 잤고 (숙면). 컨디션이 좋은 상태입니다. 아침을 전부 먹었고, 약은 복용 완료했습니다.
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs text-emerald-600 font-medium">선생님 확인 완료</span>
      </div>
    </div>
  );
}

function ChallengeContent() {
  return (
    <div>
      <p className="text-sm text-text-primary mb-3">자해 행동 1회 감지 → 직원 즉시 개입</p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <p className="text-xs font-semibold text-blue-600 mb-1">🤖 AI 인사이트</p>
        <p className="text-xs text-blue-800 leading-relaxed">
          오후 3시 이후 피로감이 원인일 수 있습니다. 이전 패턴과 비교하면 빈도가 줄어드는 추세입니다.
          휴식 시간을 늘리는 것을 권장합니다.
        </p>
      </div>
    </div>
  );
}

function AiInsightContent() {
  const stats = [
    { label: '도전행동', value: '↓30%', desc: '지난주 대비', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: '컨디션', value: '상승', desc: '최근 5일', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: '식사', value: '안정', desc: '꾸준히 양호', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  ];

  return (
    <div>
      <p className="text-sm text-text-secondary mb-3">주간 분석 리포트</p>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
            <p className="text-[10px] opacity-70 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotoContent() {
  return (
    <div>
      <p className="text-sm text-text-primary mb-3">미술활동 — 점토로 동물 만들기</p>
      <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center border border-gray-200">
        <div className="text-center text-text-muted">
          <span className="text-3xl block mb-2">📷</span>
          <span className="text-xs">사진 영역</span>
        </div>
      </div>
    </div>
  );
}

/* ───── Main Component ───── */
export function ParentTimeline() {
  const navigate = useNavigate();

  const [reactions, setReactions] = useState<Record<string, Reactions>>(() => {
    const init: Record<string, Reactions> = {};
    TIMELINE_DATA.forEach((entry) => {
      init[entry.id] = { heart: false, thumbsUp: false, pray: false, confirmed: false };
    });
    return init;
  });

  const toggleReaction = (entryId: string, key: keyof Reactions) => {
    setReactions((prev) => ({
      ...prev,
      [entryId]: { ...prev[entryId], [key]: !prev[entryId][key] },
    }));
  };

  const renderCardContent = (entry: TimelineEntry) => {
    switch (entry.type) {
      case 'parent_report':
        return <ParentReportContent />;
      case 'challenge':
        return <ChallengeContent />;
      case 'ai_insight':
        return <AiInsightContent />;
      case 'photo':
        return <PhotoContent />;
      default:
        return <p className="text-sm text-text-primary">{entry.content as string}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
              <span className="text-xl">👦</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">서준이의 하루</h1>
              <p className="text-xs text-text-muted">{DATE_STRING}</p>
            </div>
          </div>

          {/* Summary Badges */}
          <div className="grid grid-cols-4 gap-2">
            {SUMMARY_BADGES.map((badge) => (
              <div key={badge.label} className={`rounded-xl px-2 py-2 text-center ${badge.color}`}>
                <p className="text-[10px] font-medium opacity-70">{badge.label}</p>
                <p className="text-sm font-bold">{badge.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Morning Report CTA */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <button
          onClick={() => navigate('/parent/morning-report')}
          className="w-full bg-brand text-white rounded-2xl p-4 flex items-center gap-3
                     hover:opacity-90 transition-opacity shadow-md shadow-brand/15"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-lg">📝</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold">아침 보고 작성하기</p>
            <p className="text-xs text-white/70">오늘의 컨디션을 선생님에게 알려주세요</p>
          </div>
          <svg className="w-5 h-5 ml-auto text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Timeline */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <h2 className="text-base font-bold text-text-primary mb-4">오늘의 타임라인</h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {TIMELINE_DATA.map((entry) => (
              <div key={entry.id} className="relative pl-12">
                {/* Dot on timeline */}
                <div className="absolute left-3.5 top-5 w-3 h-3 rounded-full bg-white border-2 border-brand z-10" />

                {/* Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{entry.emoji}</span>
                      <span className="text-xs font-medium text-text-secondary">{entry.teacher}</span>
                    </div>
                    <span className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                      {entry.time}
                    </span>
                  </div>

                  {/* Card Body */}
                  {renderCardContent(entry)}

                  {/* Reactions */}
                  <ReactionBar
                    reactions={reactions[entry.id]}
                    onToggle={(key) => toggleReaction(entry.id, key)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}

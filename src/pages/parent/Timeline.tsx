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
  { label: '컨디션', value: '좋음', icon: '☀️', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  { label: '도전행동', value: '1회', icon: '⚠️', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { label: '식사', value: '양호', icon: '🍚', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { label: '약', value: '완료', icon: '💊', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
];

const TIMELINE_DATA: TimelineEntry[] = [
  { id: '1', type: 'parent_report', time: '07:45', teacher: '이영희 어머님 (보호자)', emoji: '📋', content: null },
  { id: '2', type: 'condition', time: '08:45', teacher: '김수진 선생님', emoji: '☀️', content: '아침에 밝은 표정으로 등원했어요' },
  { id: '3', type: 'meal', time: '12:10', teacher: '김수진 선생님', emoji: '🍚', content: '점심 — 밥, 국, 반찬 대부분 먹음' },
  { id: '4', type: 'medication', time: '12:30', teacher: '김수진 선생님', emoji: '💊', content: '리스페리돈 0.5mg 복용 완료' },
  { id: '5', type: 'photo', time: '14:00', teacher: '김수진 선생님', emoji: '📸', content: '미술활동 — 점토로 동물 만들기' },
  { id: '6', type: 'challenge', time: '15:20', teacher: 'CareVia AI', emoji: '⚠️', content: '자해 행동 1회 감지 (머리 박기) → 직원 즉시 개입, 3분 내 안정' },
  { id: '7', type: 'condition', time: '16:30', teacher: '김수진 선생님', emoji: '🌤️', content: '하원 시 차분한 상태' },
  { id: '8', type: 'ai_insight', time: '18:00', teacher: 'AI 주간 분석', emoji: '🤖', content: null },
];

const AI_INSIGHTS = [
  { label: '도전행동 감소', value: '↓30%', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  { label: '컨디션 상승 추세', value: '📈', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { label: '식사 안정 유지', value: '🍚', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
];

const CARE_TEAM = [
  { name: '김수진 선생님', role: '담당 교사', avatar: '👩‍🏫' },
  { name: '박미영', role: 'BCBA 치료사', avatar: '👩‍⚕️' },
  { name: '정민호', role: '활동보조인', avatar: '🧑‍🤝‍🧑' },
];

/* ───── Sub-Components ───── */
function ReactionBar({ reactions, onToggle }: { reactions: Reactions; onToggle: (key: keyof Reactions) => void }) {
  const emojis: { key: keyof Reactions; icon: string; activeClass: string }[] = [
    { key: 'heart', icon: '❤️', activeClass: 'bg-red-50 border-red-300 shadow-sm' },
    { key: 'thumbsUp', icon: '👍', activeClass: 'bg-blue-50 border-blue-300 shadow-sm' },
    { key: 'pray', icon: '🙏', activeClass: 'bg-amber-50 border-amber-300 shadow-sm' },
  ];

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
      {emojis.map((e) => (
        <button
          key={e.key}
          type="button"
          onClick={() => onToggle(e.key)}
          className={`w-9 h-9 rounded-full border text-base flex items-center justify-center transition-all ${
            reactions[e.key] ? e.activeClass : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          {e.icon}
        </button>
      ))}
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => onToggle('confirmed')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
          reactions.confirmed
            ? 'bg-green-50 border-green-300 text-green-700'
            : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
        }`}
      >
        {reactions.confirmed ? '확인됨 ✓' : '확인'}
      </button>
    </div>
  );
}

function ParentReportContent() {
  const badges = [
    { label: '수면', value: '충분', color: 'bg-green-100 text-green-700' },
    { label: '컨디션', value: '좋음', color: 'bg-green-100 text-green-700' },
    { label: '식사', value: '대부분', color: 'bg-blue-100 text-blue-700' },
    { label: '약', value: '✅완료', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {badges.map((b) => (
          <span key={b.label} className={`px-3 py-1 rounded-full text-xs font-semibold ${b.color}`}>
            {b.label} {b.value}
          </span>
        ))}
      </div>
      <div className="bg-purple-50 rounded-xl p-4 mb-3">
        <p className="text-sm font-semibold text-purple-700 mb-1">🤖 AI 요약</p>
        <p className="text-sm text-purple-800 leading-relaxed">
          컨디션 양호. 충분한 수면 후 아침 대부분 섭취. 약 복용 완료.
        </p>
      </div>
      <p className="text-sm text-green-600 font-medium">✓ 김수진 선생님 확인 완료 · 08:50</p>
    </div>
  );
}

function ChallengeContent({ text }: { text: string }) {
  return (
    <div>
      <p className="text-sm text-gray-800 font-medium mb-3">{text}</p>
      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-sm font-semibold text-blue-700 mb-1">🤖 AI 인사이트</p>
        <p className="text-sm text-blue-800 leading-relaxed">
          최근 3일간 오후 3-4시에 집중 발생 → 피로 패턴 가능성. 휴식 시간을 늘리는 것을 권장합니다.
        </p>
      </div>
    </div>
  );
}

function AiInsightContent() {
  const stats = [
    { label: '도전행동', value: '↓30%', icon: '📉', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    { label: '컨디션', value: '📈 상승', icon: '', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    { label: '식사', value: '🍚 안정', icon: '', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-xl border p-3 text-center ${s.bg} ${s.border}`}>
          <p className={`text-lg font-bold ${s.text}`}>{s.value}</p>
          <p className={`text-xs font-medium mt-1 ${s.text}`}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ───── Card border color by type ───── */
function cardBorderClass(type: CardType): string {
  switch (type) {
    case 'parent_report': return 'border-l-4 border-l-purple-400';
    case 'challenge': return 'border-l-4 border-l-red-400';
    case 'ai_insight': return 'border-l-4 border-l-blue-400';
    case 'photo': return 'border-l-4 border-l-green-400';
    default: return 'border-l-4 border-l-gray-200';
  }
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
        return <ChallengeContent text={entry.content as string} />;
      case 'ai_insight':
        return <AiInsightContent />;
      case 'photo':
        return (
          <div>
            <p className="text-sm text-gray-800 font-medium mb-2">{entry.content as string}</p>
            <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center">
              <span className="text-2xl">📷</span>
              <span className="text-sm text-gray-400 ml-2">사진 영역</span>
            </div>
          </div>
        );
      default:
        return <p className="text-[15px] text-gray-800 font-medium">{entry.content as string}</p>;
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">서준이의 하루</h1>
            <p className="text-sm text-gray-500 mt-0.5">{DATE_STRING}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
            👦
          </div>
        </div>

        {/* Summary Badges */}
        <div className="grid grid-cols-4 gap-2">
          {SUMMARY_BADGES.map((b) => (
            <div key={b.label} className={`rounded-xl ${b.bg} border ${b.border} p-3 text-center`}>
              <span className="text-xl block mb-1">{b.icon}</span>
              <p className={`text-sm font-bold ${b.text}`}>{b.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Morning Report CTA (full width, above grid) ── */}
      <button
        onClick={() => navigate('/parent/morning-report')}
        className="w-full bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 hover:border-purple-300 transition-colors"
      >
        <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-xl">📋</span>
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-bold text-gray-900">오늘 아침 보고</p>
          <p className="text-xs text-gray-500">수면·컨디션·식사·약 복용을 선생님께 전달</p>
        </div>
        <svg className="w-5 h-5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── 2-Column Grid (desktop) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* ── Left Column: Timeline ── */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#026eff]" />
              <h2 className="text-base font-bold text-gray-900">오늘의 타임라인</h2>
            </div>

            <div className="space-y-3">
              {TIMELINE_DATA.map((entry) => (
                <div
                  key={entry.id}
                  className={`bg-white rounded-2xl border border-gray-200 p-4 ${cardBorderClass(entry.type)}`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{entry.emoji}</span>
                      <span className="text-sm font-medium text-gray-700">{entry.teacher}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
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
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Sidebar ── */}
        <div className="space-y-6">
          {/* AI Weekly Insights */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">🤖 AI 주간 인사이트</h3>
            <div className="space-y-3">
              {AI_INSIGHTS.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl ${item.bg} border ${item.border} p-4 flex items-center gap-3`}
                >
                  <span className={`text-lg font-bold ${item.text}`}>{item.value}</span>
                  <span className={`text-sm font-medium ${item.text}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Care Team */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">👥 돌봄 팀</h3>
            <div className="space-y-3">
              {CARE_TEAM.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

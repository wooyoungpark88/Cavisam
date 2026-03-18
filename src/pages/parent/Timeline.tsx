import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ───── Types ───── */
interface Reactions {
  heart: boolean;
  thumbsUp: boolean;
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
const SUMMARY_BADGES = [
  { label: '컨디션', value: '좋음', icon: '☀️', bg: 'bg-green-100', iconBg: 'bg-green-200' },
  { label: '도전행동', value: '1회', icon: '⚠️', bg: 'bg-amber-100', iconBg: 'bg-amber-200' },
  { label: '식사', value: '양호', icon: '🍚', bg: 'bg-green-100', iconBg: 'bg-green-200' },
  { label: '약', value: '완료', icon: '💊', bg: 'bg-purple-100', iconBg: 'bg-purple-200' },
];

const TIMELINE_DATA: TimelineEntry[] = [
  { id: '1', type: 'parent_report', time: '07:45', teacher: '이영희 어머님 (보호자)', emoji: '🟢', content: null },
  { id: '2', type: 'condition', time: '08:45', teacher: '김태희 선생님', emoji: '👩‍🏫', content: '아침에 밝은 표정으로 등원했어요' },
  { id: '3', type: 'meal', time: '12:10', teacher: '김태희 선생님', emoji: '👩‍🏫', content: '점심 — 밥, 국, 반찬 대부분 먹음' },
  { id: '4', type: 'medication', time: '12:30', teacher: '김태희 선생님', emoji: '👩‍🏫', content: '리스페리돈 0.5mg 복용 완료' },
  { id: '5', type: 'photo', time: '14:00', teacher: '김태희 선생님', emoji: '👩‍🏫', content: '미술활동 — 점토로 동물 만들기' },
  { id: '6', type: 'challenge', time: '15:20', teacher: 'CareVia AI', emoji: '⚠️', content: '자해 행동 1회 감지 (머리 박기) → 직원 즉시 개입, 3분 내 안정' },
];

const AI_INSIGHTS = [
  { label: '↓ 30% 도전행동 감소', progress: 70, color: 'bg-green-500' },
  { label: '컨디션 상승 추세', progress: 85, color: 'bg-blue-500' },
  { label: '식사 안정 유지', progress: 90, color: 'bg-blue-500' },
];

const CARE_TEAM = [
  { name: '김태희 선생님', role: '담당 교사' },
  { name: '박미영', role: 'BCBA 치료사' },
  { name: '정민호', role: '활동보조인' },
];

/* ───── Reaction Bar ───── */
function ReactionBar({ reactions, onToggle }: { reactions: Reactions; onToggle: (key: keyof Reactions) => void }) {
  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
      <button
        type="button"
        onClick={() => onToggle('heart')}
        className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all ${
          reactions.heart ? 'bg-red-50 shadow-sm' : 'hover:bg-gray-50'
        }`}
      >
        ❤️
      </button>
      <button
        type="button"
        onClick={() => onToggle('thumbsUp')}
        className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all ${
          reactions.thumbsUp ? 'bg-amber-50 shadow-sm' : 'hover:bg-gray-50'
        }`}
      >
        👍
      </button>
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => onToggle('confirmed')}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ${
          reactions.confirmed
            ? 'bg-green-50 border-green-300 text-green-700'
            : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
        }`}
      >
        확인
      </button>
    </div>
  );
}

/* ───── Parent Report Card Content ───── */
function ParentReportContent() {
  return (
    <div>
      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        <p className="text-xs font-semibold text-gray-500 mb-1">AI Summary</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          컨디션 양호. 충분한 수면 후 아침 대부분 섭취. 약 복용 완료.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-green-500">✅</span>
        <p className="text-sm text-gray-600">김태희 선생님 확인 완료</p>
        <div className="flex-1" />
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">확인</span>
      </div>
    </div>
  );
}

/* ───── Challenge Card Content ───── */
function ChallengeContent({ text }: { text: string }) {
  return (
    <div>
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
        <p className="text-sm text-red-800 font-medium">{text}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3">
        <p className="text-xs font-semibold text-gray-500 mb-1">AI Insight</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          최근 3일간 오후 3~4시에 집중 발생 → 피로 패턴 가능성. 휴식 시간을 늘리는 것을 권장합니다.
        </p>
      </div>
    </div>
  );
}

/* ───── Timeline Card ───── */
function TimelineCard({
  entry,
  reactions,
  onToggle,
  renderContent,
}: {
  entry: TimelineEntry;
  reactions: Reactions;
  onToggle: (key: keyof Reactions) => void;
  renderContent: (entry: TimelineEntry) => React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm shrink-0">
          {entry.emoji}
        </div>
        <span className="text-sm font-bold text-gray-900">{entry.teacher}</span>
        {entry.type === 'parent_report' && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded ml-auto">Status</span>
        )}
      </div>

      {/* Body */}
      {renderContent(entry)}

      {/* Reactions */}
      <ReactionBar reactions={reactions} onToggle={onToggle} />
    </div>
  );
}

/* ───── Main Component ───── */
export function ParentTimeline() {
  const navigate = useNavigate();

  const [reactions, setReactions] = useState<Record<string, Reactions>>(() => {
    const init: Record<string, Reactions> = {};
    TIMELINE_DATA.forEach((entry) => {
      init[entry.id] = { heart: false, thumbsUp: false, confirmed: false };
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
      case 'photo':
        return (
          <div>
            <p className="text-sm text-gray-800 font-medium mb-2">{entry.content as string}</p>
            <div className="bg-gray-100 rounded-xl h-28 flex items-center justify-center">
              <span className="text-sm text-gray-400">사진 영역</span>
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-gray-800 font-medium">{entry.content as string}</p>;
    }
  };

  /* Split timeline into left/right columns */
  const leftEntries = TIMELINE_DATA.filter((_, i) => i % 2 === 0);
  const rightEntries = TIMELINE_DATA.filter((_, i) => i % 2 !== 0);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* ── Title ── */}
      <h1 className="text-xl font-bold text-gray-900">홈 타임라인</h1>

      {/* ── Summary Badges ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUMMARY_BADGES.map((b) => (
          <div key={b.label} className={`${b.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 ${b.iconBg} rounded-full flex items-center justify-center text-lg shrink-0`}>
              {b.icon}
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">{b.value}</p>
              <p className="text-xs text-gray-500">{b.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Morning Report CTA ── */}
      <button
        onClick={() => navigate('/parent/morning-report')}
        className="w-full bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] px-5 py-3.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center gap-3 text-left"
      >
        <span className="text-lg">📋</span>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">오늘 등원 전 한마디:</span>{' '}
          수면·컨디션·식사·약 복용을 선생님께 전달
        </p>
      </button>

      {/* ── Main Grid: Timeline + Sidebar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* ── Timeline 2-column ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            {leftEntries.map((entry) => (
              <div key={entry.id}>
                <p className="text-xs font-bold text-gray-400 mb-2 ml-1">{entry.time}</p>
                <TimelineCard
                  entry={entry}
                  reactions={reactions[entry.id]}
                  onToggle={(key) => toggleReaction(entry.id, key)}
                  renderContent={renderCardContent}
                />
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-4 md:mt-10">
            {rightEntries.map((entry) => (
              <div key={entry.id}>
                <p className="text-xs font-bold text-gray-400 mb-2 ml-1">{entry.time}</p>
                <TimelineCard
                  entry={entry}
                  reactions={reactions[entry.id]}
                  onToggle={(key) => toggleReaction(entry.id, key)}
                  renderContent={renderCardContent}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-5">
          {/* AI Weekly Insights */}
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">AI 주간 인사이트</h3>
            <div className="space-y-4">
              {AI_INSIGHTS.map((item) => (
                <div key={item.label}>
                  <p className="text-sm font-medium text-gray-700 mb-1.5">{item.label}</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Care Team */}
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">돌봄 팀</h3>
            <div className="space-y-4">
              {CARE_TEAM.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-300 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">({member.role})</p>
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

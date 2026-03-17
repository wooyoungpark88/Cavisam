import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../../hooks/useStudents';
import type { Student } from '../../types';

type ViewMode = 'daily' | 'weekly' | 'monthly';

/* ───── color helpers ───── */

function sleepColor(sleep: string): string {
  const hours = parseFloat(sleep);
  if (isNaN(hours)) return 'text-gray-600';
  return hours < 6 ? 'text-red-500' : 'text-green-600';
}

function conditionLabel(c: Student['condition']): string {
  const map = { good: '좋음', normal: '보통', bad: '나쁨', very_bad: '매우 나쁨' };
  return map[c] ?? c;
}
function conditionColor(c: Student['condition']): string {
  if (c === 'good') return 'text-green-600';
  if (c === 'normal') return 'text-blue-600';
  return 'text-red-500';
}

function mealLabel(m: Student['meal']): string {
  const map = { good: '평소처럼', normal: '보통', none: '안 먹음' };
  return map[m] ?? m;
}
function mealColor(m: Student['meal']): string {
  if (m === 'good') return 'text-green-600';
  if (m === 'normal') return 'text-blue-600';
  return 'text-red-500';
}

function bowelLabel(b: Student['bowel']): string {
  return b === 'normal' ? '정상' : '없음';
}
function bowelColor(b: Student['bowel']): string {
  return b === 'normal' ? 'text-green-600' : 'text-red-500';
}

function needsAttention(s: Student): boolean {
  return (
    s.condition === 'bad' ||
    s.condition === 'very_bad' ||
    parseFloat(s.sleep) < 6 ||
    s.meal === 'none' ||
    s.bowel === 'none'
  );
}

/* ───── date helpers ───── */

function formatKoreanDate(d: Date): string {
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

function getWeekRange(d: Date): { start: Date; end: Date; label: string } {
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday-based week
  const start = new Date(d);
  start.setDate(d.getDate() - diff - 7); // last week start
  const end = new Date(start);
  end.setDate(start.getDate() + 4); // Mon-Fri
  const label = `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일 부터 ~ ${end.getMonth() + 1}월 ${end.getDate()}일 까지`;
  return { start, end, label };
}

function getMonthRange(d: Date): string {
  const start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  const end = new Date(d.getFullYear(), d.getMonth(), 0);
  return `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일 부터 ~ ${end.getMonth() + 1}월 ${end.getDate()}일 까지`;
}

/* ───── Toggle Switch ───── */

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-[#026eff]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ───── Daily Card ───── */

function DailyCard({
  student,
  onAICare,
  onChat,
}: {
  student: Student;
  onAICare: () => void;
  onChat: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-lg">
            {student.avatar ? (
              <img src={student.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              '👤'
            )}
          </div>
          <span className="font-semibold text-[15px]">{student.name}</span>
        </div>
        <span className="text-red-500 text-xs font-medium">{student.date}</span>
      </div>

      {/* Daily items */}
      <div className="px-4 py-2 space-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <span>😴</span>
          <span className="text-gray-500 w-12">수면:</span>
          <span className={`font-medium ${sleepColor(student.sleep)}`}>{student.sleep}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>😊</span>
          <span className="text-gray-500 w-12">컨디션:</span>
          <span className={`font-medium ${conditionColor(student.condition)}`}>
            {conditionLabel(student.condition)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>🍚</span>
          <span className="text-gray-500 w-12">식사:</span>
          <span className={`font-medium ${mealColor(student.meal)}`}>
            {mealLabel(student.meal)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>🚽</span>
          <span className="text-gray-500 w-12">배변:</span>
          <span className={`font-medium ${bowelColor(student.bowel)}`}>
            {bowelLabel(student.bowel)}
          </span>
        </div>
      </div>

      {/* Note */}
      {student.note && (
        <div className="mx-4 my-2 rounded-lg px-3 py-2 text-sm bg-[#fffde6]">
          <span className="text-gray-500 font-medium">특이사항: </span>
          <span className="text-gray-700">{student.note}</span>
        </div>
      )}

      {/* Medication */}
      {student.medication && (
        <div className="mx-4 mb-2 rounded-lg px-3 py-2 text-sm bg-[#fffde6]">
          <span className="text-gray-500 font-medium">약복용: </span>
          <span className="text-gray-700">{student.medication}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="px-4 pb-4 pt-2 space-y-2">
        <button
          onClick={onAICare}
          className="w-full py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1.5 bg-[#026eff]"
        >
          <span>✨</span> AI 케어 보기 &gt;
        </button>
        <button
          onClick={onChat}
          className="w-full py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1.5 bg-[#636363]"
        >
          <span>💬</span> 소통방 가기 &gt;
        </button>
      </div>
    </div>
  );
}

/* ───── Weekly / Monthly Card ───── */

function StatsCard({
  student,
  mode,
  onAICare,
  onChat,
}: {
  student: Student;
  mode: 'weekly' | 'monthly';
  onAICare: () => void;
  onChat: () => void;
}) {
  // Generate mock aggregated stats from student data
  const sleepHours = parseFloat(student.sleep) || 7;
  const conditionScore = student.condition === 'good' ? 4 : student.condition === 'normal' ? 3 : student.condition === 'bad' ? 2 : 1;
  const mealPercent = student.meal === 'good' ? 95 : student.meal === 'normal' ? 75 : 40;
  const totalDays = mode === 'weekly' ? 5 : 25;
  const attendedDays = mode === 'weekly'
    ? Math.min(totalDays, Math.max(1, totalDays - (student.condition === 'bad' || student.condition === 'very_bad' ? 2 : 0)))
    : totalDays;

  const sleepDelta = sleepHours - 7;
  const condAvg = (conditionScore + 0.5).toFixed(1);
  const badgeLabel = mode === 'weekly' ? '주간 통계' : '월간 통계';

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-lg">
            {student.avatar ? (
              <img src={student.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              '👤'
            )}
          </div>
          <span className="font-semibold text-[15px]">{student.name}</span>
        </div>
        <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {badgeLabel}
        </span>
      </div>

      {/* Stats rows */}
      <div className="px-4 py-3 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">😴 평균 수면</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">{sleepHours}시간</span>
            {sleepDelta !== 0 && (
              <span className={`text-xs font-medium ${sleepDelta > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {sleepDelta > 0 ? `+${sleepDelta}h ↑` : `${sleepDelta}h ↓`}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">😊 평균 컨디션</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">{condAvg}/5</span>
            <span className="text-xs text-blue-500 font-medium">↓</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">🍚 평균 식사</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">{mealPercent}%</span>
            <span className="text-xs text-gray-400 font-medium">→</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">📋 출결 현황</span>
          <span className="font-semibold">{attendedDays}/{totalDays}일</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-4 pt-1 space-y-2">
        <button
          onClick={onAICare}
          className="w-full py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1.5 bg-[#026eff]"
        >
          <span>✨</span> AI 케어 보기 &gt;
        </button>
        <button
          onClick={onChat}
          className="w-full py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-1.5 bg-[#636363]"
        >
          <span>💬</span> 소통방 가기 &gt;
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Dashboard
   ═══════════════════════════════════════════ */

export function TeacherDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const dateParam = today.toISOString().slice(0, 10);
  const { students, loading } = useStudents(dateParam);

  const filteredStudents = useMemo(() => {
    if (!attentionOnly) return students;
    return students.filter(needsAttention);
  }, [students, attentionOnly]);

  /* ── header text ── */
  const weekRange = getWeekRange(today);
  const monthRange = getMonthRange(today);

  const viewLabels: Record<ViewMode, string> = {
    daily: '일일 통계',
    weekly: '주간 통계',
    monthly: '월간 통계',
  };

  const headerInfo = (() => {
    if (viewMode === 'daily') {
      return { subtitle: formatKoreanDate(today) };
    }
    if (viewMode === 'weekly') {
      return { subtitle: `지난 주: ${weekRange.label}` };
    }
    return { subtitle: `지난 달: ${monthRange}` };
  })();

  return (
    <div className="min-h-full max-w-7xl mx-auto">
      {/* ── Top Bar ── */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100/80 px-5 sm:px-6 py-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: badge + date */}
          <div className="flex items-center gap-3 flex-wrap">
            {viewMode === 'daily' && (
              <span
                className="text-white text-xs font-bold px-3 py-1 rounded-full bg-[#026eff]"
              >
                오늘
              </span>
            )}
            {viewMode !== 'daily' && (
              <span
                className="text-white text-xs font-bold px-3 py-1 rounded-full bg-[#026eff]"
              >
                {viewLabels[viewMode]}
              </span>
            )}
            <span className="text-sm sm:text-base font-medium text-gray-700">
              {headerInfo.subtitle}
            </span>
          </div>

          {/* Right: toggle + dropdown */}
          <div className="flex items-center gap-4">
            {/* Attention toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">관심 필요</span>
              <ToggleSwitch checked={attentionOnly} onChange={setAttentionOnly} />
            </div>

            {/* View mode dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {viewLabels[viewMode]}
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {(['daily', 'weekly', 'monthly'] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setViewMode(mode);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        viewMode === mode ? 'text-[#026eff] font-semibold bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      {viewLabels[mode]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#026eff] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg">
            {attentionOnly ? '관심이 필요한 학생이 없습니다.' : '등록된 학생이 없습니다.'}
          </p>
          {!attentionOnly && (
            <>
              <p className="text-sm mt-2">대상자 관리에서 학생을 추가하세요.</p>
              <button
                onClick={() => navigate('/admin/students')}
                className="mt-4 px-4 py-2 text-sm rounded-lg text-white bg-[#636363]"
              >
                대상자 관리로 이동
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredStudents.map((student) =>
            viewMode === 'daily' ? (
              <DailyCard
                key={student.id}
                student={student}
                onAICare={() => navigate('/teacher/intervention-report')}
                onChat={() => navigate('/teacher/parent-notification')}
              />
            ) : (
              <StatsCard
                key={student.id}
                student={student}
                mode={viewMode}
                onAICare={() => navigate('/teacher/intervention-report')}
                onChat={() => navigate('/teacher/parent-notification')}
              />
            )
          )}
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
      )}
    </div>
  );
}

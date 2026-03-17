import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ───── Types ───── */
type SleepLevel = 'good' | 'normal' | 'bad';
type SleepQuality = '숙면' | '뒤척임' | '자주 깸';
type Condition = 'good' | 'normal' | 'bad';
type Breakfast = 'all' | 'most' | 'some' | 'none';
type Bowel = 'normal' | 'soft' | 'hard' | 'none';
type Medication = 'done' | 'request' | 'none';

/* ───── Option Configs ───── */
const SLEEP_OPTIONS: { value: SleepLevel; label: string; sub: string }[] = [
  { value: 'good', label: '충분', sub: '7시간 이상' },
  { value: 'normal', label: '보통', sub: '5~7시간' },
  { value: 'bad', label: '부족', sub: '5시간 미만' },
];

const SLEEP_QUALITY_OPTIONS: SleepQuality[] = ['숙면', '뒤척임', '자주 깸'];

const CONDITION_OPTIONS: { value: Condition; emoji: string; label: string }[] = [
  { value: 'good', emoji: '☀️', label: '좋음' },
  { value: 'normal', emoji: '🌤️', label: '보통' },
  { value: 'bad', emoji: '🌧️', label: '안좋음' },
];

const BREAKFAST_OPTIONS: { value: Breakfast; emoji: string; label: string }[] = [
  { value: 'all', emoji: '🍱', label: '전부' },
  { value: 'most', emoji: '🥄', label: '대부분' },
  { value: 'some', emoji: '🥢', label: '조금' },
  { value: 'none', emoji: '❌', label: '안먹음' },
];

const BOWEL_OPTIONS: { value: Bowel; emoji: string; label: string }[] = [
  { value: 'normal', emoji: '✅', label: '정상' },
  { value: 'soft', emoji: '💧', label: '무른편' },
  { value: 'hard', emoji: '🪨', label: '딱딱함' },
  { value: 'none', emoji: '➖', label: '없음' },
];

const MEDICATION_OPTIONS: { value: Medication; emoji: string; label: string }[] = [
  { value: 'done', emoji: '✅', label: '복용 완료' },
  { value: 'request', emoji: '🏫', label: '기관 요청' },
  { value: 'none', emoji: '➖', label: '약 없음' },
];

/* ───── Helpers ───── */
function buildAiSummary(
  sleep: SleepLevel | null,
  sleepQuality: SleepQuality | null,
  condition: Condition | null,
  breakfast: Breakfast | null,
  bowel: Bowel | null,
  medication: Medication | null,
  note: string,
): string {
  const parts: string[] = [];

  if (sleep) {
    const sleepText = sleep === 'good' ? '충분히 잤고' : sleep === 'normal' ? '보통 수준으로 잤고' : '수면이 부족했고';
    const qualityText = sleepQuality ? ` (${sleepQuality})` : '';
    parts.push(`수면은 ${sleepText}${qualityText}`);
  }
  if (condition) {
    const condText = condition === 'good' ? '컨디션이 좋은 상태입니다' : condition === 'normal' ? '컨디션은 보통입니다' : '컨디션이 좋지 않습니다';
    parts.push(condText);
  }
  if (breakfast) {
    const mealText =
      breakfast === 'all' ? '아침을 전부 먹었고' :
      breakfast === 'most' ? '아침을 대부분 먹었고' :
      breakfast === 'some' ? '아침을 조금 먹었고' : '아침을 먹지 않았고';
    parts.push(mealText);
  }
  if (bowel) {
    const bowelText =
      bowel === 'normal' ? '배변은 정상입니다' :
      bowel === 'soft' ? '배변이 무른 편입니다' :
      bowel === 'hard' ? '배변이 딱딱한 편입니다' : '배변 활동이 없었습니다';
    parts.push(bowelText);
  }
  if (medication) {
    const medText =
      medication === 'done' ? '약은 복용 완료했습니다' :
      medication === 'request' ? '약 복용을 기관에 요청합니다' : '복용할 약이 없습니다';
    parts.push(medText);
  }
  if (note.trim()) {
    parts.push(`추가 메모: "${note.trim()}"`);
  }

  return parts.join('. ') + '.';
}

/* ───── Sub-Components ───── */
function SectionTitle({ icon, title, required }: { icon: string; title: string; required?: boolean }) {
  return (
    <h3 className="flex items-center gap-2 text-base font-semibold text-text-primary mb-3">
      <span>{icon}</span>
      {title}
      {required && <span className="text-xs font-normal text-red-500">*필수</span>}
    </h3>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
  className = '',
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 min-w-0 rounded-xl border-2 py-3 px-2 text-center text-sm font-medium
        transition-all duration-200
        ${selected
          ? 'border-brand bg-blue-50 text-brand shadow-sm'
          : 'border-gray-200 bg-white text-text-secondary hover:border-gray-300'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

/* ───── Main Component ───── */
export function MorningReport() {
  const navigate = useNavigate();

  const [sleep, setSleep] = useState<SleepLevel | null>(null);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | null>(null);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [breakfast, setBreakfast] = useState<Breakfast | null>(null);
  const [bowel, setBowel] = useState<Bowel | null>(null);
  const [medication, setMedication] = useState<Medication | null>(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* Progress */
  const requiredFields = [sleep, condition, breakfast, medication];
  const filledCount = requiredFields.filter((v) => v !== null).length;
  const totalRequired = 4;
  const canSubmit = filledCount === totalRequired;
  const progressPercent = (filledCount / totalRequired) * 100;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  const aiSummary = buildAiSummary(sleep, sleepQuality, condition, breakfast, bowel, medication, note);

  /* ───── Success Screen ───── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">아침 보고 완료!</h2>
          <p className="text-sm text-text-muted mb-6">선생님에게 전달되었습니다</p>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-purple-600 mb-1">🤖 AI 요약</p>
            <p className="text-sm text-purple-800 leading-relaxed">{aiSummary}</p>
          </div>

          <button
            onClick={() => navigate('/parent')}
            className="w-full bg-brand text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  /* ───── Form Screen ───── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate('/parent')}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-text-primary">아침 보고</h1>
          <div className="w-6" />
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
            <span>진행률</span>
            <span>{filledCount}/{totalRequired} 완료</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Sleep */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle icon="🌙" title="수면" required />
          <div className="flex gap-2 mb-3">
            {SLEEP_OPTIONS.map((opt) => (
              <OptionButton key={opt.value} selected={sleep === opt.value} onClick={() => setSleep(opt.value)}>
                <div className="font-semibold">{opt.label}</div>
                <div className="text-xs text-text-muted mt-0.5">{opt.sub}</div>
              </OptionButton>
            ))}
          </div>

          {sleep && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-text-muted mb-2">수면 질</p>
              <div className="flex gap-2">
                {SLEEP_QUALITY_OPTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSleepQuality(sleepQuality === q ? null : q)}
                    className={`
                      flex-1 py-2 rounded-lg text-xs font-medium border transition-all
                      ${sleepQuality === q
                        ? 'border-brand bg-blue-50 text-brand'
                        : 'border-gray-200 bg-gray-50 text-text-muted hover:border-gray-300'
                      }
                    `}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Condition */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle icon="😊" title="컨디션" required />
          <div className="flex gap-2">
            {CONDITION_OPTIONS.map((opt) => (
              <OptionButton key={opt.value} selected={condition === opt.value} onClick={() => setCondition(opt.value)}>
                <div className="text-xl mb-1">{opt.emoji}</div>
                <div className="text-sm">{opt.label}</div>
              </OptionButton>
            ))}
          </div>
        </section>

        {/* Breakfast */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle icon="🍽️" title="아침식사" required />
          <div className="grid grid-cols-4 gap-2">
            {BREAKFAST_OPTIONS.map((opt) => (
              <OptionButton key={opt.value} selected={breakfast === opt.value} onClick={() => setBreakfast(opt.value)}>
                <div className="text-lg mb-0.5">{opt.emoji}</div>
                <div className="text-xs">{opt.label}</div>
              </OptionButton>
            ))}
          </div>
        </section>

        {/* Bowel */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle icon="🚽" title="배변" />
          <div className="grid grid-cols-4 gap-2">
            {BOWEL_OPTIONS.map((opt) => (
              <OptionButton key={opt.value} selected={bowel === opt.value} onClick={() => setBowel(opt.value)}>
                <div className="text-lg mb-0.5">{opt.emoji}</div>
                <div className="text-xs">{opt.label}</div>
              </OptionButton>
            ))}
          </div>
        </section>

        {/* Medication */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle icon="💊" title="투약" required />
          <div className="flex gap-2">
            {MEDICATION_OPTIONS.map((opt) => (
              <OptionButton key={opt.value} selected={medication === opt.value} onClick={() => setMedication(opt.value)}>
                <div className="text-lg mb-0.5">{opt.emoji}</div>
                <div className="text-xs">{opt.label}</div>
              </OptionButton>
            ))}
          </div>
        </section>

        {/* Note */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionTitle icon="📝" title="추가 메모" />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="선생님에게 전달할 내용이 있으면 적어주세요..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-text-primary
                       placeholder:text-text-muted resize-none focus:outline-none focus:ring-2
                       focus:ring-brand/30 focus:border-brand transition-all"
          />
        </section>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200
            ${canSubmit
              ? 'bg-brand text-white hover:opacity-90 shadow-md shadow-brand/20'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {canSubmit ? '보고 전송하기' : `${totalRequired - filledCount}개 항목을 더 선택해주세요`}
        </button>

        <div className="h-6" />
      </div>
    </div>
  );
}

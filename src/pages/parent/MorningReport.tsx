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
const SLEEP_OPTIONS: { value: SleepLevel; emoji: string; label: string }[] = [
  { value: 'good', emoji: '😴', label: '충분' },
  { value: 'normal', emoji: '🌙', label: '보통' },
  { value: 'bad', emoji: '😵', label: '부족' },
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
function SectionLabel({ emoji, title, required }: { emoji: string; title: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg">{emoji}</span>
      <span className="text-base font-semibold text-gray-900">{title}</span>
      {required && (
        <span className="text-xs font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">*필수</span>
      )}
    </div>
  );
}

function CardButton({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center rounded-2xl border-2 py-4 px-2 transition-all duration-200
        ${selected
          ? 'border-[#026eff] bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <span className="text-2xl mb-1.5">{emoji}</span>
      <span className={`text-sm font-medium ${selected ? 'text-[#026eff]' : 'text-gray-600'}`}>
        {label}
      </span>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">보고 완료!</h2>
          <p className="text-sm text-gray-400 mb-8">선생님에게 전달되었습니다</p>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-8 text-left">
            <p className="text-xs font-semibold text-purple-600 mb-2">🤖 AI 요약</p>
            <p className="text-sm text-purple-800 leading-relaxed">{aiSummary}</p>
          </div>

          <button
            onClick={() => navigate('/parent')}
            className="w-full bg-[#026eff] text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-opacity"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  /* ───── Form Screen ───── */
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate('/parent')}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors -ml-2"
          >
            <span className="text-2xl font-light">&#8249;</span>
          </button>
          <h1 className="text-base font-bold text-gray-900">아침 보고</h1>
          <span className="text-sm text-gray-400 font-medium">{filledCount}/{totalRequired} 완료</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className={`h-full bg-[#026eff] transition-all duration-500 ease-out ${progressPercent === 100 ? 'rounded-none' : 'rounded-r-full'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Form Body */}
      <div className="px-4 py-6 space-y-5">
        {/* Sleep */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionLabel emoji="🌙" title="수면" required />
          <div className="grid grid-cols-3 gap-3">
            {SLEEP_OPTIONS.map((opt) => (
              <CardButton
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                selected={sleep === opt.value}
                onClick={() => setSleep(opt.value)}
              />
            ))}
          </div>

          {/* Sleep Quality sub-options */}
          {sleep && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">수면의 질</p>
              <div className="flex gap-2">
                {SLEEP_QUALITY_OPTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSleepQuality(sleepQuality === q ? null : q)}
                    className={`
                      flex-1 py-2 rounded-full text-xs font-medium border transition-all
                      ${sleepQuality === q
                        ? 'border-[#026eff] bg-blue-50 text-[#026eff]'
                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
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
          <SectionLabel emoji="😊" title="컨디션" required />
          <div className="grid grid-cols-3 gap-3">
            {CONDITION_OPTIONS.map((opt) => (
              <CardButton
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                selected={condition === opt.value}
                onClick={() => setCondition(opt.value)}
              />
            ))}
          </div>
        </section>

        {/* Breakfast */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionLabel emoji="🍽️" title="아침식사" required />
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {BREAKFAST_OPTIONS.map((opt) => (
              <CardButton
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                selected={breakfast === opt.value}
                onClick={() => setBreakfast(opt.value)}
              />
            ))}
          </div>
        </section>

        {/* Bowel */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionLabel emoji="🚽" title="배변" />
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {BOWEL_OPTIONS.map((opt) => (
              <CardButton
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                selected={bowel === opt.value}
                onClick={() => setBowel(opt.value)}
              />
            ))}
          </div>
        </section>

        {/* Medication */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionLabel emoji="💊" title="투약" required />
          <div className="grid grid-cols-3 gap-3">
            {MEDICATION_OPTIONS.map((opt) => (
              <CardButton
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                selected={medication === opt.value}
                onClick={() => setMedication(opt.value)}
              />
            ))}
          </div>
        </section>

        {/* Note */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <SectionLabel emoji="📝" title="추가 메모" />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="선생님에게 전달할 내용이 있으면 적어주세요..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900
                       placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2
                       focus:ring-blue-200 focus:border-[#026eff] transition-all"
          />
        </section>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200
            ${canSubmit
              ? 'bg-[#026eff] text-white hover:opacity-90 shadow-md shadow-blue-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {canSubmit ? '선생님에게 전송' : `${totalRequired - filledCount}개 항목을 더 선택해주세요`}
        </button>
      </div>
    </div>
  );
}

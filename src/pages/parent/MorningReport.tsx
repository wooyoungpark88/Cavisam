import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ───── Types ───── */
type SleepLevel = 'good' | 'normal' | 'bad';
type SleepQuality = '숙면' | '뒤척임' | '자주 깸';
type Condition = 'good' | 'normal' | 'bad';
type Breakfast = 'all' | 'most' | 'some' | 'none';
type Bowel = 'normal' | 'soft' | 'hard' | 'none';
type Medication = 'done' | 'request' | 'none';

/* ───── Options ───── */
const SLEEP_OPTIONS: { value: SleepLevel; emoji: string; label: string; sub: string }[] = [
  { value: 'good', emoji: '😴', label: '충분', sub: '7시간 이상' },
  { value: 'normal', emoji: '🌙', label: '보통', sub: '5~7시간' },
  { value: 'bad', emoji: '😵', label: '부족', sub: '5시간 미만' },
];
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
const SLEEP_QUALITY_OPTIONS: SleepQuality[] = ['숙면', '뒤척임', '자주 깸'];

/* ───── Helpers ───── */
function buildAiSummary(sleep: SleepLevel | null, _sq: SleepQuality | null, cond: Condition | null, bf: Breakfast | null, _bw: Bowel | null, med: Medication | null, note: string) {
  const parts: string[] = [];
  if (sleep) parts.push(`수면은 ${sleep === 'good' ? '충분' : sleep === 'normal' ? '보통' : '부족'}했습니다`);
  if (cond) parts.push(`컨디션은 ${cond === 'good' ? '좋은 상태' : cond === 'normal' ? '보통' : '좋지 않은 상태'}입니다`);
  if (bf) parts.push(`아침은 ${bf === 'all' ? '전부' : bf === 'most' ? '대부분' : bf === 'some' ? '조금' : '안'} 먹었습니다`);
  if (med) parts.push(`약은 ${med === 'done' ? '복용 완료' : med === 'request' ? '기관에서 복용 요청' : '복용할 약 없음'}`);
  if (note.trim()) parts.push(`전달 사항: "${note.trim()}"`);
  return parts.join('. ') + '.';
}

/* ───── Sub-Components ───── */
function CardSection({ emoji, title, required, children }: { emoji: string; title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] border border-gray-200/60 p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-lg">{emoji}</span>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {required && <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">*필수</span>}
      </div>
      {children}
    </div>
  );
}

function OptionCard({ emoji, label, sub, selected, onClick }: { emoji: string; label: string; sub?: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-xl border-2 py-4 px-2 transition-all duration-200 ease-out cursor-pointer ${
        selected
          ? 'border-[#026eff] bg-blue-50/60 shadow-sm scale-[1.02]'
          : 'border-gray-100 bg-gray-50/40 hover:border-gray-200 hover:bg-white hover:shadow-sm'
      }`}>
      <span className="text-2xl mb-1">{emoji}</span>
      <span className={`text-xs font-semibold ${selected ? 'text-[#026eff]' : 'text-gray-600'}`}>{label}</span>
      {sub && <span className="text-xs text-gray-400 mt-0.5">{sub}</span>}
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

  const totalRequired = 4;
  const filledCount = [sleep, condition, breakfast, medication].filter(Boolean).length;
  const canSubmit = filledCount >= totalRequired;
  const progressPercent = (filledCount / totalRequired) * 100;

  const handleSubmit = () => { if (canSubmit) setSubmitted(true); };
  const aiSummary = buildAiSummary(sleep, sleepQuality, condition, breakfast, bowel, medication, note);

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">보고 완료!</h2>
        <p className="text-sm text-gray-400 mb-8">선생님에게 전달되었습니다</p>
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] border border-gray-200/60 p-6 mb-8 text-left">
          <p className="text-xs font-semibold text-purple-600 mb-2">🤖 AI 요약</p>
          <p className="text-sm text-gray-700 leading-relaxed">{aiSummary}</p>
        </div>
        <button onClick={() => navigate('/parent')}
          className="bg-[#026eff] text-white font-semibold py-3 px-10 rounded-xl hover:bg-[#0254cc] hover:shadow-lg hover:shadow-blue-200/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  /* ── Form Screen ── */
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">오늘 아침 보고</h1>
          <p className="text-sm text-gray-400 mt-0.5">서준이 → 김태희 선생님</p>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-lg transition-colors duration-300 ${canSubmit ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-[#026eff]'}`}>
          {filledCount}/{totalRequired}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ease-out ${canSubmit ? 'bg-emerald-500' : 'bg-[#026eff]'}`} style={{ width: `${progressPercent}%` }} />
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSection emoji="🌙" title="어젯밤 수면" required>
          <div className="grid grid-cols-3 gap-2">
            {SLEEP_OPTIONS.map((o) => <OptionCard key={o.value} emoji={o.emoji} label={o.label} sub={o.sub} selected={sleep === o.value} onClick={() => setSleep(o.value)} />)}
          </div>
          {sleep && (
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-400 mb-2">수면의 질</p>
              <div className="flex gap-2">
                {SLEEP_QUALITY_OPTIONS.map((q) => (
                  <button key={q} type="button" onClick={() => setSleepQuality(sleepQuality === q ? null : q)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                      sleepQuality === q ? 'border-[#026eff] bg-blue-50 text-[#026eff]' : 'border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}>{q}</button>
                ))}
              </div>
            </div>
          )}
        </CardSection>

        <CardSection emoji="🌡️" title="컨디션" required>
          <div className="grid grid-cols-3 gap-2">
            {CONDITION_OPTIONS.map((o) => <OptionCard key={o.value} emoji={o.emoji} label={o.label} selected={condition === o.value} onClick={() => setCondition(o.value)} />)}
          </div>
        </CardSection>

        <CardSection emoji="🍚" title="아침 식사" required>
          <div className="grid grid-cols-4 gap-2">
            {BREAKFAST_OPTIONS.map((o) => <OptionCard key={o.value} emoji={o.emoji} label={o.label} selected={breakfast === o.value} onClick={() => setBreakfast(o.value)} />)}
          </div>
        </CardSection>

        <CardSection emoji="🚽" title="배변">
          <div className="grid grid-cols-4 gap-2">
            {BOWEL_OPTIONS.map((o) => <OptionCard key={o.value} emoji={o.emoji} label={o.label} selected={bowel === o.value} onClick={() => setBowel(o.value)} />)}
          </div>
        </CardSection>

        <CardSection emoji="💊" title="약 복용" required>
          <div className="grid grid-cols-3 gap-2">
            {MEDICATION_OPTIONS.map((o) => <OptionCard key={o.value} emoji={o.emoji} label={o.label} selected={medication === o.value} onClick={() => setMedication(o.value)} />)}
          </div>
        </CardSection>

        <CardSection emoji="📝" title="전달 사항">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="선생님에게 전달할 내용이 있으면 적어주세요..." rows={4}
            className="w-full border border-gray-100 rounded-xl p-3.5 text-sm text-gray-700 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#026eff]/10 focus:border-[#026eff]/30 transition-all duration-200 bg-gray-50/30" />
        </CardSection>
      </div>

      {/* Submit */}
      <div className="mt-8 flex justify-center pb-4">
        <button onClick={handleSubmit} disabled={!canSubmit}
          className={`py-3.5 px-16 rounded-xl font-semibold text-sm transition-all duration-300 ${
            canSubmit
              ? 'bg-[#026eff] text-white hover:bg-[#0254cc] hover:shadow-lg hover:shadow-blue-200/40 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}>
          {canSubmit ? '📨 선생님에게 전송' : `${totalRequired - filledCount}개 항목을 더 선택해주세요`}
        </button>
      </div>
    </div>
  );
}

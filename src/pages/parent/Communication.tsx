import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import { getStudentsByParent } from '../../lib/api/students';
import { sendMessage } from '../../lib/api/messages';
import type { StudentDB } from '../../lib/api/students';
import type { MessageDB } from '../../lib/api/messages';

const quickReplies = [
  '어제 밤에 잠을 잘 못 잤어요',
  '오늘 아침에 짜증을 많이 내더라고요',
  '오늘 점심 메뉴는 뭔가요?',
  '새로운 활동에 잘 참여하고 있나요?',
  '어제 밤에 잠을 잘 못 잤어요',
];

/* ───── Daily Report Modal ───── */
function DailyReportModal({
  studentName,
  onClose,
  onSubmit,
}: {
  studentName: string;
  onClose: () => void;
  onSubmit: (data: DailyReportForm) => void;
}) {
  const [sleepStart, setSleepStart] = useState('23:00');
  const [sleepEnd, setSleepEnd] = useState('08:00');
  const [bowel, setBowel] = useState<string>('정상');
  const [condition, setCondition] = useState(50);
  const [meal, setMeal] = useState(50);
  const [medicine, setMedicine] = useState<string>('복용할 약 없음');
  const [medicineNote, setMedicineNote] = useState('');
  const [note, setNote] = useState('');

  const calcSleepHours = () => {
    const [sh, sm] = sleepStart.split(':').map(Number);
    const [eh, em] = sleepEnd.split(':').map(Number);
    let diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
  };

  const sleepPercent = (() => {
    const [sh, sm] = sleepStart.split(':').map(Number);
    const [eh, em] = sleepEnd.split(':').map(Number);
    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    if (endMin <= startMin) endMin += 24 * 60;
    const leftPct = ((startMin - 18 * 60) / (24 * 60)) * 100;
    const widthPct = ((endMin - startMin) / (24 * 60)) * 100;
    return { left: Math.max(0, Math.min(100, leftPct)), width: Math.min(100 - Math.max(0, leftPct), widthPct) };
  })();

  const handleSubmit = () => {
    onSubmit({ sleepStart, sleepEnd, bowel, condition, meal, medicine, medicineNote, note });
  };

  const bowelOptions = ['정상', '무른편', '딱딱함', '없음'];
  const medicineOptions = ['복용할 약 없음', '복용 요청', '복용 완료'];

  const conditionLabel = condition < 25 ? '나쁨' : condition < 50 ? '보통 이하' : condition < 75 ? '보통' : '좋음';
  const mealLabel = meal < 25 ? '적게 먹음' : meal < 50 ? '보통 이하' : meal < 75 ? '보통' : '많이 먹음';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#313131] rounded-t-2xl px-6 py-4 flex items-center justify-center">
          <h2 className="text-white font-bold text-lg">{studentName} 이용인 일일보고</h2>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* 수면시간 */}
          <div>
            <h3 className="font-bold text-base mb-3">🌙 수면시간</h3>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">수면시간</span>
                <input
                  type="time"
                  value={sleepStart}
                  onChange={(e) => setSleepStart(e.target.value)}
                  className="bg-[#026eff] text-white rounded-lg px-3 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">기상시간</span>
                <input
                  type="time"
                  value={sleepEnd}
                  onChange={(e) => setSleepEnd(e.target.value)}
                  className="bg-[#f59e0b] text-white rounded-lg px-3 py-1.5 text-sm font-bold"
                />
              </div>
            </div>
            {/* Slider bar visualization */}
            <div className="relative h-3 bg-gray-200 rounded-full mb-3">
              <div
                className="absolute h-full bg-[#026eff] rounded-full"
                style={{ left: `${sleepPercent.left}%`, width: `${sleepPercent.width}%` }}
              />
            </div>
            <div className="bg-[#f0f4ff] rounded-lg px-4 py-2 text-center">
              <span className="text-sm font-bold text-[#026eff]">총 수면시간 {calcSleepHours()}</span>
            </div>
          </div>

          {/* 배변 상태 */}
          <div>
            <h3 className="font-bold text-base mb-3">💩 배변 상태</h3>
            <div className="flex gap-2 flex-wrap">
              {bowelOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setBowel(opt)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    bowel === opt
                      ? 'bg-[#026eff] text-white border-[#026eff]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-[#026eff]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 컨디션 */}
          <div>
            <h3 className="font-bold text-base mb-3">😊 컨디션</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 w-16 shrink-0">{conditionLabel}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={condition}
                onChange={(e) => setCondition(Number(e.target.value))}
                className="flex-1 accent-[#026eff]"
              />
            </div>
          </div>

          {/* 식사량 */}
          <div>
            <h3 className="font-bold text-base mb-3">🍽️ 식사량</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 w-16 shrink-0">{mealLabel}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={meal}
                onChange={(e) => setMeal(Number(e.target.value))}
                className="flex-1 accent-[#026eff]"
              />
            </div>
          </div>

          {/* 약 복용 정보 */}
          <div>
            <h3 className="font-bold text-base mb-3">💊 약 복용 정보</h3>
            <div className="flex gap-2 flex-wrap mb-3">
              {medicineOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMedicine(opt)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    medicine === opt
                      ? 'bg-[#026eff] text-white border-[#026eff]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-[#026eff]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <textarea
              value={medicineNote}
              onChange={(e) => setMedicineNote(e.target.value)}
              placeholder="약 복용 관련 메모를 입력하세요."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:border-[#026eff]"
            />
          </div>

          {/* 특이 사항 */}
          <div>
            <h3 className="font-bold text-base mb-3">ℹ️ 특이 사항</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="특이 사항을 입력하세요."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:border-[#026eff]"
            />
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#026eff] hover:bg-[#0258cc] text-white font-bold py-3 rounded-xl text-base transition-colors"
          >
            일일 보고서 전송 📋
          </button>
          <button
            onClick={onClose}
            className="bg-[#313131] hover:bg-[#444] text-white font-bold px-6 py-3 rounded-xl text-base transition-colors"
          >
            취소 ✕
          </button>
        </div>
      </div>
    </div>
  );
}

interface DailyReportForm {
  sleepStart: string;
  sleepEnd: string;
  bowel: string;
  condition: number;
  meal: number;
  medicine: string;
  medicineNote: string;
  note: string;
}

interface DailyReport {
  date: string;
  sleep: string;
  condition: string;
  meal: string;
  bowel: string;
  note: string;
  teacherName: string;
}

/* ───── Daily Report Card (in chat) ───── */
function DailyReportCard({ report }: { report: DailyReport }) {
  return (
    <div className="bg-gradient-to-br from-[#6366f1] to-[#026eff] rounded-xl p-4 max-w-[340px] text-white shadow-lg">
      <div className="text-xs opacity-80 text-right mb-2">{report.date}</div>
      <p className="font-bold text-sm mb-3">{report.date} 일일보고</p>
      <div className="space-y-1.5 text-sm leading-relaxed">
        <p>🌙 <span className="font-semibold">수면:</span> {report.sleep}</p>
        <p>💩 <span className="font-semibold">배변:</span> {report.bowel}</p>
        <p>😊 <span className="font-semibold">컨디션:</span> {report.condition}</p>
        <p>🍽️ <span className="font-semibold">식사량:</span> {report.meal}</p>
      </div>
      {report.note && (
        <div className="mt-3 pt-2 border-t border-white/30">
          <p className="font-semibold text-sm mb-1">특이사항</p>
          <p className="text-sm opacity-90">{report.note}</p>
        </div>
      )}
    </div>
  );
}

/* ───── Message Bubble ───── */
function MessageBubble({ msg, userId, parentName }: { msg: MessageDB; userId: string; parentName: string }) {
  const isMe = msg.sender_id === userId;
  const senderName = (msg.sender as { name?: string } | undefined)?.name ?? '';

  if (msg.message_type === 'daily_report') {
    let report: DailyReport | null = null;
    try {
      report = JSON.parse(msg.content) as DailyReport;
    } catch {
      /* ignore */
    }
    return (
      <div className="flex justify-start gap-2.5">
        {/* Teacher avatar */}
        <div className="w-9 h-9 rounded-full bg-[#e0e0e0] flex items-center justify-center shrink-0 mt-1">
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-[#313131] mb-1">{senderName || '선생님'}</span>
          {report ? (
            <DailyReportCard report={report} />
          ) : (
            <div className="bg-white border border-[#e0e0e0] rounded-xl p-3 text-sm">{msg.content}</div>
          )}
          <span className="text-xs text-gray-400 mt-1">
            {new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    );
  }

  if (isMe) {
    return (
      <div className="flex justify-end gap-2.5">
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-[#026eff] mb-1">{parentName} 보호자님</span>
          <div className="flex items-start gap-1.5">
            <div className="bg-[#f2f2f2] rounded-xl px-4 py-2.5 max-w-md">
              <p className="text-sm text-[#313131]">{msg.content}</p>
            </div>
            {/* Heart icon */}
            <button className="mt-1 text-gray-300 hover:text-red-400 transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          <span className="text-xs text-gray-400 mt-1">
            {new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2.5">
      {/* Teacher avatar */}
      <div className="w-9 h-9 rounded-full bg-[#e0e0e0] flex items-center justify-center shrink-0 mt-1">
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm font-bold text-[#313131] mb-1">{senderName || '선생님'}</span>
        <div className="bg-white border border-[#e0e0e0] rounded-xl px-4 py-2.5 max-w-md">
          <p className="text-sm text-[#313131]">{msg.content}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1">
          {new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

/* ───── Main Component ───── */
export function ParentCommunication() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<StudentDB[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { messages, reload } = useMessages(selectedStudentId);

  // Load children
  useEffect(() => {
    if (!profile) return;
    getStudentsByParent(profile.id).then((data) => {
      setStudents(data);
      if (data.length > 0) setSelectedStudentId(data[0].id);
    });
  }, [profile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const trimmed = (text ?? inputValue).trim();
    if (!trimmed || !selectedStudentId || !profile) return;

    setSending(true);
    try {
      await sendMessage({
        student_id: selectedStudentId,
        sender_id: profile.id,
        receiver_id: profile.id,
        content: trimmed,
        message_type: 'text',
      });
      setInputValue('');
      await reload();
    } finally {
      setSending(false);
    }
  };

  const handleReportSubmit = async (data: DailyReportForm) => {
    if (!selectedStudentId || !profile) return;
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const conditionLabel = data.condition < 25 ? '나쁨' : data.condition < 50 ? '보통 이하' : data.condition < 75 ? '보통' : '좋음';
    const mealLabel = data.meal < 25 ? '적게 먹음' : data.meal < 50 ? '보통 이하' : data.meal < 75 ? '보통' : '많이 먹음';

    const report: DailyReport = {
      date: today,
      sleep: `${data.sleepStart} ~ ${data.sleepEnd}`,
      bowel: data.bowel,
      condition: conditionLabel,
      meal: mealLabel,
      note: [data.note, data.medicineNote ? `약 복용: ${data.medicine} - ${data.medicineNote}` : data.medicine].filter(Boolean).join('\n'),
      teacherName: profile.name ?? '보호자',
    };

    await sendMessage({
      student_id: selectedStudentId,
      sender_id: profile.id,
      receiver_id: profile.id,
      content: JSON.stringify(report),
      message_type: 'daily_report',
    });
    await reload();
    setShowReportModal(false);
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const parentName = profile?.name ?? '보호자';

  return (
    <div className="h-full flex flex-col bg-[#f1f1f1] rounded-lg gap-4 md:gap-5 p-4 sm:p-5 md:p-6 overflow-hidden">
        {/* Top bar */}
        <div className="bg-white rounded-lg shadow-md px-4 sm:px-5 py-2.5 h-auto sm:h-[64px] flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#026eff] rounded-full px-4 py-1.5 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg sm:text-xl">소통방</span>
            </div>
            <span className="text-[#313131] font-bold text-lg sm:text-xl truncate">
              {selectedStudent?.name ?? '학생 선택'}
            </span>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="bg-[#313131] hover:bg-[#444] text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors shrink-0"
          >
            📋 일일보고
          </button>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5 flex-1 min-h-0 overflow-hidden">
          {/* Left Panel - Student Info */}
          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 w-full md:w-[320px] shrink-0 hidden md:flex flex-col">
            {/* Student avatar + name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f0fe] flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-[#026eff]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <span className="font-bold text-lg text-[#313131]">{selectedStudent?.name ?? '학생'}</span>
            </div>

            <div className="border-t border-gray-200 mb-4" />

            {/* Stats */}
            <div className="space-y-4 flex-1">
              {/* Sleep */}
              <div>
                <span className="inline-block bg-[#e8f0fe] text-[#026eff] text-xs font-medium px-2.5 py-1 rounded-full mb-1.5">
                  지난주 대비 +1h
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🌙 평균 수면</span>
                  <span className="font-bold text-base ml-auto">8시간</span>
                  <span className="text-sm font-bold text-[#026eff]">+1h</span>
                  <span className="text-red-500 text-sm font-bold">↑</span>
                </div>
              </div>

              {/* Condition */}
              <div>
                <span className="inline-block bg-[#e8f0fe] text-[#026eff] text-xs font-medium px-2.5 py-1 rounded-full mb-1.5">
                  지난주 대비 -0.5
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">😊 평균 컨디션</span>
                  <span className="font-bold text-base ml-auto">2.5/5</span>
                  <span className="text-[#026eff] text-sm font-bold">↓</span>
                </div>
              </div>

              {/* Meal */}
              <div>
                <span className="inline-block bg-[#e8f0fe] text-[#026eff] text-xs font-medium px-2.5 py-1 rounded-full mb-1.5">
                  지난주 대비 동일
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🍽️ 평균 식사</span>
                  <span className="font-bold text-base ml-auto">92%</span>
                  <span className="text-gray-400 text-sm font-bold">→</span>
                </div>
              </div>
            </div>

            {/* AI Care button */}
            <button
              onClick={() => alert('AI 케어 기능은 준비 중입니다.')}
              className="w-full bg-[#026eff] hover:bg-[#0258cc] text-white font-bold py-3 rounded-xl text-base mt-5 transition-colors"
            >
              ✨ AI 케어 보기 &gt;
            </button>
          </div>

          {/* Right Panel - Chat Area */}
          <div className="flex-1 bg-white rounded-xl shadow-md flex flex-col min-w-0 overflow-hidden">
            {/* Chat header */}
            <div className="bg-[#313131] rounded-t-xl px-4 py-3">
              <p className="text-white font-bold text-sm sm:text-base text-center">
                안녕하세요. {selectedStudent?.name ?? '...'} 이용인 소통방입니다.
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 sm:p-5">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} userId={profile?.id ?? ''} parentName={parentName} />
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div className="border-t border-[#e0e0e0]">
              <div className="flex gap-2 items-center px-3 sm:px-4 py-2.5 bg-[#f8f8f8]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), void handleSend())}
                  placeholder="메세지를 입력하세요."
                  className="flex-1 bg-white border border-[#e0e0e0] rounded-full px-4 py-2 text-sm text-[#313131] placeholder-[#9c9c9c] outline-none focus:border-[#026eff] min-w-0"
                  disabled={sending}
                />
                <button
                  onClick={() => alert('케비챔 AI 기능은 준비 중입니다.')}
                  className="shrink-0 px-3 py-2 bg-[#e8e8e8] rounded-full text-sm text-[#636363] font-medium hover:bg-[#ddd] transition-colors"
                >
                  ✨ 케비챔
                </button>
                <button
                  onClick={() => void handleSend()}
                  disabled={sending || !inputValue.trim()}
                  className="w-10 h-10 shrink-0 flex items-center justify-center bg-[#026eff] hover:bg-[#0258cc] rounded-full disabled:opacity-40 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Quick replies */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-[#f8f8f8] border-t border-[#eeeeee]">
                {quickReplies.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => void handleSend(text)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-[#d9d9d9] rounded-full text-[#636363] text-xs sm:text-sm hover:border-[#026eff] hover:text-[#026eff] transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      {/* Daily Report Modal */}
      {showReportModal && selectedStudent && (
        <DailyReportModal
          studentName={selectedStudent.name}
          onClose={() => setShowReportModal(false)}
          onSubmit={(data) => void handleReportSubmit(data)}
        />
      )}
    </div>
  );
}

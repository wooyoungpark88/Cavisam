import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import { getStudentsByParent } from '../../lib/api/students';
import { sendMessage } from '../../lib/api/messages';
import { DEMO_PARENT_STUDENTS } from '../../lib/demo';
import type { StudentDB } from '../../lib/api/students';
import type { MessageDB } from '../../lib/api/messages';

const quickReplies = [
  '어제 밤에 잠을 잘 못 잤어요',
  '오늘 아침에 짜증을 많이 내더라고요',
  '오늘 점심 메뉴는 뭔가요?',
  '새로운 활동에 잘 참여하고 있나요?',
  '약을 먹이지 못했어요',
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
        <div className="bg-[#0f172a] rounded-t-2xl px-6 py-4 flex items-center justify-center">
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
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl text-base transition-colors"
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
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-gray-800 mb-1">{senderName || '선생님'}</span>
          {report ? (
            <DailyReportCard report={report} />
          ) : (
            <div className="bg-white border border-gray-200/60 rounded-xl p-3 text-sm">{msg.content}</div>
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
              <p className="text-sm text-gray-800">{msg.content}</p>
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
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm font-bold text-gray-800 mb-1">{senderName || '선생님'}</span>
        <div className="bg-white border border-gray-200/60 rounded-xl px-4 py-2.5 max-w-md">
          <p className="text-sm text-gray-800">{msg.content}</p>
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

  // Load children (Supabase → 없으면 데모 데이터)
  useEffect(() => {
    if (!profile) return;
    getStudentsByParent(profile.id).then((data) => {
      const result = data.length > 0 ? data : DEMO_PARENT_STUDENTS;
      setStudents(result);
      if (result.length > 0) setSelectedStudentId(result[0].id);
    }).catch(() => {
      setStudents(DEMO_PARENT_STUDENTS);
      if (DEMO_PARENT_STUDENTS.length > 0) setSelectedStudentId(DEMO_PARENT_STUDENTS[0].id);
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
    <div className="h-full flex flex-col overflow-hidden rounded-xl bg-white">
      {/* Top bar */}
      <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-3">
          <span className="bg-[#026eff] text-white text-xs font-bold px-3 py-1 rounded-full">소통방</span>
          <span className="text-sm font-semibold text-gray-800">{selectedStudent?.name ?? '학생 선택'}</span>
        </div>
        <button onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 bg-[#026eff] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0254cc] transition-colors shadow-sm">
          📋 일일보고
        </button>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Student Info */}
          <div className="w-72 bg-white border-r border-gray-100 p-5 shrink-0 hidden md:flex flex-col overflow-y-auto">
            <div className="flex flex-col items-center mb-5">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">👦</div>
              <span className="font-bold text-base text-gray-900 mt-2">{selectedStudent?.name ?? '학생'}</span>
            </div>

            <div className="space-y-3 flex-1">
              {[
                { icon: '🌙', label: '평균 수면', value: '8시간', badge: '지난주 대비 +1h', delta: '+1h', deltaColor: 'text-red-500' },
                { icon: '😊', label: '평균 컨디션', value: '2.5/5', badge: '지난주 대비 -0.5', delta: '↓', deltaColor: 'text-blue-500' },
                { icon: '🍽️', label: '평균 식사', value: '92%', badge: '지난주 대비 동일', delta: '→', deltaColor: 'text-gray-400' },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl px-4 py-4">
                  <span className="inline-block text-xs bg-blue-50 text-[#026eff] font-medium px-2 py-0.5 rounded-md mb-2">{s.badge}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{s.icon} {s.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-bold text-gray-900">{s.value}</span>
                      <span className={`text-sm font-semibold ${s.deltaColor}`}>{s.delta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => alert('AI 케어 기능은 준비 중입니다.')}
              className="w-full mt-5 py-3 bg-[#026eff] text-white text-sm font-semibold rounded-xl hover:bg-[#0254cc] transition-colors shadow-sm">
              ✨ AI 케어 보기
            </button>
          </div>

          {/* Right Panel - Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa]">
            {/* Chat header */}
            <div className="bg-[#0f172a] px-5 py-3 shrink-0">
              <p className="text-white text-sm font-medium">안녕하세요. {selectedStudent?.name ?? '...'} 이용인 소통방입니다.</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 px-5 py-5">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} userId={profile?.id ?? ''} parentName={parentName} />
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick replies */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 flex flex-wrap gap-2 shrink-0">
              {quickReplies.map((text, i) => (
                <button key={i} onClick={() => void handleSend(text)}
                  className="bg-gray-50 text-gray-600 text-sm px-4 py-2.5 rounded-full hover:bg-gray-100 border border-gray-200 transition-colors">
                  {text}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), void handleSend())}
                placeholder="메시지를 입력하세요" disabled={sending}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#026eff]/20 focus:border-[#026eff] min-w-0" />
              <button onClick={() => alert('케비챔 AI 기능은 준비 중입니다.')}
                className="text-sm font-medium px-3 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors shrink-0">
                ✨ 케비챔
              </button>
              <button onClick={() => void handleSend()} disabled={sending || !inputValue.trim()}
                className="w-10 h-10 bg-[#026eff] text-white rounded-full flex items-center justify-center hover:bg-[#0254cc] transition-colors disabled:opacity-30 shrink-0 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
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

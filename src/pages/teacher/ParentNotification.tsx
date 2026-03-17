import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStudents } from '../../hooks/useStudents';
import { useMessages } from '../../hooks/useMessages';
import { sendMessage } from '../../lib/api/messages';
import { supabase } from '../../lib/supabase';
import type { Student } from '../../types';
import type { MessageDB } from '../../lib/api/messages';

/* ───────────────────── Daily Report Modal ───────────────────── */

interface DailyReportModalProps {
  student: Student;
  onClose: () => void;
  onSend: (report: DailyReportData) => void;
  sending: boolean;
}

interface DailyReportData {
  bowel: string;
  condition: number;
  meal: number;
  medication: string;
  medicationNote: string;
  note: string;
}

function DailyReportModal({ student, onClose, onSend, sending }: DailyReportModalProps) {
  const [bowel, setBowel] = useState('정상');
  const [condition, setCondition] = useState(50);
  const [meal, setMeal] = useState(50);
  const [medication, setMedication] = useState('복용할 약 없음');
  const [medicationNote, setMedicationNote] = useState('');
  const [note, setNote] = useState('');

  const bowelOptions = ['정상', '무른편', '딱딱함', '없음'];
  const medicationOptions = ['복용할 약 없음', '복용 요청', '복용 완료'];

  const handleSubmit = () => {
    onSend({ bowel, condition, meal, medication, medicationNote, note });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1e1e1e] px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-base">{student.name} 이용인 일일보고</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
          {/* 배변 상태 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">배변 상태</label>
            <div className="flex gap-2 flex-wrap">
              {bowelOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setBowel(opt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    bowel === opt
                      ? 'bg-[#026eff] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 컨디션 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">컨디션</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-16">나쁨</span>
              <input
                type="range"
                min={0}
                max={100}
                value={condition}
                onChange={(e) => setCondition(Number(e.target.value))}
                className="flex-1 accent-[#026eff]"
              />
              <span className="text-xs text-gray-500 w-16 text-right">좋음</span>
            </div>
          </div>

          {/* 식사량 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">식사량</label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-16">적게 먹음</span>
              <input
                type="range"
                min={0}
                max={100}
                value={meal}
                onChange={(e) => setMeal(Number(e.target.value))}
                className="flex-1 accent-[#026eff]"
              />
              <span className="text-xs text-gray-500 w-16 text-right">많이 먹음</span>
            </div>
          </div>

          {/* 약 복용 정보 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">약 복용 정보</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {medicationOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMedication(opt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    medication === opt
                      ? 'bg-[#026eff] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <textarea
              value={medicationNote}
              onChange={(e) => setMedicationNote(e.target.value)}
              placeholder="약 복용 관련 추가 사항을 입력하세요..."
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#026eff]/30 resize-none"
            />
          </div>

          {/* 특이 사항 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">특이 사항</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="특이 사항을 입력하세요..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#026eff]/30 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="flex-1 py-3 bg-[#026eff] text-white rounded-xl font-semibold text-sm hover:bg-[#0254cc] transition-colors disabled:opacity-50"
          >
            {sending ? '전송 중...' : '일일 보고서 전송'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#1e1e1e] text-white rounded-xl font-semibold text-sm hover:bg-[#333] transition-colors"
          >
            취소 &times;
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Avatar Helper ───────────────────── */

function Avatar({ name, size = 40, className = '' }: { name: string; size?: number; className?: string }) {
  const colors = ['#026eff', '#ff6b35', '#7c3aed', '#059669', '#dc2626', '#d97706'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: colors[idx], fontSize: size * 0.4 }}
    >
      {name.slice(0, 1)}
    </div>
  );
}

/* ───────────────────── Chat Bubble Components ───────────────────── */

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h < 12 ? '오전' : '오후';
  const hour = h % 12 || 12;
  return `${ampm} ${hour}:${m}`;
}

function DailyReportBubble({ content, time }: { content: string; time: string }) {
  let report: Record<string, string>;
  try {
    report = JSON.parse(content) as Record<string, string>;
  } catch {
    report = {};
  }
  return (
    <div className="flex justify-center my-3">
      <div className="bg-[#f0e6ff] rounded-xl p-4 max-w-sm w-full">
        <p className="text-xs font-bold text-purple-700 mb-2">일일 보고서</p>
        <div className="space-y-1 text-xs text-gray-700">
          {report.date && <p>날짜: {report.date}</p>}
          {report.sleep && <p>수면: {report.sleep}</p>}
          {report.condition && <p>컨디션: {report.condition}</p>}
          {report.meal && <p>식사: {report.meal}</p>}
          {report.bowel && <p>배변: {report.bowel}</p>}
          {report.note && <p>특이사항: {report.note}</p>}
          {report.medication && <p>약 복용: {report.medication}</p>}
          {report.teacherName && <p className="text-gray-400 mt-1">- {report.teacherName} 선생님</p>}
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-right">{formatTime(time)}</p>
      </div>
    </div>
  );
}

function TeacherBubble({ msg, name }: { msg: MessageDB; name: string }) {
  return (
    <div className="flex items-end gap-2 mb-3">
      <Avatar name={name} size={32} />
      <div>
        <p className="text-xs font-semibold text-gray-800 mb-1">{name} 선생님</p>
        <div className="bg-[#f5f5f5] rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-xs">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content}</p>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">{formatTime(msg.created_at)}</p>
      </div>
    </div>
  );
}

function ParentBubble({ msg, parentName }: { msg: MessageDB; parentName: string }) {
  return (
    <div className="flex flex-col items-end mb-3">
      <p className="text-xs font-semibold text-[#026eff] mb-1 flex items-center gap-1">
        {parentName} 보호자님
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff4d6d"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
      </p>
      <div className="bg-[#dbeafe] rounded-2xl rounded-br-sm px-4 py-2.5 max-w-xs">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content}</p>
      </div>
      <p className="text-[10px] text-gray-400 mt-1">{formatTime(msg.created_at)}</p>
    </div>
  );
}

/* ───────────────────── Main Page ───────────────────── */

export function ParentNotification() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const { students, loading: studentsLoading } = useStudents(today);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messageText, setMessageText] = useState('');
  const [awayMode, setAwayMode] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSending, setReportSending] = useState(false);

  const { messages, loading: messagesLoading } = useMessages(selectedStudent?.id ?? null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-select first student
  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0]);
    }
  }, [students, selectedStudent]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickReplies = [
    '어제 밤에 잠을 잘 못 잤어요',
    '오늘 아침에 짜증을 많이 내더라고요',
    '약을 먹이지 못했어요',
    '오늘 컨디션이 좋아 보여요',
  ];

  /* ── Send text message ── */
  const handleSend = async () => {
    if (!messageText.trim() || !selectedStudent || !profile) return;

    const { data: studentData } = await supabase
      .from('students')
      .select('parent_id')
      .eq('id', selectedStudent.id)
      .single();

    const parentId = (studentData as { parent_id: string | null } | null)?.parent_id;
    if (!parentId) return;

    await sendMessage({
      student_id: selectedStudent.id,
      sender_id: profile.id,
      receiver_id: parentId,
      content: messageText.trim(),
      message_type: 'text',
    });
    setMessageText('');
  };

  /* ── Send daily report ── */
  const handleSendReport = async (report: DailyReportData) => {
    if (!selectedStudent || !profile) return;

    const { data: studentData } = await supabase
      .from('students')
      .select('parent_id')
      .eq('id', selectedStudent.id)
      .single();

    const parentId = (studentData as { parent_id: string | null } | null)?.parent_id;
    if (!parentId) {
      alert('해당 학생에게 연결된 보호자가 없습니다.');
      return;
    }

    const conditionLabel = report.condition > 66 ? '좋음' : report.condition > 33 ? '보통' : '나쁨';
    const mealLabel = report.meal > 66 ? '잘 먹음' : report.meal > 33 ? '보통' : '적게 먹음';

    const reportContent = {
      date: today,
      bowel: report.bowel,
      condition: conditionLabel,
      meal: mealLabel,
      medication: report.medication + (report.medicationNote ? ` - ${report.medicationNote}` : ''),
      note: report.note,
      teacherName: profile.name,
    };

    setReportSending(true);
    try {
      await sendMessage({
        student_id: selectedStudent.id,
        sender_id: profile.id,
        receiver_id: parentId,
        content: JSON.stringify(reportContent),
        message_type: 'daily_report',
      });
      setShowReportModal(false);
    } finally {
      setReportSending(false);
    }
  };

  const isMyMessage = (msg: MessageDB) => msg.sender_id === profile?.id;

  /* ── Stat helpers (mock data for demo) ── */
  const sleepHours = selectedStudent?.sleep ? parseFloat(selectedStudent.sleep) || 8 : 8;
  const conditionMap: Record<string, number> = { good: 4, normal: 3, bad: 2, very_bad: 1 };
  const conditionVal = selectedStudent ? (conditionMap[selectedStudent.condition] ?? 2.5) : 2.5;
  const mealMap: Record<string, number> = { good: 100, normal: 80, none: 50 };
  const mealPct = selectedStudent ? (mealMap[selectedStudent.meal] ?? 80) : 80;

  return (
    <div className="h-full flex flex-col bg-[#f4f4f4] overflow-hidden">
      {/* ═══ Top Bar ═══ */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="bg-[#026eff] text-white text-xs font-bold px-3 py-1 rounded-full">소통방</span>
          {selectedStudent && (
            <span className="text-sm font-semibold text-gray-800">{selectedStudent.name}</span>
          )}
        </div>
        <button
          onClick={() => selectedStudent && setShowReportModal(true)}
          className="flex items-center gap-1.5 bg-[#026eff] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#0254cc] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
          일일보고
        </button>
      </div>

      {/* ═══ Three Panel Layout ═══ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─── Left Panel: Student List ─── */}
        <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto shrink-0 hidden md:block">
          <div className="p-3">
            {studentsLoading ? (
              <p className="text-xs text-gray-400 p-2">로딩 중...</p>
            ) : (
              <div className="space-y-1.5">
                {students.map((s) => {
                  const isSelected = selectedStudent?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        isSelected
                          ? 'bg-[#1e1e1e] text-white'
                          : 'bg-[#eaeaea] text-gray-800 hover:bg-[#ddd]'
                      }`}
                    >
                      <Avatar name={s.name} size={30} className={isSelected ? 'ring-2 ring-white/30' : ''} />
                      <span className="text-sm font-medium truncate">{s.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mobile student selector */}
        <div className="md:hidden w-full absolute top-14 left-0 z-10 bg-white border-b border-gray-200 px-3 py-2">
          <select
            value={selectedStudent?.id ?? ''}
            onChange={(e) => {
              const s = students.find((st) => st.id === e.target.value);
              if (s) setSelectedStudent(s);
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* ─── Middle Panel: Student Info ─── */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto shrink-0 hidden lg:flex flex-col">
          {selectedStudent ? (
            <div className="p-5">
              {/* Student header */}
              <div className="flex flex-col items-center mb-4">
                <Avatar name={selectedStudent.name} size={56} />
                <h3 className="text-base font-bold text-gray-900 mt-2">{selectedStudent.name}</h3>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-4">
                {/* Sleep stat */}
                <div>
                  <span className="inline-block text-[10px] bg-[#dbeafe] text-[#026eff] font-medium px-2 py-0.5 rounded-full mb-1">
                    지난주 대비 +1h
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-500">평균 수면</span>
                    <span className="text-sm font-bold text-gray-900 ml-auto">{sleepHours}시간</span>
                    <span className="text-xs font-bold text-red-500">+1h</span>
                    <span className="text-red-500 text-xs">&uarr;</span>
                  </div>
                </div>

                {/* Condition stat */}
                <div>
                  <span className="inline-block text-[10px] bg-[#dbeafe] text-[#026eff] font-medium px-2 py-0.5 rounded-full mb-1">
                    지난주 대비 -0.5
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-500">평균 컨디션</span>
                    <span className="text-sm font-bold text-gray-900 ml-auto">{conditionVal}/5</span>
                    <span className="text-xs font-bold text-[#026eff]">&darr;</span>
                  </div>
                </div>

                {/* Meal stat */}
                <div>
                  <span className="inline-block text-[10px] bg-[#dbeafe] text-[#026eff] font-medium px-2 py-0.5 rounded-full mb-1">
                    지난주 대비 동일
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-500">평균 식사</span>
                    <span className="text-sm font-bold text-gray-900 ml-auto">{mealPct}%</span>
                    <span className="text-xs font-bold text-gray-400">&rarr;</span>
                  </div>
                </div>
              </div>

              {/* AI Care button */}
              <button
                onClick={() => navigate('/teacher/intervention-report')}
                className="w-full mt-5 py-2.5 bg-[#026eff] text-white text-sm font-semibold rounded-xl hover:bg-[#0254cc] transition-colors"
              >
                AI 케어 보기 &gt;
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
              학생을 선택해주세요
            </div>
          )}
        </div>

        {/* ─── Right Panel: Chat Area ─── */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedStudent ? (
            <>
              {/* Chat header */}
              <div className="bg-[#2a2a2a] px-5 py-3 shrink-0">
                <p className="text-white text-sm font-medium">
                  안녕하세요. {selectedStudent.name} 이용인 소통방입니다.
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-[#f9f9f9]">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-400">메시지 로딩 중...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-400">아직 메시지가 없습니다.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    if (msg.message_type === 'daily_report') {
                      return <DailyReportBubble key={msg.id} content={msg.content} time={msg.created_at} />;
                    }
                    if (isMyMessage(msg)) {
                      return (
                        <TeacherBubble
                          key={msg.id}
                          msg={msg}
                          name={msg.sender?.name ?? profile?.name ?? '선생님'}
                        />
                      );
                    }
                    return (
                      <ParentBubble
                        key={msg.id}
                        msg={msg}
                        parentName={msg.sender?.name ?? '보호자'}
                      />
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick replies */}
              <div className="bg-white border-t border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto shrink-0">
                {quickReplies.map((text) => (
                  <button
                    key={text}
                    onClick={() => setMessageText(text)}
                    className="whitespace-nowrap bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors shrink-0"
                  >
                    {text}
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-2 shrink-0">
                {/* Away toggle */}
                <button
                  onClick={() => setAwayMode(!awayMode)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors shrink-0 ${
                    awayMode
                      ? 'bg-[#026eff] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-colors ${
                      awayMode ? 'bg-white' : 'bg-gray-400'
                    }`}
                  />
                  자리비움
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  placeholder="메세지를 입력하세요."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#026eff]/30 min-w-0"
                />

                {/* Cavi Chat button */}
                <button
                  onClick={() => alert('케비챔 AI 기능은 준비 중입니다.')}
                  className="flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
                    <path d="M18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
                  </svg>
                  케비챔
                </button>

                {/* Send button */}
                <button
                  onClick={() => void handleSend()}
                  disabled={!messageText.trim()}
                  className="w-9 h-9 bg-[#026eff] text-white rounded-full flex items-center justify-center hover:bg-[#0254cc] transition-colors disabled:opacity-40 shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              학생을 선택해주세요.
            </div>
          )}
        </div>
      </div>

      {/* ═══ Daily Report Modal ═══ */}
      {showReportModal && selectedStudent && (
        <DailyReportModal
          student={selectedStudent}
          onClose={() => setShowReportModal(false)}
          onSend={(report) => void handleSendReport(report)}
          sending={reportSending}
        />
      )}
    </div>
  );
}

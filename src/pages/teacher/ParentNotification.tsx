import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStudents } from '../../hooks/useStudents';
import { useMessages } from '../../hooks/useMessages';
import { sendMessage } from '../../lib/api/messages';
import { supabase } from '../../lib/supabase';
import type { Student } from '../../types';
import type { MessageDB } from '../../lib/api/messages';

/* ───── Avatar ───── */
function Avatar({ name, size = 40, className = '' }: { name: string; size?: number; className?: string }) {
  const colors = ['#026eff', '#7c3aed', '#059669', '#dc2626', '#d97706', '#0891b2'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: colors[idx], fontSize: size * 0.38 }}
    >
      {name.slice(0, 1)}
    </div>
  );
}

/* ───── Time Format ───── */
function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${m}`;
}

/* ───── Daily Report Bubble ───── */
function DailyReportBubble({ content, time }: { content: string; time: string }) {
  let r: Record<string, string>;
  try { r = JSON.parse(content) as Record<string, string>; } catch { r = {}; }
  const items = [
    { icon: '🌙', label: '수면', value: r.sleep },
    { icon: '💩', label: '배변', value: r.bowel },
    { icon: '😊', label: '컨디션', value: r.condition },
    { icon: '🍽️', label: '식사량', value: r.meal },
  ].filter((i) => i.value);

  return (
    <div className="flex justify-center my-4">
      <div className="w-full max-w-sm bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold">📋 일일 보고서</span>
          {r.date && <span className="text-xs text-white/70">{r.date}</span>}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {items.map((i) => (
            <div key={i.label} className="bg-white/15 rounded-xl px-3 py-2">
              <span className="text-xs text-white/70">{i.icon} {i.label}</span>
              <p className="text-sm font-semibold">{i.value}</p>
            </div>
          ))}
        </div>
        {r.note && (
          <div className="bg-white/10 rounded-xl px-3 py-2 mb-2">
            <span className="text-xs text-white/70">특이사항</span>
            <p className="text-sm">{r.note}</p>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-white/50 mt-2">
          {r.teacherName && <span>— {r.teacherName} 선생님</span>}
          <span>{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
}

/* ───── Chat Bubbles ───── */
function TeacherBubble({ msg, name }: { msg: MessageDB; name: string }) {
  return (
    <div className="flex items-start gap-2.5 mb-4">
      <Avatar name={name} size={36} />
      <div className="max-w-[80%]">
        <p className="text-xs font-medium text-gray-500 mb-1">{name}</p>
        <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-1">{formatTime(msg.created_at)}</p>
      </div>
    </div>
  );
}

function ParentBubble({ msg, parentName }: { msg: MessageDB; parentName: string }) {
  return (
    <div className="flex flex-col items-end mb-4">
      <p className="text-xs font-medium text-[#026eff] mb-1">{parentName}</p>
      <div className="max-w-[80%] bg-[#026eff] rounded-2xl rounded-tr-md px-4 py-3 shadow-sm">
        <p className="text-sm text-white leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
      </div>
      <p className="text-xs text-gray-400 mt-1 mr-1">{formatTime(msg.created_at)}</p>
    </div>
  );
}

/* ───── Daily Report Modal ───── */
interface DailyReportData { bowel: string; condition: number; meal: number; medication: string; medicationNote: string; note: string; }

function DailyReportModal({ student, onClose, onSend, sending }: { student: Student; onClose: () => void; onSend: (r: DailyReportData) => void; sending: boolean }) {
  const [bowel, setBowel] = useState('정상');
  const [condition, setCondition] = useState(50);
  const [meal, setMeal] = useState(50);
  const [medication, setMedication] = useState('복용할 약 없음');
  const [medicationNote, setMedicationNote] = useState('');
  const [note, setNote] = useState('');

  const pills = (opts: string[], val: string, set: (v: string) => void) => (
    <div className="flex gap-2 flex-wrap">
      {opts.map((o) => (
        <button key={o} onClick={() => set(o)}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            val === o ? 'bg-[#026eff] text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}>{o}</button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900">{student.name} 일일보고</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-6 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">배변 상태</label>
            {pills(['정상', '무른편', '딱딱함', '없음'], bowel, setBowel)}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">컨디션</label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">나쁨</span>
              <input type="range" min={0} max={100} value={condition} onChange={(e) => setCondition(Number(e.target.value))} className="flex-1 accent-[#026eff] h-2" />
              <span className="text-sm text-gray-400">좋음</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">식사량</label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">적게</span>
              <input type="range" min={0} max={100} value={meal} onChange={(e) => setMeal(Number(e.target.value))} className="flex-1 accent-[#026eff] h-2" />
              <span className="text-sm text-gray-400">많이</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">약 복용</label>
            {pills(['복용할 약 없음', '복용 요청', '복용 완료'], medication, setMedication)}
            <textarea value={medicationNote} onChange={(e) => setMedicationNote(e.target.value)} placeholder="추가 사항 입력 (선택)" rows={2}
              className="w-full mt-3 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#026eff]/20 focus:border-[#026eff] resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">특이 사항</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="특이 사항을 입력하세요..." rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#026eff]/20 focus:border-[#026eff] resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={() => onSend({ bowel, condition, meal, medication, medicationNote, note })} disabled={sending}
            className="flex-1 py-3 bg-[#026eff] text-white rounded-xl font-semibold text-sm hover:bg-[#0254cc] transition-colors disabled:opacity-50">
            {sending ? '전송 중...' : '보고서 전송'}
          </button>
          <button onClick={onClose} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">취소</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ Main Page ═══════════════ */

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

  useEffect(() => {
    if (students.length > 0 && !selectedStudent) setSelectedStudent(students[0]);
  }, [students, selectedStudent]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickReplies = [
    '어제 밤에 잠을 잘 못 잤어요',
    '오늘 아침에 짜증을 많이 내더라고요',
    '약을 먹이지 못했어요',
    '오늘 컨디션이 좋아 보여요',
  ];

  const handleSend = async () => {
    if (!messageText.trim() || !selectedStudent || !profile) return;
    const { data: sd } = await supabase.from('students').select('parent_id').eq('id', selectedStudent.id).single();
    const parentId = (sd as { parent_id: string | null } | null)?.parent_id;
    if (!parentId) return;
    await sendMessage({ student_id: selectedStudent.id, sender_id: profile.id, receiver_id: parentId, content: messageText.trim(), message_type: 'text' });
    setMessageText('');
  };

  const handleSendReport = async (report: DailyReportData) => {
    if (!selectedStudent || !profile) return;
    const { data: sd } = await supabase.from('students').select('parent_id').eq('id', selectedStudent.id).single();
    const parentId = (sd as { parent_id: string | null } | null)?.parent_id;
    if (!parentId) { alert('보호자가 연결되지 않았습니다.'); return; }
    const condLabel = report.condition > 66 ? '좋음' : report.condition > 33 ? '보통' : '나쁨';
    const mealLabel = report.meal > 66 ? '잘 먹음' : report.meal > 33 ? '보통' : '적게 먹음';
    setReportSending(true);
    try {
      await sendMessage({
        student_id: selectedStudent.id, sender_id: profile.id, receiver_id: parentId, message_type: 'daily_report',
        content: JSON.stringify({ date: today, bowel: report.bowel, condition: condLabel, meal: mealLabel, medication: report.medication + (report.medicationNote ? ` - ${report.medicationNote}` : ''), note: report.note, teacherName: profile.name }),
      });
      setShowReportModal(false);
    } finally { setReportSending(false); }
  };

  const isMyMessage = (msg: MessageDB) => msg.sender_id === profile?.id;

  /* stat helpers */
  const sleepHours = selectedStudent?.sleep ? parseFloat(selectedStudent.sleep) || 8 : 8;
  const condMap: Record<string, number> = { good: 4, normal: 3, bad: 2, very_bad: 1 };
  const condVal = selectedStudent ? (condMap[selectedStudent.condition] ?? 2.5) : 2.5;
  const mealMap: Record<string, number> = { good: 100, normal: 80, none: 50 };
  const mealPct = selectedStudent ? (mealMap[selectedStudent.meal] ?? 80) : 80;

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-xl bg-white">
      {/* ═══ Top Bar ═══ */}
      <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-3">
          <span className="bg-[#026eff] text-white text-xs font-bold px-3 py-1 rounded-full">소통방</span>
          {selectedStudent && <span className="text-sm font-semibold text-gray-800">{selectedStudent.name}</span>}
        </div>
        <button onClick={() => selectedStudent && setShowReportModal(true)}
          className="flex items-center gap-2 bg-[#026eff] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#0254cc] transition-colors shadow-sm">
          📋 일일보고
        </button>
      </div>

      {/* ═══ Three Panel Layout ═══ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─── Left: Student List ─── */}
        <div className="w-52 bg-gray-50 border-r border-gray-100 overflow-y-auto shrink-0 hidden md:block">
          <div className="p-3 space-y-1">
            {studentsLoading ? (
              <p className="text-sm text-gray-400 p-3">로딩 중...</p>
            ) : students.map((s) => {
              const sel = selectedStudent?.id === s.id;
              return (
                <button key={s.id} onClick={() => setSelectedStudent(s)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                    sel ? 'bg-[#026eff] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                  }`}>
                  <Avatar name={s.name} size={32} className={sel ? 'ring-2 ring-white/40' : ''} />
                  <span className="text-sm font-medium truncate">{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile selector */}
        <div className="md:hidden absolute top-14 left-0 right-0 z-10 bg-white border-b border-gray-100 px-4 py-2">
          <select value={selectedStudent?.id ?? ''} onChange={(e) => { const s = students.find((st) => st.id === e.target.value); if (s) setSelectedStudent(s); }}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#026eff]/20">
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* ─── Middle: Student Info ─── */}
        <div className="w-72 bg-white border-r border-gray-100 overflow-y-auto shrink-0 hidden lg:flex flex-col">
          {selectedStudent ? (
            <div className="p-5">
              <div className="flex flex-col items-center mb-5">
                <Avatar name={selectedStudent.name} size={52} />
                <h3 className="text-base font-bold text-gray-900 mt-2">{selectedStudent.name}</h3>
              </div>

              <div className="space-y-3">
                {[
                  { icon: '🌙', label: '평균 수면', value: `${sleepHours}시간`, badge: '지난주 대비 +1h', delta: '+1h', deltaColor: 'text-red-500' },
                  { icon: '😊', label: '평균 컨디션', value: `${condVal}/5`, badge: '지난주 대비 -0.5', delta: '↓', deltaColor: 'text-blue-500' },
                  { icon: '🍽️', label: '평균 식사', value: `${mealPct}%`, badge: '지난주 대비 동일', delta: '→', deltaColor: 'text-gray-400' },
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

              <button onClick={() => navigate('/teacher/intervention-report')}
                className="w-full mt-5 py-3 bg-[#026eff] text-white text-sm font-semibold rounded-xl hover:bg-[#0254cc] transition-colors shadow-sm">
                ✨ AI 케어 보기
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">학생을 선택해주세요</div>
          )}
        </div>

        {/* ─── Right: Chat ─── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa]">
          {selectedStudent ? (
            <>
              {/* Chat header */}
              <div className="bg-[#0f172a] px-5 py-3 shrink-0">
                <p className="text-white text-sm font-medium">안녕하세요. {selectedStudent.name} 이용인 소통방입니다.</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full"><p className="text-sm text-gray-400">메시지 로딩 중...</p></div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full"><p className="text-sm text-gray-400">아직 메시지가 없습니다.</p></div>
                ) : (
                  messages.map((msg) => {
                    if (msg.message_type === 'daily_report') return <DailyReportBubble key={msg.id} content={msg.content} time={msg.created_at} />;
                    if (isMyMessage(msg)) return <TeacherBubble key={msg.id} msg={msg} name={msg.sender?.name ?? profile?.name ?? '선생님'} />;
                    return <ParentBubble key={msg.id} msg={msg} parentName={msg.sender?.name ?? '보호자'} />;
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick replies */}
              <div className="bg-white border-t border-gray-100 px-4 py-3 flex flex-wrap gap-2 shrink-0">
                {quickReplies.map((text) => (
                  <button key={text} onClick={() => setMessageText(text)}
                    className="bg-gray-50 text-gray-600 text-sm px-4 py-2.5 rounded-full hover:bg-gray-100 border border-gray-200 transition-colors">
                    {text}
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
                <button onClick={() => setAwayMode(!awayMode)}
                  className={`text-sm font-medium px-3 py-2 rounded-full transition-colors shrink-0 ${
                    awayMode ? 'bg-[#026eff] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                  {awayMode ? '🔵 자리비움' : '자리비움'}
                </button>

                <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend(); } }}
                  placeholder="메시지를 입력하세요"
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#026eff]/20 focus:border-[#026eff] min-w-0" />

                <button onClick={() => alert('케비챔 AI 기능은 준비 중입니다.')}
                  className="text-sm font-medium px-3 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors shrink-0">
                  ✨ 케비챔
                </button>

                <button onClick={() => void handleSend()} disabled={!messageText.trim()} aria-label="메시지 전송"
                  className="w-10 h-10 bg-[#026eff] text-white rounded-full flex items-center justify-center hover:bg-[#0254cc] transition-colors disabled:opacity-30 shrink-0 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">학생을 선택해주세요.</div>
          )}
        </div>
      </div>

      {/* ═══ Modal ═══ */}
      {showReportModal && selectedStudent && (
        <DailyReportModal student={selectedStudent} onClose={() => setShowReportModal(false)} onSend={(r) => void handleSendReport(r)} sending={reportSending} />
      )}
    </div>
  );
}

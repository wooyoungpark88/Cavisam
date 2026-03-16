import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/common/Avatar';
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
];

interface DailyReport {
  date: string;
  sleep: string;
  condition: string;
  meal: string;
  bowel: string;
  note: string;
  teacherName: string;
}

function DailyReportCard({ report }: { report: DailyReport }) {
  return (
    <div className="bg-[#dfedff] rounded-[10px] p-[10px] max-w-[322px]">
      <div className="text-[12px] text-[#717171] text-right mb-2">{report.date}</div>
      <div className="text-[16px] text-black leading-relaxed whitespace-pre-wrap">
        <p className="font-bold mb-2">{report.date} 일일보고</p>
        <p className="mb-1"><span className="font-bold">- 수면:</span> {report.sleep}</p>
        <p className="mb-1"><span className="font-bold">- 배변:</span> {report.bowel}</p>
        <p className="mb-1"><span className="font-bold">- 컨디션:</span> {report.condition}</p>
        <p className="mb-2"><span className="font-bold">- 식사량:</span> {report.meal}</p>
        <p className="font-bold mb-1">특이사항</p>
        <p>{report.note}</p>
      </div>
    </div>
  );
}

function MessageBubble({ msg, userId }: { msg: MessageDB; userId: string }) {
  const isMe = msg.sender_id === userId;
  const senderName = (msg.sender as { name?: string } | undefined)?.name ?? '';

  if (msg.message_type === 'daily_report') {
    let report: DailyReport | null = null;
    try { report = JSON.parse(msg.content) as DailyReport; } catch { /* ignore */ }
    return (
      <div className="flex justify-start">
        <div className="flex flex-col items-start max-w-[520px]">
          <div className="flex gap-1.5 items-start">
            {report ? <DailyReportCard report={report} /> : (
              <div className="bg-[#dfedff] rounded p-3 text-sm">{msg.content}</div>
            )}
            <Avatar size="md" />
          </div>
          <span className="font-bold text-base text-[#026eff] mt-2.5">{senderName}</span>
        </div>
      </div>
    );
  }

  if (isMe) {
    return (
      <div className="flex justify-end">
        <div className="flex flex-col items-end">
          <div className="flex gap-1.5 items-start justify-end">
            <div className="bg-[#f2f2f2] rounded-[10px] p-2.5 max-w-md">
              <p className="text-base text-black">{msg.content}</p>
            </div>
            <Avatar size="md" />
          </div>
          <span className="font-bold text-base text-black mt-2.5">
            {new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex flex-col items-start max-w-[520px]">
        <div className="flex gap-1.5 items-start">
          <div className="bg-[#dfedff] rounded-lg p-2.5">
            <p className="text-base text-black">{msg.content}</p>
          </div>
          <Avatar size="md" />
        </div>
        <span className="font-bold text-base text-[#026eff] mt-2.5">{senderName}</span>
      </div>
    </div>
  );
}

export function ParentCommunication() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [students, setStudents] = useState<StudentDB[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [awayMode, setAwayMode] = useState(true);
  const [sending, setSending] = useState(false);
  const [childListOpen, setChildListOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { messages, reload } = useMessages(selectedStudentId);

  // 자녀 목록 로드
  useEffect(() => {
    if (!user) return;
    getStudentsByParent(user.id).then((data) => {
      setStudents(data);
      if (data.length > 0) setSelectedStudentId(data[0].id);
    });
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !selectedStudentId || !user) return;

    setSending(true);
    try {
      await sendMessage({
        student_id: selectedStudentId,
        sender_id: user.id,
        receiver_id: user.id,
        content: trimmed,
        message_type: 'text',
      });
      setInputValue('');
      await reload();
    } finally {
      setSending(false);
    }
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="min-h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-4 sm:p-8 md:p-[50px]">
      {/* 뒤로 가기 */}
      <button
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 sm:left-10 sm:top-10 flex items-center gap-3 z-10"
      >
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span className="hidden sm:inline text-[20px] font-bold text-black">뒤로 가기</span>
      </button>

      {/* 닫기 */}
      <button
        onClick={() => navigate('/')}
        className="absolute right-4 top-4 sm:right-10 sm:top-10 w-10 h-10 z-10"
      >
        <svg className="w-full h-full text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="bg-[#f1f1f1] flex flex-col md:flex-row gap-4 md:gap-10 rounded-lg shadow-lg pt-16 sm:pt-20 md:pt-[120px] pb-6 md:pb-[50px] px-4 sm:px-6 md:px-10 w-full max-w-[1523px]">
        {/* 좌측 네비게이션 - 데스크톱만 */}
        <aside className="hidden md:flex w-[240px] bg-white rounded-lg shadow-md p-4 flex-col gap-2 shrink-0">
          <div className="px-2.5 py-2 text-sm font-bold text-gray-500 mb-2">
            {profile?.name ?? '보호자'} 님
          </div>
          <button className="h-10 w-full flex items-center gap-2 px-2.5 rounded-lg bg-[#026eff] text-white font-bold text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            소통방
          </button>
        </aside>

        <div className="flex-1 flex flex-col gap-4 md:gap-[30px] min-w-0">
          {/* 상단 바 */}
          <div className="bg-white rounded-lg shadow-md px-4 sm:px-5 py-2.5 h-auto sm:h-[77px] flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="bg-[#026eff] rounded-full px-2.5 py-1.5 w-[110px] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl sm:text-2xl">소통방</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[#313131] font-bold text-xl sm:text-2xl truncate">
                {selectedStudent?.name ?? '학생 선택'}
              </span>
            </div>
            {/* 자녀 목록 토글 - 모바일 전용 */}
            <button
              onClick={() => setChildListOpen(!childListOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              aria-label="자녀 선택"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <div className="bg-[#d7e8ff] rounded-lg p-3 sm:p-5 flex gap-4 sm:gap-5 flex-1 overflow-hidden min-h-0 relative" style={{ minHeight: '400px' }}>
            {/* 모바일 자녀 목록 백드롭 */}
            {childListOpen && (
              <div
                className="absolute inset-0 bg-black/30 z-[5] md:hidden"
                onClick={() => setChildListOpen(false)}
              />
            )}

            {/* 자녀 목록 */}
            <div className={[
              'bg-white rounded-lg p-4 sm:p-5 flex flex-col gap-2 overflow-y-auto shrink-0',
              // 모바일: 절대 위치 오버레이
              'absolute inset-y-0 left-0 z-10 w-[195px] transition-transform duration-300',
              // 데스크톱: 일반 flow
              'md:static md:z-auto md:transition-none md:translate-x-0',
              childListOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}>
              {students.length === 0 ? (
                <p className="text-sm text-gray-400 text-center">연결된 자녀가 없습니다</p>
              ) : students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedStudentId(s.id);
                    setChildListOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-4 rounded-lg w-full text-left ${
                    selectedStudentId === s.id ? 'bg-black' : 'bg-[#eaeaea]'
                  }`}
                >
                  <Avatar size="md" />
                  <span className={`font-bold text-base ${selectedStudentId === s.id ? 'text-white' : 'text-[#313131]'}`}>
                    {s.name}
                  </span>
                </button>
              ))}
            </div>

            {/* 채팅 영역 */}
            <div className="flex-1 bg-white rounded-lg p-3 sm:p-5 flex flex-col min-w-0 overflow-hidden">
              <div className="bg-black rounded-lg p-2.5 mb-4 sm:mb-5">
                <p className="text-white font-bold text-sm sm:text-base text-center">
                  안녕하세요. {selectedStudent?.name ?? '...'} 이용인 소통방입니다.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-5 py-3 sm:py-5">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} userId={user?.id ?? ''} />
                ))}
                <div ref={chatEndRef} />
              </div>

              {awayMode && (
                <div className="bg-[#026eff] rounded-lg p-2.5 mb-3">
                  <p className="text-white font-bold text-sm sm:text-base text-center">
                    자리비움이 설정되어, 보호자님과 케비쌤이 소통합니다.
                  </p>
                </div>
              )}

              <div className="flex gap-2 sm:gap-2.5 items-center px-3 sm:px-5 py-2.5 bg-[#f2f2f2] border-t border-[#cecece] rounded-b-lg h-[52px] shrink-0">
                <button
                  onClick={() => setAwayMode(!awayMode)}
                  className={`flex items-center gap-1.5 font-medium text-sm sm:text-base shrink-0 ${
                    awayMode ? 'text-[#026eff]' : 'text-[#9c9c9c]'
                  }`}
                >
                  자리비움
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), void handleSend())}
                  placeholder="메세지를 입력하세요."
                  className="flex-1 bg-transparent text-sm sm:text-base text-black placeholder-[#9c9c9c] outline-none min-w-0"
                  disabled={sending}
                />
                <button
                  onClick={() => void handleSend()}
                  disabled={sending || !inputValue.trim()}
                  className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center disabled:opacity-40"
                >
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2.5 p-2 sm:p-2.5 bg-[#f2f2f2] rounded-b-lg shrink-0">
                {quickReplies.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(text)}
                    className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white border border-[#d9d9d9] rounded-full text-[#9c9c9c] text-sm sm:text-base hover:border-[#026eff] hover:text-[#026eff] transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useStudents } from '../../hooks/useStudents';
import { sendMessage } from '../../lib/api/messages';
import { supabase } from '../../lib/supabase';
import type { Student } from '../../types';

interface Profile {
  id: string;
  name: string;
}

export function ParentNotification() {
  const { user, profile } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const { students } = useStudents(today);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0]);
    }
  }, [students, selectedStudent]);

  const handleSendReport = async () => {
    if (!selectedStudent || !user || !profile?.organization_id) return;

    // 해당 학생의 보호자 ID 찾기
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

    const conditionLabel: Record<string, string> = {
      good: '좋음', normal: '보통', bad: '나쁨', very_bad: '매우 나쁨',
    };
    const mealLabel: Record<string, string> = {
      good: '잘 먹음', normal: '보통', none: '안 먹음',
    };
    const bowelLabel: Record<string, string> = { normal: '정상', none: '없음' };

    const report = {
      date: today,
      sleep: selectedStudent.sleep,
      condition: conditionLabel[selectedStudent.condition] ?? selectedStudent.condition,
      meal: mealLabel[selectedStudent.meal] ?? selectedStudent.meal,
      bowel: bowelLabel[selectedStudent.bowel] ?? selectedStudent.bowel,
      note: note || selectedStudent.note,
      teacherName: (profile as Profile).name,
    };

    setSending(true);
    try {
      await sendMessage({
        student_id: selectedStudent.id,
        sender_id: user.id,
        receiver_id: parentId,
        content: JSON.stringify(report),
        message_type: 'daily_report',
      });
      setSent(true);
      setNote('');
      setTimeout(() => setSent(false), 3000);
    } finally {
      setSending(false);
    }
  };

  const conditionLabel: Record<string, string> = {
    good: '😊 좋음', normal: '😐 보통', bad: '😟 나쁨', very_bad: '😰 매우 나쁨',
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">보호자 알림장</h2>
        <p className="text-sm text-gray-500">학생의 일일 컨디션을 보호자에게 전달합니다.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* 학생 목록 */}
        <div className="w-full md:w-64 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-600 mb-3">학생 목록</h3>
          <div className="space-y-2">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedStudent?.id === s.id
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* 알림장 작성 */}
        {selectedStudent ? (
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                {selectedStudent.name.slice(0, 1)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedStudent.name}</h3>
                <p className="text-sm text-gray-500">{today} 일일 보고</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">수면</p>
                <p className="font-medium">{selectedStudent.sleep || '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">컨디션</p>
                <p className="font-medium">{conditionLabel[selectedStudent.condition]}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">식사</p>
                <p className="font-medium">
                  {selectedStudent.meal === 'good' ? '잘 먹음' :
                   selectedStudent.meal === 'normal' ? '보통' : '안 먹음'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">배변</p>
                <p className="font-medium">
                  {selectedStudent.bowel === 'normal' ? '정상' : '없음'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                특이사항 / 추가 메모
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={selectedStudent.note || '오늘의 특이사항을 입력해주세요...'}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>

            <button
              onClick={() => void handleSendReport()}
              disabled={sending}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sent ? '✅ 전송 완료!' : sending ? '전송 중...' : '보호자에게 알림장 전송'}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            학생을 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );
}

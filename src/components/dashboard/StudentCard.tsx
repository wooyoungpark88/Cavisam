import type { Student } from '../../types';
import { Card, Avatar } from '../common';

interface StudentCardProps {
  student: Student;
  onAICareClick?: () => void;
  onChatClick?: () => void;
}

const conditionLabels = {
  good: '좋음',
  normal: '보통',
  bad: '나쁨',
  very_bad: '매우 나쁨',
};

const mealLabels = {
  good: '평소처럼 먹음',
  normal: '보통',
  none: '안먹음',
};

const bowelLabels = {
  normal: '정상',
  none: '없음',
};

/** 수면 시간 텍스트에서 숫자 추출해 이상 여부 판단 (6시간 미만 → 빨간색) */
function isSleepAbnormal(sleep: string): boolean {
  const match = sleep.match(/(\d+(\.\d+)?)/);
  if (!match) return false;
  return parseFloat(match[1]) < 6;
}

export function StudentCard({ student, onAICareClick, onChatClick }: StudentCardProps) {
  const sleepAbnormal = isSleepAbnormal(student.sleep);

  return (
    <Card className="w-full max-w-[336px]">
      {/* 헤더: 이름 + 날짜 */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar src={student.avatar} size="md" />
          <span className="font-semibold text-[#313131] text-lg">{student.name}</span>
        </div>
        <span className="text-xs text-[#026eff] font-medium">{student.date}</span>
      </div>

      {/* 상태 정보 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 shrink-0 text-gray-400">🌙</span>
          <span>수면:</span>
          <span className={`font-medium ${sleepAbnormal ? 'text-[#ff0000]' : 'text-[#026eff]'}`}>
            {student.sleep}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 shrink-0 text-gray-400">😊</span>
          <span className="text-[#313131]">컨디션: {conditionLabels[student.condition]}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 shrink-0 text-gray-400">🍽️</span>
          <span className="text-[#313131]">식사: {mealLabels[student.meal]}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 shrink-0 text-gray-400">🚽</span>
          <span className="text-[#313131]">배변: {bowelLabels[student.bowel]}</span>
        </div>
      </div>

      {/* 특이사항 + 약복용 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <span>📝</span>
            <span className="text-[#313131]">특이사항</span>
          </div>
          <p className="text-sm text-[#313131] pl-6 leading-relaxed">{student.note || '-'}</p>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <span>💊</span>
            <span className="text-[#313131]">약복용</span>
          </div>
          <p className="text-sm text-[#313131] pl-6">{student.medication || '-'}</p>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <button
          onClick={onAICareClick}
          className="w-full flex items-center justify-center gap-2 text-sm text-white bg-[#026eff] hover:bg-[#0057d4] py-2.5 rounded-md transition-colors font-medium"
        >
          <span>🤖</span>
          <span>AI 케어 보기</span>
        </button>

        <button
          onClick={onChatClick}
          className="w-full flex items-center justify-center gap-2 text-sm text-white bg-[#636363] hover:bg-[#4a4a4a] py-2.5 rounded-md transition-colors font-medium"
        >
          <span>💬</span>
          <span>소통방 가기</span>
        </button>
      </div>
    </Card>
  );
}

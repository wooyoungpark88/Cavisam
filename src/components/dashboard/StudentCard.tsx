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

export function StudentCard({ student, onAICareClick, onChatClick }: StudentCardProps) {
  return (
    <Card className="w-full max-w-[336px]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar src={student.avatar} size="md" />
          <span className="font-semibold text-gray-800">{student.name}</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          {student.date}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 text-gray-400">🌙</span>
          <span>수면: {student.sleep}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 text-gray-400">😊</span>
          <span>컨디션: {conditionLabels[student.condition]}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 text-gray-400">🍽️</span>
          <span>식사: {mealLabels[student.meal]}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 text-gray-400">🚽</span>
          <span>배변: {bowelLabels[student.bowel]}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <span>📝</span>
            <span>특이사항</span>
          </div>
          <p className="text-sm text-gray-600 pl-6">{student.note || '-'}</p>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <span>💊</span>
            <span>약복용</span>
          </div>
          <p className="text-sm text-gray-600 pl-6">{student.medication || '-'}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <button
          onClick={onAICareClick}
          className="w-full flex items-center justify-between text-sm text-gray-800 hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>🤖</span>
            <span>AI 케어 보기</span>
          </div>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={onChatClick}
          className="w-full flex items-center justify-between text-sm text-gray-800 hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>💬</span>
            <span>소통방 가기</span>
          </div>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Card>
  );
}

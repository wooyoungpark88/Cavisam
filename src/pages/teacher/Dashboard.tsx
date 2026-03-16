import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentCard } from '../../components/dashboard';
import { Button, Select, Badge } from '../../components/common';
import { useStudents } from '../../hooks/useStudents';

export function TeacherDashboard() {
  const [filter, setFilter] = useState<'all' | 'attention'>('all');
  const navigate = useNavigate();

  const today = new Date();
  const dateParam = today.toISOString().slice(0, 10);
  const dateStr = today.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  const { students, loading } = useStudents(dateParam);

  const needAttention = students.filter(
    (s) => s.condition === 'bad' || s.condition === 'very_bad'
  );
  const filteredStudents = filter === 'attention' ? needAttention : students;

  return (
    <div className="h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white rounded-lg p-4 gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="primary" size="sm">오늘</Button>
          <span className="text-sm sm:text-lg font-medium">{dateStr}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm">관심 필요</span>
            <Badge variant={filter === 'attention' ? 'danger' : 'default'}>
              {needAttention.length}
            </Badge>
          </div>

          <Select
            options={[
              { value: 'all', label: '전체' },
              { value: 'attention', label: '관심 필요' },
            ]}
            value={filter}
            onChange={(val) => setFilter(val as 'all' | 'attention')}
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/teacher/behavior-stats')}
          >
            일일 통계 →
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg">등록된 학생이 없습니다.</p>
          <p className="text-sm mt-2">대상자 관리에서 학생을 추가하세요.</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => navigate('/admin/students')}
          >
            대상자 관리로 이동
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onAICareClick={() => navigate(`/teacher/intervention-report`)}
              onChatClick={() => navigate('/teacher/parent-notification')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

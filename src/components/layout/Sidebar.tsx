import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  path: string;
}

interface MenuGroup {
  id: string;
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    id: 'behavior-record',
    title: '행동 발생 기록',
    items: [
      { id: 'behavior-stats', label: '도전적 행동 통계', path: '/teacher/behavior-stats' },
      { id: 'realtime-video', label: '실시간 영상', path: '/teacher/realtime-video' },
      { id: 'behavior-analysis', label: '행동 분석', path: '/teacher/behavior-analysis' },
    ],
  },
  {
    id: 'intervention',
    title: '행동중재 통합 관리',
    items: [
      { id: 'intervention-report', label: '개인별 행동중재 리포트', path: '/teacher/intervention-report' },
    ],
  },
  {
    id: 'notification',
    title: '알림장',
    items: [
      { id: 'parent-notification', label: '보호자 알림장', path: '/teacher/parent-notification' },
    ],
  },
  {
    id: 'admin',
    title: '관리자 서비스',
    items: [
      { id: 'device-mgmt', label: '장비 관리', path: '/admin/devices' },
      { id: 'subject-mgmt', label: '대상자 관리', path: '/admin/students' },
      { id: 'user-mgmt', label: '사용자 관리', path: '/admin/users' },
      { id: 'event-group', label: '이벤트 그룹 관리', path: '/teacher/event-group' },
      { id: 'video-history', label: '영상 저장 이력 관리', path: '/admin/video-history' },
      { id: 'system-log', label: '시스템 로그', path: '/admin/system-log' },
      { id: 'system-error', label: '시스템 장애 관리', path: '/admin/system-error' },
      { id: 'ai-report', label: 'AI 성능 리포트', path: '/admin/ai-report' },
    ],
  },
];

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeItem, onItemClick, isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    menuGroups.map((g) => g.id)
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    onItemClick?.(item.id);
    navigate(item.path);
  };

  return (
    <aside className={[
      'w-[233px] bg-white border-r border-gray-200 h-full overflow-y-auto shrink-0',
      'fixed inset-y-0 left-0 z-30 transition-transform duration-300',
      'md:static md:translate-x-0 md:z-auto md:transition-none',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ].join(' ')}>
      {/* 닫기 버튼 - 모바일 전용 */}
      <div className="flex justify-end p-2 md:hidden">
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
          aria-label="메뉴 닫기"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 대시보드 링크 */}
      <div className="px-4 pt-2 pb-2 md:pt-4">
        <button
          onClick={() => navigate('/teacher')}
          className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
            activeItem === 'dashboard'
              ? 'bg-[#cbe1ff] text-[#161616] font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            대시보드
          </span>
        </button>
      </div>

      <nav className="py-2 px-4">
        {menuGroups.map((group) => (
          <div key={group.id} className="mb-4">
            <button
              className="text-xs font-semibold text-[#4896ff] mb-1 w-full text-left flex items-center justify-between"
              onClick={() => toggleGroup(group.id)}
            >
              {group.title}
              <span className="text-[#4896ff]/60 text-[10px]">
                {expandedGroups.includes(group.id) ? '▲' : '▼'}
              </span>
            </button>

            {expandedGroups.includes(group.id) && (
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                        activeItem === item.id
                          ? 'bg-[#cbe1ff] text-[#161616] font-medium'
                          : 'text-[#0b0b0b] hover:bg-gray-50'
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          activeItem === item.id ? 'bg-[#026eff]' : 'bg-gray-300'
                        }`} />
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

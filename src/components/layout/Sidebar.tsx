import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const teacherMenu = [
  { id: 'dashboard', label: '대시보드', icon: '📋', path: '/teacher' },
  { id: 'communication', label: '소통방', icon: '💬', path: '/teacher/parent-notification' },
];

const parentMenu = [
  { id: 'communication', label: '소통방', icon: '💬', path: '/parent' },
  { id: 'ai-care', label: 'AI 케어', icon: '✨', path: '/parent/ai-care' },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const menu = role === 'parent' ? parentMenu : teacherMenu;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={[
        'w-[200px] bg-white rounded-lg p-4 flex flex-col gap-2 shrink-0',
        'fixed inset-y-0 left-0 z-30 transition-transform duration-300',
        'md:static md:translate-x-0 md:z-auto md:transition-none md:h-auto md:rounded-lg',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      {/* 닫기 - 모바일 */}
      <div className="flex justify-end md:hidden">
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100" aria-label="닫기">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* CareVia 로고 */}
      <div className="flex items-center justify-center py-2 mb-2">
        <img src="/logo-carevia-figma.png" alt="CareVia" className="h-8" />
      </div>

      {/* 메뉴 */}
      {menu.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            navigate(item.path);
            onClose?.();
          }}
          className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
            isActive(item.path)
              ? 'bg-[#026eff] text-white font-bold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}

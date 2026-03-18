import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DEMO_TEACHER_ID, DEMO_PARENT_ID, DEMO_ORG_ID } from '../../lib/demo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const teacherMenu = [
  { id: 'students', label: '아동 관리', icon: '👦', path: '/teacher' },
  { id: 'parent-reports', label: '보호자 보고', icon: '📋', path: '/teacher/parent-reports' },
  { id: 'communication', label: '소통방', icon: '💬', path: '/teacher/parent-notification' },
  { id: 'behavior-stats', label: '행동 추이', icon: '📊', path: '/teacher/behavior-stats' },
  { id: 'care-team', label: '돌봄 팀', icon: '👥', path: '/teacher/care-team' },
];

const parentMenu = [
  { id: 'timeline', label: '홈 타임라인', icon: '🏠', path: '/parent' },
  { id: 'morning-report', label: '등원 전 한마디', icon: '📋', path: '/parent/morning-report' },
  { id: 'communication', label: '소통방', icon: '💬', path: '/parent/communication' },
  { id: 'behavior-stats', label: '행동 추이', icon: '📊', path: '/parent/behavior-stats' },
  { id: 'care-team', label: '돌봄 팀', icon: '👥', path: '/parent/care-team' },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, signOut, signIn } = useAuth();

  const menu = role === 'parent' ? parentMenu : teacherMenu;
  const isActive = (path: string) => location.pathname === path;

  const handleRoleSwitch = () => {
    signOut();
    if (role === 'teacher') {
      signIn({
        id: DEMO_PARENT_ID,
        name: '김민준 어머니',
        role: 'parent',
        organization_id: DEMO_ORG_ID,
        organization_name: '해오름 발달장애인복지관',
      });
      navigate('/parent');
    } else {
      signIn({
        id: DEMO_TEACHER_ID,
        name: '김태희 선생님',
        role: 'teacher',
        organization_id: DEMO_ORG_ID,
        organization_name: '해오름 발달장애인복지관',
      });
      navigate('/teacher');
    }
    onClose?.();
  };

  return (
    <aside
      className={[
        'w-[240px] bg-[#0f172a] flex flex-col shrink-0',
        'fixed inset-y-0 left-0 z-40 transition-transform duration-300',
        'md:static md:translate-x-0 md:z-auto md:transition-none',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      {/* Logo section */}
      <header className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="text-white text-lg font-bold tracking-tight">CareVia</span>
        </div>
        <p className="text-slate-400 text-xs mt-1">
          {role === 'parent' ? '보호자' : '교사'} 대시보드
        </p>
      </header>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              navigate(item.path);
              onClose?.();
            }}
            className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-3 ${
              isActive(item.path)
                ? 'bg-white/12 text-white font-semibold'
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <footer className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleRoleSwitch}
          className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3"
        >
          <span className="text-base">🔄</span>
          <span>{role === 'teacher' ? '보호자 뷰로 전환' : '교사 뷰로 전환'}</span>
        </button>
      </footer>
    </aside>
  );
}

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  activeMenuItem?: string;
  onMenuItemClick?: (itemId: string) => void;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[rgba(0,0,0,0.6)] flex items-center justify-center p-2 sm:p-3 md:p-4">
      {/* 메인 컨테이너 */}
      <div className="relative flex gap-3 w-full max-w-[1520px] h-full">
        {/* 뒤로 가기 */}
        <button
          onClick={() => navigate('/')}
          className="absolute left-0 -top-0 -translate-y-full pb-1 flex items-center gap-2 z-10 sm:left-0"
        >
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="hidden sm:inline text-sm font-bold text-white">뒤로 가기</span>
        </button>

        {/* 닫기 */}
        <button
          onClick={() => navigate('/')}
          className="absolute right-0 -top-0 -translate-y-full pb-1 w-8 h-8 z-10"
        >
          <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 햄버거 - 모바일 */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-2 top-2 z-20 md:hidden bg-white rounded-lg p-2 shadow"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 모바일 사이드바 백드롭 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 overflow-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-[rgba(0,0,0,0.6)] flex items-start justify-center p-4 sm:p-6 md:p-10">
      {/* 뒤로 가기 */}
      <button
        onClick={() => navigate('/')}
        className="fixed left-4 top-4 sm:left-8 sm:top-6 flex items-center gap-3 z-40"
      >
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span className="hidden sm:inline text-lg font-bold text-white">뒤로 가기</span>
      </button>

      {/* 닫기 */}
      <button
        onClick={() => navigate('/')}
        className="fixed right-4 top-4 sm:right-8 sm:top-6 w-10 h-10 z-40"
      >
        <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 햄버거 - 모바일 */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-16 z-40 md:hidden bg-white rounded-lg p-2 shadow"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 메인 컨테이너 */}
      <div className="flex gap-4 w-full max-w-[1520px] mt-14 sm:mt-16">
        {/* 모바일 사이드바 백드롭 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

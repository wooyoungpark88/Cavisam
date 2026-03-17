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
    <div className="h-screen bg-[#f1f1f1] flex flex-col overflow-hidden">
      {/* 상단 바 */}
      <header className="h-12 bg-[#1e1e1e] flex items-center justify-between px-4 shrink-0">
        {/* 왼쪽: 햄버거(모바일) + 뒤로가기 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">홈으로</span>
          </button>
        </div>

        {/* 로고 */}
        <img src="/logo-carevia-figma.png" alt="CareVia" className="h-6" />

        {/* 오른쪽: 닫기 */}
        <button
          onClick={() => navigate('/')}
          className="text-white hover:text-gray-300 transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* 메인 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 모바일 사이드바 백드롭 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

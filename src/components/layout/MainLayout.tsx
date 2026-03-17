import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  activeMenuItem?: string;
  onMenuItemClick?: (itemId: string) => void;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        aria-label="메뉴 열기"
        className="fixed top-4 left-4 z-20 md:hidden bg-white rounded-lg p-2 shadow-md"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 overflow-auto pt-16 px-5 pb-5 md:pt-5 md:p-5 lg:p-8 bg-[#f1f5f9]">
        {children}
      </main>
    </div>
  );
}

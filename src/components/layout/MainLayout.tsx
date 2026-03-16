import { useState } from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  activeMenuItem?: string;
  onMenuItemClick?: (itemId: string) => void;
}

export function MainLayout({
  children,
  showSidebar = true,
  activeMenuItem,
  onMenuItemClick,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header onHamburgerClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <>
            {/* 모바일 오버레이 백드롭 */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <Sidebar
              activeItem={activeMenuItem}
              onItemClick={(id) => {
                onMenuItemClick?.(id);
                setSidebarOpen(false);
              }}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </>
        )}

        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

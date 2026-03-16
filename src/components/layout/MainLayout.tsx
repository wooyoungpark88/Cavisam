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
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar
            activeItem={activeMenuItem}
            onItemClick={onMenuItemClick}
          />
        )}
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

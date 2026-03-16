import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

function OrgNameFetcher({ orgId }: { orgId: string }) {
  const [name, setName] = useState('소속 기관');

  useEffect(() => {
    supabase
      .from('organizations')
      .select('name')
      .eq('id', orgId)
      .single()
      .then(({ data }) => {
        if (data) setName((data as { name: string }).name);
      });
  }, [orgId]);

  return <span className="text-black text-xs">{name}</span>;
}

interface HeaderProps {
  onHamburgerClick?: () => void;
}

export function Header({ onHamburgerClick }: HeaderProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const roleLabel =
    profile?.role === 'teacher' ? '교사' :
    profile?.role === 'admin' ? '관리자' :
    profile?.role === 'parent' ? '보호자' : '';

  return (
    <header className="h-14 bg-black flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2 md:gap-4">
        {/* 햄버거 버튼 - 모바일 전용 */}
        <button
          onClick={onHamburgerClick}
          className="text-white p-1.5 rounded hover:bg-white/10 transition-colors md:hidden"
          aria-label="메뉴 열기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          onClick={() => navigate(profile?.role === 'parent' ? '/parent' : '/teacher')}
          className="text-white font-bold text-xl hover:opacity-80 transition-opacity"
        >
          <span className="text-purple-400">Care</span>Via
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        {profile && (
          <>
            <div className="hidden sm:block text-white text-sm truncate max-w-[140px] md:max-w-none">
              <span className="font-bold">{roleLabel}:</span>{' '}
              <span className="underline">{profile.name || '이름 미설정'}</span>
            </div>

            {profile.organization_id && (
              <div className="hidden md:block bg-white rounded px-4 py-1.5">
                <OrgNameFetcher orgId={profile.organization_id} />
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white text-sm transition-colors shrink-0"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}

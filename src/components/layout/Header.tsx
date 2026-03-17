import { useState, useRef, useEffect } from 'react';
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

  return <span className="text-black text-xs font-medium">{name}</span>;
}

interface HeaderProps {
  onHamburgerClick?: () => void;
}

export function Header({ onHamburgerClick }: HeaderProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate('/login');
  };

  const roleLabel =
    profile?.role === 'teacher' ? '교사' :
    profile?.role === 'admin' ? '관리자' :
    profile?.role === 'parent' ? '보호자' : '';

  return (
    <header className="h-14 bg-[#026eff] flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* 좌측: 햄버거 + 로고 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onHamburgerClick}
          className="text-white p-1.5 rounded hover:bg-white/20 transition-colors md:hidden"
          aria-label="메뉴 열기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          onClick={() => navigate(profile?.role === 'parent' ? '/parent' : '/teacher')}
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo-carevia-figma.png"
            alt="CareVia"
            className="h-7"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </button>
      </div>

      {/* 우측: 사용자 정보 + 소속기관 + 드롭다운 */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {profile && (
          <>
            {/* 소속 기관 박스 */}
            {profile.organization_id && (
              <div className="hidden md:flex items-center gap-1.5 bg-[#fcfcfc] rounded px-3 py-1">
                {/* 건물 아이콘 */}
                <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <OrgNameFetcher orgId={profile.organization_id} />
              </div>
            )}

            {/* 사용자 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 text-white hover:opacity-80 transition-opacity"
              >
                {/* 유저 아이콘 */}
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                <span className="hidden sm:block text-sm">
                  <span className="font-bold">{roleLabel}:</span>{' '}
                  <span className="underline">{profile.name || '이름 미설정'}</span>
                </span>
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <button
                    onClick={() => { setDropdownOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    정보 수정
                  </button>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

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

export function Header() {
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
    <header className="h-14 bg-black flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(profile?.role === 'parent' ? '/parent' : '/teacher')}
          className="text-white font-bold text-xl hover:opacity-80 transition-opacity"
        >
          <span className="text-purple-400">Care</span>Via
        </button>
      </div>

      <div className="flex items-center gap-4">
        {profile && (
          <>
            <div className="text-white text-sm">
              <span className="font-bold">{roleLabel}:</span>{' '}
              <span className="underline">{profile.name || '이름 미설정'}</span>
            </div>

            {profile.organization_id && (
              <div className="bg-white rounded px-4 py-1.5">
                <OrgNameFetcher orgId={profile.organization_id} />
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}

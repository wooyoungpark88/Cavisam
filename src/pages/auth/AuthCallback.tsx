import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/**
 * Google OAuth 콜백 처리 페이지
 * Supabase가 /auth/callback?code=... 로 리다이렉트하면
 * 세션을 확립하고 적절한 페이지로 이동
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }

      // 프로필 확인 → 역할 미설정이면 setup, 미승인이면 pending
      supabase
        .from('profiles')
        .select('role, status, organization_id')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (!profile || !profile.organization_id) {
            navigate('/auth/setup', { replace: true });
          } else if (profile.status === 'pending') {
            navigate('/auth/pending', { replace: true });
          } else if (profile.role === 'parent') {
            navigate('/parent', { replace: true });
          } else {
            navigate('/teacher', { replace: true });
          }
        });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#026eff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">로그인 처리 중...</p>
      </div>
    </div>
  );
}

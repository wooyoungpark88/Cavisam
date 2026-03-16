import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }

      // 프로필 확인
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, organization_id')
        .eq('id', session.user.id)
        .single();

      if (!profile?.role || !profile?.organization_id) {
        navigate('/auth/setup', { replace: true });
      } else if (profile.role === 'teacher' || profile.role === 'admin') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/parent', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

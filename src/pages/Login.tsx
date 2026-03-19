import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { DEMO_TEACHER_ID, DEMO_PARENT_ID, DEMO_ORG_ID } from '../lib/demo';
import type { UserRole } from '../types';

/**
 * 로그인 페이지
 * - 주 로그인: Google OAuth (Supabase Auth)
 * - 데모 모드: 기존 localStorage 기반 체험용 (Supabase 미연결 시)
 */
export function Login() {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [showDemo, setShowDemo] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (!loading && session && profile) {
      if (profile.status === 'pending') {
        navigate('/auth/pending', { replace: true });
      } else if (!profile.organization_id) {
        navigate('/auth/setup', { replace: true });
      } else if (profile.role === 'parent') {
        navigate('/parent', { replace: true });
      } else {
        navigate('/teacher', { replace: true });
      }
    }
  }, [session, profile, loading, navigate]);

  async function handleGoogleLogin() {
    setOauthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('OAuth error:', error.message);
      setOauthLoading(false);
    }
  }

  // 데모 모드 (Supabase 미설정 시 사용)
  function handleDemoStart(role: UserRole) {
    // 데모용 세션은 localStorage로 임시 처리
    const demoProfile = {
      id: role === 'teacher' ? DEMO_TEACHER_ID : DEMO_PARENT_ID,
      name: role === 'teacher' ? '김태희' : '김민준 어머니',
      role,
      status: 'approved' as const,
      organization_id: DEMO_ORG_ID,
      avatar_url: null,
      created_at: '',
    };
    localStorage.setItem('cavisam_demo', JSON.stringify(demoProfile));
    navigate(role === 'parent' ? '/parent' : '/teacher', { replace: true });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#026eff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <div className="text-5xl font-bold mb-4">
          <span className="text-[#026eff]">Care</span>Via
        </div>
        <p className="text-lg text-gray-600 mb-1">어제보다 나은 내일을 만드는, 케어비아</p>
        <p className="text-sm text-gray-400">케어비아의 캐비챗과 함께 체계적인 변화를 경험하세요.</p>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">로그인</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Google 계정으로 시작하세요
        </p>

        {/* Google OAuth 로그인 */}
        <button
          onClick={handleGoogleLogin}
          disabled={oauthLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {oauthLoading ? '연결 중...' : 'Google 계정으로 로그인'}
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 데모 모드 토글 */}
        {!showDemo ? (
          <button
            onClick={() => setShowDemo(true)}
            className="w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            체험 모드로 둘러보기
          </button>
        ) : (
          <div>
            <p className="text-xs text-gray-400 text-center mb-3">
              역할을 선택하면 데모 데이터로 체험할 수 있습니다
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoStart('teacher')}
                className="p-4 border-2 border-gray-200 rounded-xl text-center hover:border-[#026eff] hover:bg-blue-50 transition-all"
              >
                <div className="text-2xl mb-1">👩‍🏫</div>
                <p className="text-sm font-medium text-gray-800">교사 체험</p>
              </button>
              <button
                onClick={() => handleDemoStart('parent')}
                className="p-4 border-2 border-gray-200 rounded-xl text-center hover:border-[#026eff] hover:bg-blue-50 transition-all"
              >
                <div className="text-2xl mb-1">👨‍👩‍👧</div>
                <p className="text-sm font-medium text-gray-800">보호자 체험</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

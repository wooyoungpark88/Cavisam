import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * 관리자 승인 대기 페이지
 * 30초마다 프로필을 재조회하여 승인 상태를 확인
 */
export default function AuthPending() {
  const { profile, status, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();

  // 승인되면 자동 리다이렉트
  useEffect(() => {
    if (status === 'approved' && profile) {
      navigate(profile.role === 'parent' ? '/parent' : '/teacher', { replace: true });
    }
    if (status === 'rejected') {
      // rejected 상태면 여기에 머무르며 안내
    }
  }, [status, profile, navigate]);

  // 주기적으로 상태 확인
  useEffect(() => {
    const interval = setInterval(() => {
      refreshProfile();
    }, 30_000);
    return () => clearInterval(interval);
  }, [refreshProfile]);

  async function handleLogout() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-4xl font-bold mb-6">
          <span className="text-[#026eff]">Care</span>Via
        </div>

        {status === 'rejected' ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">가입이 반려되었습니다</h2>
            <p className="text-sm text-gray-500 mb-8">
              관리자가 가입 요청을 반려했습니다.<br />
              문의사항이 있으시면 소속 기관 관리자에게 연락해주세요.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#026eff] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">승인 대기 중</h2>
            <p className="text-sm text-gray-500 mb-2">
              관리자가 가입 요청을 검토하고 있습니다.
            </p>
            <p className="text-xs text-gray-400 mb-8">
              승인이 완료되면 자동으로 서비스에 접속됩니다.
            </p>
          </>
        )}

        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline"
        >
          다른 계정으로 로그인
        </button>
      </div>
    </div>
  );
}

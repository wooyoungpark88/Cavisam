import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';

/**
 * 신규 가입자 역할 선택 + 기관 배정 페이지
 * 초대코드를 입력하면 기관이 자동 배정됨
 */
export default function AuthSetup() {
  const { session, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [inviteCode, setInviteCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!session || !inviteCode.trim() || !selectedRole) return;
    setSubmitting(true);
    setError('');

    // 1. 초대코드 검증
    const { data: invitation, error: invErr } = await supabase
      .from('invitation_codes')
      .select('id, organization_id, max_uses, used_count, expires_at')
      .eq('code', inviteCode.trim().toUpperCase())
      .single();

    if (invErr || !invitation) {
      setError('유효하지 않은 초대코드입니다.');
      setSubmitting(false);
      return;
    }

    if (invitation.used_count >= invitation.max_uses) {
      setError('초대코드 사용 횟수가 초과되었습니다.');
      setSubmitting(false);
      return;
    }

    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      setError('만료된 초대코드입니다.');
      setSubmitting(false);
      return;
    }

    // 2. 프로필 업데이트 (역할 + 기관 + 상태)
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({
        role: selectedRole,
        organization_id: invitation.organization_id,
        status: 'pending',
      })
      .eq('id', session.user.id);

    if (updateErr) {
      setError('프로필 설정 중 오류가 발생했습니다.');
      setSubmitting(false);
      return;
    }

    // 3. 초대코드 사용 횟수 증가
    await supabase
      .from('invitation_codes')
      .update({ used_count: invitation.used_count + 1 })
      .eq('id', invitation.id);

    await refreshProfile();
    setSubmitting(false);
    navigate('/auth/pending', { replace: true });
  }

  // 이미 설정 완료된 사용자는 리다이렉트
  if (profile?.organization_id && profile.status !== 'pending') {
    navigate(profile.role === 'parent' ? '/parent' : '/teacher', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <div className="text-4xl font-bold mb-3">
          <span className="text-[#026eff]">Care</span>Via
        </div>
        <p className="text-sm text-gray-500">서비스 이용을 위해 초기 설정을 완료해주세요</p>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">초기 설정</h2>

        {/* 초대코드 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">초대코드</label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="관리자에게 받은 초대코드를 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#026eff] focus:border-transparent uppercase"
          />
        </div>

        {/* 역할 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">역할 선택</label>
          <div className="grid grid-cols-2 gap-4">
            {(['teacher', 'parent'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`p-5 border-2 rounded-xl text-center transition-all ${
                  selectedRole === r
                    ? 'border-[#026eff] bg-blue-50'
                    : 'border-gray-200 hover:border-[#026eff]/40'
                }`}
              >
                <div className="text-3xl mb-2">{r === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧'}</div>
                <p className="font-medium text-gray-800">
                  {r === 'teacher' ? '교사' : '보호자'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {r === 'teacher' ? '학생 관리 및 행동 기록' : '자녀 상태 확인 및 소통'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!inviteCode.trim() || !selectedRole || submitting}
          className="w-full py-3 bg-[#026eff] text-white rounded-xl font-medium hover:bg-[#0258d4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? '처리 중...' : '설정 완료'}
        </button>
      </div>
    </div>
  );
}

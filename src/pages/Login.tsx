import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Organization, UserRole } from '../types';

export function Login() {
  const { profile, loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (!loading && profile) {
      if (profile.role === 'parent') {
        navigate('/parent', { replace: true });
      } else {
        navigate('/teacher', { replace: true });
      }
    }
  }, [profile, loading, navigate]);

  // 시설 목록 로드
  useEffect(() => {
    supabase
      .from('organizations')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setOrganizations((data as Organization[]) ?? []);
      });
  }, []);

  const selectedOrgObj = organizations.find((o) => o.id === selectedOrg);

  function handleStart() {
    if (!selectedOrg || !selectedRole || !selectedOrgObj) return;
    setSubmitting(true);

    signIn({
      id: '',
      name: selectedRole === 'teacher' ? '교사' : '보호자',
      role: selectedRole,
      organization_id: selectedOrg,
      organization_name: selectedOrgObj.name,
    });

    if (selectedRole === 'parent') {
      navigate('/parent', { replace: true });
    } else {
      navigate('/teacher', { replace: true });
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
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
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">시작하기</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          소속 시설과 역할을 선택해주세요
        </p>

        {/* 시설 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">소속 시설</label>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#026eff] focus:border-transparent"
          >
            <option value="">발달장애인복지시설을 선택하세요</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* 역할 선택 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">역할 선택</label>
          <div className="grid grid-cols-2 gap-4">
            {(['teacher', 'parent'] as UserRole[]).map((r) => (
              <button
                key={r}
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

        {/* 시작 버튼 */}
        <button
          onClick={handleStart}
          disabled={!selectedOrg || !selectedRole || submitting}
          className="w-full py-3 bg-[#026eff] text-white rounded-xl font-medium hover:bg-[#0258d4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? '처리 중...' : '시작하기'}
        </button>
      </div>
    </div>
  );
}

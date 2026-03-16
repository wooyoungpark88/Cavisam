import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Organization, UserRole } from '../types';

export function RoleSetup() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'role' | 'org'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [orgName, setOrgName] = useState('');
  const [isNewOrg, setIsNewOrg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    setName(user.user_metadata?.full_name ?? '');
    supabase.from('organizations').select('*').order('name').then(({ data }) => {
      setOrganizations((data as Organization[]) ?? []);
    });
  }, [user, navigate]);

  async function handleComplete() {
    if (!user || !selectedRole || (!selectedOrg && !orgName)) return;
    setLoading(true);
    try {
      let orgId = selectedOrg;

      if (isNewOrg && orgName) {
        const { data, error } = await supabase
          .from('organizations')
          .insert({ name: orgName })
          .select('id')
          .single();
        if (error) throw error;
        orgId = (data as { id: string }).id;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ name, role: selectedRole, organization_id: orgId })
        .eq('id', user.id);
      if (error) throw error;

      await refreshProfile();

      if (selectedRole === 'teacher' || selectedRole === 'admin') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/parent', { replace: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="text-4xl font-bold mb-2">
          <span className="text-purple-600">Care</span>Via
        </div>
        <p className="text-sm text-gray-500">케어비아에 오신 것을 환영합니다</p>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        {step === 'role' ? (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-2">역할을 선택해주세요</h2>
            <p className="text-sm text-gray-500 mb-6">본인의 역할에 맞게 서비스를 제공합니다.</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="이름을 입력해주세요"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {(['teacher', 'parent'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`p-6 border-2 rounded-xl text-center transition-all ${
                    selectedRole === r
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{r === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧'}</div>
                  <p className="font-medium text-gray-800">{r === 'teacher' ? '교사' : '보호자'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {r === 'teacher' ? '학생 관리 및 행동 기록' : '자녀 상태 확인 및 소통'}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('org')}
              disabled={!selectedRole || !name.trim()}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-2">소속 기관을 선택해주세요</h2>
            <p className="text-sm text-gray-500 mb-6">소속된 센터나 기관을 선택하거나 새로 등록하세요.</p>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={isNewOrg}
                  onChange={(e) => setIsNewOrg(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">새 기관 등록</span>
              </label>

              {isNewOrg ? (
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="기관명 입력"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              ) : (
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">기관을 선택하세요</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('role')}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
              <button
                onClick={handleComplete}
                disabled={loading || (!selectedOrg && !orgName.trim())}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? '처리 중...' : '시작하기'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

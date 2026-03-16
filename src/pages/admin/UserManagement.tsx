import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import type { Profile, UserRole } from '../../types';

export function UserManagement() {
  const { profile: myProfile } = useAuth();
  const orgId = myProfile?.organization_id ?? null;
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(!!orgId);
  const [saving, setSaving] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!orgId) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('organization_id', orgId)
      .order('name')
      .then(({ data }) => {
        setUsers((data ?? []) as Profile[]);
        setLoading(false);
      });
  }, [orgId, refreshKey]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setSaving(userId);
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    setSaving(null);
    setRefreshKey((k) => k + 1);
  };

  const roleLabels: Record<UserRole, string> = {
    teacher: '교사',
    parent: '보호자',
    admin: '관리자',
  };

  const roleBadgeColor: Record<UserRole, string> = {
    teacher: 'bg-blue-100 text-blue-700',
    parent: 'bg-green-100 text-green-700',
    admin: 'bg-purple-100 text-purple-700',
  };

  return (
    <MainLayout activeMenuItem="user-mgmt">
      <div className="h-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">사용자 관리</h2>
          <p className="text-sm text-gray-500">소속 기관의 구성원 역할을 관리합니다.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            등록된 사용자가 없습니다.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">이름</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">현재 역할</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">가입일</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">역할 변경</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {u.name || '이름 미설정'}
                      {u.id === myProfile?.id && (
                        <span className="ml-2 text-xs text-gray-400">(나)</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${roleBadgeColor[u.role as UserRole]}`}>
                        {roleLabels[u.role as UserRole]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(u.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== myProfile?.id ? (
                        <select
                          value={u.role}
                          disabled={saving === u.id}
                          onChange={(e) => void handleRoleChange(u.id, e.target.value as UserRole)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400"
                        >
                          <option value="teacher">교사</option>
                          <option value="parent">보호자</option>
                          <option value="admin">관리자</option>
                        </select>
                      ) : (
                        <span className="text-xs text-gray-400">변경 불가</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

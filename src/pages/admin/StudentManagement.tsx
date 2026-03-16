import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout';
import { Button } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { createStudent, updateStudent, deleteStudent } from '../../lib/api/students';
import type { StudentDB } from '../../lib/api/students';

interface FormState {
  name: string;
  phone: string;
}

const emptyForm: FormState = { name: '', phone: '' };

export function StudentManagement() {
  const { profile } = useAuth();
  const orgId = profile?.organization_id ?? null;
  const [students, setStudents] = useState<StudentDB[]>([]);
  const [loading, setLoading] = useState(!!orgId);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!orgId) return;
    supabase
      .from('students')
      .select('*')
      .eq('organization_id', orgId)
      .order('name')
      .then(({ data }) => {
        setStudents((data ?? []) as StudentDB[]);
        setLoading(false);
      });
  }, [orgId, refreshKey]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !orgId) return;
    setSaving(true);
    try {
      if (editId) {
        await updateStudent(editId, { name: form.name, phone: form.phone });
      } else {
        await createStudent({
          name: form.name,
          phone: form.phone,
          organization_id: orgId,
          parent_id: null,
          avatar_url: null,
        });
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);
      setRefreshKey((k) => k + 1);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (s: StudentDB) => {
    setEditId(s.id);
    setForm({ name: s.name, phone: s.phone });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await deleteStudent(id);
    setRefreshKey((k) => k + 1);
  };

  return (
    <MainLayout activeMenuItem="subject-mgmt">
      <div className="h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">대상자 관리</h2>
            <p className="text-sm text-gray-500">학생 정보를 등록하고 관리합니다.</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => { setEditId(null); setForm(emptyForm); setShowForm(true); }}
          >
            + 학생 추가
          </Button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-4">
              {editId ? '학생 정보 수정' : '새 학생 등록'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">이름 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="학생 이름"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">연락처</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => void handleSubmit()}
                disabled={saving || !form.name.trim()}
              >
                {saving ? '저장 중...' : editId ? '수정 완료' : '등록'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }}
              >
                취소
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p>등록된 학생이 없습니다.</p>
            <p className="text-sm mt-1">위의 "학생 추가" 버튼을 눌러 추가하세요.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">이름</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">연락처</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">등록일</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{s.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(s.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-xs text-blue-600 hover:text-blue-800 mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => void handleDelete(s.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

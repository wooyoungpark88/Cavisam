import { useState, useEffect } from "react";
import { type TeamMember, type MemberRole } from "../../../types/team";
import { supabase } from "../../../lib/supabase";
import { useTeacherData } from "../../../contexts/TeacherDataContext";

const ROLE_OPTIONS: MemberRole[] = [
  "담임교사",
  "특수교사",
  "언어치료사",
  "작업치료사",
  "사회복지사",
  "행동지원전문가",
];

const ROLE_COLORS: Record<MemberRole, { bg: string; color: string }> = {
  "담임교사":       { bg: "#eff6ff", color: "#026eff" },
  "특수교사":       { bg: "#f0fdf4", color: "#059669" },
  "언어치료사":     { bg: "#f5f3ff", color: "#7c3aed" },
  "작업치료사":     { bg: "#fffbeb", color: "#d97706" },
  "사회복지사":     { bg: "#fdf2f8", color: "#be185d" },
  "행동지원전문가": { bg: "#fef2f2", color: "#dc2626" },
};

const AVATAR_COLORS = [
  "#026eff", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899",
  "#ef4444", "#06b6d4", "#e879f9", "#6366f1", "#14b8a6",
];

interface Props {
  existingMemberIds: (number | string)[];
  onAdd: (member: TeamMember) => void;
  onClose: () => void;
}

export default function AddTeamMemberModal({ existingMemberIds, onAdd, onClose }: Props) {
  const { orgId } = useTeacherData();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<MemberRole | null>(null);
  const [availableTeachers, setAvailableTeachers] = useState<{id: string; name: string; initial: string; avatarColor: string; email: string; phone: string; department: string}[]>([]);

  useEffect(() => {
    if (!orgId) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('organization_id', orgId)
      .eq('role', 'teacher')
      .eq('status', 'approved')
      .then(({ data }) => {
        if (!data) return;
        setAvailableTeachers(data
          .filter((p: any) => !existingMemberIds.includes(p.id))
          .map((p: any, i: number) => ({
            id: p.id,
            name: p.name || "이름 없음",
            initial: (p.name || "?").charAt(0),
            avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
            email: "",
            phone: "",
            department: "",
          }))
        );
      });
  }, [orgId, existingMemberIds]);

  const selectedUser = availableTeachers.find((u) => u.id === selectedUserId);

  const handleAdd = () => {
    if (!selectedUser || !selectedRole) return;
    const colorIndex = availableTeachers.indexOf(selectedUser) % AVATAR_COLORS.length;
    const newMember: TeamMember = {
      id: selectedUser.id,
      name: selectedUser.name,
      initial: selectedUser.initial,
      avatarColor: AVATAR_COLORS[colorIndex],
      role: selectedRole,
      department: selectedUser.department || "소속 미지정",
      phone: selectedUser.phone,
      email: selectedUser.email,
      assignedStudentIds: [],
      specialty: "전문 분야 등록 전",
      availableTime: "시간 정보 없음",
    };
    onAdd(newMember);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.25)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-[440px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-gray-900 text-sm font-bold">새 팀원 추가</h3>
            <p className="text-gray-400 text-[11px] mt-0.5">교사로 등록된 회원 중 선택하세요</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-all"
          >
            <i className="ri-close-line text-gray-400" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Step 1: 교사 선택 */}
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              1단계 · 팀원 선택
            </p>
            {availableTeachers.length === 0 ? (
              <div className="rounded-xl border border-gray-100 px-4 py-6 text-center">
                <i className="ri-user-search-line text-2xl text-gray-300 block mb-2" />
                <p className="text-gray-400 text-xs">추가 가능한 교사 계정이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {availableTeachers.map((u) => {
                  const isSelected = selectedUserId === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => { setSelectedUserId(u.id); setSelectedRole(null); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer"
                      style={{
                        background: isSelected ? "#eff6ff" : "#f9fafb",
                        border: isSelected ? "1px solid #bfdbfe" : "1px solid transparent",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: u.avatarColor }}
                      >
                        {u.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-xs font-bold">{u.name}</p>
                        <p className="text-gray-400 text-[10px]">{u.email}</p>
                      </div>
                      {u.department && (
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{u.department}</span>
                      )}
                      {isSelected && (
                        <i className="ri-check-circle-fill text-[#026eff] text-sm flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: 팀 내 역할 선택 */}
          {selectedUser && (
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                2단계 · 팀 내 역할 지정
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {ROLE_OPTIONS.map((role) => {
                  const rc = ROLE_COLORS[role];
                  const isActive = selectedRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className="px-2 py-2 rounded-xl text-[11px] font-semibold cursor-pointer whitespace-nowrap transition-all"
                      style={{
                        background: isActive ? rc.bg : "#f9fafb",
                        color: isActive ? rc.color : "#6b7280",
                        border: isActive ? `1px solid ${rc.color}40` : "1px solid transparent",
                      }}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-500 cursor-pointer whitespace-nowrap transition-all"
            style={{ background: "#f3f4f6" }}
          >
            취소
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedUser || !selectedRole}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap transition-all"
            style={{
              background: selectedUser && selectedRole ? "#026eff" : "#d1d5db",
              cursor: selectedUser && selectedRole ? "pointer" : "not-allowed",
            }}
          >
            팀에 추가
          </button>
        </div>
      </div>
    </div>
  );
}

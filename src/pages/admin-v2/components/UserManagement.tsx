import { useState, useEffect } from "react";
import { type AdminUser, type UserRole, type UserStatus } from "../../../types/admin";
import { supabase } from "../../../lib/supabase";

type FilterRole = "all" | UserRole;
type FilterStatus = "all" | UserStatus;

const ROLE_LABEL: Record<UserRole, string> = {
  teacher: "교사",
  parent: "보호자",
  unassigned: "미지정",
};
const STATUS_LABEL: Record<UserStatus, string> = {
  approved: "승인",
  pending: "대기",
  suspended: "정지",
};
const ROLE_STYLE: Record<UserRole, { bg: string; color: string }> = {
  teacher: { bg: "#eff6ff", color: "#026eff" },
  parent: { bg: "#fff7ed", color: "#ea580c" },
  unassigned: { bg: "#fef9c3", color: "#b45309" },
};
const STATUS_STYLE: Record<UserStatus, { bg: string; color: string }> = {
  approved: { bg: "#ecfdf5", color: "#059669" },
  pending: { bg: "#fef3c7", color: "#d97706" },
  suspended: { bg: "#f3f4f6", color: "#6b7280" },
};

interface RoleModalProps {
  user: AdminUser;
  onSave: (id: number | string, role: UserRole, status: UserStatus, linkedStudents?: string[]) => void;
  onClose: () => void;
}
function RoleModal({ user, onSave, onClose }: RoleModalProps) {
  const [role, setRole] = useState<UserRole>(user.role === "unassigned" ? "teacher" : user.role);
  const [status, setStatus] = useState<UserStatus>(user.status === "pending" ? "approved" : user.status);
  const [linked, setLinked] = useState<string[]>(user.linkedStudents ?? []);
  const [MOCK_STUDENTS_FOR_LINK, setStudentNames] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("students").select("name").order("name").then(({ data }) => {
      if (data) setStudentNames(data.map((s: { name: string }) => s.name));
    });
  }, []);

  const toggleStudent = (name: string) => {
    setLinked((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl w-[420px] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: user.avatarColor }}
            >
              {user.initial}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{user.name}</p>
              <p className="text-[12.5px] text-gray-400">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* 역할 선택 */}
          <div>
            <p className="text-xs font-bold text-gray-700 mb-2">역할 지정</p>
            <div className="flex gap-2">
              {(["teacher", "parent"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap border transition-all"
                  style={{
                    background: role === r ? ROLE_STYLE[r].bg : "white",
                    color: role === r ? ROLE_STYLE[r].color : "#6b7280",
                    borderColor: role === r ? ROLE_STYLE[r].color : "#e5e7eb",
                  }}
                >
                  <i className={`${r === "teacher" ? "ri-user-settings-line" : "ri-parent-line"} mr-1.5`} />
                  {ROLE_LABEL[r]}
                </button>
              ))}
            </div>
          </div>

          {/* 보호자인 경우 이용인 연결 */}
          {role === "parent" && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">이용인 연결</p>
              <div className="flex flex-wrap gap-2">
                {MOCK_STUDENTS_FOR_LINK.map((s) => {
                  const isSelected = linked.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleStudent(s)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap border transition-all"
                      style={{
                        background: isSelected ? "#fff7ed" : "white",
                        color: isSelected ? "#ea580c" : "#6b7280",
                        borderColor: isSelected ? "#ea580c" : "#e5e7eb",
                      }}
                    >
                      {isSelected && <i className="ri-check-line mr-1 text-[12px]" />}
                      {s}
                    </button>
                  );
                })}
              </div>
              {linked.length === 0 && (
                <p className="text-[12.5px] text-orange-400 mt-2">이용인을 1명 이상 연결해 주세요.</p>
              )}
            </div>
          )}

          {/* 계정 상태 */}
          <div>
            <p className="text-xs font-bold text-gray-700 mb-2">계정 상태</p>
            <div className="flex gap-2">
              {(["approved", "suspended"] as UserStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap border transition-all"
                  style={{
                    background: status === s ? STATUS_STYLE[s].bg : "white",
                    color: status === s ? STATUS_STYLE[s].color : "#6b7280",
                    borderColor: status === s ? STATUS_STYLE[s].color : "#e5e7eb",
                  }}
                >
                  {s === "approved" ? "활성" : "정지"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
          >
            취소
          </button>
          <button
            onClick={() => onSave(user.id, role, status, role === "parent" ? linked : undefined)}
            disabled={role === "parent" && linked.length === 0}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#026eff] hover:bg-[#0057cc] cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

interface UserManagementProps {
  users: AdminUser[];
  onUpdate: (id: number | string, role: UserRole, status: UserStatus, linkedStudents?: string[]) => void;
}

export default function UserManagement({ users, onUpdate }: UserManagementProps) {
  const [filterRole, setFilterRole] = useState<FilterRole>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<AdminUser | null>(null);

  const filtered = users.filter((u) => {
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    const matchSearch =
      u.name.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    return matchRole && matchStatus && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">사용자 관리</h1>
        <p className="text-sm text-gray-500 mt-0.5">가입된 사용자의 역할을 확인하고 변경할 수 있습니다.</p>
      </div>

      {/* 필터 바 - 모바일에서 세로 스택 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {/* 검색 */}
        <div className="relative w-full sm:flex-1 sm:max-w-xs">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 이메일, 전화번호 검색"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#026eff]/20 focus:border-[#026eff]/50"
          />
        </div>

        {/* 필터 그룹 - 모바일에서 스크롤 가능 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 sm:pb-0">
          {/* 역할 필터 */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
            {(["all", "teacher", "parent", "unassigned"] as FilterRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{
                  background: filterRole === r ? "white" : "transparent",
                  color: filterRole === r ? "#111827" : "#6b7280",
                  boxShadow: filterRole === r ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                }}
              >
                {r === "all" ? "전체" : ROLE_LABEL[r]}
              </button>
            ))}
          </div>

          {/* 상태 필터 */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
            {(["all", "approved", "pending", "suspended"] as FilterStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{
                  background: filterStatus === s ? "white" : "transparent",
                  color: filterStatus === s ? "#111827" : "#6b7280",
                  boxShadow: filterStatus === s ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                }}
              >
                {s === "all" ? "전체" : STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {filtered.length}명
          </span>
        </div>
      </div>

      {/* 테이블 - 데스크탑 */}
      <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* thead */}
        <div className="grid grid-cols-[2fr_2.5fr_1.5fr_1fr_1fr_1fr] gap-0 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
          {["이름", "이메일 / 전화번호", "연결 이용인", "역할", "상태", ""].map((h) => (
            <p key={h} className="text-[12.5px] font-bold text-gray-500 px-1">
              {h}
            </p>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <i className="ri-user-search-line text-gray-300 text-lg" />
            </div>
            <p className="text-sm text-gray-400">검색 결과가 없어요</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-[2fr_2.5fr_1.5fr_1fr_1fr_1fr] gap-0 px-5 py-3.5 items-center hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 px-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: u.avatarColor }}
                  >
                    {u.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                    {u.department && (
                      <p className="text-[12px] text-gray-400 truncate">{u.department}</p>
                    )}
                  </div>
                </div>
                <div className="px-1 min-w-0">
                  <p className="text-xs text-gray-600 truncate">{u.email}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{u.phone}</p>
                </div>
                <div className="px-1">
                  {u.linkedStudents && u.linkedStudents.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {u.linkedStudents.map((s) => (
                        <span
                          key={s}
                          className="text-[12px] px-2 py-0.5 bg-orange-50 text-orange-500 rounded-full font-medium whitespace-nowrap"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[12.5px] text-gray-300">—</span>
                  )}
                </div>
                <div className="px-1">
                  <span
                    className="text-[12.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={ROLE_STYLE[u.role]}
                  >
                    {ROLE_LABEL[u.role]}
                  </span>
                </div>
                <div className="px-1">
                  <span
                    className="text-[12.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={STATUS_STYLE[u.status]}
                  >
                    {STATUS_LABEL[u.status]}
                  </span>
                </div>
                <div className="px-1 flex justify-end">
                  <button
                    onClick={() => setEditUser(u)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
                  >
                    <i className="ri-edit-line text-xs" />
                    수정
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 카드 뷰 - 모바일 */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center bg-white rounded-2xl border border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
              <i className="ri-user-search-line text-gray-300 text-lg" />
            </div>
            <p className="text-sm text-gray-400">검색 결과가 없어요</p>
          </div>
        ) : (
          filtered.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: u.avatarColor }}
                >
                  {u.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                  <p className="text-[12.5px] text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className="text-[12.5px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={ROLE_STYLE[u.role]}
                  >
                    {ROLE_LABEL[u.role]}
                  </span>
                  <span
                    className="text-[12.5px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={STATUS_STYLE[u.status]}
                  >
                    {STATUS_LABEL[u.status]}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {u.linkedStudents && u.linkedStudents.length > 0
                    ? u.linkedStudents.map((s) => (
                        <span
                          key={s}
                          className="text-[12px] px-2 py-0.5 bg-orange-50 text-orange-500 rounded-full font-medium whitespace-nowrap"
                        >
                          {s}
                        </span>
                      ))
                    : <span className="text-[12.5px] text-gray-300">연결 이용인 없음</span>
                  }
                </div>
                <button
                  onClick={() => setEditUser(u)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors flex-shrink-0 ml-2"
                >
                  <i className="ri-edit-line text-xs" />
                  수정
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {editUser && (
        <RoleModal
          user={editUser}
          onSave={(id, role, status, linkedStudents) => {
            onUpdate(id, role, status, linkedStudents);
            setEditUser(null);
          }}
          onClose={() => setEditUser(null)}
        />
      )}
    </div>
  );
}

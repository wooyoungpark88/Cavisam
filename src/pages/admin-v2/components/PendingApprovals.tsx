import { useState, useEffect } from "react";
import { type AdminUser, type UserRole } from "../../../types/admin";
import { supabase } from "../../../lib/supabase";

interface PendingApprovalsProps {
  users: AdminUser[];
  onApprove: (id: number | string, role: UserRole, linkedStudents?: string[]) => void;
  onReject: (id: number | string) => void;
}

interface ApproveCardProps {
  user: AdminUser;
  onApprove: (id: number | string, role: UserRole, linkedStudents?: string[]) => void;
  onReject: (id: number | string) => void;
}

function ApproveCard({ user, onApprove, onReject }: ApproveCardProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [linked, setLinked] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
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

  const canApprove =
    selectedRole !== null &&
    (selectedRole !== "parent" || linked.length > 0);

  if (confirmed) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-8 flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-3">
          <i className="ri-checkbox-circle-fill text-green-400 text-xl" />
        </div>
        <p className="text-sm font-bold text-gray-700">{user.name} 승인 완료</p>
        <p className="text-xs text-gray-400 mt-1">
          {selectedRole === "teacher" ? "교사" : "보호자"}로 등록되었습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* User info */}
      <div className="px-5 py-4 flex items-center gap-4 border-b border-gray-50">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: "#9ca3af" }}
        >
          {user.initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
          <p className="text-xs text-gray-400">{user.phone}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[10px] px-2 py-1 bg-orange-50 text-orange-400 rounded-full font-semibold whitespace-nowrap">
            역할 미지정
          </span>
          <p className="text-[10px] text-gray-400 mt-1">{user.registeredAt} 가입</p>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* 역할 선택 */}
        <div>
          <p className="text-[11px] font-bold text-gray-600 mb-2">역할 선택</p>
          <div className="flex gap-2">
            <button
              onClick={() => { setSelectedRole("teacher"); setLinked([]); }}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap border transition-all flex items-center justify-center gap-1.5"
              style={{
                background: selectedRole === "teacher" ? "#eff6ff" : "white",
                color: selectedRole === "teacher" ? "#026eff" : "#6b7280",
                borderColor: selectedRole === "teacher" ? "#026eff" : "#e5e7eb",
              }}
            >
              <i className="ri-user-settings-line text-sm" />
              교사
            </button>
            <button
              onClick={() => setSelectedRole("parent")}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap border transition-all flex items-center justify-center gap-1.5"
              style={{
                background: selectedRole === "parent" ? "#fff7ed" : "white",
                color: selectedRole === "parent" ? "#ea580c" : "#6b7280",
                borderColor: selectedRole === "parent" ? "#ea580c" : "#e5e7eb",
              }}
            >
              <i className="ri-parent-line text-sm" />
              보호자
            </button>
          </div>
        </div>

        {/* 이용인 연결 (보호자 선택 시) */}
        {selectedRole === "parent" && (
          <div>
            <p className="text-[11px] font-bold text-gray-600 mb-2">
              이용인 연결
              <span className="text-gray-400 font-normal ml-1">( 1명 이상 선택 )</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
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
                    {isSelected && <i className="ri-check-line mr-1 text-[10px]" />}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onReject(user.id)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          >
            거절
          </button>
          <button
            onClick={() => {
              if (!canApprove || !selectedRole) return;
              setConfirmed(true);
              onApprove(user.id, selectedRole, selectedRole === "parent" ? linked : undefined);
            }}
            disabled={!canApprove}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-white cursor-pointer whitespace-nowrap transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "#026eff" }}
          >
            <i className="ri-check-line mr-1.5" />
            {selectedRole === "teacher" ? "교사로 승인" : selectedRole === "parent" ? "보호자로 승인" : "승인하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PendingApprovals({ users, onApprove, onReject }: PendingApprovalsProps) {
  const pending = users.filter((u) => u.status === "pending");

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">승인 대기</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          신규 가입자의 역할을 지정하고 승인해 주세요.
          <span className="ml-2 text-orange-500 font-semibold">{pending.length}명 대기 중</span>
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
            <i className="ri-checkbox-circle-line text-green-400 text-2xl" />
          </div>
          <p className="text-base font-bold text-gray-600">모두 처리됐어요!</p>
          <p className="text-sm text-gray-400 mt-1">대기 중인 가입 요청이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
            <i className="ri-information-line text-amber-500 text-base mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              신규 가입자는 <strong>교사</strong> 또는 <strong>보호자</strong> 중 하나의 역할을 지정해야 합니다.
              보호자로 승인할 경우 <strong>담당 이용인과 반드시 연결</strong>해 주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {pending.map((u) => (
              <ApproveCard
                key={u.id}
                user={u}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

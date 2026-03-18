import { useState } from "react";
import { type TeamMember, type StudentAssignment, type MemberRole } from "../../../mocks/teacherTeam";

const ROLE_COLORS: Record<MemberRole, { bg: string; color: string }> = {
  "담임교사":       { bg: "#eff6ff", color: "#026eff" },
  "특수교사":       { bg: "#f0fdf4", color: "#059669" },
  "언어치료사":     { bg: "#f5f3ff", color: "#7c3aed" },
  "작업치료사":     { bg: "#fffbeb", color: "#d97706" },
  "사회복지사":     { bg: "#fdf2f8", color: "#be185d" },
  "행동지원전문가": { bg: "#fef2f2", color: "#dc2626" },
};

const PRIORITY_STYLES = {
  "일반": { bg: "#f9fafb", color: "#6b7280" },
  "집중": { bg: "#fffbeb", color: "#d97706" },
  "긴급": { bg: "#fef2f2", color: "#dc2626" },
};

interface Props {
  student: StudentAssignment;
  teamMembers: TeamMember[];
  onSave: (studentId: number, newMemberIds: number[]) => void;
  onClose: () => void;
}

export default function EditAssignmentModal({ student, teamMembers, onSave, onClose }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([...student.assignedMemberIds]);

  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(student.studentId, selectedIds);
    onClose();
  };

  const ps = PRIORITY_STYLES[student.priority];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.25)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-[420px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: student.avatarColor }}
            >
              {student.initial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900 text-sm font-bold">{student.studentName}</h3>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ color: ps.color, background: ps.bg }}
                >
                  {student.priority}
                </span>
              </div>
              <p className="text-gray-400 text-[11px] mt-0.5">담당 팀원을 선택하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-all"
          >
            <i className="ri-close-line text-gray-400" />
          </button>
        </div>

        {/* Member list */}
        <div className="px-5 py-4 space-y-1.5 max-h-80 overflow-y-auto">
          {teamMembers.map((m) => {
            const rc = ROLE_COLORS[m.role];
            const isChecked = selectedIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer"
                style={{
                  background: isChecked ? "#eff6ff" : "#f9fafb",
                  border: isChecked ? "1px solid #bfdbfe" : "1px solid transparent",
                }}
              >
                {/* Checkbox */}
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: isChecked ? "#026eff" : "white",
                    border: isChecked ? "none" : "1.5px solid #d1d5db",
                  }}
                >
                  {isChecked && <i className="ri-check-line text-white" style={{ fontSize: 10 }} />}
                </div>

                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                  style={{ background: m.avatarColor }}
                >
                  {m.initial}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-gray-900 text-xs font-bold">{m.name}</p>
                    {m.isMe && (
                      <span className="text-[9px] text-[#026eff] font-semibold">나</span>
                    )}
                  </div>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                    style={{ color: rc.color, background: rc.bg }}
                  >
                    {m.role}
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 whitespace-nowrap">{m.department}</p>
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="px-5 pb-2">
          <p className="text-[11px] text-gray-400">
            선택된 팀원:{" "}
            <span className="font-bold text-gray-700">{selectedIds.length}명</span>
          </p>
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
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer whitespace-nowrap transition-all"
            style={{ background: "#026eff" }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

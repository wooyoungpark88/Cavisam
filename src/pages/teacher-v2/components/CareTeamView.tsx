import { useState } from "react";
import {
  mockTeamMembers,
  mockStudentAssignments,
  mockTeamMeetings,
  mockTeamActivities,
  type MemberRole,
  type TeamMember,
  type StudentAssignment,
} from "../../../mocks/teacherTeam";
import AddTeamMemberModal from "./AddTeamMemberModal";
import EditAssignmentModal from "./EditAssignmentModal";

type TabKey = "assignments" | "meetings" | "activity";
type RoleFilter = "전체" | MemberRole;

const ROLE_FILTERS: RoleFilter[] = ["전체", "담임교사", "특수교사", "언어치료사", "작업치료사", "사회복지사", "행동지원전문가"]; void ROLE_FILTERS;

const ROLE_COLORS: Record<MemberRole, { bg: string; color: string }> = {
  "담임교사":       { bg: "#eff6ff", color: "#026eff" },
  "특수교사":       { bg: "#f0fdf4", color: "#059669" },
  "언어치료사":     { bg: "#f5f3ff", color: "#7c3aed" },
  "작업치료사":     { bg: "#fffbeb", color: "#d97706" },
  "사회복지사":     { bg: "#fdf2f8", color: "#be185d" },
  "행동지원전문가": { bg: "#fef2f2", color: "#dc2626" },
};

const PRIORITY_STYLES = {
  "일반": { bg: "#f9fafb", color: "#6b7280", label: "일반" },
  "집중": { bg: "#fffbeb", color: "#d97706", label: "집중" },
  "긴급": { bg: "#fef2f2", color: "#dc2626", label: "긴급" },
};

const ACTIVITY_ICONS: Record<string, { icon: string; color: string }> = {
  note:    { icon: "ri-edit-line", color: "#8b5cf6" },
  report:  { icon: "ri-file-text-line", color: "#026eff" },
  meeting: { icon: "ri-calendar-check-line", color: "#10b981" },
  alert:   { icon: "ri-alarm-warning-line", color: "#ef4444" },
  update:  { icon: "ri-refresh-line", color: "#f59e0b" },
};

const MEETING_TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  "정기회의":     { bg: "#eff6ff", color: "#026eff" },
  "사례회의":     { bg: "#fef3c7", color: "#d97706" },
  "보호자간담회": { bg: "#f0fdf4", color: "#059669" },
  "외부협력":     { bg: "#f5f3ff", color: "#7c3aed" },
};

function MemberCard({ member, isSelected, onClick }: { member: TeamMember; isSelected: boolean; onClick: () => void }) {
  const rs = ROLE_COLORS[member.role];
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer"
      style={{
        background: isSelected ? "#eff6ff" : "transparent",
        border: isSelected ? "1px solid #bfdbfe" : "1px solid transparent",
      }}
    >
      <div className="relative flex-shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
          style={{ background: member.avatarColor }}
        >
          {member.initial}
        </div>
        {member.isMe && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#026eff] rounded-full border-2 border-white flex items-center justify-center">
            <i className="ri-user-line text-white" style={{ fontSize: 7 }} />
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-gray-900 text-xs font-bold truncate">{member.name}</p>
          {member.isMe && <span className="text-[9px] text-[#026eff] font-semibold whitespace-nowrap">나</span>}
        </div>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
          style={{ color: rs.color, background: rs.bg }}
        >
          {member.role}
        </span>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-[11px] font-bold text-gray-700">{member.assignedStudentIds.length}</p>
        <p className="text-[9px] text-gray-400">담당</p>
      </div>
    </button>
  );
}

function AssignmentsTab({
  selectedMemberId,
  teamMembers,
  studentAssignments,
  onEditAssignment,
}: {
  selectedMemberId: number | null;
  teamMembers: TeamMember[];
  studentAssignments: StudentAssignment[];
  onEditAssignment: (student: StudentAssignment) => void;
}) {
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">이용인 담당 현황</p>
        <p className="text-[11px] text-gray-400">총 {studentAssignments.length}명</p>
      </div>
      <div className="space-y-2">
        {studentAssignments.map((sa) => {
          const ps = PRIORITY_STYLES[sa.priority];
          const isHighlighted =
            selectedMemberId !== null && sa.assignedMemberIds.includes(selectedMemberId);
          return (
            <div
              key={sa.studentId}
              className="rounded-xl border p-3.5 transition-all"
              style={{
                borderColor: isHighlighted ? "#bfdbfe" : "#e5e7eb",
                background: isHighlighted ? "#f8faff" : "white",
              }}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                  style={{ background: sa.avatarColor }}
                >
                  {sa.initial}
                </div>
                <p className="text-gray-900 text-sm font-bold flex-1">{sa.studentName}</p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ color: ps.color, background: ps.bg }}
                >
                  {ps.label}
                </span>
                <button
                  onClick={() => onEditAssignment(sa)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer whitespace-nowrap transition-all hover:bg-gray-100"
                  style={{ color: "#6b7280" }}
                >
                  <i className="ri-edit-line text-xs" />
                  편집
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sa.assignedMemberIds.map((mid) => {
                  const m = teamMembers.find((t) => t.id === mid);
                  if (!m) return null;
                  const rs = ROLE_COLORS[m.role];
                  const isActive = selectedMemberId === mid;
                  return (
                    <div
                      key={mid}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all"
                      style={{
                        background: isActive ? m.avatarColor : rs.bg,
                        color: isActive ? "white" : rs.color,
                      }}
                    >
                      <span>{m.name}</span>
                      <span className="opacity-70">·</span>
                      <span>{m.role}</span>
                    </div>
                  );
                })}
                {sa.assignedMemberIds.length === 0 && (
                  <span className="text-[10px] text-gray-400 italic">담당 팀원이 없습니다</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MeetingsTab() {
  const upcoming = mockTeamMeetings.filter((m) => m.isUpcoming);
  const past = mockTeamMeetings.filter((m) => !m.isUpcoming);
  return (
    <div className="p-5 space-y-5">
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">예정된 회의</p>
        <div className="space-y-3">
          {upcoming.map((mtg) => {
            const ts = MEETING_TYPE_STYLES[mtg.type];
            return (
              <div key={mtg.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ color: ts.color, background: ts.bg }}
                      >
                        {mtg.type}
                      </span>
                    </div>
                    <p className="text-gray-900 text-sm font-bold">{mtg.title}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <i className="ri-calendar-line text-xs" />
                    {mtg.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line text-xs" />
                    {mtg.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-map-pin-line text-xs" />
                    {mtg.location}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">안건</p>
                  {mtg.agenda.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                      </span>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 mr-1">참석</p>
                  {mtg.participants.map((pid) => {
                    const m = mockTeamMembers.find((t) => t.id === pid);
                    if (!m) return null;
                    return (
                      <div
                        key={pid}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: m.avatarColor }}
                        title={m.name}
                      >
                        {m.initial}
                      </div>
                    );
                  })}
                  <span className="text-[10px] text-gray-400 ml-1">{mtg.participants.length}명</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">지난 회의</p>
        <div className="space-y-3">
          {past.map((mtg) => {
            const ts = MEETING_TYPE_STYLES[mtg.type];
            return (
              <div key={mtg.id} className="bg-white rounded-xl border border-gray-100 p-4 opacity-80">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ color: ts.color, background: ts.bg }}
                  >
                    {mtg.type}
                  </span>
                  <p className="text-gray-700 text-xs font-bold">{mtg.title}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <i className="ri-calendar-check-line text-xs" />
                    {mtg.date} · {mtg.time}
                  </span>
                </div>
                {mtg.notes && (
                  <div className="mt-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-[11px] text-gray-500 leading-relaxed">{mtg.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ActivityTab() {
  return (
    <div className="p-5">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">최근 팀 활동</p>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
        <div className="space-y-4">
          {mockTeamActivities.map((act) => {
            const ai = ACTIVITY_ICONS[act.type] ?? { icon: "ri-record-circle-line", color: "#6b7280" };
            return (
              <div key={act.id} className="relative pl-10">
                <div
                  className="absolute left-2 top-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: `${ai.color}18` }}
                >
                  <i className={`${ai.icon} text-[10px]`} style={{ color: ai.color }} />
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                      style={{ background: act.memberColor }}
                    >
                      {act.memberInitial}
                    </div>
                    <p className="text-gray-700 text-xs font-bold">{act.memberName}</p>
                    <span className="text-gray-400 text-[10px] ml-auto whitespace-nowrap">{act.time}</span>
                  </div>
                  <p className="text-gray-800 text-[11px] font-semibold mb-0.5">{act.action}</p>
                  <p className="text-gray-500 text-[11px] leading-relaxed">{act.target}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CareTeamView() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [studentAssignments, setStudentAssignments] = useState<StudentAssignment[]>(mockStudentAssignments);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("전체");
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("assignments");
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentAssignment | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<string | null>(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false); void mobilePanelOpen;

  const filteredMembers =
    roleFilter === "전체"
      ? teamMembers
      : teamMembers.filter((m) => m.role === roleFilter);

  const selectedMember = selectedMemberId
    ? teamMembers.find((m) => m.id === selectedMemberId)
    : null;

  const handleMemberClick = (id: number) => {
    setSelectedMemberId((prev) => (prev === id ? null : id));
    setActiveTab("assignments");
    setMobilePanelOpen(false);
  };

  const handleAddMember = (newMember: TeamMember) => {
    setTeamMembers((prev) => [...prev, newMember]);
    setAddedSuccess(`${newMember.name} 팀원이 추가됐어요`);
    setTimeout(() => setAddedSuccess(null), 3000);
  };

  const handleSaveAssignment = (studentId: number, newMemberIds: number[]) => {
    setStudentAssignments((prev) =>
      prev.map((sa) =>
        sa.studentId === studentId ? { ...sa, assignedMemberIds: newMemberIds } : sa
      )
    );
    setTeamMembers((prev) =>
      prev.map((m) => {
        const isAssigned = newMemberIds.includes(m.id);
        const wasAssigned = studentAssignments.find(s => s.studentId === studentId)?.assignedMemberIds.includes(m.id);
        if (isAssigned && !wasAssigned) {
          return { ...m, assignedStudentIds: [...m.assignedStudentIds, studentId] };
        }
        if (!isAssigned && wasAssigned) {
          return { ...m, assignedStudentIds: m.assignedStudentIds.filter(id => id !== studentId) };
        }
        return m;
      })
    );
  };

  const TABS: { key: TabKey; label: string; icon: string }[] = [
    { key: "assignments", label: "이용인 담당", icon: "ri-user-heart-line" },
    { key: "meetings", label: "팀 미팅", icon: "ri-calendar-line" },
    { key: "activity", label: "소통 기록", icon: "ri-history-line" },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left: Team list — desktop only ── */}
      <aside className="hidden md:flex flex-col border-r border-gray-100 bg-white overflow-hidden flex-shrink-0" style={{ width: 256 }}>
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-gray-900 text-sm font-bold">돌봄 팀</h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">{teamMembers.length}명</span>
              <button
                onClick={() => setShowAddMember(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer whitespace-nowrap transition-all"
                style={{ background: "#eff6ff", color: "#026eff" }}
              >
                <i className="ri-user-add-line text-xs" />
                팀원 추가
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-[11px]">해오름 발달장애인복지관 3반</p>
        </div>

        {/* Role filter */}
        <div className="flex-shrink-0 px-3 py-2.5 border-b border-gray-100">
          <div className="flex flex-wrap gap-1">
            {["전체", "교사", "치료사", "복지사", "전문가"].map((label) => {
              const filterMap: Record<string, RoleFilter> = {
                "전체": "전체",
                "교사": "담임교사",
                "치료사": "언어치료사",
                "복지사": "사회복지사",
                "전문가": "행동지원전문가",
              };
              const filterVal = filterMap[label];
              const isActive =
                roleFilter === filterVal ||
                (label === "교사" && (roleFilter === "담임교사" || roleFilter === "특수교사")) ||
                (label === "치료사" && (roleFilter === "언어치료사" || roleFilter === "작업치료사"));
              return (
                <button
                  key={label}
                  onClick={() => {
                    if (label === "교사") setRoleFilter("담임교사");
                    else if (label === "치료사") setRoleFilter("언어치료사");
                    else setRoleFilter(filterVal);
                    setSelectedMemberId(null);
                  }}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer whitespace-nowrap transition-all"
                  style={{
                    background: isActive ? "#eff6ff" : "#f9fafb",
                    color: isActive ? "#026eff" : "#6b7280",
                    border: isActive ? "1px solid #bfdbfe" : "1px solid transparent",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {addedSuccess && (
          <div className="flex-shrink-0 mx-3 mt-2 px-3 py-2 rounded-lg text-[11px] font-semibold text-[#059669] flex items-center gap-2" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <i className="ri-checkbox-circle-line text-sm" />
            {addedSuccess}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filteredMembers.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              isSelected={selectedMemberId === m.id}
              onClick={() => handleMemberClick(m.id)}
            />
          ))}
        </div>

        {selectedMember && (
          <div className="flex-shrink-0 border-t border-gray-100 px-4 py-4 space-y-2.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">선택된 팀원 정보</p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mt-0.5"><i className="ri-phone-line text-[10px] text-gray-400" /></div>
                <p className="text-[11px] text-gray-500">{selectedMember.phone}</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mt-0.5"><i className="ri-mail-line text-[10px] text-gray-400" /></div>
                <p className="text-[11px] text-gray-500 break-all">{selectedMember.email}</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mt-0.5"><i className="ri-time-line text-[10px] text-gray-400" /></div>
                <p className="text-[11px] text-gray-500">{selectedMember.availableTime}</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 mt-0.5"><i className="ri-star-line text-[10px] text-gray-400" /></div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{selectedMember.specialty}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Right: Tab panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile: 팀원 가로 스크롤 바 */}
        <div className="md:hidden flex-shrink-0 border-b border-gray-100 bg-white">
          {/* 모바일 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <div>
              <h2 className="text-sm font-bold text-gray-900">돌봄 팀</h2>
              <p className="text-[10px] text-gray-400">해오름 발달장애인복지관 3반</p>
            </div>
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap"
              style={{ background: "#eff6ff", color: "#026eff" }}
            >
              <i className="ri-user-add-line text-xs" />
              팀원 추가
            </button>
          </div>

          {/* 가로 스크롤 팀원 선택 */}
          <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto">
            <button
              onClick={() => setSelectedMemberId(null)}
              className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                style={{
                  background: selectedMemberId === null ? "#026eff" : "#f3f4f6",
                  color: selectedMemberId === null ? "white" : "#6b7280",
                  borderColor: selectedMemberId === null ? "#026eff" : "transparent",
                }}
              >
                전체
              </div>
              <span className="text-[9px] text-gray-500 whitespace-nowrap">전체</span>
            </button>
            {teamMembers.map((m) => {
              const isSelected = selectedMemberId === m.id;
              const rs = ROLE_COLORS[m.role]; void rs;
              return (
                <button
                  key={m.id}
                  onClick={() => handleMemberClick(m.id)}
                  className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 transition-all relative"
                    style={{
                      background: m.avatarColor,
                      borderColor: isSelected ? "#026eff" : "transparent",
                      transform: isSelected ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {m.initial}
                    {m.isMe && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#026eff] rounded-full border border-white flex items-center justify-center">
                        <i className="ri-user-line text-white" style={{ fontSize: 6 }} />
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-500 whitespace-nowrap max-w-[44px] truncate">{m.name}</span>
                </button>
              );
            })}
          </div>

          {/* 선택된 팀원 정보 (모바일) */}
          {selectedMember && (
            <div className="px-4 pb-3 flex items-center gap-3 overflow-x-auto">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <i className="ri-phone-line text-[10px] text-gray-400" />
                <span className="text-[11px] text-gray-500 whitespace-nowrap">{selectedMember.phone}</span>
              </div>
              <span className="text-gray-200 text-xs">|</span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <i className="ri-time-line text-[10px] text-gray-400" />
                <span className="text-[11px] text-gray-500 whitespace-nowrap">{selectedMember.availableTime}</span>
              </div>
              <span className="text-gray-200 text-xs">|</span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                style={{ background: ROLE_COLORS[selectedMember.role].bg, color: ROLE_COLORS[selectedMember.role].color }}
              >
                {selectedMember.role}
              </span>
            </div>
          )}
        </div>

        {/* Desktop: Top info bar */}
        <div className="hidden md:flex flex-shrink-0 px-5 py-3.5 border-b border-gray-100 bg-white items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedMember ? (
              <>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: selectedMember.avatarColor }}>{selectedMember.initial}</div>
                <div>
                  <p className="text-gray-900 text-xs font-bold">{selectedMember.name} · {selectedMember.role}</p>
                  <p className="text-gray-400 text-[10px]">담당 이용인 {selectedMember.assignedStudentIds.length}명 · {selectedMember.department}</p>
                </div>
                <button onClick={() => setSelectedMemberId(null)} className="ml-2 text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap">
                  <i className="ri-close-line text-xs" /> 선택 해제
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-xs">팀원을 선택하면 담당 이용인이 강조됩니다</p>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            {[
              { label: "긴급", color: "#dc2626", count: studentAssignments.filter(s => s.priority === "긴급").length },
              { label: "집중", color: "#d97706", count: studentAssignments.filter(s => s.priority === "집중").length },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                {item.label} {item.count}명
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex items-center gap-1 px-4 sm:px-5 pt-3 pb-0 border-b border-gray-100 bg-white overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold cursor-pointer whitespace-nowrap transition-all border-b-2 flex-shrink-0"
                style={{
                  color: isActive ? "#026eff" : "#6b7280",
                  borderBottomColor: isActive ? "#026eff" : "transparent",
                }}
              >
                <i className={`${tab.icon} text-xs`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          {activeTab === "assignments" && (
            <AssignmentsTab
              selectedMemberId={selectedMemberId}
              teamMembers={teamMembers}
              studentAssignments={studentAssignments}
              onEditAssignment={setEditingStudent}
            />
          )}
          {activeTab === "meetings" && <MeetingsTab />}
          {activeTab === "activity" && <ActivityTab />}
        </div>
      </div>

      {/* Modals */}
      {showAddMember && (
        <AddTeamMemberModal
          existingMemberIds={teamMembers.map((m) => m.id)}
          onAdd={handleAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}
      {editingStudent && (
        <EditAssignmentModal
          student={editingStudent}
          teamMembers={teamMembers}
          onSave={handleSaveAssignment}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </div>
  );
}

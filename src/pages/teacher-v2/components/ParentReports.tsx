import { useState, useRef, useMemo } from "react";
import { useTeacherData } from "../../../contexts/TeacherDataContext";
import {
  mockSentReports,
  REPORT_TYPES,
  type ReportTypeKey,
  type ReportAttachment,
  type SentReport,
} from "../../../mocks/teacherReports";

/* ── 파일 유틸 ──────────────────────────────────────── */
const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "heic"];
const DOC_EXTS = ["pdf", "doc", "docx", "txt", "xlsx", "xls", "pptx", "ppt", "hwp"];
const ACCEPTED = [...IMAGE_EXTS, ...DOC_EXTS].map((e) => `.${e}`).join(",");
const MAX_FILES = 5;
const MAX_SIZE_MB = 10;

const DOC_ICON: Record<string, string> = {
  pdf: "ri-file-pdf-line",
  doc: "ri-file-word-line",
  docx: "ri-file-word-line",
  xls: "ri-file-excel-line",
  xlsx: "ri-file-excel-line",
  ppt: "ri-file-ppt-line",
  pptx: "ri-file-ppt-line",
  hwp: "ri-file-text-line",
  txt: "ri-file-text-line",
};
const DOC_COLOR: Record<string, string> = {
  pdf: "#ef4444",
  doc: "#026eff",
  docx: "#026eff",
  xls: "#10b981",
  xlsx: "#10b981",
  ppt: "#f97316",
  pptx: "#f97316",
  hwp: "#6366f1",
  txt: "#6b7280",
};

/* ── 파일 첨부 미리보기 컴포넌트 ──────────────────────── */
function AttachmentPreview({
  attachments,
  onRemove,
}: {
  attachments: ReportAttachment[];
  onRemove: (idx: number) => void;
}) {
  if (attachments.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {attachments.map((att, idx) =>
        att.type === "image" ? (
          <div key={idx} className="relative group w-16 h-16 flex-shrink-0">
            <img
              src={att.url}
              alt={att.name}
              className="w-16 h-16 object-cover rounded-xl border border-gray-200"
            />
            <button
              onClick={() => onRemove(idx)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
            >
              <i className="ri-close-line" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 rounded-b-xl px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-[8px] text-white truncate">{att.name}</p>
            </div>
          </div>
        ) : (
          <div
            key={idx}
            className="relative group flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl max-w-[180px]"
          >
            <div
              className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: `${DOC_COLOR[att.ext] ?? "#6b7280"}18` }}
            >
              <i
                className={`${DOC_ICON[att.ext] ?? "ri-file-line"} text-sm`}
                style={{ color: DOC_COLOR[att.ext] ?? "#6b7280" }}
              />
            </div>
            <p className="text-[11px] text-gray-700 font-medium truncate leading-tight">
              {att.name}
            </p>
            <button
              onClick={() => onRemove(idx)}
              className="ml-auto w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer flex-shrink-0"
            >
              <i className="ri-close-line text-xs" />
            </button>
          </div>
        )
      )}
    </div>
  );
}

/* ── Left: 이용인 선택 패널 ───────────────────────────── */
function UserList({
  selectedId,
  onSelect,
  sentReports,
  mockStudents,
}: {
  selectedId: number;
  onSelect: (id: number) => void;
  sentReports: SentReport[];
  mockStudents: { id: number; name: string; initial: string; avatarColor: string }[];
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0 border-r border-gray-100 bg-white w-full md:w-[190px] md:flex-shrink-0">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3.5 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-900">생활알리미</p>
        <p className="text-[10px] text-gray-400 mt-0.5">이용인 선택 후 작성</p>
      </div>

      {/* Student list */}
      <div className="flex-1 overflow-y-auto py-2">
        {mockStudents.map((student) => {
          const isActive = student.id === selectedId;
          const studentReports = sentReports.filter((r) => r.studentId === student.id);
          const latest = studentReports[0];
          const unconfirmed = studentReports.filter((r) => !r.confirmed).length;

          return (
            <button
              key={student.id}
              onClick={() => onSelect(student.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 md:py-3 transition-colors cursor-pointer text-left"
              style={{
                background: isActive ? "rgba(2,110,255,0.07)" : "transparent",
                borderLeft: isActive ? "3px solid #026eff" : "3px solid transparent",
              }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-sm md:text-xs font-bold"
                  style={{ background: student.avatarColor }}
                >
                  {student.initial}
                </div>
                {unconfirmed > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-orange-400 border border-white flex items-center justify-center text-white text-[9px] font-bold">
                    {unconfirmed}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p
                    className="text-sm md:text-xs font-semibold truncate"
                    style={{ color: isActive ? "#026eff" : "#111827" }}
                  >
                    {student.name}
                  </p>
                  {latest && (
                    <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                      {latest.sentAt}
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-[10px] text-gray-400 truncate mt-0.5">
                  {latest
                    ? `${latest.type} · ${studentReports.length}건`
                    : "발송 내역 없음"}
                </p>
              </div>

              {/* Arrow — mobile only */}
              <i className="ri-arrow-right-s-line text-gray-300 text-base flex-shrink-0 md:hidden" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Right: 작성 + 이력 패널 ──────────────────────────── */
function ReportPanel({ studentId, onBack, mockStudents }: { studentId: number; onBack?: () => void; mockStudents: { id: number; name: string; initial: string; avatarColor: string }[] }) {
  const student = mockStudents.find((s) => s.id === studentId) ?? { id: studentId, name: "로딩 중", initial: "?", avatarColor: "#6b7280" };
  const [selectedType, setSelectedType] = useState<ReportTypeKey>("positive");
  const [content, setContent] = useState("");
  const [sent, setSent] = useState(false);
  const [reports, setReports] = useState<SentReport[]>(mockSentReports);
  const [attachments, setAttachments] = useState<ReportAttachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTypeMeta = REPORT_TYPES.find((t) => t.key === selectedType)!;
  const filteredHistory = reports.filter((r) => r.studentId === studentId);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setFileError(null);
    const incoming = Array.from(files);
    const remaining = MAX_FILES - attachments.length;

    if (incoming.length > remaining) {
      setFileError(`파일은 최대 ${MAX_FILES}개까지 첨부할 수 있어요.`);
      return;
    }

    const newAtts: ReportAttachment[] = [];
    for (const file of incoming) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setFileError(`파일 크기는 ${MAX_SIZE_MB}MB 이하여야 해요.`);
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const isImage = IMAGE_EXTS.includes(ext);
      newAtts.push({
        name: file.name,
        type: isImage ? "image" : "document",
        url: isImage ? URL.createObjectURL(file) : undefined,
        ext,
      });
    }
    setAttachments((prev) => [...prev, ...newAtts]);
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => {
      const next = [...prev];
      if (next[idx].url) URL.revokeObjectURL(next[idx].url!);
      next.splice(idx, 1);
      return next;
    });
  };

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    const newReport: SentReport = {
      id: reports.length + 1,
      studentId,
      studentName: student.name,
      type: selectedTypeMeta.label,
      typeIcon: selectedTypeMeta.icon,
      typeColor: selectedTypeMeta.color,
      content: content.trim(),
      sentAt: "방금",
      confirmed: false,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };
    setReports((prev) => [newReport, ...prev]);
    setContent("");
    setAttachments([]);
    setFileError(null);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-3.5 border-b border-gray-100 bg-white flex items-center gap-3">
        {/* Back button — mobile only */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
          >
            <i className="ri-arrow-left-s-line text-gray-700 text-xl" />
          </button>
        )}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: student.avatarColor }}
        >
          {student.initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{student.name} 이용인</p>
          <p className="text-[11px] text-gray-400">보호자 타임라인에 전달됩니다</p>
        </div>
        {sent && (
          <span className="flex items-center gap-1.5 text-xs text-[#10b981] font-semibold whitespace-nowrap">
            <i className="ri-checkbox-circle-fill text-sm" />
            <span className="hidden sm:inline">보호자에게 전송됐습니다</span>
            <span className="sm:hidden">전송완료</span>
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── 새 보고 작성 ── */}
        <div className="px-4 sm:px-6 pt-5 pb-5 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-700 mb-3">새 보고 작성</p>

          {/* Type selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {REPORT_TYPES.map((type) => {
              const isActive = selectedType === type.key;
              return (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(type.key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap transition-all border"
                  style={{
                    background: isActive ? type.color : "white",
                    color: isActive ? "white" : type.color,
                    borderColor: isActive ? type.color : `${type.color}40`,
                  }}
                >
                  <i className={`${type.icon} text-[11px]`} />
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`보호자에게 전달할 내용을 입력하세요.\n(보호자 홈 타임라인에 등록됩니다)`}
            maxLength={500}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none leading-relaxed"
          />

          {/* 첨부파일 미리보기 */}
          <AttachmentPreview attachments={attachments} onRemove={handleRemoveAttachment} />

          {/* 에러 메시지 */}
          {fileError && (
            <p className="mt-2 text-[11px] text-red-500 flex items-center gap-1">
              <i className="ri-error-warning-line" />
              {fileError}
            </p>
          )}

          {/* 하단 바: 파일 업로드 + 글자수 + 전송 */}
          <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
                onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={attachments.length >= MAX_FILES}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="ri-image-add-line text-sm text-gray-400" />
                이미지
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={attachments.length >= MAX_FILES}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="ri-file-upload-line text-sm text-gray-400" />
                문서
              </button>
              {attachments.length > 0 && (
                <span className="text-[10px] text-gray-400 ml-1">
                  {attachments.length}/{MAX_FILES}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[11px] text-gray-400">{content.length}/500</span>
              <button
                onClick={handleSend}
                disabled={!content.trim() && attachments.length === 0}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer whitespace-nowrap transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: selectedTypeMeta.color }}
              >
                <i className="ri-send-plane-fill text-xs" />
                <span className="hidden sm:inline">보호자에게 전송</span>
                <span className="sm:hidden">전송</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 발송 이력 ── */}
        <div className="px-4 sm:px-6 pt-4 pb-6">
          <p className="text-xs font-bold text-gray-700 mb-3">
            최근 발송 내역
            <span className="ml-1.5 text-[11px] font-normal text-gray-400">
              ({filteredHistory.length}건)
            </span>
          </p>

          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <i className="ri-file-text-line text-gray-300 text-lg" />
              </div>
              <p className="text-gray-400 text-sm">아직 발송한 보고가 없어요</p>
              <p className="text-gray-300 text-xs mt-1">위에서 작성 후 전송해보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-gray-100 px-4 py-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0"
                        style={{ background: `${report.typeColor}15` }}
                      >
                        <i
                          className={`${report.typeIcon} text-xs`}
                          style={{ color: report.typeColor }}
                        />
                      </div>
                      <span
                        className="text-[11px] font-bold"
                        style={{ color: report.typeColor }}
                      >
                        {report.type}
                      </span>
                      <span className="text-[10px] text-gray-400">{report.sentAt}</span>
                    </div>
                    {report.confirmed ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[#10b981]">
                        <i className="ri-checkbox-circle-fill text-xs" />
                        보호자 확인 {report.confirmedAt}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">미확인</span>
                    )}
                  </div>
                  {report.content && (
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {report.content}
                    </p>
                  )}
                  {/* 이력에서 첨부파일 표시 */}
                  {report.attachments && report.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {report.attachments.map((att, i) =>
                        att.type === "image" ? (
                          <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div
                            key={i}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 bg-gray-50"
                          >
                            <i
                              className={`${DOC_ICON[att.ext] ?? "ri-file-line"} text-xs`}
                              style={{ color: DOC_COLOR[att.ext] ?? "#6b7280" }}
                            />
                            <span className="text-[10px] text-gray-500 max-w-[80px] truncate">{att.name}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컨테이너 ─────────────────────────────────────── */
export default function ParentReports() {
  const { students: rawStudents } = useTeacherData();
  const mockStudents = useMemo(() =>
    rawStudents.map((s, i) => ({ id: i + 1, name: s.name, initial: s.name.charAt(0), avatarColor: ["#026eff","#10b981","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#e879f9"][i % 7] })),
  [rawStudents]);
  const [selectedId, setSelectedId] = useState(1);
  const [reports] = useState(mockSentReports);
  const [mobileView, setMobileView] = useState<"list" | "report">("list");

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setMobileView("report");
  };

  const handleBack = () => {
    setMobileView("list");
  };

  return (
    <div className="flex flex-1 min-h-0 bg-white overflow-hidden">
      {/* 이용인 목록 — 모바일: 뷰 전환 / 데스크탑: 항상 표시 */}
      <div
        className={[
          "flex-col min-h-0 w-full md:w-auto",
          mobileView === "list" ? "flex" : "hidden",
          "md:flex md:flex-shrink-0",
        ].join(" ")}
      >
        <UserList
          selectedId={selectedId}
          onSelect={handleSelect}
          sentReports={reports}
          mockStudents={mockStudents}
        />
      </div>

      {/* 작성 + 이력 패널 — 모바일: 뷰 전환 / 데스크탑: 항상 표시 */}
      <div
        className={[
          "flex-1 flex-col overflow-hidden min-w-0 min-h-0",
          mobileView === "report" ? "flex" : "hidden",
          "md:flex",
        ].join(" ")}
      >
        <ReportPanel
          key={selectedId}
          studentId={selectedId}
          onBack={handleBack}
          mockStudents={mockStudents}
        />
      </div>
    </div>
  );
}

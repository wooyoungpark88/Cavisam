import { useNavigate } from "react-router-dom";
import { type ReactNode } from "react";

/* ────────────────────────────────────────────
   오버레이 라벨 배지
──────────────────────────────────────────── */
function LabelBadge({
  icon, text, color, style,
}: {
  icon: string; text: string; color: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute flex items-center gap-1 rounded-full pointer-events-none"
      style={{
        padding: "2px 7px 2px 5px",
        background: "rgba(255,255,255,0.93)",
        border: `1px solid ${color}25`,
        borderLeft: `2.5px solid ${color}`,
        backdropFilter: "blur(6px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
        ...style,
      }}
    >
      <i className={icon} style={{ fontSize: 8, color }} />
      <span
        style={{
          fontSize: 8.5,
          color: "rgba(15,23,42,0.72)",
          fontWeight: 700,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────
   교사용 미니 UI 목업
──────────────────────────────────────────── */
function TeacherMockup() {
  const students = [
    { initial: "김", label: "김민준", color: "#026eff", status: "정상" },
    { initial: "이", label: "이서연", color: "#10b981", status: "관찰" },
    { initial: "박", label: "박지호", color: "#f59e0b", status: "주의" },
    { initial: "최", label: "최다은", color: "#026eff", status: "정상" },
  ];
  return (
    <div
      className="w-full h-full relative flex"
      style={{ background: "#f0f4ff", fontSize: 0 }}
    >
      {/* 미니 사이드바 */}
      <div
        className="flex flex-col items-center py-3 gap-2.5 flex-shrink-0"
        style={{ width: 28, background: "#e8f0ff", borderRight: "1px solid rgba(2,110,255,0.12)" }}
      >
        <div className="w-4 h-4 rounded-md flex items-center justify-center" style={{ background: "#026eff" }}>
          <i className="ri-heart-pulse-line text-white" style={{ fontSize: 7 }} />
        </div>
        {["ri-user-heart-line", "ri-file-text-line", "ri-chat-3-line", "ri-line-chart-line"].map((ic, i) => (
          <div
            key={i}
            className="w-4 h-4 flex items-center justify-center rounded"
            style={{ background: i === 0 ? "rgba(2,110,255,0.15)" : "transparent", color: i === 0 ? "#026eff" : "rgba(2,110,255,0.35)" }}
          >
            <i className={ic} style={{ fontSize: 8 }} />
          </div>
        ))}
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 flex flex-col px-2.5 pt-2.5 pb-2 gap-2 overflow-hidden">
        {/* 헤더 바 */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="h-2.5 rounded" style={{ width: 60, background: "rgba(2,110,255,0.15)" }} />
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(2,110,255,0.12)", color: "#026eff" }}>
            <i className="ri-notification-3-line" style={{ fontSize: 8 }} />
          </div>
        </div>

        {/* 학생 카드 그리드 */}
        <div className="grid grid-cols-2 gap-1.5 flex-shrink-0">
          {students.map((s) => (
            <div
              key={s.initial}
              className="rounded-lg px-2 py-1.5 flex items-center gap-1.5"
              style={{ background: "white", border: "1px solid rgba(2,110,255,0.08)" }}
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
                style={{ background: s.color, fontSize: 6 }}
              >
                {s.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-1.5 rounded mb-1" style={{ width: "70%", background: "rgba(15,23,42,0.18)" }} />
                <div
                  className="rounded-sm px-1"
                  style={{
                    display: "inline-block",
                    background: s.status === "정상" ? "rgba(16,185,129,0.12)" : s.status === "관찰" ? "rgba(2,110,255,0.12)" : "rgba(245,158,11,0.15)",
                    color: s.status === "정상" ? "#10b981" : s.status === "관찰" ? "#026eff" : "#f59e0b",
                    fontSize: 6,
                    fontWeight: 700,
                  }}
                >
                  {s.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 미니 차트 */}
        <div
          className="flex-1 rounded-lg px-2 py-1.5 flex flex-col justify-between"
          style={{ background: "white", border: "1px solid rgba(2,110,255,0.08)", minHeight: 0 }}
        >
          <div className="h-1.5 rounded" style={{ width: 48, background: "rgba(2,110,255,0.15)" }} />
          <div className="flex items-end gap-0.5 h-8 pt-1">
            {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `rgba(2,110,255,${0.25 + i * 0.07})` }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── 오버레이 라벨 ── */}
      <LabelBadge
        icon="ri-user-heart-line"
        text="이용인 현황 모니터링"
        color="#026eff"
        style={{ top: 8, right: 8 }}
      />
      <LabelBadge
        icon="ri-bar-chart-2-line"
        text="행동 추이 분석"
        color="#026eff"
        style={{ bottom: 8, right: 8 }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   보호자용 미니 UI 목업
──────────────────────────────────────────── */
function ParentMockup() {
  const timeline = [
    { time: "09:00", label: "등원 완료", color: "#10b981", wide: 72 },
    { time: "10:30", label: "오전 활동", color: "#ea580c", wide: 55 },
    { time: "12:00", label: "점심 식사", color: "#f59e0b", wide: 64 },
  ];
  return (
    <div
      className="w-full h-full relative flex flex-col px-3 pt-2.5 pb-2 gap-1.5 overflow-hidden"
      style={{ background: "#fff8f3" }}
    >
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(234,88,12,0.15)", color: "#ea580c" }}>
            <i className="ri-user-smile-line" style={{ fontSize: 8 }} />
          </div>
          <div className="h-2 rounded" style={{ width: 40, background: "rgba(234,88,12,0.2)" }} />
        </div>
        <div className="h-2 rounded" style={{ width: 28, background: "rgba(234,88,12,0.12)" }} />
      </div>

      {/* 타임라인 */}
      <div className="flex flex-col gap-1 flex-shrink-0">
        {timeline.map((item) => (
          <div key={item.time} className="flex items-center gap-2">
            <span style={{ fontSize: 7, color: "rgba(120,70,50,0.5)", width: 22, flexShrink: 0, fontWeight: 600 }}>{item.time}</span>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <div className="flex-1 rounded-md py-1 px-1.5 flex items-center" style={{ background: "white", border: `1px solid ${item.color}22` }}>
              <div className="h-1.5 rounded" style={{ width: `${item.wide}%`, background: `${item.color}40` }} />
            </div>
          </div>
        ))}
      </div>

      {/* 구분선 */}
      <div className="flex-shrink-0 h-px" style={{ background: "rgba(234,88,12,0.1)" }} />

      {/* 채팅 버블 */}
      <div className="flex flex-col gap-1.5 flex-1 justify-end overflow-hidden">
        <div className="flex items-end gap-1.5">
          <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#026eff", fontSize: 6, color: "white", fontWeight: 700 }}>T</div>
          <div className="rounded-xl rounded-bl-sm px-2 py-1" style={{ background: "white", border: "1px solid rgba(2,110,255,0.12)" }}>
            <div className="h-1.5 rounded" style={{ width: 62, background: "rgba(2,110,255,0.2)" }} />
          </div>
        </div>
        <div className="flex items-end justify-end gap-1.5">
          <div className="rounded-xl rounded-br-sm px-2 py-1" style={{ background: "rgba(234,88,12,0.1)" }}>
            <div className="h-1.5 rounded" style={{ width: 44, background: "rgba(234,88,12,0.35)" }} />
          </div>
          <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "#ea580c", fontSize: 6, color: "white", fontWeight: 700 }}>P</div>
        </div>
      </div>

      {/* ── 오버레이 라벨 ── */}
      <LabelBadge
        icon="ri-time-line"
        text="하루 일과 타임라인"
        color="#ea580c"
        style={{ top: 8, right: 8 }}
      />
      <LabelBadge
        icon="ri-chat-smile-2-line"
        text="담임 교사와 실시간 소통"
        color="#ea580c"
        style={{ bottom: 8, right: 8 }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   ServiceCard
──────────────────────────────────────────── */
interface ServiceCardProps {
  onClick: () => void;
  icon: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  title: string;
  desc: string;
  preview: ReactNode;
  badgeLabel: string;
  badgeColor: string;
}

function ServiceCard({
  onClick, icon, iconBg, iconColor, accentColor,
  title, desc, preview, badgeLabel, badgeColor,
}: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex-1 bg-white rounded-2xl cursor-pointer text-left transition-all duration-300 hover:-translate-y-2 overflow-hidden"
      style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        border: "1.5px solid rgba(220,228,255,0.9)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 16px 48px ${accentColor}28`;
        (e.currentTarget as HTMLButtonElement).style.border = `1.5px solid ${accentColor}55`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid rgba(220,228,255,0.9)";
      }}
    >
      {/* ── 미니 브라우저 프리뷰 ── */}
      <div className="w-full overflow-hidden" style={{ background: "#f8fafc" }}>
        {/* 브라우저 상단 바 */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 flex-shrink-0"
          style={{ background: "#f1f5f9", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
          <div
            className="flex-1 mx-2 h-3.5 rounded-md flex items-center px-2 gap-1"
            style={{ background: "rgba(0,0,0,0.05)" }}
          >
            <i className="ri-lock-line" style={{ fontSize: 7, color: "rgba(0,0,0,0.25)" }} />
            <span style={{ fontSize: 7, color: "rgba(0,0,0,0.3)" }}>carevia.app</span>
          </div>
          {/* 배지 */}
          <span
            className="text-white font-bold rounded-full flex-shrink-0"
            style={{ background: badgeColor, fontSize: 7, padding: "1px 6px" }}
          >
            {badgeLabel}
          </span>
        </div>

        {/* CSS 목업 영역 */}
        <div
          className="relative w-full overflow-hidden transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ height: 152 }}
        >
          {preview}
        </div>
      </div>

      {/* ── 컨텐츠 ── */}
      <div className="px-6 pt-4 pb-6">
        {/* Accent top line */}
        <div
          className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />

        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: iconBg }}
          >
            <i className={`${icon} text-lg`} style={{ color: iconColor }} />
          </div>
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0"
            style={{ color: accentColor }}
          >
            <span className="text-[11px] font-bold">시작하기</span>
            <i className="ri-arrow-right-line text-xs" />
          </div>
        </div>

        <h2
          className="font-bold text-gray-900 mb-1.5"
          style={{ fontSize: 15, letterSpacing: "-0.01em" }}
        >
          {title}
        </h2>
        <p
          className="text-gray-500 leading-relaxed"
          style={{ fontSize: 12, letterSpacing: "0.01em" }}
        >
          {desc}
        </p>
      </div>
    </button>
  );
}

/* ────────────────────────────────────────────
   Home
──────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
      style={{ background: "#f0f4ff" }}
    >
      {/* ── 배경 레이어 ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(2,110,255,0.10) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 80% 90%, rgba(234,88,12,0.09) 0%, transparent 55%)," +
            "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(255,255,255,0.95) 0%, transparent 100%)," +
            "linear-gradient(160deg, #e8f0ff 0%, #f5f0ff 35%, #fff8f0 70%, #fef9f5 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, #a5b4fc 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(2,110,255,0.13) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 60%, rgba(234,88,12,0.11) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* ── 컨텐츠 ── */}
      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
      >

        {/* Logo */}
        <div className="mb-7">
          <img
            alt="CareVia"
            className="h-11 sm:h-13 mx-auto"
            src="https://cavisam-production.up.railway.app/logo-carevia-figma.png"
          />
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#026eff]/25" />
          <span
            className="text-[11px] font-medium px-3.5 py-1 rounded-full"
            style={{
              background: "rgba(2,110,255,0.07)",
              color: "#4a7fd4",
              border: "1px solid rgba(2,110,255,0.13)",
              letterSpacing: "0.04em",
            }}
          >
            AI 기반 발달장애인 통합 돌봄 플랫폼
          </span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#026eff]/25" />
        </div>

        {/* Title */}
        <h1
          className="text-[26px] sm:text-[36px] font-extrabold text-gray-900 mb-3 text-center break-keep"
          style={{ lineHeight: 1.35, letterSpacing: "-0.02em" }}
        >
          어제보다 나은 내일을 만드는{" "}
          <span style={{ color: "#026eff" }} className="whitespace-nowrap">케어비아</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[13px] sm:text-sm font-medium text-gray-400 mb-10 text-center"
          style={{ letterSpacing: "0.01em" }}
        >
          역할을 선택해서 바로 시작하세요.
        </p>

        {/* Service Cards */}
        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-xl">
          <ServiceCard
            onClick={() => navigate("/teacher")}
            icon="ri-user-settings-line"
            iconBg="#eff6ff"
            iconColor="#026eff"
            accentColor="#026eff"
            title="교사용"
            desc="이용인의 일상을 기록하고 보호자와 소통하는 교사용 대시보드"
            preview={<TeacherMockup />}
            badgeLabel="교사 전용"
            badgeColor="#026eff"
          />
          <ServiceCard
            onClick={() => navigate("/parent")}
            icon="ri-parent-line"
            iconBg="#fff7ed"
            iconColor="#ea580c"
            accentColor="#ea580c"
            title="보호자용"
            desc="자녀의 하루를 담임 선생님과 함께 확인하는 보호자용 대시보드"
            preview={<ParentMockup />}
            badgeLabel="보호자 전용"
            badgeColor="#ea580c"
          />
        </div>

        {/* Admin floating button */}
        <button
          onClick={() => navigate("/admin")}
          className="fixed bottom-6 right-6 group flex items-center gap-2 cursor-pointer transition-all duration-300 z-20"
        >
          <span
            className="text-[11px] font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none"
          >
            관리자 콘솔
          </span>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: "rgba(15,23,42,0.06)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(15,23,42,0.08)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "rgba(15,23,42,0.10)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(15,23,42,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "rgba(15,23,42,0.06)";
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(15,23,42,0.08)";
            }}
          >
            <i className="ri-settings-4-line text-base text-gray-500 group-hover:text-gray-700 transition-colors" />
          </div>
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

interface CCTVPreviewModalProps {
  studentName?: string;
  behaviorType?: string;
  behaviorCount?: number;
  onClose: () => void;
}

const THUMBNAIL_TIMES = ["09:14", "10:32", "13:07", "14:55", "15:41"];

const FEATURES = [
  {
    icon: "ri-vidicon-2-line",
    title: "AI 실시간 도전행동 감지",
    desc: "CCTV 영상을 AI가 분석해 도전행동 발생 순간을 자동으로 감지합니다",
    color: "#026eff",
  },
  {
    icon: "ri-alarm-warning-line",
    title: "즉각 알림 & 클립 저장",
    desc: "행동 감지 즉시 담당 교사에게 알림을 보내고 영상 클립을 자동 저장합니다",
    color: "#ef4444",
  },
  {
    icon: "ri-line-chart-line",
    title: "행동 패턴 데이터 분석",
    desc: "시간대·상황별 도전행동 패턴을 시각화해 맞춤 지원 계획을 수립합니다",
    color: "#10b981",
  },
  {
    icon: "ri-parent-line",
    title: "보호자 실시간 공유",
    desc: "보호자 동의 하에 클립을 즉시 공유해 가정 연계 지원이 가능합니다",
    color: "#f59e0b",
  },
];

export default function CCTVPreviewModal({
  studentName,
  behaviorType,
  behaviorCount,
  onClose,
}: CCTVPreviewModalProps) {
  const [visible, setVisible] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: "rgba(3,7,20,0.75)",
          backdropFilter: "blur(4px)",
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden"
          style={{
            pointerEvents: "auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
            transition: "opacity 0.26s ease, transform 0.26s cubic-bezier(0.34,1.56,0.64,1)",
            maxHeight: "92vh",
            overflowY: "auto",
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-b border-gray-100"
            style={{ background: "#fafbfc" }}
          >
            <div
              className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: "rgba(2,110,255,0.1)" }}
            >
              <i className="ri-vidicon-2-line text-[#026eff] text-base" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-tight">
                AI CCTV 도전행동 영상
                {studentName && (
                  <span className="text-gray-400 font-normal ml-1.5">· {studentName}</span>
                )}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {behaviorType && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                  >
                    {behaviorType}
                  </span>
                )}
                {behaviorCount != null && (
                  <span className="text-[10px] text-gray-400">이번 주 {behaviorCount}건 감지됨</span>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
            >
              <i className="ri-close-line text-gray-500 text-lg" />
            </button>
          </div>

          {/* ── Main CCTV Preview ── */}
          <div className="px-5 pt-5 pb-3">

            {/* Video player area */}
            <div
              className="relative w-full rounded-2xl overflow-hidden"
              style={{ aspectRatio: "16/9", background: "#0d1117" }}
            >
              {/* Fake CCTV grid background */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d1117 0%, #111827 50%, #0a0f1a 100%)" }}>
                {/* Scanlines effect */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
                  }}
                />

                {/* Fake room silhouette */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-15"
                  style={{ background: "linear-gradient(to top, #4ade80 0%, transparent 100%)" }} />

                {/* Fake figure silhouette */}
                <div
                  className="absolute opacity-20"
                  style={{
                    width: 28,
                    height: 56,
                    background: "#6ee7b7",
                    borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%",
                    bottom: "28%",
                    left: "42%",
                    filter: "blur(2px)",
                  }}
                />

                {/* AI detection box */}
                <div
                  className="absolute"
                  style={{
                    border: "2px dashed #ef4444",
                    borderRadius: 4,
                    width: 76,
                    height: 80,
                    bottom: "24%",
                    left: "38%",
                    animation: "cctv-blink 1.4s ease-in-out infinite",
                  }}
                >
                  <span
                    className="absolute -top-4 left-0 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ background: "#ef4444", color: "white" }}
                  >
                    도전행동 감지
                  </span>
                </div>

                {/* Corner timestamp */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#ef4444", animation: "cctv-blink 1s ease-in-out infinite" }}
                  />
                  <span className="text-[10px] font-mono text-white/70">
                    CAM-03 · 2026.03.18 {THUMBNAIL_TIMES[activeThumb]}
                  </span>
                </div>

                {/* Corner badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md"
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)" }}>
                  <span className="text-[9px] font-bold text-red-400">● REC</span>
                </div>
              </div>

              {/* ── LOCK OVERLAY — always on top ── */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(3,7,20,0.82) 0%, rgba(2,25,60,0.88) 100%)",
                  backdropFilter: "blur(2px)",
                }}
              >
                {/* Glow ring */}
                <div
                  className="absolute w-40 h-40 rounded-full opacity-20"
                  style={{
                    background: "radial-gradient(circle, #026eff 0%, transparent 70%)",
                  }}
                />

                {/* Lock icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                  style={{
                    background: "linear-gradient(135deg, #026eff, #0243c2)",
                    boxShadow: "0 0 28px rgba(2,110,255,0.5)",
                  }}
                >
                  <i className="ri-lock-2-fill text-white text-2xl" />
                </div>

                {/* Main headline */}
                <div className="text-center px-6 relative z-10">
                  <p
                    className="text-white font-extrabold leading-snug mb-1.5"
                    style={{ fontSize: "clamp(13px, 2.5vw, 18px)" }}
                  >
                    케어비아 with AI CCTV
                  </p>
                  <p
                    className="font-bold mb-3"
                    style={{
                      fontSize: "clamp(10px, 2vw, 13px)",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    서비스 이용자 전용 콘텐츠입니다
                  </p>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(2,110,255,0.25)",
                      border: "1px solid rgba(2,110,255,0.5)",
                      color: "#93c5fd",
                    }}
                  >
                    <i className="ri-vidicon-2-line text-xs" />
                    {behaviorCount != null ? `${behaviorCount}개 클립 잠금됨` : "영상 클립 잠금됨"}
                  </div>
                </div>
              </div>

              {/* CSS animations */}
              <style>{`
                @keyframes cctv-blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.3; }
                }
              `}</style>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {THUMBNAIL_TIMES.map((time, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className="flex-shrink-0 relative rounded-xl overflow-hidden cursor-pointer transition-all"
                  style={{
                    width: 80,
                    height: 48,
                    background: "#0d1117",
                    border: activeThumb === i ? "2px solid #026eff" : "2px solid transparent",
                    opacity: activeThumb === i ? 1 : 0.6,
                  }}
                >
                  {/* Blurred thumb */}
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, #0d1117, #1a2640)`, filter: "blur(0.5px)" }}
                  />
                  {/* Fake detection overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backdropFilter: "blur(1px)" }}
                  >
                    <i className="ri-lock-fill text-white/40 text-sm" />
                  </div>
                  <span
                    className="absolute bottom-1 left-1 text-[8px] font-mono text-white/60"
                  >
                    {time}
                  </span>
                  {i === 0 && (
                    <span
                      className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                      style={{ background: "#ef4444" }}
                    />
                  )}
                </button>
              ))}
              <div
                className="flex-shrink-0 w-20 h-12 rounded-xl flex items-center justify-center text-[10px] font-semibold text-gray-500 border border-dashed border-gray-300 cursor-pointer"
              >
                +{Math.floor(Math.random() * 8) + 3}개 더
              </div>
            </div>
          </div>

          {/* ── Service upsell ── */}
          <div className="px-5 pb-2">
            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">AI CCTV 서비스란?</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {FEATURES.map((feat) => (
                <div
                  key={feat.title}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: `${feat.color}08`, border: `1px solid ${feat.color}18` }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${feat.color}15` }}
                  >
                    <i className={`${feat.icon} text-sm`} style={{ color: feat.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight mb-0.5">{feat.title}</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5"
              style={{
                background: "linear-gradient(135deg, #f0f5ff 0%, #e8f0ff 100%)",
                border: "1.5px solid #bfdbfe",
              }}
            >
              <div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">AI CCTV 서비스 도입 문의</p>
                <p className="text-xs text-gray-500">
                  도전행동을 영상으로 분석하고, 교사·보호자·치료사가 함께 확인하세요.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  닫기
                </button>
                <button
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer whitespace-nowrap transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #026eff 0%, #0243c2 100%)",
                    boxShadow: "0 4px 12px rgba(2,110,255,0.3)",
                  }}
                >
                  <i className="ri-customer-service-2-line text-sm" />
                  서비스 문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

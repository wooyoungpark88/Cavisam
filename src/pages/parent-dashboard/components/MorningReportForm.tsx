import { useState, useRef, useCallback, useEffect } from "react";
import { useParentData } from "../../../contexts/ParentDataContext";
import { useAuth } from "../../../hooks/useAuth";
import { upsertMorningReport } from "../../../lib/api/reports";

/* ── Web Speech API 타입 ── */
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

function useSpeechToText(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const toggle = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "ko-KR";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (ev: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) {
          transcript += ev.results[i][0].transcript;
        }
      }
      if (transcript.trim()) {
        onResult(transcript.trim());
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [listening, onResult]);

  return { listening, supported, toggle };
}

interface OptionItem {
  value: string;
  emoji: string;
  label: string;
  sublabel?: string;
}

interface FormSection {
  key: string;
  title: string;
  required: boolean;
  options: OptionItem[];
  accentColor: string;
  icon: string;
}

const SECTIONS: FormSection[] = [
  {
    key: "sleep",
    title: "어젯밤 수면",
    required: true,
    accentColor: "#8b5cf6",
    icon: "ri-moon-line",
    options: [
      { value: "충분", emoji: "😴", label: "충분", sublabel: "7시간 이상" },
      { value: "보통", emoji: "🌙", label: "보통", sublabel: "5~7시간" },
      { value: "부족", emoji: "😵", label: "부족", sublabel: "5시간 미만" },
    ],
  },
  {
    key: "condition",
    title: "컨디션",
    required: true,
    accentColor: "#f59e0b",
    icon: "ri-sun-line",
    options: [
      { value: "좋음", emoji: "☀️", label: "좋음", sublabel: "활기차요" },
      { value: "보통", emoji: "🌤️", label: "보통", sublabel: "무난해요" },
      { value: "안좋음", emoji: "🌧️", label: "안좋음", sublabel: "처져요" },
    ],
  },
  {
    key: "meal",
    title: "아침 식사",
    required: true,
    accentColor: "#ef4444",
    icon: "ri-restaurant-line",
    options: [
      { value: "전부", emoji: "🍱", label: "전부", sublabel: "완식" },
      { value: "대부분", emoji: "🥣", label: "대부분", sublabel: "거의 다" },
      { value: "조금", emoji: "🥢", label: "조금", sublabel: "반 이하" },
      { value: "안먹음", emoji: "🚫", label: "안먹음", sublabel: "거부" },
    ],
  },
  {
    key: "bowel",
    title: "배변",
    required: false,
    accentColor: "#10b981",
    icon: "ri-drop-line",
    options: [
      { value: "정상", emoji: "✅", label: "정상" },
      { value: "무른편", emoji: "💧", label: "무른편" },
      { value: "딱딱함", emoji: "🪨", label: "딱딱함" },
      { value: "없음", emoji: "➖", label: "없음" },
    ],
  },
  {
    key: "medicine",
    title: "약 복용",
    required: true,
    accentColor: "#026eff",
    icon: "ri-capsule-line",
    options: [
      { value: "복용 완료", emoji: "✅", label: "복용 완료", sublabel: "직접 투약" },
      { value: "기관 요청", emoji: "🏫", label: "기관 요청", sublabel: "점심약 위탁" },
      { value: "약 없음", emoji: "➖", label: "약 없음", sublabel: "해당 없음" },
    ],
  },
];

interface Selections {
  sleep: string;
  condition: string;
  meal: string;
  bowel: string;
  medicine: string;
  note: string;
}

const EMPTY: Selections = {
  sleep: "",
  condition: "",
  meal: "",
  bowel: "",
  medicine: "",
  note: "",
};

interface Props {
  onSent: () => void;
}

const CONDITION_MAP: Record<string, string> = { good: "좋음", normal: "보통", bad: "안좋음", very_bad: "안좋음" };
const MEAL_MAP: Record<string, string> = { good: "전부", normal: "대부분", none: "안먹음" };
const BOWEL_MAP: Record<string, string> = { normal: "정상", none: "없음" };
const CONDITION_REV: Record<string, string> = { "좋음": "good", "보통": "normal", "안좋음": "bad" };
const MEAL_REV: Record<string, string> = { "전부": "good", "대부분": "good", "조금": "normal", "안먹음": "none" };
const BOWEL_REV: Record<string, string> = { "정상": "normal", "무른편": "normal", "딱딱함": "normal", "없음": "none" };

export default function MorningReportForm({ onSent }: Props) {
  const { profile } = useAuth();
  const { activeChild, morningReports, careTeam, refresh } = useParentData();
  const childName = activeChild?.name ?? "자녀";
  const leadTeacher = careTeam.find((m) => m.role === "lead");
  const teacherName = leadTeacher?.member?.name ?? "선생님";

  const [selections, setSelections] = useState<Selections>(EMPTY);
  const [sent, setSent] = useState(false);
  const [loadedFields, setLoadedFields] = useState<Set<string>>(new Set());
  const [yesterdayBanner, setYesterdayBanner] = useState<"idle" | "loaded" | "dismissed">("idle");

  const handleSpeechResult = useCallback((text: string) => {
    setSelections((prev) => {
      const separator = prev.note.length > 0 && !prev.note.endsWith(" ") ? " " : "";
      return { ...prev, note: prev.note + separator + text };
    });
  }, []);

  const { listening, supported: sttSupported, toggle: toggleSTT } = useSpeechToText(handleSpeechResult);

  // 가장 최근 기록 (어제 데이터)
  const yesterdayReport = morningReports[0];
  const yesterday = yesterdayReport ? {
    sleep: yesterdayReport.sleep_time?.includes("5") ? "부족" : yesterdayReport.sleep_time?.includes("7") || yesterdayReport.sleep_time?.includes("8") ? "충분" : "보통",
    condition: CONDITION_MAP[yesterdayReport.condition ?? "normal"] ?? "보통",
    meal: MEAL_MAP[yesterdayReport.meal ?? "normal"] ?? "대부분",
    bowel: BOWEL_MAP[yesterdayReport.bowel ?? "normal"] ?? "정상",
    medicine: yesterdayReport.medication ?? "복용 완료",
  } : { sleep: "보통", condition: "보통", meal: "대부분", bowel: "정상", medicine: "복용 완료" };

  const handleLoadYesterday = () => {
    setSelections({
      sleep: yesterday.sleep,
      condition: yesterday.condition,
      meal: yesterday.meal,
      bowel: yesterday.bowel,
      medicine: yesterday.medicine,
      note: "",
    });
    setLoadedFields(new Set(["sleep", "condition", "meal", "bowel", "medicine"]));
    setYesterdayBanner("loaded");
  };

  const requiredKeys = SECTIONS.filter((s) => s.required).map((s) => s.key) as (keyof Selections)[];
  const filledRequired = requiredKeys.filter((k) => selections[k] !== "").length;
  const totalRequired = requiredKeys.length;
  const remaining = totalRequired - filledRequired;
  const isReady = remaining === 0;

  const select = (key: string, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: prev[key as keyof Selections] === value ? "" : value }));
    // Mark field as manually changed (remove "loaded" indicator)
    setLoadedFields((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const handleSend = async () => {
    if (!isReady || !profile || !activeChild) return;
    setSent(true);
    try {
      await upsertMorningReport({
        student_id: activeChild.id,
        parent_id: profile.id,
        date: new Date().toISOString().slice(0, 10),
        sleep_time: selections.sleep,
        condition: (CONDITION_REV[selections.condition] ?? 'normal') as 'good' | 'normal' | 'bad' | 'very_bad',
        meal: (MEAL_REV[selections.meal] ?? 'normal') as 'good' | 'normal' | 'none',
        bowel: (BOWEL_REV[selections.bowel] ?? 'normal') as 'normal' | 'none',
        medication: selections.medicine,
        note: selections.note || null,
      });
      await refresh();
    } catch (e) {
      console.error('등원 전 한마디 저장 실패:', e);
    }
    setTimeout(() => {
      setSent(false);
      setSelections(EMPTY);
      setLoadedFields(new Set());
      setYesterdayBanner("idle");
      onSent();
    }, 2000);
  };

  return (
    <div className="flex flex-col">
      {/* Content area */}
      <div className="px-3 sm:px-7 pt-3 sm:pt-5 pb-4">
        {/* Sub-header */}
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <p className="text-xs text-gray-400 truncate min-w-0 mr-2">
            {childName} 보호자 → {teacherName}
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: isReady ? "#10b981" : "#026eff" }}
            >
              {filledRequired}/{totalRequired}
            </span>
            <span className="text-[12px] text-gray-400">필수</span>
          </div>
        </div>

        {/* Yesterday quick-load button / confirmation banner */}
        {yesterdayBanner === "idle" && (
          <button
            onClick={handleLoadYesterday}
            className="w-full mb-3 sm:mb-4 flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer group"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-white border border-gray-200 flex-shrink-0 group-hover:border-gray-300 transition-all">
              <i className="ri-history-line text-[12.5px] text-gray-400" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <span className="text-xs font-semibold text-gray-600">어제와 같아요</span>
              {/* Desktop: show tags */}
              <span className="text-[12px] text-gray-400 ml-2 hidden sm:inline">
                어제 기록
                <span className="inline-flex items-center gap-1 ml-1">
                  {[
                    { val: yesterday.condition, color: yesterday.condition === "좋음" ? "#10b981" : yesterday.condition === "보통" ? "#f59e0b" : "#ef4444" },
                    { val: `수면 ${yesterday.sleep}`, color: "#8b5cf6" },
                    { val: `식사 ${yesterday.meal}`, color: "#f97316" },
                  ].map((tag) => (
                    <span
                      key={tag.val}
                      className="px-1.5 py-px rounded-md text-[11px] font-semibold whitespace-nowrap"
                      style={{ background: `${tag.color}18`, color: tag.color }}
                    >
                      {tag.val}
                    </span>
                  ))}
                </span>
                을 불러와요
              </span>
              {/* Mobile: simplified */}
              <span className="text-[12px] text-gray-400 ml-1.5 sm:hidden">
                컨디션·수면·식사 기록 가져오기
              </span>
            </div>
            <i className="ri-arrow-right-s-line text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
          </button>
        )}

        {yesterdayBanner === "loaded" && (
          <div
            className="w-full mb-3 sm:mb-4 flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border"
            style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: "#10b98120" }}>
              <i className="ri-checkbox-circle-fill text-[12.5px]" style={{ color: "#10b981" }} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold" style={{ color: "#059669" }}>어제 기록을 불러왔어요</span>
              <span className="text-[12px] ml-1.5 hidden sm:inline" style={{ color: "#6ee7b7" }}>달라진 부분만 수정 후 발송하세요</span>
            </div>
            <button
              onClick={() => {
                setYesterdayBanner("dismissed");
                setLoadedFields(new Set());
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 cursor-pointer hover:bg-green-200 transition-colors"
            >
              <i className="ri-close-line text-[12.5px]" style={{ color: "#10b981" }} />
            </button>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 sm:mb-5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(filledRequired / totalRequired) * 100}%`,
              background: isReady ? "#10b981" : "#026eff",
            }}
          />
        </div>

        {/* 2-column grid (1-column on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {SECTIONS.map((section) => {
            const currentVal = selections[section.key as keyof Selections] as string;
            const isLoadedField = loadedFields.has(section.key);
            const optCount = section.options.length;
            // On mobile: 4 options → 2×2 grid; 3 options → 3-col flex; else flex
            const isFourOpts = optCount >= 4;

            return (
              <div
                key={section.key}
                className="bg-white rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition-all"
                style={{ borderColor: isLoadedField ? `${section.accentColor}40` : "#f3f4f6" }}
              >
                {/* Section header */}
                <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                  <div
                    className="w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0"
                    style={{ background: `${section.accentColor}18` }}
                  >
                    <i className={`${section.icon} text-[12.5px]`} style={{ color: section.accentColor }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{section.title}</span>
                  {section.required && (
                    <span className="text-[12px] font-semibold" style={{ color: "#ef4444" }}>
                      *필수
                    </span>
                  )}
                  {isLoadedField && (
                    <span
                      className="ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: `${section.accentColor}14`, color: section.accentColor }}
                    >
                      어제와 동일
                    </span>
                  )}
                </div>

                {/* Options: 4개일 때 모바일에서 2x2 그리드, 나머지는 flex 1행 */}
                <div
                  className={
                    isFourOpts
                      ? "grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2"
                      : "flex gap-1.5 sm:gap-2"
                  }
                >
                  {section.options.map((opt) => {
                    const isSelected = currentVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => select(section.key, opt.value)}
                        className="flex flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer flex-1"
                        style={{
                          minWidth: 0,
                          paddingTop: 8,
                          paddingBottom: 8,
                          background: isSelected ? `${section.accentColor}12` : "#f9fafb",
                          borderColor: isSelected ? section.accentColor : "transparent",
                        }}
                      >
                        <span className="text-base sm:text-xl leading-none mb-0.5 sm:mb-1">{opt.emoji}</span>
                        <span
                          className="text-[12px] sm:text-[12.5px] font-semibold leading-tight text-center px-0.5"
                          style={{ color: isSelected ? section.accentColor : "#374151" }}
                        >
                          {opt.label}
                        </span>
                        {opt.sublabel && (
                          <span
                            className="text-[11px] mt-0.5 leading-tight text-center hidden sm:block"
                            style={{ color: isSelected ? section.accentColor : "#9ca3af" }}
                          >
                            {opt.sublabel}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Note section with STT - full width */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 sm:col-span-2">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
              <div className="w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0 bg-gray-100">
                <i className="ri-sticky-note-line text-[12.5px] text-gray-400" />
              </div>
              <span className="text-xs font-bold text-gray-700">전달 사항</span>
              <span className="text-[12px] text-gray-400 ml-0.5">(선택)</span>
              {sttSupported && (
                <span className="ml-auto flex items-center gap-1 text-xs text-[#f97316] font-medium">
                  <i className="ri-mic-line text-xs" />
                  음성으로도 입력 가능
                </span>
              )}
            </div>
            <div className="relative">
              <textarea
                value={selections.note}
                onChange={(e) => setSelections((prev) => ({ ...prev, note: e.target.value }))}
                placeholder={listening ? "말씀해 주세요... 음성을 인식하고 있어요" : "선생님에게 전달할 내용을 입력하거나 마이크를 눌러 말씀해 주세요"}
                maxLength={500}
                className="w-full bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-14 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none leading-relaxed transition-all"
                style={{
                  minHeight: 64,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: listening ? "#f97316" : "transparent",
                  boxShadow: listening ? "0 0 0 3px rgba(249,115,22,0.12)" : "none",
                }}
              />
              {sttSupported && (
                <button
                  type="button"
                  onClick={toggleSTT}
                  className="absolute right-2.5 bottom-2.5 w-9 h-9 flex items-center justify-center rounded-full transition-all cursor-pointer"
                  style={{
                    background: listening ? "#f97316" : "rgba(249,115,22,0.12)",
                    color: listening ? "white" : "#f97316",
                    animation: listening ? "stt-pulse 1.5s ease-in-out infinite" : "none",
                  }}
                >
                  <i className={`${listening ? "ri-mic-fill" : "ri-mic-line"} text-base`} />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                {listening ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
                    음성 인식 중...
                  </>
                ) : sttSupported ? (
                  <>
                    <i className="ri-mic-line text-xs" />
                    오른쪽 <strong className="text-gray-600">마이크 버튼</strong>을 눌러 말하면 자동으로 입력돼요
                  </>
                ) : null}
              </p>
              <span className="text-xs text-gray-300 tabular-nums">{selections.note.length}/500</span>
            </div>
            <style>{`
              @keyframes stt-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0.3); }
                50% { box-shadow: 0 0 0 8px rgba(249,115,22,0); }
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="sticky bottom-0 bg-white border-t border-gray-100 px-3 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 z-10"
        style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <p className="text-xs text-gray-500 min-w-0">
          {isReady ? (
            <span className="flex items-center gap-1.5 font-semibold text-[#10b981]">
              <i className="ri-checkbox-circle-fill flex-shrink-0" />
              <span className="hidden sm:inline">보고서 완성! 선생님께 발송할 수 있어요.</span>
              <span className="sm:hidden">발송 준비 완료!</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <i className="ri-information-line text-gray-400 flex-shrink-0" />
              <span>
                필수 <strong style={{ color: "#026eff" }}>{remaining}개</strong>
                <span className="hidden sm:inline"> 더 선택해주세요</span>
                <span className="sm:hidden"> 남음</span>
              </span>
            </span>
          )}
        </p>
        <button
          onClick={handleSend}
          disabled={!isReady || sent}
          className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{
            background: isReady
              ? "linear-gradient(135deg, #026eff, #0258d4)"
              : "#d1d5db",
          }}
        >
          {sent ? (
            <>
              <i className="ri-checkbox-circle-fill" />
              발송 완료!
            </>
          ) : (
            <>
              <i className="ri-send-plane-fill" />
              <span className="hidden sm:inline">선생님께 발송</span>
              <span className="sm:hidden">발송하기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

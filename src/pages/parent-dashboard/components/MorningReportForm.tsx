import { useState } from "react";
import { mockChild } from "../../../mocks/parentDashboard";

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

export default function MorningReportForm({ onSent }: Props) {
  const [selections, setSelections] = useState<Selections>(EMPTY);
  const [sent, setSent] = useState(false);

  const requiredKeys = SECTIONS.filter((s) => s.required).map((s) => s.key) as (keyof Selections)[];
  const filledRequired = requiredKeys.filter((k) => selections[k] !== "").length;
  const totalRequired = requiredKeys.length;
  const remaining = totalRequired - filledRequired;
  const isReady = remaining === 0;

  const select = (key: string, value: string) => {
    setSelections((prev) => ({ ...prev, [key]: prev[key as keyof Selections] === value ? "" : value }));
  };

  const handleSend = () => {
    if (!isReady) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelections(EMPTY);
      onSent();
    }, 2000);
  };

  return (
    <div className="flex flex-col">
      {/* Content area */}
      <div className="px-4 sm:px-7 pt-4 sm:pt-5 pb-4">
        {/* Sub-header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">
            {mockChild.name} 보호자 → {mockChild.teacher}
          </p>
          <div className="flex items-center gap-1.5">
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: isReady ? "#10b981" : "#026eff" }}
            >
              {filledRequired}/{totalRequired}
            </span>
            <span className="text-[10px] text-gray-400">필수</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(filledRequired / totalRequired) * 100}%`,
              background: isReady ? "#10b981" : "#026eff",
            }}
          />
        </div>

        {/* 2-column grid (1-column on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECTIONS.map((section) => {
            const currentVal = selections[section.key as keyof Selections] as string;
            return (
              <div
                key={section.key}
                className="bg-white rounded-2xl border border-gray-100 p-4"
              >
                {/* Section header */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div
                    className="w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0"
                    style={{ background: `${section.accentColor}18` }}
                  >
                    <i className={`${section.icon} text-[11px]`} style={{ color: section.accentColor }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{section.title}</span>
                  {section.required && (
                    <span className="text-[10px] font-semibold" style={{ color: "#ef4444" }}>
                      *필수
                    </span>
                  )}
                </div>

                {/* Options row */}
                <div className="flex gap-2">
                  {section.options.map((opt) => {
                    const isSelected = currentVal === opt.value;
                    const colWidth =
                      section.options.length >= 4
                        ? "calc(25% - 6px)"
                        : section.options.length === 3
                        ? "calc(33.33% - 6px)"
                        : "calc(50% - 4px)";
                    return (
                      <button
                        key={opt.value}
                        onClick={() => select(section.key, opt.value)}
                        className="flex flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer flex-1"
                        style={{
                          minWidth: 0,
                          maxWidth: colWidth,
                          paddingTop: 10,
                          paddingBottom: 10,
                          background: isSelected ? `${section.accentColor}12` : "#f9fafb",
                          borderColor: isSelected ? section.accentColor : "transparent",
                        }}
                      >
                        <span className="text-lg sm:text-xl leading-none mb-1">{opt.emoji}</span>
                        <span
                          className="text-[10px] sm:text-[11px] font-semibold leading-tight text-center px-0.5"
                          style={{ color: isSelected ? section.accentColor : "#374151" }}
                        >
                          {opt.label}
                        </span>
                        {opt.sublabel && (
                          <span
                            className="text-[9px] mt-0.5 leading-tight text-center hidden sm:block"
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

          {/* Note section - full width */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:col-span-2">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0 bg-gray-100">
                <i className="ri-sticky-note-line text-[11px] text-gray-400" />
              </div>
              <span className="text-xs font-bold text-gray-700">전달 사항</span>
              <span className="text-[10px] text-gray-400 ml-0.5">(선택)</span>
            </div>
            <textarea
              value={selections.note}
              onChange={(e) => setSelections((prev) => ({ ...prev, note: e.target.value }))}
              placeholder="선생님에게 전달할 내용이 있으면 적어주세요..."
              maxLength={300}
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-700 placeholder-gray-400 resize-none focus:outline-none leading-relaxed"
              style={{ minHeight: 64 }}
            />
            <p className="text-[10px] text-gray-300 text-right mt-1">{selections.note.length}/300</p>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-7 py-3 flex items-center justify-between gap-3 z-10">
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
                필수 <strong style={{ color: "#026eff" }}>{remaining}개</strong> 더 선택해주세요
              </span>
            </span>
          )}
        </p>
        <button
          onClick={handleSend}
          disabled={!isReady || sent}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
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
              선생님께 발송
            </>
          )}
        </button>
      </div>
    </div>
  );
}

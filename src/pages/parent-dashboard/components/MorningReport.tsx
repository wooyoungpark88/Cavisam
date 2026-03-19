import { useState } from "react";
import MorningReportForm from "./MorningReportForm";
import MorningReportDashboard from "./MorningReportDashboard";
import { useParentData } from "../../../contexts/ParentDataContext";

type Tab = "form" | "stats";

export default function MorningReport() {
  const { morningReports } = useParentData();
  const today = new Date().toISOString().slice(0, 10);
  const hasSentToday = morningReports.some((r) => r.date === today);
  const [tab, setTab] = useState<Tab>(hasSentToday ? "stats" : "form");
  const [sentCount, setSentCount] = useState(0);

  return (
    <div>
      {/* Tab header */}
      <div className="px-4 sm:px-7 pt-4 sm:pt-7 pb-0">
        <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">등원 전 한마디</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              매일 등원 전 아이의 상태를 선생님께 전달해요
            </p>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 flex-shrink-0">
            <button
              onClick={() => setTab("form")}
              className="px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              style={{
                background: tab === "form" ? "#fff" : "transparent",
                color: tab === "form" ? "#111827" : "#6b7280",
              }}
            >
              <i className="ri-edit-2-line mr-1 sm:mr-1.5" />
              오늘 보고
            </button>
            <button
              onClick={() => setTab("stats")}
              className="px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
              style={{
                background: tab === "stats" ? "#fff" : "transparent",
                color: tab === "stats" ? "#111827" : "#6b7280",
              }}
            >
              <i className="ri-bar-chart-2-line mr-1 sm:mr-1.5" />
              발송 통계
            </button>
          </div>
        </div>

        {/* Sent success banner */}
        {sentCount > 0 && tab === "form" && (
          <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: "#10b98115" }}>
            <i className="ri-checkbox-circle-fill text-[#10b981] text-base flex-shrink-0" />
            <p className="text-xs font-semibold text-[#10b981]">
              선생님께 등원 전 한마디가 성공적으로 전달됐어요! 오늘도 좋은 하루 되세요 😊
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      {tab === "form" ? (
        <MorningReportForm onSent={() => setSentCount((c) => c + 1)} />
      ) : (
        <div className="px-4 sm:px-7 pb-10">
          <MorningReportDashboard />
        </div>
      )}
    </div>
  );
}

import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  onClick: () => void;
  icon: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  hoverBorder: string;
  hoverShadow: string;
  title: string;
  desc: string;
  features: string[];
  featureBg: string;
  featureColor: string;
}

function ServiceCard({
  onClick, icon, iconBg, iconColor, accentColor, hoverBorder, hoverShadow,
  title, desc, features, featureBg, featureColor,
}: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex-1 bg-white rounded-2xl p-7 cursor-pointer text-left
                  transition-all duration-200 border-2
                  hover:-translate-y-1.5 ${hoverBorder} ${hoverShadow}`}
      style={{ border: "2px solid #e5e7eb" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.border = `2px solid ${accentColor}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.border = "2px solid #e5e7eb";
      }}
    >
      {/* Arrow indicator — subtle at rest, highlights on hover */}
      <div
        className="absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-gray-100 group-hover:scale-110"
        style={{}}
      >
        <i
          className="ri-arrow-right-line text-sm transition-all duration-200 text-gray-400 group-hover:translate-x-0.5"
          style={{ color: undefined }}
        />
      </div>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-200"
        style={{ background: iconBg }}
      >
        <i className={`${icon} text-xl`} style={{ color: iconColor }} />
      </div>

      {/* Title & desc */}
      <h2 className="text-lg font-bold text-gray-900 mb-1.5">{title}</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">{desc}</p>

      {/* Feature chips */}
      <div className="flex flex-wrap gap-1.5">
        {features.map((f) => (
          <span
            key={f}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
            style={{ background: featureBg, color: featureColor }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Bottom hint — appears subtly */}
      <p className="text-[11px] text-gray-300 mt-5 font-medium group-hover:text-gray-400 transition-colors">
        눌러서 시작하기
      </p>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4ff] to-white flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <img
        alt="CareVia"
        className="h-14 mb-6"
        src="https://cavisam-production.up.railway.app/logo-carevia-figma.png"
      />

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
        어제보다 나은 내일을 만드는, 케어비아
      </h1>

      {/* Subtitle */}
      <p className="text-base text-gray-500 mb-10 text-center">
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
          hoverBorder="hover:border-[#026eff]"
          hoverShadow="hover:shadow-[0_8px_28px_rgba(2,110,255,0.13)]"
          title="교사용"
          desc="이용인의 일상을 기록하고 보호자와 소통하는 교사용 대시보드"
          features={["이용인 관리", "행동 추이", "AI 케어", "보호자 보고"]}
          featureBg="#eff6ff"
          featureColor="#026eff"
        />
        <ServiceCard
          onClick={() => navigate("/parent")}
          icon="ri-parent-line"
          iconBg="#fff7ed"
          iconColor="#ea580c"
          accentColor="#ea580c"
          hoverBorder="hover:border-orange-400"
          hoverShadow="hover:shadow-[0_8px_28px_rgba(234,88,12,0.12)]"
          title="보호자용"
          desc="자녀의 하루를 담임 선생님과 함께 확인하는 보호자용 대시보드"
          features={["홈 타임라인", "아침 보고", "소통방", "돌봄 팀"]}
          featureBg="#fff7ed"
          featureColor="#ea580c"
        />
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-10">해오름 발달장애인복지관</p>

      {/* Admin link */}
      <button
        onClick={() => navigate("/admin")}
        className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors whitespace-nowrap"
      >
        <i className="ri-shield-keyhole-line text-xs" />
        관리자 콘솔
      </button>
    </div>
  );
}

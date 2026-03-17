import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#3d3d3d] flex items-center justify-center p-4">
      {/* 모달 */}
      <div className="w-full max-w-[680px] bg-white rounded-2xl shadow-2xl relative">
        {/* 메인 콘텐츠 */}
        <div className="px-10 py-10 flex flex-col items-center">
          {/* 로고 */}
          <div className="mb-4">
            <img src="/logo-carevia-figma.png" alt="CareVia" className="h-[52px]" />
          </div>

          {/* 슬로건 */}
          <p className="text-[22px] font-bold text-[#3d3d3d] mb-1.5 text-center leading-snug">
            "어제보다 나은 내일을 만드는, 케어비아"
          </p>
          <p className="text-[15px] text-[#626262] mb-7 text-center">
            "케어비아의 캐비챗과 함께 체계적인 변화를 경험하세요."
          </p>

          {/* 케비쌤 서비스 뱃지 */}
          <div className="bg-[#026eff] text-white px-9 py-2.5 rounded-full mb-7">
            <span className="text-[17px] font-bold">케비쌤 서비스</span>
          </div>

          {/* 교사용 / 보호자용 카드 */}
          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-[520px]">
            {/* 교사용 */}
            <button
              onClick={() => navigate('/teacher')}
              className="flex-1 bg-white border border-[#e0e0e0] rounded-xl p-6 hover:border-[#026eff] hover:shadow-md transition-all flex flex-col items-center gap-4"
            >
              <img
                src="/icon-teacher.png"
                alt="교사"
                className="w-[64px] h-[64px] object-contain"
              />
              <div className="text-center">
                <p className="text-[18px] font-bold text-[#026eff]">교사용</p>
                <p className="text-[13px] text-[#313131] mt-0.5">교사용 대시보드</p>
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-[#2d2d2d] text-white w-full py-2.5 rounded-lg text-[14px] font-bold mt-auto">
                <span>바로가기</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* 보호자용 */}
            <button
              onClick={() => navigate('/parent')}
              className="flex-1 bg-[#fde8e8] border border-[#ffd0d0] rounded-xl p-6 hover:border-[#026eff] hover:shadow-md transition-all flex flex-col items-center gap-4"
            >
              <img
                src="/icon-family.png"
                alt="가족"
                className="w-[64px] h-[64px] object-contain"
              />
              <div className="text-center">
                <p className="text-[18px] font-bold text-[#026eff]">보호자용</p>
                <p className="text-[13px] text-[#313131] mt-0.5">보호자 소통방</p>
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-[#2d2d2d] text-white w-full py-2.5 rounded-lg text-[14px] font-bold mt-auto">
                <span>바로가기</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

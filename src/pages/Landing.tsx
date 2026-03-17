import { useNavigate } from 'react-router-dom';

function TeacherIcon() {
  return (
    <svg className="w-10 h-10 text-[#313131]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function FamilyIcon() {
  return (
    <svg className="w-10 h-10 text-[#313131]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center p-4">
      {/* 모달 컨테이너 */}
      <div className="w-full max-w-[680px] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 상단 바: 케비챗 보호자 */}
        <div className="bg-[#eaeaea] px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-medium text-[#515151]">케비챗 보호자</span>
          <button
            onClick={() => {}}
            className="w-8 h-8 flex items-center justify-center text-[#515151] hover:bg-[#d9d9d9] rounded transition-colors"
            aria-label="닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="px-8 py-10 flex flex-col items-center">
          {/* 로고: 피그마 원본 컬러 로고 */}
          <div className="flex flex-col items-center mb-6">
            <img src="/logo-carevia-figma.png" alt="CareVia" className="h-16 mb-2" />
          </div>

          <p className="text-base text-[#515151] mb-1 text-center">
            어제보다 나은 내일을 만드는, 케어비아
          </p>
          <p className="text-sm text-[#848484] mb-8 text-center">
            케어비아의 캐비챗과 함께 체계적인 변화를 경험하세요.
          </p>

          {/* 케비쌤 서비스 버튼 - 파란색 */}
          <div className="bg-[#026eff] text-white px-8 py-3 rounded-full mb-10">
            <span className="text-xl font-medium">케비쌤 서비스</span>
          </div>

          {/* 교사용 / 보호자용 카드 */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-[560px]">
            <button
              onClick={() => navigate('/teacher')}
              className="flex-1 min-w-[240px] bg-white border-2 border-[#e0e0e0] rounded-xl p-8 hover:border-[#026eff] hover:shadow-md transition-all flex flex-col items-center justify-center gap-4"
            >
              <div className="w-16 h-16 bg-[#f4f4f4] rounded-full flex items-center justify-center">
                <TeacherIcon />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-[#313131]">교사용</p>
                <p className="text-sm text-[#848484]">교사용 대시보드</p>
              </div>
              <div className="flex items-center justify-center gap-2 bg-black text-white w-full py-2.5 rounded-lg font-medium text-sm">
                <span>바로가기</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => navigate('/parent')}
              className="flex-1 min-w-[240px] bg-white border-2 border-[#e0e0e0] rounded-xl p-8 hover:border-[#026eff] hover:shadow-md transition-all flex flex-col items-center justify-center gap-4"
            >
              <div className="w-16 h-16 bg-[#f4f4f4] rounded-full flex items-center justify-center">
                <FamilyIcon />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-[#313131]">보호자용</p>
                <p className="text-sm text-[#848484]">보호자 소통방</p>
              </div>
              <div className="flex items-center justify-center gap-2 bg-black text-white w-full py-2.5 rounded-lg font-medium text-sm">
                <span>바로가기</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

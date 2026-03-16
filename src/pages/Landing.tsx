import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="text-4xl font-bold mb-4">
          <span className="text-purple-600">Care</span>Via
        </div>
        <p className="text-lg text-gray-600 mb-2">
          "어제보다 나은 내일을 만드는, 케어비아"
        </p>
        <p className="text-sm text-gray-400">
          "케어비아의 캐비챗과 함께 체계적인 변화를 경험하세요."
        </p>
      </div>

      <div className="bg-purple-600 text-white px-8 py-3 rounded-lg mb-12">
        <span className="text-xl font-medium">케비쌤 서비스</span>
      </div>

      <div className="flex gap-8">
        <button
          onClick={() => navigate('/teacher')}
          className="w-72 h-72 bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">교사용</p>
            <p className="text-sm text-gray-600">교사용 대시보드</p>
          </div>
          <div className="flex items-center gap-2 text-purple-600 font-medium">
            <span>바로가기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => navigate('/parent')}
          className="w-72 h-72 bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">보호자용</p>
            <p className="text-sm text-gray-600">보호자 소통방</p>
          </div>
          <div className="flex items-center gap-2 text-purple-600 font-medium">
            <span>바로가기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

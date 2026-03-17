import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DEMO_ORG_ID, DEMO_TEACHER_ID, DEMO_PARENT_ID } from '../lib/demo';

export function Landing() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const enterAsTeacher = () => {
    signIn({
      id: DEMO_TEACHER_ID,
      name: '김태희 선생님',
      role: 'teacher',
      organization_id: DEMO_ORG_ID,
      organization_name: '해오름 발달장애인복지관',
    });
    navigate('/teacher');
  };

  const enterAsParent = () => {
    signIn({
      id: DEMO_PARENT_ID,
      name: '김민준 어머니',
      role: 'parent',
      organization_id: DEMO_ORG_ID,
      organization_name: '해오름 발달장애인복지관',
    });
    navigate('/parent');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4ff] to-white flex flex-col items-center justify-center px-4 py-12">
      {/* 로고 */}
      <img src="/logo-carevia-figma.png" alt="CareVia" className="h-14 mb-6" />

      {/* 슬로건 */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
        어제보다 나은 내일을 만드는, 케어비아
      </h1>

      {/* 부제 */}
      <p className="text-sm sm:text-base text-gray-500 mb-8 text-center">
        케어비아의 캐비챗과 함께 체계적인 변화를 경험하세요.
      </p>

      {/* 케비쌤 서비스 뱃지 */}
      <div className="bg-[#026eff] text-white px-8 py-2.5 rounded-full mb-10 shadow-lg shadow-blue-200">
        <span className="text-base font-bold">케비쌤 서비스</span>
      </div>

      {/* 교사용 / 보호자용 카드 */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        {/* 교사용 */}
        <button
          onClick={enterAsTeacher}
          className="flex-1 bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-[#026eff] hover:shadow-lg transition-all flex flex-col items-center gap-5 group shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/icon-teacher.png" alt="교사" className="w-14 h-14 object-contain" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#026eff]">교사용</p>
            <p className="text-sm text-gray-500 mt-1">학생 관리 및 행동 기록</p>
          </div>
          <div className="flex items-center justify-center gap-2 bg-[#0f172a] text-white w-full py-3 rounded-xl text-sm font-bold mt-auto group-hover:bg-[#026eff] transition-colors whitespace-nowrap">
            <span>바로가기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* 보호자용 */}
        <button
          onClick={enterAsParent}
          className="flex-1 bg-[#fef2f2] border-2 border-red-100 rounded-2xl p-8 hover:border-[#026eff] hover:shadow-lg transition-all flex flex-col items-center gap-5 group shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
        >
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/icon-family.png" alt="가족" className="w-14 h-14 object-contain" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#026eff]">보호자용</p>
            <p className="text-sm text-gray-500 mt-1">자녀 상태 확인 및 소통</p>
          </div>
          <div className="flex items-center justify-center gap-2 bg-[#0f172a] text-white w-full py-3 rounded-xl text-sm font-bold mt-auto group-hover:bg-[#026eff] transition-colors whitespace-nowrap">
            <span>바로가기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* 하단 기관명 */}
      <p className="text-xs text-gray-400 mt-10">해오름 발달장애인복지관</p>
    </div>
  );
}

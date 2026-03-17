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
    <div className="min-h-screen bg-gradient-to-b from-[#eef3ff] to-white flex flex-col items-center justify-center px-6 py-20">
      {/* 로고 */}
      <img src="/logo-carevia-figma.png" alt="CareVia" className="h-14 mb-10" />

      {/* 슬로건 */}
      <h1 className="text-[26px] sm:text-[32px] font-bold text-gray-900 mb-3 text-center leading-tight">
        어제보다 나은 내일을 만드는, 케어비아
      </h1>
      <p className="text-sm sm:text-base text-gray-400 mb-10 text-center">
        케어비아의 캐비챗과 함께 체계적인 변화를 경험하세요.
      </p>

      {/* 캐비쌤 서비스 뱃지 */}
      <div className="bg-[#026eff] text-white px-8 py-3 rounded-full mb-12 shadow-lg shadow-blue-200/40">
        <span className="text-base font-bold tracking-wide">캐비쌤 서비스</span>
      </div>

      {/* 교사용 / 보호자용 카드 */}
      <div className="flex flex-col sm:flex-row gap-7 w-full max-w-[750px]">
        {/* 교사용 */}
        <button
          onClick={enterAsTeacher}
          className="flex-1 bg-white border border-gray-200/50 rounded-3xl px-8 pt-10 pb-8 hover:border-[#026eff] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center gap-5 group shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="w-[72px] h-[72px] bg-[#f0f4ff] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img src="/icon-teacher.png" alt="교사" className="w-12 h-12 object-contain" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#026eff]">교사용</p>
            <p className="text-sm text-gray-400 mt-1.5">학생 관리 및 행동 기록</p>
          </div>
          <div className="flex items-center justify-center gap-2 bg-[#1a1a2e] text-white w-full py-3.5 rounded-2xl text-sm font-bold mt-2 group-hover:bg-[#026eff] transition-colors duration-300">
            <span>바로가기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* 보호자용 */}
        <button
          onClick={enterAsParent}
          className="flex-1 bg-[#fef0ee] border border-[#fcddd8] rounded-3xl px-8 pt-10 pb-8 hover:border-[#026eff] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center gap-5 group shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="w-[72px] h-[72px] bg-[#fde8e4] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img src="/icon-family.png" alt="가족" className="w-12 h-12 object-contain" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#026eff]">보호자용</p>
            <p className="text-sm text-gray-400 mt-1.5">자녀 상태 확인 및 소통</p>
          </div>
          <div className="flex items-center justify-center gap-2 bg-[#1a1a2e] text-white w-full py-3.5 rounded-2xl text-sm font-bold mt-2 group-hover:bg-[#026eff] transition-colors duration-300">
            <span>바로가기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* 하단 기관명 */}
      <p className="text-xs text-gray-400 mt-14">해오름 발달장애인복지관</p>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
        >
          ← 뒤로가기
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">개인정보 처리방침</h1>
        <p className="text-sm text-gray-500 mb-8">시행일: 2026년 3월 19일</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. 개인정보 수집 항목 및 목적</h2>
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">수집 항목</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">수집 목적</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">이름, 이메일 (Google 계정)</td>
                  <td className="border border-gray-200 px-4 py-2">회원 식별 및 서비스 로그인</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">역할 정보 (교사/보호자)</td>
                  <td className="border border-gray-200 px-4 py-2">역할별 서비스 제공</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">소속 기관 정보</td>
                  <td className="border border-gray-200 px-4 py-2">기관 단위 서비스 운영</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2 font-medium">건강 관련 기록 (수면, 식사, 컨디션, 배변, 투약)</td>
                  <td className="border border-gray-200 px-4 py-2">돌봄 대상자의 일일 케어 기록 관리</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">행동 이벤트 기록</td>
                  <td className="border border-gray-200 px-4 py-2">도전적 행동 모니터링 및 통계</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">메시지 내용</td>
                  <td className="border border-gray-200 px-4 py-2">교사-보호자 간 소통</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. 민감정보 처리</h2>
            <p>
              본 서비스는 돌봄 대상자의 <strong>건강 관련 기록</strong>(수면·식사·컨디션·배변·투약 정보)을
              수집합니다. 이는 「개인정보 보호법」 제23조에 따른 민감정보에 해당하며,
              <strong>별도의 동의</strong>를 받아 처리합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. 개인정보 보유 및 이용 기간</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>회원 탈퇴 시 또는 서비스 이용 종료 시까지</li>
              <li>관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보존</li>
              <li>보유 기간 경과 후 지체 없이 파기</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. 개인정보의 제3자 제공</h2>
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">제공받는 자</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">제공 목적</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">제공 항목</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Google LLC</td>
                  <td className="border border-gray-200 px-4 py-2">OAuth 인증</td>
                  <td className="border border-gray-200 px-4 py-2">이메일, 이름</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Supabase Inc.</td>
                  <td className="border border-gray-200 px-4 py-2">데이터 저장 및 인증</td>
                  <td className="border border-gray-200 px-4 py-2">서비스 이용 전체 데이터</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. 정보주체의 권리</h2>
            <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정·삭제 요구</li>
              <li>개인정보 처리정지 요구</li>
              <li>동의 철회</li>
            </ul>
            <p className="mt-2">
              권리 행사는 서비스 내 관리자에게 요청하거나, 아래 연락처로 문의해주세요.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. 개인정보의 안전성 확보 조치</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>모든 데이터 전송 시 TLS(SSL) 암호화 적용</li>
              <li>데이터베이스 접근 권한 관리 (Row Level Security)</li>
              <li>인증 토큰 기반 접근 제어</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. 개인정보 파기 절차</h2>
            <p>
              이용 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일은 복구 불가능한
              방법으로 삭제하며, 출력물은 분쇄 또는 소각합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. 개인정보 보호책임자</h2>
            <ul className="list-none space-y-1">
              <li><strong>담당자:</strong> CareVia 운영팀</li>
              <li><strong>이메일:</strong> privacy@carevia.kr</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. 처리방침 변경</h2>
            <p>
              본 개인정보 처리방침은 2026년 3월 19일부터 적용됩니다.
              변경 사항이 있을 경우 시행일 7일 전부터 서비스 내 공지를 통해 안내합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

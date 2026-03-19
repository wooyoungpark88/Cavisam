import { usePWAInstall } from '../../hooks/usePWAInstall';

/**
 * 모바일 PWA 설치 유도 배너
 * - Android: 네이티브 설치 프롬프트 호출
 * - iOS: Safari "홈 화면에 추가" 수동 안내
 */
export default function InstallPrompt() {
  const { os, showInstallBanner, promptInstall, dismissBanner } = usePWAInstall();

  if (!showInstallBanner) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/30 z-[9998] transition-opacity"
        onClick={dismissBanner}
      />

      {/* 하단 시트 */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
        <div className="bg-white rounded-t-2xl shadow-2xl px-5 pt-6 pb-8 max-w-lg mx-auto">
          {/* 핸들 바 */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/pwa-192x192.png"
              alt="케어비아"
              className="w-14 h-14 rounded-2xl shadow-sm"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900">케어비아 설치하기</h3>
              <p className="text-sm text-gray-500">홈 화면에서 바로 실행하세요</p>
            </div>
          </div>

          {/* 혜택 안내 */}
          <div className="bg-blue-50 rounded-xl p-4 mb-5">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <i className="ri-speed-line text-[#026eff] text-base" />
                앱처럼 빠르게 실행
              </li>
              <li className="flex items-center gap-2">
                <i className="ri-fullscreen-line text-[#026eff] text-base" />
                전체 화면으로 깔끔하게
              </li>
              <li className="flex items-center gap-2">
                <i className="ri-download-cloud-line text-[#026eff] text-base" />
                앱스토어 다운로드 불필요
              </li>
            </ul>
          </div>

          {os === 'android' ? (
            /* ── Android: 네이티브 설치 버튼 ── */
            <div className="space-y-3">
              <button
                onClick={promptInstall}
                className="w-full py-3.5 bg-[#026eff] text-white rounded-xl font-semibold text-base hover:bg-[#0258d4] active:scale-[0.98] transition-all"
              >
                홈 화면에 추가
              </button>
              <button
                onClick={dismissBanner}
                className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700"
              >
                나중에 할게요
              </button>
            </div>
          ) : (
            /* ── iOS: 수동 안내 ── */
            <div>
              <p className="text-sm font-medium text-gray-800 mb-3">
                Safari에서 아래 순서대로 진행해주세요
              </p>
              <div className="space-y-3 mb-5">
                <Step
                  num={1}
                  icon="ri-share-forward-line"
                  text={<>하단의 <strong>공유</strong> 버튼 <ShareIcon /> 을 탭하세요</>}
                />
                <Step
                  num={2}
                  icon="ri-add-box-line"
                  text={<>아래로 스크롤하여 <strong>홈 화면에 추가</strong>를 탭하세요</>}
                />
                <Step
                  num={3}
                  icon="ri-check-line"
                  text={<>우측 상단 <strong>추가</strong>를 탭하면 완료!</>}
                />
              </div>
              <button
                onClick={dismissBanner}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                확인했어요
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/** iOS 공유 아이콘 인라인 SVG */
function ShareIcon() {
  return (
    <svg
      className="inline-block w-5 h-5 -mt-0.5 text-[#026eff]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 3v12M8 7l4-4 4 4" />
    </svg>
  );
}

/** 단계별 안내 아이템 */
function Step({ num, icon, text }: { num: number; icon: string; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
      <div className="flex-shrink-0 w-6 h-6 bg-[#026eff] text-white rounded-full flex items-center justify-center text-xs font-bold">
        {num}
      </div>
      <div className="flex items-center gap-1.5 text-sm text-gray-700">
        <i className={`${icon} text-[#026eff] text-base`} />
        <span>{text}</span>
      </div>
    </div>
  );
}

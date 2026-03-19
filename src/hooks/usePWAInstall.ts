import { useState, useEffect, useCallback } from 'react';

type MobileOS = 'ios' | 'android' | 'other';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallState {
  /** 현재 모바일 OS */
  os: MobileOS;
  /** 설치 배너를 보여줄지 여부 */
  showInstallBanner: boolean;
  /** 이미 standalone(설치됨)으로 실행 중인지 */
  isStandalone: boolean;
  /** Android: 네이티브 설치 프롬프트 호출 */
  promptInstall: () => Promise<void>;
  /** 배너 닫기 (24시간 동안 다시 안 보임) */
  dismissBanner: () => void;
}

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24시간

function getMobileOS(): MobileOS {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  // iPad (iOS 13+): Safari가 Mac으로 위장
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

function getIsStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as unknown as { standalone: boolean }).standalone === true)
  );
}

function isDismissed(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  if (Date.now() - ts < DISMISS_DURATION) return true;
  localStorage.removeItem(DISMISS_KEY);
  return false;
}

export function usePWAInstall(): PWAInstallState {
  const [os] = useState<MobileOS>(getMobileOS);
  const [isStandalone] = useState(getIsStandalone);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(isDismissed);

  // Android: beforeinstallprompt 이벤트 캡처
  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // 설치 완료 감지
  useEffect(() => {
    function handler() {
      setDeferredPrompt(null);
    }
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const dismissBanner = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  }, []);

  // 배너 표시 조건: 모바일 + 미설치 + 미닫힘 + (Android에서 prompt 있거나 iOS)
  const showInstallBanner =
    !isStandalone &&
    !dismissed &&
    (os === 'ios' || (os === 'android' && deferredPrompt !== null));

  return { os, showInstallBanner, isStandalone, promptInstall, dismissBanner };
}

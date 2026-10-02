import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const usePwa = (isTransactionActive: boolean = false) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(() => {
    try {
      const dismissedUntil = localStorage.getItem('NINI_PWA_INSTALL_DISMISSED_UNTIL');
      return dismissedUntil ? Number(dismissedUntil) > Date.now() : false;
    } catch {
      return false;
    }
  });

  // Service worker registration & update handling
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Nini PWA Service Worker Registered:', r?.scope);
    },
    onRegisterError(error) {
      console.error('Nini PWA Service Worker registration error:', error);
    },
  });

  // Check standalone mode and iOS environment
  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(isIosDevice);

    return () => {
      mediaQuery.removeEventListener('change', checkStandalone);
    };
  }, []);

  // Listen for Chromium beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Trigger Chromium installation
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
    }
  }, [deferredPrompt]);

  // Dismiss install CTA for 3 days
  const dismissInstall = useCallback(() => {
    setInstallDismissed(true);
    try {
      localStorage.setItem(
        'NINI_PWA_INSTALL_DISMISSED_UNTIL',
        String(Date.now() + 3 * 24 * 60 * 60 * 1000)
      );
    } catch {
      // ignore
    }
  }, []);

  // Safe update: Only reload if NOT in the middle of active payment
  const handleUpdate = useCallback(async () => {
    if (isTransactionActive) {
      console.warn('Postponing PWA update until active transaction completes.');
      return;
    }
    await updateServiceWorker(true);
  }, [isTransactionActive, updateServiceWorker]);

  const dismissUpdate = useCallback(() => {
    setNeedRefresh(false);
  }, [setNeedRefresh]);

  const canInstallChromium = Boolean(deferredPrompt && !isStandalone && !installDismissed);
  const canShowIosGuide = Boolean(isIos && !isStandalone && !installDismissed);

  return {
    isStandalone,
    isIos,
    canInstallChromium,
    canShowIosGuide,
    showIosGuide,
    setShowIosGuide,
    installApp,
    dismissInstall,
    needRefresh,
    handleUpdate,
    dismissUpdate,
  };
};

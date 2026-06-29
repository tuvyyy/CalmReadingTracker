// src/components/ReloadPrompt.tsx
// Shows a toast-like banner when a new version of the app is available.
// Uses the virtual module from vite-plugin-pwa.
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Check for updates every 60 minutes
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="reload-toast">
      <span>Phiên bản mới có sẵn!</span>
      <button
        onClick={() => updateServiceWorker(true)}
        className="reload-toast__btn"
      >
        Cập nhật
      </button>
    </div>
  );
}

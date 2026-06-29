// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LangProvider } from './i18n/LangContext';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import TestsPage from './pages/TestsPage';
import PracticePage from './pages/PracticePage';
import ImportAnswerPage from './pages/ImportAnswerPage';
import WrongQuestionsPage from './pages/WrongQuestionsPage';
import VocabularyPage from './pages/VocabularyPage';
import SettingsPage from './pages/SettingsPage';
import SyllabusDayPage from './pages/SyllabusDayPage';
import ReloadPrompt from './components/ReloadPrompt';
import VirtualCallOverlay from './components/VirtualCallOverlay';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [activeCall, setActiveCall] = useState<{ active: boolean; callerName: string } | null>(null);
  const [callbackTimer, setCallbackTimer] = useState<any>(null);

  const sendSystemNotification = (callerName: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(callerName, {
        body: 'Cuộc gọi thoại nhắc học bài đang đến! Nhấp vào để nghe máy. 📞',
        tag: 'study-call-reminder',
        vibrate: [200, 100, 200],
        requireInteraction: true
      } as any);
      
      notification.onclick = () => {
        window.focus();
        if ((window as any).triggerVirtualCall) {
          (window as any).triggerVirtualCall(callerName);
        }
      };
    }
  };

  const handleCallClose = (reason: 'accept' | 'decline' | 'silent') => {
    setActiveCall(null);
    if (reason === 'accept' || reason === 'decline') {
      if (callbackTimer) {
        clearTimeout(callbackTimer);
      }
      
      const delay = reason === 'decline' ? 10000 : 25000; // 10s if declined, 25s if accepted
      const timer = setTimeout(() => {
        const currentPath = window.location.pathname;
        const isStudying = currentPath.includes('/practice/') || currentPath.includes('/syllabus/day/');
        if (!isStudying) {
          const caller = reason === 'decline' 
            ? 'Thầy Lee (Gọi Lại - Phạt Trốn Học)' 
            : 'Thầy Lee (Gọi Lại - Chưa Học Bài)';

          if (document.visibilityState === 'hidden') {
            sendSystemNotification(caller);
          } else {
            if ((window as any).triggerVirtualCall) {
              (window as any).triggerVirtualCall(caller);
            }
          }
        }
      }, delay);
      
      setCallbackTimer(timer);
    }
  };

  const handlePageChange = (path: string) => {
    if (path.includes('/practice/') || path.includes('/syllabus/day/')) {
      if (callbackTimer) {
        clearTimeout(callbackTimer);
        setCallbackTimer(null);
      }
    }
  };
  useEffect(() => {
    (window as any).triggerVirtualCall = (callerName?: string) => {
      setActiveCall({ active: true, callerName: callerName || 'Thầy Lee Nghiêm Khắc' });
    };
    return () => {
      delete (window as any).triggerVirtualCall;
    };
  }, []);

  // Daily virtual call alarm checker (at 20:00 every day)
  useEffect(() => {
    const t = setInterval(() => {
      const alarmEnabled = localStorage.getItem('pref_call_alarm') !== '0';
      if (!alarmEnabled) return;
      
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (timeStr === '20:00' && now.getSeconds() < 12) {
        const alarmCaller = localStorage.getItem('lang') === 'en' ? 'Strict Coach Lee' : 'Thầy Lee Nghiêm Khắc';
        if (document.visibilityState === 'hidden') {
          sendSystemNotification(alarmCaller);
        } else {
          if ((window as any).triggerVirtualCall) {
            (window as any).triggerVirtualCall(alarmCaller);
          }
        }
      }
    }, 10000); // Check every 10 seconds
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Show splash screen for 2.2 seconds, then trigger fade out
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2200);

    // After 0.5 seconds of fade out, unmount the splash screen
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <LangProvider>
    <>
      {showSplash && (
        <div 
          className="splash-screen"
          style={isFading ? { opacity: 0, visibility: 'hidden' } : {}}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <div className="splash-logo">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50 10 A 40 40 0 0 1 50 90" stroke="var(--line)" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 50 10 C 36 10, 31 18, 31 27 C 31 33, 34 37, 34 40 C 32 41, 26 44, 26 48 C 26 51, 31 53, 31 55 C 29 56, 31 58, 31 60 C 31 62, 28 64, 28 66 C 28 69, 34 72, 38 74 C 42 76, 46 80, 50 90" stroke="var(--foam)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path d="M 50 50 C 49 46, 45 46, 45 50 C 45 54, 53 54, 53 50 C 53 42, 41 42, 41 50 C 41 58, 59 58, 59 50 C 59 38, 37 38, 37 50 C 37 62, 65 62, 65 50 C 65 34, 33 34, 33 50 C 33 66, 71 66, 71 50 C 71 30, 29 30, 29 50" stroke="var(--aqua)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <circle cx="42" cy="24" r="0.8" fill="var(--foam)" opacity="0.8" />
                <circle cx="52" cy="20" r="0.6" fill="var(--foam)" opacity="0.6" />
                <circle cx="58" cy="26" r="0.8" fill="var(--aqua)" opacity="0.7" />
                <circle cx="48" cy="34" r="0.6" fill="var(--foam)" opacity="0.5" />
                <path d="M 32 78 C 42 70, 50 70, 60 78 C 70 86, 78 82, 85 75" stroke="var(--aqua)" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.8" />
                <path d="M 36 84 C 44 77, 52 77, 60 84 C 68 91, 74 88, 80 82" stroke="var(--line)" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.6" />
                <path d="M 64 78 C 74 72, 78 62, 76 46" stroke="var(--line)" strokeWidth="1.0" strokeLinecap="round" fill="none" />
                <path d="M 76 46 C 79 42, 83 42, 84 46 C 82 50, 78 50, 76 46 Z" stroke="var(--aqua)" strokeWidth="0.8" fill="rgba(142, 216, 232, 0.12)" />
                <path d="M 77 56 C 81 53, 85 54, 85 58 C 82 61, 79 60, 77 56 Z" stroke="var(--aqua)" strokeWidth="0.8" fill="rgba(142, 216, 232, 0.12)" />
                <path d="M 73 66 C 77 64, 80 66, 80 69 C 77 71, 74 70, 73 66 Z" stroke="var(--aqua)" strokeWidth="0.8" fill="rgba(142, 216, 232, 0.12)" />
                <line x1="50" y1="50" x2="50" y2="10" stroke="var(--line)" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                <path d="M 50 4 Q 50 10, 44 10 Q 50 10, 50 16 Q 50 10, 56 10 Q 50 10, 50 4" stroke="var(--foam)" strokeWidth="0.8" fill="var(--foam)" />
                <circle cx="50" cy="10" r="1" fill="#ffffff" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--foam)', marginTop: 20 }}>
              WATER SPIRIT
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--silver)', marginTop: 6, letterSpacing: '0.04em' }}>
              Practice with calm focus
            </span>
          </div>
          <div className="splash-ripple-container">
            <div className="splash-ripple" />
            <div className="splash-ripple" />
            <div className="splash-ripple" />
            <div className="splash-ripple" />
          </div>
        </div>
      )}

      <BrowserRouter>
        {activeCall && (
          <VirtualCallOverlay 
            callerName={activeCall.callerName} 
            onClose={(reason) => handleCallClose(reason)} 
          />
        )}
        <NavigationTracker onPageChange={handlePageChange} />
        <Routes>
          {/* Routes with bottom navigation */}
          <Route element={<AppShell />}>
            <Route path="/"       element={<HomePage />} />
            <Route path="/tests"  element={<TestsPage />} />
            <Route path="/syllabus" element={<TestsPage />} />
            <Route path="/import" element={<ImportAnswerPage />} />
            <Route path="/wrong"  element={<WrongQuestionsPage />} />
            <Route path="/vocab"    element={<VocabularyPage />} />
            <Route path="/grammar"  element={<Navigate to="/syllabus/day/grammar-core" replace />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Practice: full-screen, no bottom nav */}
          <Route path="/practice/:testId" element={<PracticePage />} />
          <Route path="/syllabus/day/:dayId" element={<SyllabusDayPage />} />
        </Routes>
      </BrowserRouter>
      <ReloadPrompt />
    </>
    </LangProvider>
  );
}

function NavigationTracker({ onPageChange }: { onPageChange: (path: string) => void }) {
  const location = useLocation();
  useEffect(() => {
    onPageChange(location.pathname);
  }, [location, onPageChange]);
  return null;
}

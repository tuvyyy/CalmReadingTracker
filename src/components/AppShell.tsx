// src/components/AppShell.tsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomTabs from './BottomTabs';
import { audioService } from '../services/audioService';
import { ArrowUp } from 'lucide-react';

export default function AppShell() {
  const [isPlaying, setIsPlaying] = useState(() => audioService.isPlaying());
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleToggle = () => {
    const playing = audioService.toggleAmbient();
    setIsPlaying(playing);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell water-bg">
      {/* Floating Zen Focus Sound Button */}
      <button 
        className={`floating-audio-btn${isPlaying ? ' playing' : ''}`}
        onClick={handleToggle}
        aria-label={isPlaying ? 'Tắt sóng âm tập trung' : 'Bật sóng âm tập trung'}
        title="Focus Within Soundscape"
      >
        <svg viewBox="0 0 100 100" className="audio-btn-svg">
          <path d="M 50 50 C 49 46, 45 46, 45 50 C 45 54, 53 54, 53 50 C 53 42, 41 42, 41 50 C 41 58, 59 58, 59 50 C 59 38, 37 38, 37 50 C 37 62, 65 62, 65 50 C 65 34, 33 34, 33 50" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
        {isPlaying && <span className="audio-ping" />}
      </button>

      {/* Floating Scroll to Top Button */}
      <button 
        className={`scroll-top-btn${showScrollTop ? ' visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Cuộn lên đầu trang"
        title="Cuộn lên đầu"
      >
        <ArrowUp size={18} strokeWidth={2.5} />
      </button>

      <div className="screen">
        <Outlet />
      </div>
      <BottomTabs />
    </div>
  );
}

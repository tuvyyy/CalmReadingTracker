// src/components/VirtualCallOverlay.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, PhoneOff, Volume2, ShieldAlert, X } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

interface VirtualCallOverlayProps {
  callerName: string;
  onClose: (reason: 'accept' | 'decline' | 'silent') => void;
}

export default function VirtualCallOverlay({ callerName, onClose }: VirtualCallOverlayProps) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<any>(null);

  // Start telephone ringtone using Web Audio API (commented out sounds for silent vibration mode)
  useEffect(() => {
    if (callState !== 'ringing') return;

    const playRing = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        
        const audioCtx = new AudioCtx();
        audioCtxRef.current = audioCtx;

        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc1.frequency.value = 440;
        osc2.frequency.value = 480;

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime + 1.6);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.8);

        // Keep oscillators silent as user preferred vibration-only calls
        // osc1.start();
        // osc2.start();

        // Physical vibration pattern to sync with the ring cycle
        if ('vibrate' in navigator) {
          navigator.vibrate([1200, 400, 1200]);
        }

        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            audioCtx.close();
          } catch {}
        }, 2000);
      } catch (err) {
        console.error('Failed to play synthesized ringtone:', err);
      }
    };

    playRing();
    ringIntervalRef.current = setInterval(playRing, 3000);

    return () => {
      if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
      if ('vibrate' in navigator) navigator.vibrate(0);
    };
  }, [callState]);

  // Connected duration timer
  useEffect(() => {
    if (callState !== 'connected') return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [callState]);

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  };

  const speakText = (text: string, callback: () => void) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'vi') {
        utterance.lang = 'vi-VN';
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.rate = 1.0;
      utterance.onend = () => {
        callback();
      };
      utterance.onerror = () => {
        setTimeout(callback, 3000);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(callback, 3000);
    }
  };

  const handleDecline = () => {
    stopRingtone();
    setCallState('ended');
    const msg = lang === 'vi' 
      ? "Lại trốn học nữa hả? Tự giác đi làm bài tập ngay cho tôi!" 
      : "No excuses! Go back and study right now!";
    speakText(msg, () => {
      onClose('decline');
      navigate('/tests?tab=syllabus');
    });
  };

  const handleSilentClose = () => {
    stopRingtone();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose('silent');
  };

  const handleAccept = () => {
    stopRingtone();
    setCallState('connected');
    
    const msg = lang === 'vi' 
      ? `A lô, tôi là ${callerName} đây. Đang làm cái trò gì đấy? Lười học quá rồi nhé! Đi vào học bài và làm bài tập ngay lập tức cho tôi!`
      : `Hello, this is ${callerName}. Stop chilling and start studying immediately!`;
      
    speakText(msg, () => {
      setCallState('ended');
      setTimeout(() => {
        onClose('accept');
        navigate('/tests?tab=syllabus');
      }, 800);
    });
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#071118',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px 24px calc(60px + env(safe-area-inset-bottom))',
        boxSizing: 'border-box',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: callState === 'connected' ? 'rgba(126, 224, 184, 0.08)' : 'rgba(255, 139, 139, 0.08)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Caller Info */}
      <div style={{ zIndex: 1, textAlign: 'center', marginTop: 40 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--foam)' }}>
          {callerName}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--silver)', marginTop: 8, margin: 0, opacity: 0.85 }}>
          {callState === 'ringing' 
            ? (lang === 'vi' ? 'Cuộc gọi thoại đến...' : 'Incoming Voice Call...') 
            : callState === 'connected' 
              ? formatTime(seconds) 
              : (lang === 'vi' ? 'Cuộc gọi đã kết thúc' : 'Call Ended')
          }
        </p>
      </div>

      {/* Avatar Screen */}
      <div style={{ zIndex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {callState === 'ringing' && (
          <>
            <div className="call-pulse" style={{ animationDelay: '0s' }} />
            <div className="call-pulse" style={{ animationDelay: '1s' }} />
          </>
        )}
        
        <div style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1f4258 0%, #0d222e 100%)',
          border: `2px solid ${callState === 'connected' ? 'var(--success)' : 'var(--aqua)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 2
        }}>
          {isVocabCaller(callerName) ? (
            <Volume2 size={54} color={callState === 'connected' ? 'var(--success)' : 'var(--aqua)'} />
          ) : (
            <ShieldAlert size={54} color={callState === 'connected' ? 'var(--success)' : 'var(--aqua)'} />
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ zIndex: 1, width: '100%', maxWidth: 300, display: 'flex', justifyContent: callState === 'ringing' ? 'space-between' : 'center', gap: 20, marginBottom: 30 }}>
        {callState === 'ringing' ? (
          <>
            {/* Decline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleDecline}
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: '50%',
                  background: 'rgba(255, 139, 139, 0.95)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 139, 139, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                <PhoneOff size={24} color="#ffffff" style={{ transform: 'rotate(-45deg)' }} />
              </button>
              <span style={{ fontSize: '0.7rem', color: 'var(--silver)', fontWeight: 600 }}>
                {lang === 'vi' ? 'Từ chối' : 'Decline'}
              </span>
            </div>

            {/* Silent Close */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleSilentClose}
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                <X size={24} color="#ffffff" />
              </button>
              <span style={{ fontSize: '0.7rem', color: 'var(--silver)', fontWeight: 600 }}>
                {lang === 'vi' ? 'Đóng' : 'Close'}
              </span>
            </div>

            {/* Accept */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleAccept}
                className="pulse-accept"
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: '50%',
                  background: 'rgba(126, 224, 184, 0.95)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(126, 224, 184, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                <Phone size={24} color="#ffffff" />
              </button>
              <span style={{ fontSize: '0.7rem', color: 'var(--silver)', fontWeight: 600 }}>
                {lang === 'vi' ? 'Chấp nhận' : 'Accept'}
              </span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleSilentClose}
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'rgba(255, 139, 139, 0.95)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255, 139, 139, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <PhoneOff size={28} color="#ffffff" />
            </button>
            <span style={{ fontSize: '0.74rem', color: 'var(--silver)', fontWeight: 600 }}>
              {lang === 'vi' ? 'Gác máy' : 'End Call'}
            </span>
          </div>
        )}
      </div>

      <style>{`
        .call-pulse {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          border: 1px solid rgba(142, 216, 232, 0.25);
          animation: pulseCallAnim 2s infinite ease-out;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes pulseCallAnim {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        .pulse-accept {
          animation: pulseAcceptBtn 1.5s infinite ease-in-out;
        }
        @keyframes pulseAcceptBtn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

function isVocabCaller(name: string): boolean {
  name = name.toLowerCase();
  return name.includes('từ vựng') || name.includes('vocab');
}

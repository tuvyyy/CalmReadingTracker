// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { dbService } from '../services/dbService';
import {
  BookOpen, AlertCircle, BookMarked,
  ChevronRight, TrendingUp, Compass, Sparkles, BookOpenCheck, Flame,
  Target, CalendarDays, Brain, BellRing, CheckCircle2
} from 'lucide-react';
import { useMemo } from 'react';

interface ActionCardProps {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick: () => void;
  delay?: string;
  featured?: boolean;
}

function ActionCard({ icon, label, sub, onClick, delay, featured }: ActionCardProps) {
  return (
    <button
      className="action-card fade-up"
      style={{
        animationDelay: delay,
        background: featured 
          ? 'linear-gradient(135deg, rgba(142, 216, 232, 0.15) 0%, rgba(18, 43, 59, 0.7) 100%)' 
          : 'rgba(18, 43, 59, 0.45)',
        border: featured 
          ? '1px solid rgba(142, 216, 232, 0.35)' 
          : '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: featured ? '0 8px 30px rgba(142, 216, 232, 0.1)' : 'none'
      }}
      onClick={onClick}
    >
      <div className="action-card__body">
        <span className="action-card__label" style={{ color: featured ? 'var(--aqua)' : 'var(--foam)' }}>{label}</span>
        <span className="action-card__sub" style={{ opacity: featured ? 0.9 : 0.6 }}>{sub}</span>
      </div>
      <div className="action-card__icon-wrap" style={{ background: featured ? 'rgba(142, 216, 232, 0.15)' : 'rgba(255, 255, 255, 0.05)' }}>
        {icon}
      </div>
    </button>
  );
}

export default function HomePage() {
  const nav = useNavigate();
  const { t, lang } = useLang();
  
  const metrics = dbService.getMetrics();
  const dashboard = dbService.getStudyDashboard();
  const syllabusProgress = dbService.getSyllabusProgress('grammar-core');
  const isDay1Done = syllabusProgress?.completed ?? false;

  // Curate dynamic AI advice depending on user state
  const aiTip = useMemo(() => {
    if (metrics.wrong > 10) {
      return lang === 'vi'
        ? 'Bạn đang tích lũy khá nhiều lỗi sai. Hãy vào Sổ tay câu sai ngay để giải quyết các phần ngữ pháp/từ vựng chưa vững!'
        : 'You have accumulated several mistakes. Visit the Mistakes Journal to reinforce weak grammatical rules!';
    }
    if (metrics.tests === 0) {
      return lang === 'vi'
        ? 'Hãy bắt đầu lộ trình học 30 ngày hoặc làm Đề thi thử đầu tiên để AI ghi nhận và phân tích trình độ của bạn nhé!'
        : 'Start your 30-Day Syllabus or take your first practice test so the AI can diagnose your level!';
    }
    return lang === 'vi'
      ? 'Mẹo Part 5: Luôn xác định động từ chính của câu trước khi chọn đáp án để loại trừ nhanh các dạng To-V hay V-ing.'
      : 'Part 5 Tip: Always locate the main verb of the sentence first to eliminate invalid To-V or V-ing forms.';
  }, [metrics.wrong, metrics.tests, lang]);

  // Load last done test info for recent block
  const recentTest = useMemo(() => {
    const tests = dbService.getTests();
    const completed = tests.filter(t => t.status === 'done');
    if (completed.length === 0) return null;
    
    // Get the most recently submitted test
    return completed[completed.length - 1];
  }, []);

  const xp = dbService.getUserXP();
  const streak = dbService.getStreakCount();
  const studyHistory = dbService.getStudyHistory();

  const levelInfo = useMemo(() => {
    if (xp < 200) {
      return {
        level: 1,
        title: lang === 'vi' ? 'Tân Binh' : 'Novice',
        minXp: 0,
        maxXp: 200,
        color: 'linear-gradient(135deg, #7ad3ff 0%, #4da3ff 100%)',
        bgColor: 'rgba(77, 163, 255, 0.08)',
        borderColor: 'rgba(77, 163, 255, 0.2)'
      };
    }
    if (xp < 600) {
      return {
        level: 2,
        title: lang === 'vi' ? 'Chiến Binh TOEIC' : 'TOEIC Warrior',
        minXp: 200,
        maxXp: 600,
        color: 'linear-gradient(135deg, #b088ff 0%, #804dff 100%)',
        bgColor: 'rgba(128, 77, 255, 0.08)',
        borderColor: 'rgba(128, 77, 255, 0.2)'
      };
    }
    if (xp < 1500) {
      return {
        level: 3,
        title: lang === 'vi' ? 'Bậc Thầy Từ Vựng' : 'Vocab Master',
        minXp: 600,
        maxXp: 1500,
        color: 'linear-gradient(135deg, #ff85a2 0%, #ff4d6d 100%)',
        bgColor: 'rgba(255, 77, 109, 0.08)',
        borderColor: 'rgba(255, 77, 109, 0.2)'
      };
    }
    return {
      level: 4,
      title: lang === 'vi' ? 'Huyền Thoại 800+' : 'TOEIC 800+ Legend',
      minXp: 1500,
      maxXp: 5000,
      color: 'linear-gradient(135deg, #ffcc33 0%, #ff6600 100%)',
      bgColor: 'rgba(255, 102, 0, 0.12)',
      borderColor: 'rgba(255, 102, 0, 0.3)'
    };
  }, [xp, lang]);

  const progressPct = useMemo(() => {
    const range = levelInfo.maxXp - levelInfo.minXp;
    const earned = xp - levelInfo.minXp;
    return Math.min(100, Math.max(0, (earned / range) * 100));
  }, [xp, levelInfo]);

  const last7Days = useMemo(() => {
    const list = [];
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(localDate.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayNum = d.getDay();
      let label = '';
      if (lang === 'vi') {
        label = dayNum === 0 ? 'CN' : `T${dayNum + 1}`;
      } else {
        const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        label = labels[dayNum];
      }
      
      const completed = studyHistory.includes(dateStr);
      list.push({ dateStr, label, completed, isToday: i === 0 });
    }
    return list;
  }, [studyHistory, lang]);

  return (
    <>
      {/* ── Hero (Poster Story style) ── */}
      <div className="poster-hero fade-up" style={{ 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(18, 43, 59, 0.6) 0%, rgba(7, 16, 20, 0.8) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: 'calc(30px + env(safe-area-inset-top)) 20px 24px'
      }}>
        {/* Animated breathing glow */}
        <div className="poster-hero__glow" style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(142, 216, 232, 0.25) 0%, transparent 60%)',
          filter: 'blur(50px)',
          animation: 'splashPulse 6s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, position: 'relative', zIndex: 1 }}>
          <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 10 A 40 40 0 0 1 50 90" stroke="var(--line)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 50 10 C 36 10, 31 18, 31 27 C 31 33, 34 37, 34 40 C 32 41, 26 44, 26 48 C 26 51, 31 53, 31 55 C 29 56, 31 58, 31 60 C 31 62, 28 64, 28 66 C 28 69, 34 72, 38 74 C 42 76, 46 80, 50 90" stroke="var(--foam)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M 50 50 C 49 46, 45 46, 45 50 C 45 54, 53 54, 53 50 C 53 42, 41 42, 41 50 C 41 58, 59 58, 59 50 C 59 38, 37 38, 37 50 C 37 62, 65 62, 65 50 C 65 34, 33 34, 33 50 C 33 66, 71 66, 71 50 C 71 30, 29 30, 29 50" stroke="var(--aqua)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="42" cy="24" r="0.8" fill="var(--foam)" opacity="0.8" />
            <circle cx="52" cy="20" r="0.6" fill="var(--foam)" opacity="0.6" />
            <circle cx="58" cy="26" r="0.8" fill="var(--aqua)" opacity="0.7" />
            <circle cx="48" cy="34" r="0.6" fill="var(--foam)" opacity="0.5" />
            <path d="M 32 78 C 42 70, 50 70, 60 78 C 70 86, 78 82, 85 75" stroke="var(--aqua)" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 36 84 C 44 77, 52 77, 60 84 C 68 91, 74 88, 80 82" stroke="var(--line)" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.6" />
          </svg>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--foam)' }}>
            WATER SPIRIT
          </span>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="hero__eyebrow">{t('home', 'eyebrow')}</p>
          <h1 className="hero__title" style={{ whiteSpace: 'pre-line', fontSize: '2.1rem', lineHeight: 1.25 }}>{t('home', 'title')}</h1>
          
          {/* Glass quote box overlay */}
          <div className="hero-quote-box" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '12px 16px', borderRadius: 16, marginTop: 14 }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--silver)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
              "{t('home', 'quote')}"
            </p>
          </div>
        </div>

        {/* Stats Grid cards */}
        <div className="hero__stats" style={{ display: 'flex', gap: 10, marginTop: 20, position: 'relative', zIndex: 1 }}>
          <div className="stat-glass" style={{ flex: 1, padding: '10px 6px', background: 'rgba(18, 43, 59, 0.4)', borderRadius: 14 }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foam)' }}>{dashboard.tests.done}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2 }}>{t('home', 'tests_done')}</div>
          </div>
          <div className="stat-glass" style={{ flex: 1, padding: '10px 6px', background: 'rgba(18, 43, 59, 0.4)', borderRadius: 14 }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--danger)' }}>{dashboard.wrong.total}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2 }}>{t('home', 'wrong_cnt')}</div>
          </div>
          <div className="stat-glass" style={{ flex: 1, padding: '10px 6px', background: 'rgba(18, 43, 59, 0.4)', borderRadius: 14 }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--aqua)' }}>{dashboard.tests.avgPct}%</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2 }}>{t('home', 'avg_score')}</div>
          </div>
        </div>
      </div>

      {/* ── Exam Focus Dashboard ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="glass-panel fade-up" style={{
          padding: 16,
          borderRadius: 22,
          background: 'linear-gradient(135deg, rgba(18, 43, 59, 0.56) 0%, rgba(7, 16, 20, 0.72) 100%)',
          border: '1px solid rgba(142, 216, 232, 0.14)',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: '0.64rem', fontFamily: 'var(--font-label)', fontWeight: 800, color: 'var(--aqua)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {lang === 'vi' ? 'NƯỚC RÚT 05/08' : 'EXAM SPRINT'}
              </div>
              <div style={{ marginTop: 4, fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--foam)', fontWeight: 800 }}>
                {dashboard.daysToExam} {lang === 'vi' ? 'ngày nữa thi' : 'days left'}
              </div>
            </div>
            <div style={{
              width: 62,
              height: 62,
              borderRadius: 18,
              background: 'rgba(142, 216, 232, 0.09)',
              border: '1px solid rgba(142, 216, 232, 0.22)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--aqua)',
              flexShrink: 0,
            }}>
              <Target size={28} strokeWidth={2.1} />
            </div>
          </div>

          <button
            onClick={() => nav(dashboard.focus.path)}
            style={{
              width: '100%',
              border: '1px solid rgba(255,255,255,0.08)',
              background: dashboard.todayStudied ? 'rgba(126, 224, 184, 0.08)' : 'rgba(142, 216, 232, 0.08)',
              borderRadius: 16,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'left',
              marginBottom: 14,
            }}
          >
            <span style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              background: dashboard.todayStudied ? 'rgba(126, 224, 184, 0.13)' : 'rgba(142, 216, 232, 0.13)',
              color: dashboard.todayStudied ? 'var(--success)' : 'var(--aqua)',
              flexShrink: 0,
            }}>
              {dashboard.todayStudied ? <CheckCircle2 size={19} /> : <BellRing size={19} />}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', color: 'var(--foam)', fontWeight: 800, fontSize: '0.88rem' }}>
                {dashboard.todayStudied
                  ? (lang === 'vi' ? 'Hôm nay đã có tiến độ' : 'Progress recorded today')
                  : dashboard.focus.label}
              </span>
              <span style={{ display: 'block', color: 'var(--silver)', fontSize: '0.72rem', lineHeight: 1.4, marginTop: 2 }}>
                {dashboard.todayStudied
                  ? (lang === 'vi' ? 'Làm thêm một lượt ngắn để giữ nhịp.' : 'Do one more short round to keep momentum.')
                  : dashboard.focus.sub}
              </span>
            </span>
            <ChevronRight size={16} color="var(--aqua)" />
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              {
                icon: <CalendarDays size={15} />,
                label: lang === 'vi' ? 'Sẵn sàng' : 'Readiness',
                value: `${dashboard.readinessPct}%`,
                sub: lang === 'vi' ? `Best đề ${dashboard.tests.bestPct}%` : `Best test ${dashboard.tests.bestPct}%`,
                color: 'var(--aqua)',
              },
              {
                icon: <AlertCircle size={15} />,
                label: lang === 'vi' ? 'Câu sai' : 'Mistakes',
                value: dashboard.wrong.total,
                sub: dashboard.wrong.priority === 'clear'
                  ? (lang === 'vi' ? 'Đang sạch lỗi' : 'Clean')
                  : (lang === 'vi' ? 'Nên xử lý trước' : 'Review first'),
                color: dashboard.wrong.total > 0 ? 'var(--danger)' : 'var(--success)',
              },
              {
                icon: <BookMarked size={15} />,
                label: lang === 'vi' ? 'Từ thuộc' : 'Vocab',
                value: `${dashboard.vocab.masteredCount}/${dashboard.vocab.total}`,
                sub: `${dashboard.vocab.reviewCount} review`,
                color: 'var(--success)',
              },
              {
                icon: <Brain size={15} />,
                label: lang === 'vi' ? 'Grammar' : 'Grammar',
                value: `${dashboard.grammar.pct}%`,
                sub: `${dashboard.grammar.done}/${dashboard.grammar.total}`,
                color: '#ffd68f',
              },
            ].map(item => (
              <div
                key={item.label}
                style={{
                  borderRadius: 15,
                  padding: 12,
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  minWidth: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: item.color, marginBottom: 7 }}>
                  {item.icon}
                  <span style={{ fontSize: '0.62rem', color: 'var(--silver)', fontWeight: 800, fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ color: 'var(--foam)', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>
                  {item.value}
                </div>
                <div style={{ color: 'var(--silver)', fontSize: '0.66rem', marginTop: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gamified Study Streak & XP Dashboard ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="glass-panel fade-up" style={{
          padding: '20px 18px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(18, 43, 59, 0.4) 0%, rgba(7, 16, 20, 0.5) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div 
                className="streak-flame-container" 
                style={{ 
                  background: streak > 0 ? 'rgba(255, 102, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: streak > 0 ? '1px solid rgba(255, 102, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 14, 
                  padding: '8px 10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  color: streak > 0 ? '#ff6600' : 'var(--silver)',
                  boxShadow: streak > 0 ? '0 0 15px rgba(255, 102, 0, 0.2)' : 'none'
                }}
              >
                <Flame size={18} fill={streak > 0 ? '#ff6600' : 'none'} className={streak > 0 ? 'pulse-flame' : ''} />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                  {streak} {lang === 'vi' ? 'Ngày' : 'Days'}
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--silver)', fontWeight: 500 }}>
                {lang === 'vi' ? 'Chuỗi liên tục' : 'Streak Fire'}
              </span>
            </div>
            
            <div 
              style={{ 
                background: levelInfo.bgColor, 
                border: `1px solid ${levelInfo.borderColor}`, 
                borderRadius: 999, 
                padding: '5px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <span 
                style={{ 
                  fontSize: '0.68rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.03em',
                  fontFamily: 'var(--font-label)',
                  background: levelInfo.color,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {levelInfo.title}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--silver)', marginBottom: 6 }}>
              <span>Level {levelInfo.level}</span>
              <span>{xp} / {levelInfo.maxXp} XP</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${progressPct}%`, 
                  height: '100%', 
                  background: levelInfo.color, 
                  borderRadius: 999,
                  transition: 'width 0.6s cubic-bezier(0.1, 0.8, 0.2, 1)' 
                }} 
              />
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '16px 0' }} />
          <div style={{ fontSize: '0.72rem', color: 'var(--silver)', fontWeight: 600, letterSpacing: '0.03em' }}>
            {lang === 'vi' ? 'LỊCH SỬ TUẦN NÀY' : 'WEEKLY STUDY HISTORY'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            {last7Days.map(day => (
              <div key={day.dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <span style={{ fontSize: '0.62rem', color: day.isToday ? 'var(--aqua)' : 'var(--silver)', fontWeight: day.isToday ? 700 : 500 }}>
                  {day.label}
                </span>
                <div 
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: day.completed 
                      ? 'rgba(255, 102, 0, 0.12)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: day.completed 
                      ? '1px solid rgba(255, 102, 0, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: day.completed ? '0 0 10px rgba(255, 102, 0, 0.2)' : 'none',
                    color: day.completed ? '#ff6600' : 'rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {day.completed ? (
                    <Flame size={12} fill="#ff6600" strokeWidth={1} />
                  ) : (
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI Tip of the Day ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="glass-panel fade-up" style={{ 
          padding: '14px 18px', 
          borderRadius: 20, 
          background: 'rgba(142, 216, 232, 0.03)', 
          border: '1px solid rgba(142, 216, 232, 0.15)',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          textAlign: 'left'
        }}>
          <div style={{ background: 'rgba(142, 216, 232, 0.08)', color: 'var(--aqua)', padding: 8, borderRadius: 10, flexShrink: 0 }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-label)', color: 'var(--aqua)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lang === 'vi' ? 'AI COACH KHUYÊN BẠN' : 'AI STUDY TIP'}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--foam)', lineHeight: 1.45, marginTop: 4, margin: 0 }}>
              {aiTip}
            </p>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div style={{ height: 16 }} />
      <p className="section-label" style={{ padding: '0 20px', textAlign: 'left' }}>{t('home', 'sectionActions')}</p>
      <div className="action-grid" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Featured syllabus day */}
        <ActionCard
          icon={<Compass size={16} strokeWidth={2.5} />}
          label={lang === 'vi' ? 'Lộ trình 30 ngày' : '30-Day Syllabus'}
          sub={
            isDay1Done
              ? (lang === 'vi' ? 'Day 1 đã xong · Tiếp tục lộ trình!' : 'Day 1 completed · Continue!')
              : (lang === 'vi' ? 'Học bài Ngày 1 ngay · Đang mở khóa' : 'Study Day 1 now · Unlocked')
          }
          onClick={() => nav('/tests?tab=syllabus')}
          delay="0.02s"
          featured={true}
        />
        
        {/* Grid cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button 
            className="glass-panel"
            onClick={() => nav('/tests')}
            style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'rgba(18, 43, 59, 0.45)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 18 }}
          >
            <div style={{ background: 'rgba(142, 216, 232, 0.08)', color: 'var(--aqua)', padding: 10, borderRadius: 12 }}>
              <BookOpen size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--foam)' }}>{t('home', 'action_tests')}</span>
          </button>

          <button 
            className="glass-panel"
            onClick={() => nav('/wrong')}
            style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'rgba(18, 43, 59, 0.45)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 18 }}
          >
            <div style={{ background: 'rgba(255, 139, 139, 0.08)', color: 'var(--danger)', padding: 10, borderRadius: 12 }}>
              <AlertCircle size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--foam)' }}>{t('home', 'action_wrong')}</span>
          </button>
        </div>

        <ActionCard
          icon={<BookMarked size={15} strokeWidth={2.2} />}
          label={t('home', 'action_vocab')}
          sub={t('home', 'action_vocab_s')}
          onClick={() => nav('/vocab')}
          delay="0.08s"
        />
      </div>

      {/* ── Recent activity ── */}
      <div style={{ height: 20 }} />
      <p className="section-label" style={{ padding: '0 20px', textAlign: 'left' }}>{t('home', 'sectionRecent')}</p>
      <div className="recent-list" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recentTest ? (
          <div
            className="recent-item fade-up"
            style={{ 
              animationDelay: '0.12s',
              background: 'rgba(18, 43, 59, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 18,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => nav(`/practice/${recentTest.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                className="recent-item__icon"
                style={{ background: 'rgba(126, 224, 184, 0.08)', color: 'var(--success)', padding: 8, borderRadius: 10 }}
              >
                <BookOpenCheck size={16} strokeWidth={2.2} />
              </div>
              <div className="recent-item__body" style={{ textAlign: 'left' }}>
                <div className="recent-item__title" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--foam)' }}>{recentTest.title}</div>
                <div className="recent-item__sub" style={{ fontSize: '0.7rem', color: 'var(--silver)', marginTop: 2 }}>
                  {lang === 'vi' ? 'Làm lại để nâng điểm số' : 'Redo test to increase score'}
                </div>
              </div>
            </div>
            <span
              className="recent-item__badge"
              style={{ background: 'rgba(142, 216, 232, 0.1)', color: 'var(--aqua)', fontSize: '0.74rem', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}
            >
              {recentTest.score}/100
            </span>
          </div>
        ) : (
          <div
            className="recent-item fade-up"
            style={{ 
              animationDelay: '0.12s',
              background: 'rgba(18, 43, 59, 0.25)',
              border: '1px dashed rgba(255, 255, 255, 0.06)',
              borderRadius: 18,
              padding: '16px 20px',
              textAlign: 'center',
              color: 'var(--silver)',
              fontSize: '0.78rem'
            }}
          >
            {lang === 'vi' ? 'Chưa có hoạt động làm đề nào.' : 'No recent test activities.'}
          </div>
        )}

        {/* Static list item for wrong questions count */}
        {metrics.wrong > 0 && (
          <div
            className="recent-item fade-up"
            style={{ 
              animationDelay: '0.18s',
              background: 'rgba(18, 43, 59, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 18,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginTop: 4
            }}
            onClick={() => nav('/wrong')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                className="recent-item__icon"
                style={{ background: 'rgba(255, 139, 139, 0.08)', color: 'var(--danger)', padding: 8, borderRadius: 10 }}
              >
                <TrendingUp size={16} strokeWidth={2.2} />
              </div>
              <div className="recent-item__body" style={{ textAlign: 'left' }}>
                <div className="recent-item__title" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--foam)' }}>{t('home', 'recent_wrong_title').replace('12', String(metrics.wrong))}</div>
                <div className="recent-item__sub" style={{ fontSize: '0.7rem', color: 'var(--silver)', marginTop: 2 }}>{t('home', 'recent_wrong_sub')}</div>
              </div>
            </div>
            <ChevronRight size={15} color="var(--silver)" />
          </div>
        )}
      </div>

      <div style={{ height: 20 }} />
    </>
  );
}

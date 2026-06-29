// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import { dbService } from '../services/dbService';
import {
  BookOpen, AlertCircle, BookMarked,
  ChevronRight, TrendingUp, Compass, Sparkles, BookOpenCheck
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
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foam)' }}>{metrics.tests}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2 }}>{t('home', 'tests_done')}</div>
          </div>
          <div className="stat-glass" style={{ flex: 1, padding: '10px 6px', background: 'rgba(18, 43, 59, 0.4)', borderRadius: 14 }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--danger)' }}>{metrics.wrong}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2 }}>{t('home', 'wrong_cnt')}</div>
          </div>
          <div className="stat-glass" style={{ flex: 1, padding: '10px 6px', background: 'rgba(18, 43, 59, 0.4)', borderRadius: 14 }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--aqua)' }}>{metrics.avg}%</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2 }}>{t('home', 'avg_score')}</div>
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

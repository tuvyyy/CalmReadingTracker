// src/pages/TestsPage.tsx
import { useState, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowRight, 
  Inbox, 
  Compass, 
  BookOpen, 
  Award,
  ChevronRight
} from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { dbService } from '../services/dbService';
import { SYLLABUS_DAYS } from '../services/syllabusData';

const PART5_TIME_OPTIONS = [8, 12, 15, 20, 25, 30];

export default function TestsPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { t, lang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || (location.pathname === '/syllabus' ? 'syllabus' : 'tests'); // 'tests' | 'syllabus'

  const tests = useMemo(() => dbService.getTests(), []);
  
  // States for Modals
  const [activeSetupId, setActiveSetupId] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(15);

  // Syllabus calculation metrics
  const completedSyllabusDays = useMemo(() => {
    return SYLLABUS_DAYS.filter(day => dbService.getSyllabusProgress(day.id)?.completed).length;
  }, []);

  const testsStats = useMemo(() => {
    const total = tests.length;
    const done = tests.filter(t => t.status === 'done').length;
    const pending = total - done;
    return { total, done, pending };
  }, [tests]);

  // Setup sheet data
  const selectedTest = tests.find(t => t.id === activeSetupId);
  const isTestCustom = activeSetupId ? dbService.hasAnswerKey(activeSetupId) : false;

  return (
    <>
      {/* ── Page title ── */}
      <div className="page-title-section" style={{ paddingBottom: 8 }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--aqua)', marginBottom: 8,
          }}>
            {lang === 'vi' ? 'TRUNG TÂM LUYỆN ĐỀ' : 'PRACTICE HUB'}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700,
            letterSpacing: '-0.02em', color: 'var(--foam)', margin: 0
          }}>
            {lang === 'vi' ? 'Làm bài' : 'Practice'}
          </h1>
        </div>
      </div>

      {/* ── Segmented Tab Selector ── */}
      <div style={{ padding: '0 16px', marginBottom: 14 }}>
        <div className="segmented-control" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 4, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <button
            className={activeTab === 'tests' ? 'active' : ''}
            onClick={() => setSearchParams({ tab: 'tests' })}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <BookOpen size={13} />
            {lang === 'vi' ? 'Đề thi thử' : 'Exam Decks'}
          </button>
          <button
            className={activeTab === 'syllabus' ? 'active' : ''}
            onClick={() => setSearchParams({ tab: 'syllabus' })}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Compass size={13} />
            {lang === 'vi' ? 'Lộ trình 30 ngày' : '30-Day Syllabus'}
          </button>
        </div>
      </div>

      {/* ── TAB 1: PRACTICE TESTS DECK ── */}
      {activeTab === 'tests' && (
        <>
          {/* Summary stats bar */}
          <div style={{ padding: '0 16px', marginBottom: 16 }}>
            <div className="glass-panel" style={{ padding: '12px 16px', borderRadius: 18, display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foam)' }}>{testsStats.total}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{lang === 'vi' ? 'Tổng số đề' : 'Total'}</div>
              </div>
              <div style={{ width: 1, background: 'var(--line)' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>{testsStats.done}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{lang === 'vi' ? 'Đã làm' : 'Done'}</div>
              </div>
              <div style={{ width: 1, background: 'var(--line)' }} />
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--aqua)' }}>{testsStats.pending}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{lang === 'vi' ? 'Đang chờ' : 'Pending'}</div>
              </div>
            </div>
          </div>

          {/* Test list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
            {tests.length === 0 ? (
              <div className="empty-state" style={{ padding: '50px 24px', borderRadius: 24, background: 'rgba(18, 43, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                <div className="empty-state__icon" style={{ width: 58, height: 58, borderRadius: '50%', background: 'rgba(142, 216, 232, 0.08)', color: 'var(--aqua)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(142, 216, 232, 0.15)', marginBottom: 16 }}>
                  <Inbox size={30} strokeWidth={1.8} />
                </div>
                <div className="empty-state__title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--foam)', fontWeight: 700 }}>
                  {lang === 'vi' ? 'Không tìm thấy đề thi' : 'No tests found'}
                </div>
                <div className="empty-state__sub" style={{ fontSize: '0.78rem', color: 'var(--silver)', maxWidth: 280, margin: '6px auto 0', lineHeight: 1.5 }}>
                  {lang === 'vi' ? 'Danh sách đề thi đang trống.' : 'The exam deck list is currently empty.'}
                </div>
              </div>
            ) : (
              tests.map((testItem, i) => {
                const hasKey = dbService.hasAnswerKey(testItem.id);
                const totalCount = testItem.totalCount || (testItem.part === '5' ? 30 : 100);
                const duration = testItem.part === '5' ? '8-30' : '75';
                const partLabel = testItem.part && testItem.part !== 'all' ? `Part ${testItem.part}` : 'Full Test';

                return (
                  <div
                    key={testItem.id}
                    className="test-card test-card--compact fade-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="test-card__badge">
                      {String(testItem.index).padStart(2, '0')}
                    </div>

                    <div className="test-card__body">
                      <div className="test-card__topline">
                        <div className="test-card__title">{testItem.title}</div>
                      </div>

                      <div className="test-card__meta-row">
                        <span>{partLabel}</span>
                        <span>{totalCount} {lang === 'vi' ? 'câu' : 'Qs'}</span>
                        <span>{duration} {lang === 'vi' ? 'phút' : 'min'}</span>
                      </div>

                      {testItem.score !== undefined && (
                        <div className="test-card__bottomline">
                          <span className="test-card__score-pill">
                            {lang === 'vi' ? 'Điểm' : 'Score'} · {testItem.score}/{totalCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {hasKey ? (
                      <button
                        className="test-card__start-btn"
                        onClick={() => setActiveSetupId(testItem.id)}
                      >
                        {testItem.status === 'done' ? t('tests', 'redo') : t('tests', 'start')}
                        <ArrowRight size={15} strokeWidth={2.2} />
                      </button>
                    ) : (
                      <span className="test-card__missing-key">
                        {lang === 'vi' ? 'Thiếu đáp án' : 'No key'}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ── TAB 2: 30-DAY STUDY SYLLABUS ── */}
      {activeTab === 'syllabus' && (
        <>
          <div style={{ padding: '0 16px', marginBottom: 18 }}>
            <div 
              className="glass-panel" 
              style={{ 
                padding: '20px 22px', 
                borderRadius: 24, 
                background: 'linear-gradient(135deg, rgba(18, 43, 59, 0.75) 0%, rgba(10, 22, 30, 0.85) 100%)',
                border: '1px solid rgba(142, 216, 232, 0.15)',
                boxShadow: '0 8px 32px rgba(10, 22, 30, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: 'rgba(142, 216, 232, 0.1)', color: 'var(--aqua)', padding: 8, borderRadius: 10 }}>
                    <Compass size={18} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--foam)', letterSpacing: '-0.01em' }}>
                      {lang === 'vi' ? 'Tiến độ Lộ trình' : 'Focus Journey Progress'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--silver)', marginTop: 1 }}>
                      {lang === 'vi' ? 'Luyện đọc TOEIC 30 ngày' : '30-Day TOEIC Reading Plan'}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 800, 
                  color: completedSyllabusDays > 0 ? 'var(--success)' : 'var(--aqua)' 
                }}>
                  {Math.round((completedSyllabusDays / 30) * 100)}%
                </div>
              </div>

              {/* Progress bar track */}
              <div style={{ width: '100%' }}>
                <div style={{ height: 8, width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(completedSyllabusDays / 30) * 100}%`, 
                      background: 'linear-gradient(90deg, var(--aqua) 0%, var(--success) 100%)', 
                      borderRadius: 4,
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--silver)', marginTop: 6, fontWeight: 600 }}>
                  <span>{lang === 'vi' ? `Đã xong ${completedSyllabusDays}/30 ngày` : `Completed ${completedSyllabusDays}/30 days`}</span>
                  <span>30 {lang === 'vi' ? 'ngày' : 'days'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus path list */}
          <div style={{ padding: '0 16px calc(96px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SYLLABUS_DAYS.map(day => {
              const progress = dbService.getSyllabusProgress(day.id);
              const completed = progress?.completed ?? false;
              const isVocab = day.title.includes('Từ vựng') || day.titleEn.toLowerCase().includes('vocab');
              
              const categoryLabel = isVocab 
                ? (lang === 'vi' ? 'Từ vựng' : 'Vocabulary') 
                : (lang === 'vi' ? 'Ngữ pháp' : 'Grammar');
              
              // Colors
              const themeColor = completed 
                ? 'var(--success)' 
                : isVocab 
                  ? '#ffd68f' 
                  : 'var(--aqua)';
              const cardBg = completed
                ? 'linear-gradient(135deg, rgba(126, 224, 184, 0.06) 0%, rgba(15, 38, 30, 0.55) 100%)'
                : isVocab
                  ? 'linear-gradient(135deg, rgba(255, 214, 143, 0.06) 0%, rgba(45, 38, 25, 0.55) 100%)'
                  : 'linear-gradient(135deg, rgba(142, 216, 232, 0.06) 0%, rgba(18, 43, 59, 0.55) 100%)';
              const cardBorder = completed
                ? '1px solid rgba(126, 224, 184, 0.22)'
                : isVocab
                  ? '1px solid rgba(255, 214, 143, 0.22)'
                  : '1px solid rgba(142, 216, 232, 0.22)';
              const glowColor = completed
                ? 'rgba(126, 224, 184, 0.04)'
                : isVocab
                  ? 'rgba(255, 214, 143, 0.04)'
                  : 'rgba(142, 216, 232, 0.04)';

              return (
                <button
                  key={day.id}
                  onClick={() => nav(`/syllabus/day/${day.id}`)}
                  className="glass-panel fade-up hover-lift"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '18px 22px',
                    width: '100%',
                    textAlign: 'left',
                    border: cardBorder,
                    background: cardBg,
                    borderRadius: 22,
                    boxShadow: `0 8px 30px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.02)`,
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle background light effect */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    background: themeColor,
                    opacity: 0.03,
                    filter: 'blur(30px)',
                    pointerEvents: 'none'
                  }} />

                  {/* Day badge */}
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: 15,
                    background: completed ? 'rgba(126, 224, 184, 0.08)' : isVocab ? 'rgba(255, 214, 143, 0.08)' : 'rgba(142, 216, 232, 0.08)',
                    border: `1px solid ${completed ? 'rgba(126, 224, 184, 0.15)' : isVocab ? 'rgba(255, 214, 143, 0.15)' : 'rgba(142, 216, 232, 0.15)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '0.52rem', fontFamily: 'var(--font-label)', color: themeColor, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>DAY</span>
                    <span style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: completed ? 'var(--success)' : 'var(--foam)', fontWeight: 800, marginTop: -3 }}>{day.dayNo}</span>
                  </div>

                  {/* Info block */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{
                        fontSize: '0.58rem',
                        fontFamily: 'var(--font-label)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: completed ? 'rgba(126, 224, 184, 0.08)' : isVocab ? 'rgba(255, 214, 143, 0.08)' : 'rgba(142, 216, 232, 0.08)',
                        color: themeColor,
                        border: `1px solid ${completed ? 'rgba(126, 224, 184, 0.15)' : isVocab ? 'rgba(255, 214, 143, 0.15)' : 'rgba(142, 216, 232, 0.15)'}`
                      }}>
                        {categoryLabel}
                      </span>
                      {completed && (
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <Award size={10} /> {lang === 'vi' ? 'Đã học' : 'Done'}
                        </span>
                      )}
                      {completed && progress && (
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: '0.66rem',
                          fontWeight: 900,
                          color: 'var(--ink)',
                          background: 'linear-gradient(135deg, var(--success) 0%, var(--foam) 100%)',
                          borderRadius: 999,
                          padding: '3px 9px',
                          boxShadow: '0 8px 18px rgba(126, 224, 184, 0.16)',
                          whiteSpace: 'nowrap'
                        }}>
                          {progress.score}/{progress.total}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--foam)', lineHeight: 1.35 }}>
                      {lang === 'vi' ? day.title.split(': ').slice(1).join(': ') || day.title : day.titleEn}
                    </div>
                    
                    <p style={{ fontSize: '0.74rem', color: 'var(--silver)', marginTop: 5, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.85 }}>
                      {lang === 'vi' ? day.description : day.descriptionEn}
                    </p>
                    
                    {completed && progress && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 7 }}>
                        <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.round((progress.score / Math.max(progress.total, 1)) * 100)}%`,
                            height: '100%',
                            borderRadius: 999,
                            background: 'linear-gradient(90deg, var(--success), var(--foam))'
                          }} />
                        </div>
                        <span style={{ color: 'var(--success)', fontSize: '0.64rem', fontWeight: 800 }}>
                          {Math.round((progress.score / Math.max(progress.total, 1)) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <ChevronRight size={16} color="var(--silver)" style={{ opacity: 0.6 }} />
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ── PRACTICE SETUP MODE SELECTION SHEET ── */}
      {activeSetupId && selectedTest && (
        <div className="modal-overlay" onClick={() => setActiveSetupId(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ padding: '24px 20px', borderRadius: 24, textAlign: 'left' }}>
            <div className="modal-handle" />
            
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--foam)', margin: '0 0 4px 0' }}>
              {lang === 'vi' ? 'Chọn chế độ luyện tập' : 'Select Practice Mode'}
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--silver)', marginBottom: 20 }}>
              {selectedTest.title}
            </p>

            {!isTestCustom && (
              <div className="alert alert--info" style={{ marginBottom: 18, fontSize: '0.74rem', lineHeight: 1.45 }}>
                <span>
                  {lang === 'vi'
                    ? 'Đề này chưa có đáp án nên chưa thể làm bài.'
                    : 'This test has no answer key yet.'
                  }
                </span>
              </div>
            )}

            {selectedTest.part === '5' ? (
              <div className="practice-setup-panel">
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--foam)' }}>
                    {lang === 'vi' ? 'Luyện Part 5 (30 câu)' : 'Part 5 Only (30 q)'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--silver)', marginTop: 3 }}>
                    {lang === 'vi' ? 'Chọn thời gian làm bài' : 'Choose your practice timer'}
                  </div>
                </div>

                <div className="time-choice-grid" aria-label="Chọn thời gian làm bài">
                  {PART5_TIME_OPTIONS.map(minutes => (
                    <button
                      key={minutes}
                      type="button"
                      className={`time-choice${selectedDuration === minutes ? ' active' : ''}`}
                      onClick={() => setSelectedDuration(minutes)}
                    >
                      {minutes}
                      <span>{lang === 'vi' ? 'phút' : 'min'}</span>
                    </button>
                  ))}
                </div>

                <button
                  className="btn-primary"
                  disabled={!isTestCustom}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    if (!isTestCustom) return;
                    setActiveSetupId(null);
                    nav(`/practice/${selectedTest.id}?part=5&minutes=${selectedDuration}`);
                  }}
                >
                  {lang === 'vi' ? `Bắt đầu · ${selectedDuration} phút` : `Start · ${selectedDuration} min`}
                  <ArrowRight size={15} strokeWidth={2.4} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {[
                  { partKey: 'all', titleVi: 'Full Test (100 câu)', titleEn: 'Full Test (100 q)', descVi: '75 phút · Làm cả 3 part', descEn: '75 mins · Parts 5, 6, 7' },
                  { partKey: '5', titleVi: 'Luyện Part 5 (30 câu)', titleEn: 'Part 5 Only (30 q)', descVi: '15 phút · Câu đơn ngắn', descEn: '15 mins · Incomplete Sentences' },
                  { partKey: '6', titleVi: 'Luyện Part 6 (16 câu)', titleEn: 'Part 6 Only (16 q)', descVi: '10 phút · Điền đoạn văn', descEn: '10 mins · Text Completion' },
                  { partKey: '7', titleVi: 'Luyện Part 7 (54 câu)', titleEn: 'Part 7 Only (54 q)', descVi: '50 phút · Đọc hiểu văn bản', descEn: '50 mins · Reading Comprehension' },
                ].map(({ partKey, titleVi, titleEn, descVi, descEn }) => {
                  const displayTitle = lang === 'vi' ? titleVi : titleEn;
                  const displayDesc = lang === 'vi' ? descVi : descEn;

                  return (
                    <button
                      key={partKey}
                      onClick={() => {
                        if (!isTestCustom) return;
                        setActiveSetupId(null);
                        nav(`/practice/${selectedTest.id}?part=${partKey}`);
                      }}
                      className={`glass-panel ${isTestCustom ? '' : 'disabled'}`}
                      disabled={!isTestCustom}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 16,
                        background: 'rgba(18, 43, 59, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        textAlign: 'left',
                        cursor: isTestCustom ? 'pointer' : 'not-allowed',
                        opacity: isTestCustom ? 1 : 0.55
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--foam)' }}>
                          {displayTitle}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--silver)', marginTop: 2 }}>
                          {displayDesc}
                        </div>
                      </div>
                      
                      {isTestCustom ? (
                        <ArrowRight size={15} color="var(--aqua)" />
                      ) : (
                        <span style={{ 
                          fontSize: '0.58rem', 
                          fontFamily: 'var(--font-label)', 
                          background: 'rgba(255, 139, 139, 0.1)', 
                          color: 'var(--danger)', 
                          padding: '3px 8px', 
                          borderRadius: 6,
                          fontWeight: 700
                        }}>
                          {lang === 'vi' ? 'ĐANG CẬP NHẬT' : 'COMING SOON'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <button 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center' }} 
              onClick={() => setActiveSetupId(null)}
            >
              {lang === 'vi' ? 'Quay lại' : 'Close'}
            </button>
          </div>
        </div>
      )}

      <div style={{ height: 20 }} />
    </>
  );
}

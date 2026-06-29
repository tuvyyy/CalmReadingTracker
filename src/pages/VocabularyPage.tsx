// src/pages/VocabularyPage.tsx
import { useState, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, ChevronRight, Loader2, RotateCcw, Sparkles, Volume2, Search, X } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { audioService } from '../services/audioService';
import { getVocabCoach, type VocabCoachResponse } from '../services/aiVocabService';
import { dbService, type TestVocabItem } from '../services/dbService';

const speakWord = (word: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
  }
};

type VocabStatus = 'new' | 'review' | 'mastered';
type View = 'quiz' | 'list';

const STATUS_LABEL_KEYS: Record<VocabStatus, 'status_new' | 'status_review' | 'status_mastered'> = {
  new:      'status_new',
  review:   'status_review',
  mastered: 'status_mastered',
};

function shuffleArray<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

// ── AI Coach Box ────────────────────────────────
function AiCoachBox({ item, chosen }: { item: TestVocabItem; chosen: string | null }) {
  const { lang } = useLang();
  const [coach, setCoach] = useState<VocabCoachResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAi = async () => {
    setLoading(true);
    setError('');
    try {
      const next = await getVocabCoach({
        word: item.word,
        type: item.type,
        meaning: item.meaning,
        example: item.example,
        exampleVi: item.exampleVi,
        synonyms: item.synonyms,
        usage: item.usage,
        chosen,
        correct: chosen === item.meaning,
      });
      setCoach(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI coach is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
      <button
        className="btn-secondary"
        onClick={askAi}
        disabled={loading}
        style={{
          width: '100%',
          justifyContent: 'center',
          gap: 8,
          background: 'rgba(142, 216, 232, 0.08)',
          borderColor: 'rgba(142, 216, 232, 0.25)',
          color: 'var(--aqua)',
        }}
      >
        {loading ? <Loader2 size={15} className="ai-spin" /> : <Sparkles size={15} strokeWidth={2.3} />}
        AI Coach
      </button>

      {error && (
        <div className="alert alert--warn" style={{ fontSize: '0.72rem', lineHeight: 1.45, margin: 0 }}>
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {coach && createPortal(
        <div className="modal-overlay" onClick={() => setCoach(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '82vh', overflowY: 'auto' }}>
            <div className="modal-handle" />
            
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, justifyContent: 'center' }}>
              <Sparkles size={18} style={{ color: 'var(--aqua)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--foam)', margin: 0 }}>
                AI Learning Coach
              </h3>
            </div>

            {/* Word details header */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--foam)' }}>
                {item.word}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>
                {item.type} · "{item.meaning}"
              </div>
            </div>

            {/* Content list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left', marginBottom: 24 }}>
              
              {/* Summary */}
              <div className="glass-panel" style={{ padding: '12px 16px', borderRadius: 12, borderLeft: '3px solid var(--aqua)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--foam)', lineHeight: 1.5, fontWeight: 500 }}>
                  {coach.summary}
                </div>
              </div>

              {/* Memory hook */}
              {coach.memoryHook && (
                <div className="glass-panel" style={{ padding: '12px 16px', borderRadius: 12 }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--aqua)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
                    {lang === 'vi' ? 'Mẹo ghi nhớ' : 'Memory Hook'}
                  </span>
                  <div style={{ fontSize: '0.74rem', color: 'var(--silver)', lineHeight: 1.45 }}>
                    {coach.memoryHook}
                  </div>
                </div>
              )}

              {/* Common Trap */}
              {coach.commonTrap && (
                <div className="glass-panel" style={{ padding: '12px 16px', borderRadius: 12, borderLeft: '3px solid var(--danger)' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
                    {lang === 'vi' ? 'Bẫy thường gặp' : 'Common Trap'}
                  </span>
                  <div style={{ fontSize: '0.74rem', color: 'var(--silver)', lineHeight: 1.45 }}>
                    {coach.commonTrap}
                  </div>
                </div>
              )}

              {/* TOEIC pattern */}
              {coach.toeicPattern && (
                <div className="glass-panel" style={{ padding: '12px 16px', borderRadius: 12, borderLeft: '3px solid var(--success)' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
                    {lang === 'vi' ? 'Cấu trúc TOEIC' : 'TOEIC Pattern'}
                  </span>
                  <div style={{ fontSize: '0.74rem', color: 'var(--silver)', lineHeight: 1.45 }}>
                    {coach.toeicPattern}
                  </div>
                </div>
              )}

              {/* Micro Drill */}
              {coach.microDrill && coach.microDrill.length > 0 && (
                <div className="glass-panel" style={{ padding: '12px 16px', borderRadius: 12 }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                    {lang === 'vi' ? 'Bài tập nhanh' : 'Micro Drill'}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {coach.microDrill.map((line, i) => (
                      <div key={line} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.45 }}>
                        {i + 1}. {line}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Close button */}
            <button className="btn-primary" onClick={() => setCoach(null)} style={{ width: '100%' }}>
              {lang === 'vi' ? 'Đóng AI Coach' : 'Close AI Coach'}
            </button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

// ── Quiz View ────────────────────────────────────
interface QuizViewProps {
  vocabList: TestVocabItem[];
  onAnswer: () => void;
}

function QuizView({ vocabList, onAnswer }: QuizViewProps) {
  const { t, lang } = useLang();
  
  const getWordFontSize = (word: string) => {
    if (!word) return '3.2rem';
    if (word.length > 14) return '2.15rem';
    if (word.length > 11) return '2.45rem';
    if (word.length > 8) return '2.75rem';
    return '3.2rem';
  };
  const [queue, setQueue] = useState<TestVocabItem[]>(() =>
    shuffleArray(vocabList.filter(v => v.status !== 'mastered'))
  );
  const [idx, setIdx] = useState(0);
  const [shuffled, setShuffled] = useState<string[]>(() =>
    shuffleArray(queue[0]?.options ?? [])
  );
  const [chosen, setChosen] = useState<string | null>(null);

  const current = queue[idx];

  const handleChoose = (opt: string) => {
    if (chosen) return;
    setChosen(opt);
    const correct = opt === current.meaning;
    audioService.playFeedbackSound(correct);
    dbService.handleVocabAnswer(current.id, correct);
    onAnswer(); // Sync parent state count
  };

  const handleNext = useCallback(() => {
    const nextIdx = idx + 1;
    if (nextIdx >= queue.length) {
      // Reload matching list from parent to adapt to new status changes
      const activeList = dbService.getVocabList().filter(v => v.status !== 'mastered');
      const newQueue = shuffleArray(activeList);
      setQueue(newQueue);
      setIdx(0);
      setShuffled(shuffleArray(newQueue[0]?.options ?? []));
    } else {
      setIdx(nextIdx);
      setShuffled(shuffleArray(queue[nextIdx].options));
    }
    setChosen(null);
  }, [idx, queue]);

  if (!current) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon"><RotateCcw size={40} strokeWidth={1.3} /></div>
        <div className="empty-state__title">{t('vocab', 'empty_title')}</div>
        <div className="empty-state__sub">{t('vocab', 'empty_sub')}</div>
      </div>
    );
  }

  const isAnswered = chosen !== null;

  const watermarkSvg = (
    <svg width="240" height="240" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50 10 A 40 40 0 0 1 50 90" stroke="var(--foam)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 50 10 C 36 10, 31 18, 31 27 C 31 33, 34 37, 34 40 C 32 41, 26 44, 26 48 C 26 51, 31 53, 31 55 C 29 56, 31 58, 31 60 C 31 62, 28 64, 28 66 C 28 69, 34 72, 38 74 C 42 76, 46 80, 50 90" stroke="var(--foam)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 50 50 C 49 46, 45 46, 45 50 C 45 54, 53 54, 53 50 C 53 42, 41 42, 41 50 C 41 58, 59 58, 59 50 C 59 38, 37 38, 37 50 C 37 62, 65 62, 65 50 C 65 34, 33 34, 33 50 C 33 66, 71 66, 71 50 C 71 30, 29 30, 29 50" stroke="var(--foam)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="42" cy="24" r="0.8" fill="var(--foam)" opacity="0.8" />
      <circle cx="52" cy="20" r="0.6" fill="var(--foam)" opacity="0.6" />
      <circle cx="58" cy="26" r="0.8" fill="var(--foam)" opacity="0.7" />
      <circle cx="48" cy="34" r="0.6" fill="var(--foam)" opacity="0.5" />
      <path d="M 32 78 C 42 70, 50 70, 60 78 C 70 86, 78 82, 85 75" stroke="var(--foam)" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M 36 84 C 44 77, 52 77, 60 84 C 68 91, 74 88, 80 82" stroke="var(--foam)" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M 64 78 C 74 72, 78 62, 76 46" stroke="var(--foam)" strokeWidth="1.0" strokeLinecap="round" fill="none" />
      <path d="M 76 46 C 79 42, 83 42, 84 46 C 82 50, 78 50, 76 46 Z" stroke="var(--foam)" strokeWidth="0.8" fill="rgba(255, 255, 255, 0.12)" />
      <path d="M 77 56 C 81 53, 85 54, 85 58 C 82 61, 79 60, 77 56 Z" stroke="var(--foam)" strokeWidth="0.8" fill="rgba(255, 255, 255, 0.12)" />
      <path d="M 73 66 C 77 64, 80 66, 80 69 C 77 71, 74 70, 73 66 Z" stroke="var(--foam)" strokeWidth="0.8" fill="rgba(255, 255, 255, 0.12)" />
      <line x1="50" y1="50" x2="50" y2="10" stroke="var(--foam)" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.6" />
      <path d="M 50 4 Q 50 10, 44 10 Q 50 10, 50 16 Q 50 10, 56 10 Q 50 10, 50 4" stroke="var(--foam)" strokeWidth="0.8" fill="var(--foam)" />
      <circle cx="50" cy="10" r="1" fill="#ffffff" />
    </svg>
  );

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div className="progress-track" style={{ flex: 1, height: 3 }}>
          <div
            className="progress-fill"
            style={{ width: `${((idx + 1) / queue.length) * 100}%` }}
          />
        </div>
        <span className="progress-text" style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem' }}>
          {idx + 1}/{queue.length}
        </span>
      </div>

      {/* 3D Flashcard container */}
      <div className="flashcard-perspective fade-up" key={current.id}>
        <div className={`flashcard-inner${isAnswered ? ' is-flipped' : ''}`}>
          
          {/* Front Face: Word & Options */}
          <div className="flashcard-front">
            <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.08, pointerEvents: 'none', zIndex: 0 }}>
              {watermarkSvg}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.62rem', fontWeight: 700, color: 'var(--silver)', letterSpacing: '0.12em' }}>
                {t('vocab', 'quiz_label')}
              </span>
              <span className="vocab-card__type-badge">
                {current.type}
              </span>
            </div>

            {/* Word centered and large */}
            <div style={{ margin: '30px 0', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span className="vocab-card__word" style={{ fontSize: getWordFontSize(current.word) }}>{current.word}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(current.word);
                  }}
                  style={{
                    background: 'none', border: 'none', color: 'var(--aqua)',
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                    padding: 6, borderRadius: '50%', transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  title="Pronounce word"
                  aria-label="Pronounce word"
                >
                  <Volume2 size={16} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Options (2x2 Grid) */}
            <div className="vocab-options">
              {shuffled.map(opt => {
                const isCorrectOpt = opt === current.meaning;
                const isChosenOpt = opt === chosen;
                
                let cls = 'quiz-option';
                if (isAnswered) {
                  if (isCorrectOpt) cls += ' correct';
                  else if (isChosenOpt) cls += ' wrong';
                }
                
                return (
                  <button
                    key={opt}
                    className={cls}
                    onClick={() => handleChoose(opt)}
                    disabled={isAnswered}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Back Face: Meaning & Example */}
          <div className="flashcard-back">
            <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.08, pointerEvents: 'none', zIndex: 0 }}>
              {watermarkSvg}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.62rem', fontWeight: 700, color: 'var(--silver)', letterSpacing: '0.12em' }}>
                {t('vocab', 'quiz_label')}
              </span>
              <span className="vocab-card__type-badge">
                {current.type}
              </span>
            </div>

            {/* Word and Correctness info */}
            <div style={{ margin: '15px 0', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span className="vocab-card__word" style={{ fontSize: getWordFontSize(current.word) }}>{current.word}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(current.word);
                  }}
                  style={{
                    background: 'none', border: 'none', color: 'var(--aqua)',
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                    padding: 6, borderRadius: '50%', transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  title="Pronounce word"
                  aria-label="Pronounce word"
                >
                  <Volume2 size={16} strokeWidth={2.2} />
                </button>
              </div>
              
              {chosen && (
                <div style={{ marginTop: 8 }}>
                  {chosen === current.meaning ? (
                    <span style={{ 
                      fontSize: '0.75rem', fontWeight: 700, 
                      color: 'var(--success)', background: 'rgba(126, 224, 184, 0.12)', 
                      padding: '3px 10px', borderRadius: '12px', letterSpacing: '0.04em'
                    }}>
                      {lang === 'vi' ? 'Đúng rồi!' : 'Correct!'}
                    </span>
                  ) : (
                    <span style={{ 
                      fontSize: '0.75rem', fontWeight: 700, 
                      color: 'var(--danger)', background: 'rgba(255, 139, 139, 0.12)', 
                      padding: '3px 10px', borderRadius: '12px', letterSpacing: '0.04em'
                    }}>
                      {lang === 'vi' ? 'Chưa đúng' : 'Incorrect'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Explanation & Next action */}
            <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="glass-panel" style={{ 
                padding: '12px 16px', textAlign: 'left', 
                borderLeft: '3px solid var(--aqua)', borderRadius: '14px',
                maxHeight: '150px', overflowY: 'auto',
                fontSize: '0.78rem'
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--foam)', marginBottom: 8 }}>
                  "{current.meaning}"
                </div>

                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: 'var(--foam)', fontWeight: 600, lineHeight: 1.3 }}>
                    • {current.example}
                  </div>
                  {current.exampleVi && (
                    <div style={{ color: 'var(--silver)', fontStyle: 'italic', fontSize: '0.72rem', marginTop: 2 }}>
                      {current.exampleVi}
                    </div>
                  )}
                </div>

                {current.synonyms && (
                  <div style={{ marginBottom: 6, fontSize: '0.72rem' }}>
                    <strong style={{ color: 'var(--aqua)' }}>Synonyms:</strong> <span style={{ color: 'var(--silver)' }}>{current.synonyms}</span>
                  </div>
                )}

                {current.usage && (
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', background: 'rgba(142, 216, 232, 0.05)', padding: '6px 10px', borderRadius: '8px', marginTop: 6, borderLeft: '2px solid var(--silver)' }}>
                    {current.usage}
                  </div>
                )}
              </div>

              {/* AI Coach Trigger Box */}
              <AiCoachBox key={current.id} item={current} chosen={chosen} />

              <button className="btn-primary" onClick={handleNext} style={{ width: '100%' }}>
                {t('vocab', 'next_btn')}
                <ChevronRight size={15} strokeWidth={2.5} style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── List View ────────────────────────────────────
function ListView({ vocabList }: { vocabList: TestVocabItem[] }) {
  const { t, lang } = useLang();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return vocabList;
    return vocabList.filter(
      v => v.word.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q)
    );
  }, [vocabList, searchQuery]);

  const statusPriority: Record<VocabStatus, number> = { new: 0, review: 1, mastered: 2 };
  const sorted = [...filtered].sort(
    (a, b) => statusPriority[a.status ?? 'new'] - statusPriority[b.status ?? 'new']
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Glassmorphic Search Bar */}
      <div className="vocab-search-container">
        <div className="vocab-search-wrapper">
          <Search size={16} className="vocab-search-icon" />
          <input
            type="text"
            className="vocab-search-input"
            placeholder={lang === 'vi' ? 'Tìm kiếm từ vựng hoặc nghĩa...' : 'Search word or meaning...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="vocab-search-clear"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {sorted.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px 16px' }}>
            <div className="empty-state__icon"><Search size={32} strokeWidth={1.5} /></div>
            <div className="empty-state__title" style={{ fontSize: '1rem', color: 'var(--foam)', fontWeight: 700 }}>
              {lang === 'vi' ? 'Không tìm thấy từ vựng' : 'No words found'}
            </div>
            <div className="empty-state__sub" style={{ fontSize: '0.74rem', color: 'var(--silver)', marginTop: 4 }}>
              {lang === 'vi' ? 'Không có từ nào khớp với tìm kiếm của bạn.' : 'No words match your search query.'}
            </div>
          </div>
        ) : (
          sorted.map((v, i) => (
            <div
              key={v.id}
              className={`vocab-word-item glass-panel fade-up vocab-status--${v.status ?? 'new'}`}
              style={{ animationDelay: `${i * 0.04}s`, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="vocab-word-item__word" style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {v.word}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(v.word);
                    }}
                    style={{
                      background: 'none', border: 'none', color: 'var(--aqua)',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                      padding: 4, borderRadius: '50%', transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    title="Pronounce word"
                    aria-label="Pronounce word"
                  >
                    <Volume2 size={13} strokeWidth={2.2} />
                  </button>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--silver)', fontWeight: 500, textTransform: 'uppercase' }}>
                    {v.type}
                  </span>
                </div>
                <div className="vocab-word-item__meaning" style={{ fontSize: '0.82rem', color: 'var(--foam)', fontWeight: 600, marginTop: 4 }}>
                  {v.meaning}
                </div>
                {v.synonyms && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--silver)', marginTop: 4 }}>
                    <span style={{ color: 'var(--aqua)', fontWeight: 600 }}>Synonyms:</span> {v.synonyms}
                  </div>
                )}
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: 4, fontStyle: 'italic' }}>
                  Ex: {v.example}
                </div>
                {v.usage && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--silver)', marginTop: 6, background: 'rgba(142, 216, 232, 0.04)', padding: '6px 10px', borderRadius: '6px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                    {v.usage}
                  </div>
                )}
              </div>
              <span className={`vocab-status-pill vocab-status-pill--${v.status ?? 'new'}`} style={{ flexShrink: 0 }}>
                {t('vocab', STATUS_LABEL_KEYS[v.status ?? 'new'])}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────
export default function VocabularyPage() {
  const { t, lang } = useLang();
  const [view, setView] = useState<View>('quiz');
  const [vocabList, setVocabList] = useState(() => dbService.getVocabList());
  const [syncMessage, setSyncMessage] = useState('');

  const refreshList = useCallback(() => {
    setVocabList(dbService.getVocabList());
  }, []);

  // Auto-sync with server on mount
  useEffect(() => {
    let active = true;
    const runSync = async () => {
      const added = await dbService.syncVocabWithServer();
      if (!active) return;
      if (added > 0) {
        setSyncMessage(
          lang === 'vi'
            ? `Đồng bộ thành công! Đã thêm ${added} từ vựng từ server máy tính.`
            : `Synchronized! Added ${added} vocabulary items from the host computer.`
        );
        setVocabList(dbService.getVocabList());
        setTimeout(() => {
          if (active) setSyncMessage('');
        }, 4000);
      }
    };
    runSync();
    return () => {
      active = false;
    };
  }, [lang]);

  const newCount    = vocabList.filter(v => v.status === 'new').length;
  const reviewCount = vocabList.filter(v => v.status === 'review').length;
  const masteredCount = vocabList.filter(v => v.status === 'mastered').length;

  return (
    <>
      {/* Title Header - persistent on both views */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 6, 
        padding: 'calc(24px + env(safe-area-inset-top)) 16px 8px' 
      }}>
        <p style={{
          fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--aqua)', marginBottom: 0
        }}>
          {lang === 'vi' ? 'HỌC TỪ VỰNG' : 'VOCABULARY STUDY'}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700,
          letterSpacing: '-0.02em', color: 'var(--foam)', margin: 0
        }}>
          {lang === 'vi' ? 'Sổ tay từ vựng' : 'Vocab Notebook'}
        </h1>
      </div>

      {/* Segmented Control tab switch */}
      <div style={{ padding: '0 16px 14px' }}>
        <div className="segmented-control">
          <button
            className={view === 'quiz' ? 'active' : ''}
            onClick={() => setView('quiz')}
          >
            {t('vocab', 'tab_quiz')}
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            {t('vocab', 'tab_list')}
          </button>
        </div>
      </div>

      {/* Stats Row - only shown in list view */}
      {view === 'list' && (
        <div style={{ display: 'flex', gap: 10, padding: '0 16px 14px' }}>
          {[
            { label: t('vocab', 'stat_new'),      count: newCount,      color: 'var(--aqua)'    },
            { label: t('vocab', 'stat_review'),   count: reviewCount,    color: 'var(--silver)'  },
            { label: t('vocab', 'stat_mastered'), count: masteredCount, color: 'var(--success)' },
          ].map(({ label, count, color }) => (
            <div key={label} className="stat-glass" style={{ padding: '12px 6px' }}>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '1.4rem', fontWeight: 700, color }}>{count}</div>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Sync Success Notification banner */}
      {syncMessage && (
        <div className="alert alert--success fade-up" style={{ margin: '0 16px 12px 16px', fontSize: '0.74rem' }}>
          <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Content */}
      {view === 'quiz' ? <QuizView vocabList={vocabList} onAnswer={refreshList} /> : <ListView vocabList={vocabList} />}

      <div style={{ height: 20 }} />
    </>
  );
}

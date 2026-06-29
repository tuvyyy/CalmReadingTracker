// src/pages/GrammarPage.tsx
import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Sparkles, 
  AlertTriangle,
  Award
} from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { audioService } from '../services/audioService';
import { dbService } from '../services/dbService';
import { GRAMMAR_QUESTIONS, type GrammarQuestion } from '../services/grammarData';
import { getGrammarCoach, type GrammarCoachResponse } from '../services/aiGrammarService';

type ViewMode = 'dashboard' | 'practice' | 'summary';

// List of categories in order
const CATEGORIES = [
  "NOUNS", "ADJECTIVES", "ADVERBS", "PRONOUNS", "PREPOSITIONS", "CONJUNCTIONS",
  "NUMERIC EXPRESSIONS BEFORE NOUNS", "RELATIVE CLAUSES", "TO INFINITIVES AND GERUNDS",
  "PRESENT SIMPLE TENSE", "PASSIVE VOICE", "IMPERATIVE", "PASSIVE AND SPECIAL PASSIVE CASES",
  "MODAL VERBS", "CONDITIONAL SENTENCES", "REDUCING RELATIVE CLAUSES", "VERBS",
  "SENTENCE ELEMENTS", "ADVERBIAL CLAUSES OF TIME", "PHRASES & CLAUSES",
  "PHRASES & CLAUSES OF CONCESSION", "PHRASES & CLAUSES OF EFFECT",
  "PHRASES & CLAUSES OF PURPOSE", "PHRASES & CLAUSES OF REASON"
];

// Helper to format category name
function formatCategoryName(cat: string): string {
  return cat
    .split(' ')
    .map(w => w === '&' ? '&' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Helper to check if question has a passage
function parsePassage(questionText: string) {
  const triggers = ["Announcement", "Memo", "Dear Team", "Subject:", "To:"];
  const isPassage = questionText.length > 200 || triggers.some(t => questionText.includes(t));
  
  if (!isPassage) {
    return { isPassage: false, passage: '', prompt: questionText };
  }

  // Look for sub-question prompt at the end
  const promptIndex = questionText.indexOf("Cần chọn");
  const altPromptIndex = questionText.indexOf("Chọn đáp án");
  const cutIndex = promptIndex !== -1 ? promptIndex : altPromptIndex !== -1 ? altPromptIndex : -1;

  if (cutIndex !== -1) {
    return {
      isPassage: true,
      passage: questionText.substring(0, cutIndex).trim(),
      prompt: questionText.substring(cutIndex).trim()
    };
  }

  return { isPassage: true, passage: questionText, prompt: 'Chọn đáp án đúng nhất để điền vào chỗ trống:' };
}

// ── AI Coach Box ────────────────────────────────
function AiGrammarCoachBox({ item, chosen }: { item: GrammarQuestion; chosen: string | null }) {
  const { lang } = useLang();
  const [coach, setCoach] = useState<GrammarCoachResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAi = async () => {
    setLoading(true);
    setError('');
    try {
      const next = await getGrammarCoach({
        category: item.category,
        question: item.question,
        options: item.options,
        chosen,
        correct: chosen === item.answer,
        explanation: item.explanation
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
        AI Grammar Coach
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
                AI Grammar Coach
              </h3>
            </div>

            {/* Word details header */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Chuyên đề: {formatCategoryName(item.category)}
              </div>
              <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--foam)', lineHeight: 1.4, padding: '0 10px' }}>
                {item.question.length > 120 ? item.question.substring(0, 120) + '...' : item.question}
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

// ── Main Component ──────────────────────────────
export default function GrammarPage() {
  const { lang } = useLang();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [metrics, setMetrics] = useState(() => dbService.getGrammarMetrics());

  const refreshMetrics = useCallback(() => {
    setMetrics(dbService.getGrammarMetrics());
  }, []);

  // Filter questions by selected topic
  const topicQuestions = selectedTopic 
    ? GRAMMAR_QUESTIONS.filter(q => q.category === selectedTopic)
    : [];

  const currentQuestion = topicQuestions[qIdx];

  const handleStartTopic = (topic: string) => {
    setSelectedTopic(topic);
    setQIdx(0);
    setChosen(null);
    setViewMode('practice');
  };

  const handleChoose = (letter: string) => {
    if (chosen) return;
    setChosen(letter);
    const correct = letter === currentQuestion.answer;
    audioService.playFeedbackSound(correct);
    dbService.saveGrammarAnswer(currentQuestion.id, letter, correct);
    refreshMetrics();
  };

  const handleNext = () => {
    if (qIdx + 1 >= topicQuestions.length) {
      setViewMode('summary');
    } else {
      setQIdx(prev => prev + 1);
      setChosen(null);
    }
  };

  // Render Category Dashboard List
  if (viewMode === 'dashboard') {
    return (
      <>
        {/* Header Poster */}
        <div className="page-title-section">
          <p style={{
            fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--aqua)', marginBottom: 8,
          }}>
            {lang === 'vi' ? 'CHUYÊN ĐỀ NGỮ PHÁP' : 'GRAMMAR STUDY'}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700,
            letterSpacing: '-0.02em', color: 'var(--foam)',
          }}>
            {lang === 'vi' ? 'Ngữ pháp' : 'Grammar'}
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--silver)', marginTop: 6 }}>
            {lang === 'vi'
              ? `Hoàn thành ${metrics.done}/${metrics.total} câu hỏi · Điểm đúng: ${metrics.pct}%`
              : `Completed ${metrics.done}/${metrics.total} items · Accuracy: ${metrics.pct}%`
            }
          </p>
        </div>

        {/* Categories grid */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CATEGORIES.map((cat, i) => {
            const state = metrics.categories[cat] || { total: 0, done: 0, correct: 0 };
            const progressPct = state.total > 0 ? Math.round((state.done / state.total) * 100) : 0;
            const formattedName = formatCategoryName(cat);
            
            return (
              <button
                key={cat}
                onClick={() => handleStartTopic(cat)}
                className="glass-panel fade-up"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: '14px 18px',
                  width: '100%',
                  textAlign: 'left',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(18, 43, 59, 0.4)',
                  animationDelay: `${i * 0.03}s`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ 
                      fontFamily: 'var(--font-label)', 
                      fontSize: '0.74rem', 
                      color: 'var(--aqua)',
                      background: 'rgba(142, 216, 232, 0.08)',
                      padding: '2px 7px',
                      borderRadius: 6,
                      fontWeight: 700
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--foam)' }}>
                      {formattedName}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--silver)' }}>
                    {state.done}/{state.total} {lang === 'vi' ? 'câu' : 'q'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="progress-track" style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${progressPct}%`, 
                      background: progressPct === 100 
                        ? 'linear-gradient(90deg, var(--success), #9effd4)' 
                        : 'linear-gradient(90deg, var(--aqua), var(--foam))' 
                    }} 
                  />
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ height: 20 }} />
      </>
    );
  }

  // Render Summary view (Topic completed)
  if (viewMode === 'summary') {
    const total = topicQuestions.length;
    const answers = dbService.getGrammarAnswers();
    const correct = topicQuestions.filter(q => answers[q.id]?.correct).length;
    const formattedName = selectedTopic ? formatCategoryName(selectedTopic) : '';

    return (
      <div style={{ padding: 'calc(40px + env(safe-area-inset-top)) 16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '80vh' }}>
        <div className="fade-up" style={{ 
          background: 'rgba(18, 43, 59, 0.5)',
          border: '1px solid rgba(142, 216, 232, 0.15)',
          borderRadius: 28,
          padding: '30px 24px',
          width: '100%',
          maxWidth: 360,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'inline-flex', background: 'rgba(126, 224, 184, 0.1)', color: 'var(--success)', padding: 18, borderRadius: '50%', marginBottom: 18 }}>
            <Award size={48} strokeWidth={1.5} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--foam)', fontWeight: 700, margin: '0 0 8px 0' }}>
            {lang === 'vi' ? 'Hoàn thành chuyên đề!' : 'Topic Completed!'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--silver)', margin: '0 0 24px 0' }}>
            {formattedName}
          </p>

          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <div className="stat-glass" style={{ flex: 1 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--aqua)' }}>{total}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2 }}>{lang === 'vi' ? 'Tổng câu hỏi' : 'Total Items'}</div>
            </div>
            <div className="stat-glass" style={{ flex: 1 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>{correct}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2 }}>{lang === 'vi' ? 'Trả lời đúng' : 'Correct'}</div>
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%' }}
            onClick={() => setViewMode('dashboard')}
          >
            {lang === 'vi' ? 'Quay lại danh sách' : 'Back to Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  // Render Practice view
  const parsed = parsePassage(currentQuestion.question);
  const userAns = dbService.getGrammarAnswers()[currentQuestion.id];
  const isQuestionAnswered = chosen !== null || userAns !== undefined;
  const activeChoice = chosen || (userAns ? userAns.chosen : null);
  const isChoiceCorrect = activeChoice === currentQuestion.answer;

  return (
    <div style={{ padding: 'calc(16px + env(safe-area-inset-top)) 16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <button 
          onClick={() => setViewMode('dashboard')}
          style={{
            background: 'none', border: 'none', color: 'var(--silver)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 0', fontSize: '0.8rem', fontWeight: 600
          }}
        >
          <ChevronLeft size={16} />
          {lang === 'vi' ? 'Trở lại' : 'Back'}
        </button>
        <span style={{ fontSize: '0.68rem', color: 'var(--silver)', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {formatCategoryName(currentQuestion.category)}
        </span>
        <span style={{ fontSize: '0.74rem', color: 'var(--aqua)', fontFamily: 'var(--font-label)', fontWeight: 700 }}>
          {qIdx + 1}/{topicQuestions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-track" style={{ height: 3, marginBottom: 8 }}>
        <div 
          className="progress-fill" 
          style={{ width: `${((qIdx + 1) / topicQuestions.length) * 100}%` }} 
        />
      </div>

      {/* Main Question Practice Panel */}
      <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Render passage block if Part 6 */}
        {parsed.isPassage && (
          <div className="glass-panel" style={{ 
            padding: '14px 18px', 
            borderRadius: 18, 
            background: 'rgba(12, 31, 44, 0.45)',
            maxHeight: '200px', 
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <p style={{ 
              fontSize: '0.78rem', 
              color: 'var(--foam)', 
              lineHeight: 1.55, 
              whiteSpace: 'pre-line',
              textAlign: 'left',
              margin: 0
            }}>
              {parsed.passage}
            </p>
          </div>
        )}

        {/* Question Prompt */}
        <div className="glass-panel" style={{ 
          padding: '16px 20px', 
          borderRadius: 20, 
          background: 'rgba(18, 43, 59, 0.55)',
          border: '1px solid rgba(142, 216, 232, 0.12)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          textAlign: 'left'
        }}>
          <span style={{ 
            fontSize: '0.58rem', 
            fontFamily: 'var(--font-label)', 
            color: 'var(--aqua)', 
            fontWeight: 700, 
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 6
          }}>
            {lang === 'vi' ? 'CÂU HỎI LUYỆN ÔN' : 'PRACTICE QUESTION'}
          </span>
          <p style={{ 
            fontSize: '0.88rem', 
            color: 'var(--foam)', 
            lineHeight: 1.5, 
            fontWeight: 500,
            margin: 0
          }}>
            {parsed.prompt}
          </p>
        </div>

        {/* 4 Choices (A, B, C, D) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currentQuestion.options.map(opt => {
            const letter = opt.charAt(0); // 'A', 'B', 'C', 'D'
            const isCorrectAnswer = letter === currentQuestion.answer;
            const isChosenAnswer = letter === activeChoice;
            
            let buttonClass = 'quiz-option';
            let styleOverride: React.CSSProperties = {
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              fontSize: '0.82rem',
              justifyContent: 'flex-start',
              fontWeight: 500
            };

            if (isQuestionAnswered) {
              if (isCorrectAnswer) {
                buttonClass += ' correct';
              } else if (isChosenAnswer) {
                buttonClass += ' wrong';
              }
            }

            return (
              <button
                key={opt}
                className={buttonClass}
                style={styleOverride}
                onClick={() => handleChoose(letter)}
                disabled={isQuestionAnswered}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation and AI Coach overlay */}
        {isQuestionAnswered && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Vietnamese Explanation box */}
            <div className="glass-panel" style={{ 
              padding: '12px 16px', 
              borderRadius: 14, 
              textAlign: 'left', 
              borderLeft: `3px solid ${isChoiceCorrect ? 'var(--success)' : 'var(--danger)'}`,
              fontSize: '0.74rem',
              lineHeight: 1.45
            }}>
              <div style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '0.92rem', 
                fontWeight: 700, 
                color: isChoiceCorrect ? 'var(--success)' : 'var(--danger)',
                marginBottom: 6 
              }}>
                {isChoiceCorrect 
                  ? (lang === 'vi' ? 'Chính xác!' : 'Correct Answer!') 
                  : (lang === 'vi' ? `Chưa đúng (Đáp án đúng: ${currentQuestion.answer})` : `Incorrect (Correct: ${currentQuestion.answer})`)
                }
              </div>
              <p style={{ color: 'var(--foam)', margin: 0 }}>
                {currentQuestion.explanation}
              </p>
            </div>

            {/* AI Coach Integration Box */}
            <AiGrammarCoachBox item={currentQuestion} chosen={activeChoice} />

            {/* Next button */}
            <button className="btn-primary" onClick={handleNext} style={{ width: '100%', marginTop: 4 }}>
              {lang === 'vi' ? 'Tiếp tục' : 'Continue'}
              <ChevronRight size={15} strokeWidth={2.5} style={{ marginLeft: 3 }} />
            </button>
          </div>
        )}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );
}

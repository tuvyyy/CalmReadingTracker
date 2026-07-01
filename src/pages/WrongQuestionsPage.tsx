// src/pages/WrongQuestionsPage.tsx
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Check, ChevronLeft, ChevronRight, RotateCcw, Shuffle, Trash2, X } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { dbService } from '../services/dbService';
import type { PracticeQuestion } from '../services/part5PracticeData';

type ErrorType = 'grammar' | 'vocab' | 'reading' | 'careless';
type PartNum   = 5 | 6 | 7;
type Letter    = 'A' | 'B' | 'C' | 'D';

interface WQ {
  id:         number;
  questionNo: number;
  part:       PartNum;
  chosen:     Letter;
  correct:    Letter;
  errorType:  ErrorType;
  note:       string;
  testTitle:  string;
  testId?:    string;
  question?:  string;
  options?:   PracticeQuestion['options'];
  explanation?: string;
  translation?: string;
  vocabulary?: string[];
}

interface QuizItem extends WQ {
  detail: PracticeQuestion | null;
}

const LETTERS: Letter[] = ['A', 'B', 'C', 'D'];

const ERROR_META: Record<ErrorType, { labelKey: 'error_grammar' | 'error_vocab' | 'error_reading' | 'error_careless'; color: string; bg: string }> = {
  grammar:  { labelKey: 'error_grammar',  color: 'var(--cyan)',    bg: 'rgba(110, 231, 249, 0.08)' },
  vocab:    { labelKey: 'error_vocab',    color: 'var(--aqua)',    bg: 'rgba(142, 216, 232, 0.08)' },
  reading:  { labelKey: 'error_reading',  color: '#ffd68f',        bg: 'rgba(255, 214, 143, 0.06)' },
  careless: { labelKey: 'error_careless', color: 'var(--danger)',  bg: 'rgba(255, 139, 139, 0.08)' },
};

const PART_COLORS: Record<PartNum, string> = {
  5: 'var(--aqua)',
  6: 'var(--cyan)',
  7: 'var(--mist)',
};

type FilterKey = 'all' | ErrorType;

function shuffleList<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function getDetail(item: QuizItem) {
  return item.detail || {
    questionNo: item.questionNo,
    part: item.part,
    question: item.question || `Câu ${item.questionNo} · ${item.testTitle}`,
    options: item.options || LETTERS.map(letter => ({ letter, text: `Đáp án ${letter}` })),
    answer: item.correct,
    explanation: item.explanation || item.note,
    translation: item.translation,
    vocabulary: item.vocabulary,
  };
}

export default function WrongQuestionsPage() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [wrongList, setWrongList] = useState<WQ[]>(() => dbService.getWrongQuestions());
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Letter>>({});

  const FILTERS = [
    { key: 'all' as FilterKey,      label: t('wrong', 'filter_all')     },
    { key: 'grammar' as FilterKey,  label: t('wrong', 'filter_grammar') },
    { key: 'vocab' as FilterKey,    label: t('wrong', 'filter_vocab')   },
    { key: 'reading' as FilterKey,  label: t('wrong', 'filter_reading') },
    { key: 'careless' as FilterKey, label: t('wrong', 'filter_careless')},
  ];

  const filtered = filter === 'all' ? wrongList : wrongList.filter(q => q.errorType === filter);

  const quizScore = useMemo(() => {
    return quizItems.reduce((score, item) => score + (quizAnswers[item.id] === item.correct ? 1 : 0), 0);
  }, [quizAnswers, quizItems]);

  const handleDelete = (id: number) => {
    dbService.deleteWrongQuestion(id);
    const nextList = dbService.getWrongQuestions();
    setWrongList(nextList);
    setQuizItems(prev => prev.filter(item => item.id !== id));
  };

  const handleShuffleQuiz = () => {
    const source = filtered.length > 0 ? filtered : wrongList;
    if (source.length === 0) return;
    const next = shuffleList(source).map(item => ({
      ...item,
      detail: dbService.getWrongQuestionDetail(item),
    }));
    setQuizItems(next);
    setQuizIndex(0);
    setQuizAnswers({});
  };

  const closeQuiz = () => {
    setQuizItems([]);
    setQuizIndex(0);
    setQuizAnswers({});
  };

  const restartQuiz = () => {
    setQuizItems(prev => shuffleList(prev));
    setQuizIndex(0);
    setQuizAnswers({});
  };

  const currentQuiz = quizItems[quizIndex];
  const currentDetail = currentQuiz ? getDetail(currentQuiz) : null;
  const currentSelected = currentQuiz ? quizAnswers[currentQuiz.id] : undefined;
  const answeredCount = Object.keys(quizAnswers).length;

  return (
    <>
      {/* Header */}
      <div className="page-title-section" style={{ paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--aqua)', marginBottom: 8,
          }}>
            {lang === 'vi' ? 'SỔ TAY CÁ NHÂN' : 'MISTAKES JOURNAL'}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700,
            letterSpacing: '-0.02em', color: 'var(--foam)', margin: 0
          }}>
            {lang === 'vi' ? 'Câu đã sai' : 'Mistakes'}
          </h1>
        </div>

        {wrongList.length > 0 && (
          <button
            className="btn-primary btn-sm"
            style={{ gap: 6, width: 'auto' }}
            onClick={handleShuffleQuiz}
          >
            <Shuffle size={15} strokeWidth={2.2} />
            {t('wrong', 'quiz_btn')} · {filtered.length || wrongList.length}
          </button>
        )}
      </div>

      {/* Chips */}
      <div className="chip-row" style={{ marginBottom: 16 }}>
        {FILTERS.map(({ key, label }) => {
          const count = key === 'all'
            ? wrongList.length
            : wrongList.filter(q => q.errorType === key).length;
          return (
            <button
              key={key}
              className={`chip${filter === key ? ' active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
              {count > 0 && (
                <span
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.62rem', fontWeight: 700,
                    background: filter === key ? 'rgba(255,255,255,0.22)' : 'var(--bg-3)',
                    color: filter === key ? 'var(--ink)' : 'var(--silver)',
                    padding: '1px 6px', borderRadius: 999, marginLeft: 4,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{
            padding: '50px 24px',
            borderRadius: 24,
            background: 'rgba(18, 43, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            textAlign: 'center',
            marginTop: 20
          }}>
            <div className="empty-state__icon" style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'rgba(126, 224, 184, 0.08)',
              color: 'var(--success)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(126, 224, 184, 0.15)',
              marginBottom: 16
            }}>
              <Check size={32} strokeWidth={1.8} />
            </div>
            <div className="empty-state__title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--foam)', fontWeight: 700 }}>
              {lang === 'vi' ? 'Sổ tay sạch lỗi!' : 'Mistake-Free!'}
            </div>
            <div className="empty-state__sub" style={{ fontSize: '0.78rem', color: 'var(--silver)', maxWidth: 300, margin: '6px auto 0', lineHeight: 1.5 }}>
              {lang === 'vi'
                ? 'Hiện tại bạn không có lỗi sai nào. Khi làm bài thi thử hoặc luyện tập mà trả lời sai, các câu đó sẽ được lưu ở đây.'
                : 'You have no saved mistakes. Incorrect questions from practice tests will automatically appear here.'
              }
            </div>
          </div>
        ) : (
          filtered.map((q, i) => {
            const meta = ERROR_META[q.errorType] || ERROR_META.grammar;
            const errorLabel = t('wrong', meta.labelKey);
            return (
              <div
                key={q.id}
                className="wrong-card fade-up"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  background: 'rgba(18, 43, 59, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 20,
                  padding: 18
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <span className="wrong-card__qno" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--foam)', fontSize: '1.1rem' }}>#{q.questionNo}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--silver)', marginLeft: 8 }}>
                      · {q.testTitle}
                    </span>
                  </div>
                  <span
                    className="wrong-card__part-tag"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: PART_COLORS[q.part] || 'var(--aqua)',
                      border: `1px solid var(--line)`,
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-label)'
                    }}
                  >
                    Part {q.part}
                  </span>
                </div>

                <div className="ans-compare" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="ans-bubble ans-bubble--wrong" style={{
                    flex: 1,
                    background: 'rgba(255, 139, 139, 0.08)',
                    border: '1px solid rgba(255, 139, 139, 0.25)',
                    padding: '8px 12px',
                    borderRadius: 10,
                    textAlign: 'center'
                  }}>
                    <span className="ans-bubble__label" style={{ display: 'block', fontSize: '0.58rem', textTransform: 'uppercase', color: 'var(--silver)', marginBottom: 2 }}>{t('wrong', 'chosen')}</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--danger)' }}>{q.chosen}</strong>
                  </div>
                  <ArrowRight size={14} color="var(--silver)" />
                  <div className="ans-bubble ans-bubble--correct" style={{
                    flex: 1,
                    background: 'rgba(126, 224, 184, 0.08)',
                    border: '1px solid rgba(126, 224, 184, 0.25)',
                    padding: '8px 12px',
                    borderRadius: 10,
                    textAlign: 'center'
                  }}>
                    <span className="ans-bubble__label" style={{ display: 'block', fontSize: '0.58rem', textTransform: 'uppercase', color: 'var(--silver)', marginBottom: 2 }}>{t('wrong', 'correct')}</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--success)' }}>{q.correct}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <span
                    className="error-tag"
                    style={{
                      background: meta.bg,
                      color: meta.color,
                      border: `1px solid ${meta.color}25`,
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: '0.64rem',
                      fontWeight: 700
                    }}
                  >
                    {errorLabel}
                  </span>
                </div>

                {q.note && (
                  <p className="wrong-card__note" style={{ fontSize: '0.78rem', color: 'var(--silver)', fontStyle: 'italic', margin: '0 0 14px 0', lineHeight: 1.45 }}>"{q.note}"</p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
                  <button
                    className="reviewed-btn"
                    style={{
                      background: 'rgba(255, 139, 139, 0.05)',
                      color: 'var(--danger)',
                      border: '1px solid rgba(255, 139, 139, 0.2)',
                      borderRadius: 10,
                      padding: '6px 12px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                    onClick={() => handleDelete(q.id)}
                  >
                    <Trash2 size={13} strokeWidth={2.2} />
                    {lang === 'vi' ? 'Xóa khỏi sổ tay' : 'Delete mistake'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {currentQuiz && currentDetail && createPortal(
        <div className="modal-overlay" onClick={closeQuiz}>
          <div
            className="modal-sheet"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '88vh', overflowY: 'auto', padding: '24px 20px', textAlign: 'left' }}
          >
            <div className="modal-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
              <div>
                <p style={{ margin: 0, fontFamily: 'var(--font-label)', fontSize: '0.64rem', color: 'var(--aqua)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {lang === 'vi' ? 'QUIZ ÔN LỖI SAI' : 'MISTAKE QUIZ'}
                </p>
                <h2 style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--foam)' }}>
                  {quizIndex + 1}/{quizItems.length} · {quizScore}/{answeredCount || 0}
                </h2>
              </div>
              <button className="icon-btn" onClick={closeQuiz} aria-label="Close quiz">
                <X size={18} />
              </button>
            </div>

            <div style={{
              borderRadius: 18,
              padding: '16px 16px 18px',
              background: 'rgba(9, 31, 43, 0.72)',
              border: '1px solid rgba(142, 216, 232, 0.14)',
              marginBottom: 14,
            }}>
              <div style={{ color: 'var(--aqua)', fontSize: '0.66rem', fontFamily: 'var(--font-label)', fontWeight: 800, letterSpacing: '0.08em', marginBottom: 10 }}>
                PART {currentQuiz.part} · CÂU {currentQuiz.questionNo}
              </div>
              <p style={{ margin: 0, color: 'var(--foam)', fontWeight: 800, lineHeight: 1.55, fontSize: '1rem' }}>
                {currentDetail.question}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {currentDetail.options.map(option => {
                const isSelected = currentSelected === option.letter;
                const isCorrect = option.letter === currentQuiz.correct;
                let className = 'quiz-option';
                if (currentSelected) {
                  if (isCorrect) className = 'quiz-option correct';
                  else if (isSelected) className = 'quiz-option wrong';
                } else if (isSelected) {
                  className = 'quiz-option active';
                }
                return (
                  <button
                    key={option.letter}
                    className={className}
                    onClick={() => {
                      if (currentSelected) return;
                      setQuizAnswers(prev => ({ ...prev, [currentQuiz.id]: option.letter }));
                    }}
                    style={{ minHeight: 52, justifyContent: 'flex-start', textAlign: 'left' }}
                  >
                    ({option.letter}) {option.text}
                  </button>
                );
              })}
            </div>

            {currentSelected && (
              <div style={{
                marginTop: 14,
                borderRadius: 16,
                padding: 14,
                background: currentSelected === currentQuiz.correct ? 'rgba(126, 224, 184, 0.08)' : 'rgba(255, 139, 139, 0.07)',
                border: `1px solid ${currentSelected === currentQuiz.correct ? 'rgba(126, 224, 184, 0.24)' : 'rgba(255, 139, 139, 0.22)'}`,
              }}>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--silver)', fontFamily: 'var(--font-label)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {lang === 'vi' ? 'Đáp án' : 'Answer'}
                    </span>
                    <strong style={{ color: 'var(--foam)' }}>{currentQuiz.correct}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--aqua)', fontFamily: 'var(--font-label)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {lang === 'vi' ? 'Mấu chốt' : 'Key point'}
                    </span>
                    <p style={{ margin: '4px 0 0', color: 'var(--silver)', lineHeight: 1.55, fontSize: '0.82rem' }}>
                      {currentDetail.explanation || currentQuiz.note}
                    </p>
                  </div>
                  {currentDetail.translation && (
                    <div>
                      <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--success)', fontFamily: 'var(--font-label)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {lang === 'vi' ? 'Dịch' : 'Translation'}
                      </span>
                      <p style={{ margin: '4px 0 0', color: 'var(--silver)', lineHeight: 1.55, fontSize: '0.82rem' }}>
                        {currentDetail.translation}
                      </p>
                    </div>
                  )}
                  {currentDetail.vocabulary && currentDetail.vocabulary.length > 0 && (
                    <div>
                      <span style={{ display: 'block', fontSize: '0.62rem', color: '#ffd68f', fontFamily: 'var(--font-label)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {lang === 'vi' ? 'Từ vựng' : 'Vocabulary'}
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {currentDetail.vocabulary.map(word => (
                          <span key={word} style={{ borderRadius: 999, padding: '4px 8px', background: 'rgba(255,255,255,0.06)', color: 'var(--silver)', fontSize: '0.72rem' }}>
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', gap: 10, marginTop: 18 }}>
              <button
                className="btn-secondary"
                onClick={() => setQuizIndex(prev => Math.max(0, prev - 1))}
                disabled={quizIndex === 0}
                aria-label="Previous question"
                style={{ padding: 0, height: 44, minHeight: 44 }}
              >
                <ChevronLeft size={18} />
              </button>
              <button className="btn-secondary" onClick={restartQuiz} style={{ gap: 8 }}>
                <RotateCcw size={15} />
                {lang === 'vi' ? 'Làm lại vòng này' : 'Restart quiz'}
              </button>
              <button
                className="btn-primary"
                onClick={() => setQuizIndex(prev => Math.min(quizItems.length - 1, prev + 1))}
                disabled={quizIndex === quizItems.length - 1}
                aria-label="Next question"
                style={{ padding: 0, height: 44, minHeight: 44 }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <div style={{ height: 20 }} />
    </>
  );
}

// src/pages/PracticePage.tsx
import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, CheckCheck } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { audioService } from '../services/audioService';
import { dbService } from '../services/dbService';
import { PART5_PRACTICE_TEST_ID, type PracticeQuestion } from '../services/part5PracticeData';

type Letter = 'A' | 'B' | 'C' | 'D';

interface QA {
  questionNo: number;
  selected: Letter | null;
}

interface ResultData {
  total: number;
  correct: number;
  part5: { correct: number; total: number };
  part6: { correct: number; total: number };
  part7: { correct: number; total: number };
}

const LETTERS: Letter[] = ['A', 'B', 'C', 'D'];
const PART5_TIME_OPTIONS = [8, 12, 15, 20, 25, 30] as const;
const TOTAL   = 100;
const START_Q = 101;

function getPart(n: number): 5 | 6 | 7 {
  if (n <= 130) return 5;
  if (n <= 146) return 6;
  return 7;
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function getPart5Minutes(raw: string | null) {
  const minutes = Number(raw);
  return PART5_TIME_OPTIONS.includes(minutes as typeof PART5_TIME_OPTIONS[number]) ? minutes : 15;
}

interface AnswerRowProps {
  questionNo: number;
  selected: Letter | null;
  correct: Letter;
  submitted: boolean;
  onSelect: (qno: number, l: Letter) => void;
}

const AnswerRow = memo(function AnswerRow({
  questionNo,
  selected,
  correct,
  submitted,
  onSelect,
}: AnswerRowProps) {
  const answered = selected !== null;
  return (
    <div className={`answer-row${answered ? ' answered' : ''}`}>
      <span className="answer-row__num">{questionNo}</span>
      <div className="answer-choices">
        {LETTERS.map(l => {
          const isSel = selected === l;
          let cls = 'answer-choice';
          if (submitted) {
            if (l === correct) cls += ' correct-reveal';
            else if (isSel)   cls += ' wrong';
          } else if (isSel) {
            cls += ' active';
          }
          return (
            <button
              key={l}
              className={cls}
              onClick={() => onSelect(questionNo, l)}
              disabled={submitted}
              aria-label={`Câu ${questionNo}: ${l}`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
});

interface QuestionCardProps {
  item: PracticeQuestion;
  selected: Letter | null;
  submitted: boolean;
  onSelect: (qno: number, l: Letter) => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}

const QuestionCard = memo(function QuestionCard({
  item,
  selected,
  submitted,
  onSelect,
  cardRef,
}: QuestionCardProps) {
  const answered = selected !== null;
  const correctOption = item.options.find(option => option.letter === item.answer);

  return (
    <div
      className="glass-panel fade-up practice-question-card"
      ref={cardRef}
      style={{
        padding: '18px 20px',
        borderRadius: 20,
        background: answered && !submitted ? 'rgba(18, 57, 74, 0.58)' : 'rgba(18, 43, 59, 0.45)',
        border: answered
          ? '1px solid rgba(142, 216, 232, 0.32)'
          : '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'left',
        scrollMarginTop: 128,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-label)', color: 'var(--aqua)', fontWeight: 800, letterSpacing: '0.08em' }}>
          PART {item.part} · CÂU {item.questionNo}
        </span>
        {submitted && (
          <span style={{
            fontSize: '0.66rem',
            fontWeight: 800,
            color: selected === item.answer ? 'var(--success)' : 'var(--danger)',
          }}>
            {selected === item.answer ? 'Đúng' : `Sai · Đáp án ${item.answer}`}
          </span>
        )}
      </div>

      <p className="practice-question-text" style={{
        fontSize: '0.95rem',
        lineHeight: 1.55,
        fontWeight: 700,
        color: 'var(--foam)',
        margin: '0 0 14px',
      }}>
        {item.question}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {item.options.map(option => {
          const isSelected = selected === option.letter;
          const isCorrect = item.answer === option.letter;
          let className = 'quiz-option';

          if (submitted) {
            if (isCorrect) className = 'quiz-option correct';
            else if (isSelected) className = 'quiz-option wrong';
          } else if (isSelected) {
            className += ' active';
          }

          return (
            <button
              key={`${item.questionNo}-${option.letter}`}
              type="button"
              className={className}
              disabled={submitted}
              onClick={() => onSelect(item.questionNo, option.letter)}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '14px 16px',
                fontSize: '0.82rem',
                lineHeight: 1.45,
                minHeight: 52,
              }}
            >
              ({option.letter}) {option.text}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="practice-explain">
          <div className="practice-explain__block practice-explain__answer">
            <span>Đáp án</span>
            <strong>{item.answer}{correctOption ? ` · ${correctOption.text}` : ''}</strong>
          </div>
          <div className="practice-explain__block">
            <span>Mấu chốt</span>
            <p>{item.explanation}</p>
          </div>
          {item.translation && (
            <div className="practice-explain__block">
              <span>Dịch</span>
              <p>{item.translation}</p>
            </div>
          )}
          {item.vocabulary && item.vocabulary.length > 0 && (
            <div className="practice-explain__block">
              <span>Từ vựng</span>
              <div className="practice-explain__vocab">
                {item.vocabulary.map(vocab => (
                  <em key={vocab}>{vocab}</em>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ── Result Sheet Modal ──────────────────────────
function ResultSheet({
  result,
  onClose,
  onShowWrongOnly,
  onRetryWrong,
  wrongCount,
}: {
  result: ResultData;
  onClose: () => void;
  onShowWrongOnly: () => void;
  onRetryWrong: () => void;
  wrongCount: number;
}) {
  const nav = useNavigate();
  const { t, lang } = useLang();
  const pct = Math.round((result.correct / result.total) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="result-score">
          <div className="result-score__pct">{pct}%</div>
          <div className="result-score__label">
            {t('practice', 'result_correct').replace('{correct}', String(result.correct)).replace('{total}', String(result.total))}&nbsp;·&nbsp;
            {pct >= 80 ? t('practice', 'excellent') : pct >= 60 ? t('practice', 'good') : t('practice', 'keep_going')}
          </div>
        </div>

        <div className="result-parts">
          {([
            { label: 'Part 5', d: result.part5 },
            { label: 'Part 6', d: result.part6 },
            { label: 'Part 7', d: result.part7 },
          ] as const).filter(({ d }) => d.total > 0).map(({ label, d }) => (
            <div key={label} className="result-part-cell">
              <div className="result-part-cell__label">{label}</div>
              <div className="result-part-cell__val">{d.correct}/{d.total}</div>
              <div className="result-part-cell__pct">
                {Math.round((d.correct / (d.total || 1)) * 100)}%
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-primary" onClick={onClose}>{t('practice', 'view_answers')}</button>
          <button className="btn-secondary" disabled={wrongCount === 0} onClick={onShowWrongOnly}>
            {lang === 'vi' ? `Chỉ xem câu sai (${wrongCount})` : `Review wrong only (${wrongCount})`}
          </button>
          <button className="btn-secondary" disabled={wrongCount === 0} onClick={onRetryWrong}>
            {lang === 'vi' ? 'Làm lại câu sai' : 'Retry wrong answers'}
          </button>
          <button className="btn-secondary" onClick={() => nav('/wrong')}>{t('practice', 'view_wrong')}</button>
          <button
            className="btn-secondary"
            style={{ color: 'var(--silver)' }}
            onClick={() => nav('/tests')}
          >
            {t('practice', 'back_to_list')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────
export default function PracticePage() {
  const nav         = useNavigate();
  const { t, lang } = useLang();
  const { testId }  = useParams<{ testId: string }>();
  const [showConfirm, setShowConfirm] = useState(false);
  const activeTestId = testId || PART5_PRACTICE_TEST_ID;
  const correctAnswers = useMemo(() => dbService.getAnswerKey(activeTestId), [activeTestId]);
  const questionSet = useMemo(() => dbService.getPracticeQuestions(activeTestId), [activeTestId]);
  const questionMap = useMemo(() => {
    return new Map(questionSet.map(item => [item.questionNo, item]));
  }, [questionSet]);
  const hasQuestionSet = questionSet.length > 0;
  
  const matchedTest = useMemo(() => {
    return dbService.getTests().find(t => t.id === testId);
  }, [testId]);
  
  const title = matchedTest ? matchedTest.title : 'Practice Test';

  const [searchParams] = useSearchParams();
  const partParam = searchParams.get('part') || (hasQuestionSet ? '5' : 'all'); // 'all' | '5' | '6' | '7'
  const minutesParam = searchParams.get('minutes');

  // Determine active questions range
  const activeRange = useMemo(() => {
    if (partParam === '5') return { start: 101, end: 130, total: 30, limitSecs: getPart5Minutes(minutesParam) * 60 };
    if (partParam === '6') return { start: 131, end: 146, total: 16, limitSecs: 10 * 60 };
    if (partParam === '7') return { start: 147, end: 200, total: 54, limitSecs: 50 * 60 };
    return { start: 101, end: 200, total: 100, limitSecs: 75 * 60 };
  }, [partParam, minutesParam]);

  const [answers, setAnswers] = useState<QA[]>(() =>
    Array.from({ length: TOTAL }, (_, i) => ({ questionNo: START_Q + i, selected: null }))
  );
  const [timeLeft,  setTimeLeft]  = useState(activeRange.limitSecs);
  const [submitted, setSubmitted] = useState(false);
  const [result,    setResult]    = useState<ResultData | null>(null);
  const [showWrongOnly, setShowWrongOnly] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Synchronize initial timer limit on range load
  useEffect(() => {
    setTimeLeft(activeRange.limitSecs);
    setShowWrongOnly(false);
    setShowTimeUp(false);
  }, [activeRange]);

  useEffect(() => {
    if (submitted || showTimeUp || timeLeft <= 0) return;
    const id = setInterval(() =>
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id);
          setShowTimeUp(true);
          return 0;
        }
        return t - 1;
      }), 1000);
    return () => clearInterval(id);
  }, [submitted, showTimeUp, timeLeft]);

  const doSubmit = useCallback(() => {
    setSubmitted(true);
    setShowTimeUp(false);
    let correct = 0;
    const p5 = { correct: 0, total: partParam === '5' ? 30 : 0 };
    const p6 = { correct: 0, total: partParam === '6' ? 16 : 0 };
    const p7 = { correct: 0, total: partParam === '7' ? 54 : 0 };
    if (partParam === 'all') {
      p5.total = 30;
      p6.total = 16;
      p7.total = 54;
    }

    answers.forEach(({ questionNo, selected }) => {
      // Only grade questions in the active part range
      if (questionNo < activeRange.start || questionNo > activeRange.end) return;

      const corr = correctAnswers[questionNo];
      const p = getPart(questionNo);
      if (selected === corr) {
        correct++;
        if (p === 5) p5.correct++;
        else if (p === 6) p6.correct++;
        else p7.correct++;
      } else if (selected !== null) {
        // Log mistake dynamically!
        dbService.saveWrongQuestion(
          `${title} (Part ${p})`,
          questionNo,
          p,
          selected,
          corr
        );
      }
    });

    setResult({ total: activeRange.total, correct, part5: p5, part6: p6, part7: p7 });
    
    // Play correct/incorrect sounds
    const pctCorrect = Math.round((correct / activeRange.total) * 100);
    audioService.playFeedbackSound(pctCorrect >= 70);
    
    dbService.saveResult(activeTestId, correct, activeRange.total, partParam);
  }, [answers, activeTestId, correctAnswers, title, activeRange, partParam]);

  const handleSelect = useCallback((qno: number, l: Letter) => {
    if (submitted) return;
    setAnswers(prev =>
      prev.map(a => a.questionNo === qno
        ? { ...a, selected: a.selected === l ? null : l }
        : a)
    );
    audioService.playTapSound();
  }, [submitted]);

  // Calculations only for active questions subset
  const activeAnswers = useMemo(() => {
    return answers.filter(a => a.questionNo >= activeRange.start && a.questionNo <= activeRange.end);
  }, [answers, activeRange]);

  const wrongAnswers = useMemo(() => {
    if (!submitted) return [];
    return activeAnswers.filter(({ questionNo, selected }) => selected !== correctAnswers[questionNo]);
  }, [activeAnswers, correctAnswers, submitted]);

  const scrollToQuestion = useCallback((questionNo: number) => {
    questionRefs.current[questionNo]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const showWrongReview = useCallback(() => {
    setResult(null);
    setShowWrongOnly(true);
    window.setTimeout(() => {
      const firstWrong = wrongAnswers[0]?.questionNo;
      if (firstWrong) scrollToQuestion(firstWrong);
    }, 50);
  }, [scrollToQuestion, wrongAnswers]);

  const retryWrongAnswers = useCallback(() => {
    const wrongSet = new Set(wrongAnswers.map(item => item.questionNo));
    if (wrongSet.size === 0) return;

    setAnswers(prev => prev.map(answer =>
      wrongSet.has(answer.questionNo)
        ? { ...answer, selected: null }
        : answer
    ));
    setSubmitted(false);
    setResult(null);
    setShowWrongOnly(false);
    setShowTimeUp(false);
    setTimeLeft(activeRange.limitSecs);

    window.setTimeout(() => {
      const firstWrong = wrongAnswers[0]?.questionNo;
      if (firstWrong) scrollToQuestion(firstWrong);
    }, 50);
  }, [activeRange.limitSecs, scrollToQuestion, wrongAnswers]);

  const getVisibleAnswers = useCallback((list: QA[]) => {
    if (!submitted || !showWrongOnly) return list;
    return list.filter(({ questionNo, selected }) => selected !== correctAnswers[questionNo]);
  }, [correctAnswers, showWrongOnly, submitted]);

  const done    = activeAnswers.filter(a => a.selected !== null).length;
  const warn    = timeLeft < 5 * 60;
  const danger  = timeLeft < 2 * 60;
  const pct     = Math.round((done / activeRange.total) * 100);

  const part5   = useMemo(() => answers.filter(a => a.questionNo <= 130), [answers]);
  const part6   = useMemo(() => answers.filter(a => a.questionNo >= 131 && a.questionNo <= 146), [answers]);
  const part7   = useMemo(() => answers.filter(a => a.questionNo >= 147), [answers]);

  const renderSection = (
    label: string,
    range: string,
    sub: string,
    qs: QA[],
  ) => {
    if (qs.length === 0) return null;
    const sectionDone = qs.filter(a => a.selected !== null).length;
    return (
      <div className="answer-sheet-card">
        <div className="part-section__header">
          <div>
            <span className="part-section__title">{label}</span>
            <span style={{ fontFamily: 'var(--font-label)', marginLeft: 8, fontSize: '0.68rem', color: 'var(--silver)', fontWeight: 500 }}>
              · {range} · {sub}
            </span>
          </div>
          <span className="part-section__count">
            {sectionDone}/{qs.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: hasQuestionSet ? 12 : 0 }}>
          {qs.map(({ questionNo, selected }) => {
            const questionDetail = questionMap.get(questionNo);
            if (questionDetail) {
              return (
                <QuestionCard
                  key={questionNo}
                  item={questionDetail}
                  selected={selected}
                  submitted={submitted}
                  onSelect={handleSelect}
                  cardRef={node => {
                    questionRefs.current[questionNo] = node;
                  }}
                />
              );
            }

            return (
              <div
                key={questionNo}
                ref={node => {
                  questionRefs.current[questionNo] = node;
                }}
                style={{ scrollMarginTop: 128 }}
              >
                <AnswerRow
                  questionNo={questionNo}
                  selected={selected}
                  correct={correctAnswers[questionNo] as Letter}
                  submitted={submitted}
                  onSelect={handleSelect}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="water-bg practice-screen">
      {/* ── Sticky glass header ── */}
      <div className="practice-header">
        <div className="practice-header__row1">
          <button
            className="practice-back-btn"
            onClick={() => nav('/tests')}
            aria-label={t('practice', 'back')}
          >
            <ChevronLeft size={18} />
          </button>

          <span className="practice-title">{title}</span>

          <div className={`timer-pill${timeLeft === 0 ? ' expired' : danger ? ' danger' : warn ? ' warn' : ''}`}>
            {fmt(timeLeft)}
          </div>
        </div>

        <div className="practice-header__row2">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-text" style={{ marginLeft: 8 }}>
            {t('practice', 'progress').replace('{done}', String(done)).replace('{total}', String(activeRange.total))}
          </span>
        </div>

        <div className="question-nav-strip" aria-label="Chuyển nhanh câu hỏi">
          {activeAnswers.map(({ questionNo, selected }) => {
            const isAnswered = selected !== null;
            const isCorrect = submitted && selected === correctAnswers[questionNo];
            const isWrong = submitted && selected !== correctAnswers[questionNo];

            return (
              <button
                key={questionNo}
                type="button"
                className={[
                  'question-nav-button',
                  isAnswered ? 'answered' : '',
                  isCorrect ? 'correct' : '',
                  isWrong ? 'wrong' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => scrollToQuestion(questionNo)}
                aria-label={`Đến câu ${questionNo}`}
              >
                {questionNo}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Answer sheet ── */}
      <div className="answer-sheet">
        {submitted && (
          <div className="review-toolbar">
            <button
              type="button"
              className={`chip${!showWrongOnly ? ' active' : ''}`}
              onClick={() => setShowWrongOnly(false)}
            >
              {lang === 'vi' ? 'Tất cả câu' : 'All questions'}
            </button>
            <button
              type="button"
              className={`chip${showWrongOnly ? ' active' : ''}`}
              onClick={() => setShowWrongOnly(true)}
            >
              {lang === 'vi' ? `Chỉ câu sai (${wrongAnswers.length})` : `Wrong only (${wrongAnswers.length})`}
            </button>
            <button
              type="button"
              className="chip"
              disabled={wrongAnswers.length === 0}
              onClick={retryWrongAnswers}
            >
              {lang === 'vi' ? 'Làm lại câu sai' : 'Retry wrong'}
            </button>
          </div>
        )}

        {submitted && showWrongOnly && wrongAnswers.length === 0 && (
          <div className="glass-panel practice-empty-review">
            {lang === 'vi' ? 'Không có câu sai trong lượt này.' : 'No wrong answers in this attempt.'}
          </div>
        )}

        {(partParam === 'all' || partParam === '5') && renderSection('PART 5', '101 – 130', 'Incomplete Sentences', getVisibleAnswers(part5))}
        {(partParam === 'all' || partParam === '6') && renderSection('PART 6', '131 – 146', 'Text Completion', getVisibleAnswers(part6))}
        {(partParam === 'all' || partParam === '7') && renderSection('PART 7', '147 – 200', 'Reading Comprehension', getVisibleAnswers(part7))}
      </div>

      {/* ── Submit bar CTA ── */}
      {!submitted && (
        <div className="floating-cta">
          <button className="btn-primary" onClick={() => setShowConfirm(true)}>
            <CheckCheck size={16} strokeWidth={2.5} />
            {t('practice', 'submit').replace('{done}', String(done)).replace('{total}', String(activeRange.total))}
          </button>
        </div>
      )}

      {/* ── Submit Confirmation Modal ── */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ minHeight: 'auto', paddingBottom: 28 }}>
            <div className="modal-handle" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--foam)', textAlign: 'center', marginBottom: 12 }}>
              {lang === 'vi' ? 'Nộp bài và chấm điểm?' : 'Submit and grade?'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--silver)', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
              {lang === 'vi' 
                ? `Bạn đã hoàn thành ${done}/${activeRange.total} câu. Hãy chắc chắn rằng bạn đã điền hết các đáp án trước khi nộp.` 
                : `You have completed ${done}/${activeRange.total} questions. Make sure you have entered all answers before submitting.`}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1 }} 
                onClick={() => setShowConfirm(false)}
              >
                {lang === 'vi' ? 'Làm tiếp' : 'Keep practicing'}
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1 }} 
                onClick={() => {
                  setShowConfirm(false);
                  doSubmit();
                }}
              >
                {lang === 'vi' ? 'Nộp bài' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimeUp && !submitted && (
        <div className="modal-overlay" onClick={() => setShowTimeUp(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ minHeight: 'auto', paddingBottom: 28 }}>
            <div className="modal-handle" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--foam)', textAlign: 'center', marginBottom: 10 }}>
              {lang === 'vi' ? 'Hết thời gian' : 'Time is up'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--silver)', textAlign: 'center', marginBottom: 22, lineHeight: 1.6 }}>
              {lang === 'vi'
                ? 'Bài chưa tự nộp. Bạn có thể xem lại đáp án đã chọn rồi bấm Chấm bài khi sẵn sàng.'
                : 'Your answers were not submitted automatically. Review your choices, then submit when ready.'}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowTimeUp(false)}
              >
                {lang === 'vi' ? 'Xem lại bài' : 'Review'}
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  setShowTimeUp(false);
                  doSubmit();
                }}
              >
                {lang === 'vi' ? 'Nộp bài' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Result sheet ── */}
      {result && (
        <ResultSheet
          result={result}
          wrongCount={wrongAnswers.length}
          onClose={() => setResult(null)}
          onShowWrongOnly={showWrongReview}
          onRetryWrong={retryWrongAnswers}
        />
      )}
    </div>
  );
}

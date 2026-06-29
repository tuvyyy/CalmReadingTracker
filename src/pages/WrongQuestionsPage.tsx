// src/pages/WrongQuestionsPage.tsx
import { useState } from 'react';
import { ArrowRight, Check, Shuffle, Trash2 } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { dbService } from '../services/dbService';

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
}

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

export default function WrongQuestionsPage() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [wrongList, setWrongList] = useState<WQ[]>(() => dbService.getWrongQuestions());

  const FILTERS = [
    { key: 'all' as FilterKey,      label: t('wrong', 'filter_all')     },
    { key: 'grammar' as FilterKey,  label: t('wrong', 'filter_grammar') },
    { key: 'vocab' as FilterKey,    label: t('wrong', 'filter_vocab')   },
    { key: 'reading' as FilterKey,  label: t('wrong', 'filter_reading') },
    { key: 'careless' as FilterKey, label: t('wrong', 'filter_careless')},
  ];

  const filtered = filter === 'all' ? wrongList : wrongList.filter(q => q.errorType === filter);

  const handleDelete = (id: number) => {
    dbService.deleteWrongQuestion(id);
    setWrongList(dbService.getWrongQuestions());
  };

  const handleShuffleQuiz = () => {
    if (wrongList.length === 0) return;
    // Start practice with first mistake
    alert(lang === 'vi' ? 'Chức năng Quiz ôn lỗi sai sẽ mở trong bản cập nhật tới!' : 'Mistake Quiz feature will be unlocked in the next update!');
  };

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
            {t('wrong', 'quiz_btn')} · {wrongList.length}
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
                ? 'Tuyệt vời! Hiện tại bạn không có lỗi sai nào. Khi làm bài thi thử hoặc luyện tập mà trả lời sai, các câu đó sẽ được lưu ở đây.'
                : 'Great job! You have no saved mistakes. Incorrect questions from practice tests will automatically appear here.'
              }
            </div>
          </div>
        ) : (
          filtered.map((q, i) => {
            const meta = ERROR_META[q.errorType] || ERROR_META['grammar'];
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
                {/* Top row */}
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

                {/* Answer compare */}
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

                {/* Error tag */}
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

                {/* Note block */}
                {q.note && (
                  <p className="wrong-card__note" style={{ fontSize: '0.78rem', color: 'var(--silver)', fontStyle: 'italic', margin: '0 0 14px 0', lineHeight: 1.45 }}>"{q.note}"</p>
                )}

                {/* Footer */}
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

      <div style={{ height: 20 }} />
    </>
  );
}

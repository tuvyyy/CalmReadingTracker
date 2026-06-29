import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  XCircle,
} from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { audioService } from '../services/audioService';
import { dbService } from '../services/dbService';
import { SYLLABUS_DAYS, type SyllabusQuestion } from '../services/syllabusData';

type DayTab = 'theory' | 'practice' | 'pdf';

function getStudyHint(question: SyllabusQuestion) {
  if (question.type === 'bracket') {
    return 'Cách tự suy ra: so sánh hai lựa chọn trong ngoặc trước, rồi nhìn vị trí của cụm đó trong câu. Nếu vị trí cần động từ chính thì chọn dạng đã chia hoặc có trợ động từ; nếu đứng trước danh từ thì thường cần tính từ; nếu sau mạo từ/giới từ thì thường cần danh từ.';
  }

  if (question.passage) {
    return 'Cách tự suy ra: đọc câu chứa chỗ trống trước, sau đó đọc một câu trước và một câu sau để kiểm tra mạch ý. Với Part 6, đáp án đúng không chỉ đúng ngữ pháp mà còn phải nối logic với toàn đoạn.';
  }

  return 'Cách tự suy ra: xác định từ đứng ngay trước và ngay sau chỗ trống để đoán từ loại cần điền, sau đó mới xét nghĩa của từng đáp án. Nếu câu đã có đủ chủ ngữ và động từ chính, hãy cẩn thận với đáp án là động từ chia thì.';
}

export default function SyllabusDayPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();

  const day = SYLLABUS_DAYS.find(d => d.id === dayId);
  const [activeTab, setActiveTab] = useState<DayTab>('theory');
  const [answers, setAnswers] = useState<Record<string, { chosen: string; correct: boolean }>>({});
  const [submitted, setSubmitted] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const hasPdf = Boolean(day?.pdfPath || day?.pdfImages?.length);

  useEffect(() => {
    if (day && !hasPdf && activeTab === 'pdf') {
      setActiveTab('theory');
    }
  }, [activeTab, day, hasPdf]);

  if (!day) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--foam)' }}>
        Bài học không tồn tại.
      </div>
    );
  }

  const score = Object.values(answers).filter(a => a.correct).length;
  const unanswered = day.questions.length - Object.keys(answers).length;
  const availableTabs: DayTab[] = hasPdf ? ['theory', 'practice', 'pdf'] : ['theory', 'practice'];
  const sectionTitle = activeTab === 'theory'
    ? (lang === 'vi' ? 'Lý thuyết trọng tâm' : 'Core theory')
    : activeTab === 'practice'
      ? (lang === 'vi' ? 'Kiểm tra tương tác' : 'Interactive practice')
      : (lang === 'vi' ? 'Tài liệu gốc' : 'Original PDF');

  const choose = (questionId: string, chosen: string, answer: string) => {
    if (submitted) return;
    const correct = chosen === answer;
    audioService.playFeedbackSound(correct);
    setAnswers(prev => ({ ...prev, [questionId]: { chosen, correct } }));
  };

  const submit = () => {
    dbService.saveSyllabusProgress(day.id, score, day.questions.length);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: 'calc(16px + env(safe-area-inset-top)) 16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => navigate('/tests?tab=syllabus')}
          style={{
            background: 'none', border: 'none', color: 'var(--silver)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 0', fontSize: '0.8rem', fontWeight: 600,
          }}
        >
          <ChevronLeft size={16} />
          {lang === 'vi' ? 'Lộ trình' : 'Syllabus'}
        </button>
        <span style={{ fontSize: '0.68rem', color: 'var(--aqua)', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          DAY {day.dayNo}: {activeTab.toUpperCase()}
        </span>
      </div>

      <div style={{ textAlign: 'left', marginTop: 4 }}>
        <p style={{
          fontSize: '0.66rem',
          fontFamily: 'var(--font-label)',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--aqua)',
          margin: '0 0 6px',
        }}>
          {lang === 'vi' ? `Ngày ${day.dayNo}` : `Day ${day.dayNo}`}
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--foam)', margin: 0, letterSpacing: 0 }}>
          {sectionTitle}
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--silver)', margin: '6px 0 0' }}>
          {lang === 'vi' ? day.title : day.titleEn}
        </p>
      </div>

      <div className="chip-row" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 4, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        {availableTabs.map(tab => (
          <button
            key={tab}
            type="button"
            className={`chip ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              justifyContent: 'center',
              borderRadius: 8,
              padding: '8px 0',
              fontSize: '0.74rem',
              fontWeight: 600,
              background: activeTab === tab ? 'rgba(142, 216, 232, 0.08)' : 'transparent',
              color: activeTab === tab ? 'var(--aqua)' : 'var(--silver)',
            }}
          >
            {tab === 'theory' && (lang === 'vi' ? 'Lý thuyết' : 'Theory')}
            {tab === 'practice' && (lang === 'vi' ? 'Luyện tập' : 'Practice')}
            {tab === 'pdf' && (lang === 'vi' ? 'Tài liệu PDF' : 'PDF File')}
          </button>
        ))}
      </div>

      {activeTab === 'theory' && (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--silver)' }}>
              {lang === 'vi' ? `Phần ${slideIndex + 1} trên ${day.theorySlides.length}` : `Section ${slideIndex + 1} of ${day.theorySlides.length}`}
            </span>
          </div>

          <div className="glass-panel" style={{
            padding: '20px 24px',
            borderRadius: 24,
            background: 'rgba(18, 43, 59, 0.55)',
            border: '1px solid rgba(142, 216, 232, 0.12)',
            minHeight: 260,
            textAlign: 'left',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              color: 'var(--aqua)',
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 16,
            }}>
              {day.theorySlides[slideIndex].title}
            </h3>
            <div style={{ fontSize: '0.84rem', color: 'var(--foam)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
              {day.theorySlides[slideIndex].content}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={slideIndex === 0}
              onClick={() => setSlideIndex(p => p - 1)}
            >
              <ChevronLeft size={16} />
              {lang === 'vi' ? 'Trước đó' : 'Previous'}
            </button>
            <button
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={slideIndex + 1 === day.theorySlides.length}
              onClick={() => setSlideIndex(p => p + 1)}
            >
              {lang === 'vi' ? 'Tiếp theo' : 'Next'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {submitted && (
            <div className="glass-panel" style={{
              padding: '16px 20px',
              borderRadius: 20,
              background: 'rgba(126, 224, 184, 0.08)',
              border: '1px solid rgba(126, 224, 184, 0.3)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}>
              <Award size={32} color="var(--success)" />
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foam)' }}>
                {lang === 'vi' ? `Kết quả: ${score}/${day.questions.length} đúng` : `Result: ${score}/${day.questions.length} correct`}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--silver)' }}>
                {lang === 'vi' ? 'Bài làm đã được chấm điểm và lưu vào lộ trình.' : 'Your answers have been graded and saved.'}
              </div>
            </div>
          )}

          {day.questions.map((q, idx) => {
            const answer = answers[q.id];
            const answered = answer !== undefined;

            return (
              <div
                key={q.id}
                className="glass-panel"
                style={{
                  padding: '18px 22px',
                  borderRadius: 20,
                  background: 'rgba(18, 43, 59, 0.45)',
                  border: answered
                    ? (submitted && !answer.correct ? '1px solid rgba(255, 139, 139, 0.25)' : '1px solid rgba(142, 216, 232, 0.25)')
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-label)', color: 'var(--aqua)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {q.sourceLabel ?? (q.type === 'bracket'
                      ? (lang === 'vi' ? `Luyện tập ${idx + 1}` : `Drill ${idx + 1}`)
                      : (lang === 'vi' ? `Trắc nghiệm ${idx + 1}` : `MCQ ${idx + 1}`))}
                  </span>
                  {submitted && answered && (
                    answer.correct
                      ? <CheckCircle size={15} color="var(--success)" />
                      : <XCircle size={15} color="var(--danger)" />
                  )}
                </div>

                {q.passage && (
                  <div className="glass-panel" style={{
                    padding: '12px 16px',
                    borderRadius: 14,
                    background: 'rgba(10, 22, 30, 0.35)',
                    marginBottom: 12,
                    fontSize: '0.76rem',
                    lineHeight: 1.5,
                    color: 'var(--foam)',
                    whiteSpace: 'pre-line',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}>
                    {q.passage}
                  </div>
                )}

                <p style={{ fontSize: '0.84rem', color: 'var(--foam)', lineHeight: 1.5, fontWeight: 600, margin: '0 0 14px 0' }}>
                  {q.question}
                </p>

                {q.type === 'bracket' ? (
                  <div style={{ display: 'flex', gap: 10 }}>
                    {q.options.map((option, optionIndex) => {
                      const active = answer?.chosen === option;
                      const correct = option === q.answer;
                      let bg = 'rgba(255, 255, 255, 0.03)';
                      let border = '1px solid rgba(255, 255, 255, 0.08)';
                      let color = 'var(--silver)';

                      if (active) {
                        bg = 'rgba(142, 216, 232, 0.08)';
                        border = '1px solid var(--aqua)';
                        color = 'var(--aqua)';
                      }
                      if (submitted) {
                        if (correct) {
                          bg = 'rgba(126, 224, 184, 0.08)';
                          border = '1px solid var(--success)';
                          color = 'var(--success)';
                        } else if (active) {
                          bg = 'rgba(255, 139, 139, 0.08)';
                          border = '1px solid var(--danger)';
                          color = 'var(--danger)';
                        }
                      }

                      return (
                        <button
                          key={`${q.id}-${optionIndex}`}
                          type="button"
                          onClick={() => choose(q.id, option, q.answer)}
                          disabled={submitted}
                          style={{
                            flex: 1,
                            padding: '9px 0',
                            borderRadius: 10,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: submitted ? 'default' : 'pointer',
                            background: bg,
                            border,
                            color,
                            transition: 'all 0.2s',
                          }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {q.options.map((option, optionIndex) => {
                      const letter = option.match(/^\(?([A-Z])[).]/)?.[1] ?? option;
                      const active = answer?.chosen === letter;
                      const correct = letter === q.answer;
                      let className = 'quiz-option';
                      if (active) className += ' active';
                      if (submitted) {
                        if (correct) className = 'quiz-option correct';
                        else if (active) className = 'quiz-option wrong';
                      }

                      return (
                        <button
                          key={`${q.id}-${optionIndex}`}
                          type="button"
                          className={className}
                          onClick={() => choose(q.id, letter, q.answer)}
                          disabled={submitted}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '10px 14px',
                            fontSize: '0.78rem',
                            justifyContent: 'flex-start',
                            fontWeight: 500,
                          }}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}

                {submitted && (
                  <div className="glass-panel" style={{
                    marginTop: 12,
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    fontSize: '0.72rem',
                    lineHeight: 1.55,
                    color: 'var(--silver)',
                    borderLeft: `3px solid ${answer?.correct ? 'var(--success)' : 'var(--danger)'}`,
                  }}>
                    <strong style={{ color: 'var(--foam)', display: 'block', marginBottom: 2 }}>
                      {lang === 'vi' ? `Đáp án: ${q.answer}` : `Answer: ${q.answer}`}
                    </strong>
                    <div>
                      <strong style={{ color: 'var(--aqua)' }}>{lang === 'vi' ? 'Mấu chốt: ' : 'Key point: '}</strong>
                      {q.explanation}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {getStudyHint(q)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {!submitted ? (
            <button
              type="button"
              className="btn-primary"
              onClick={submit}
              disabled={unanswered > 0}
              style={{ width: '100%', padding: '14px 0', fontSize: '0.86rem', justifyContent: 'center' }}
            >
              {unanswered > 0
                ? (lang === 'vi' ? `Còn ${unanswered} câu chưa làm` : `${unanswered} questions left`)
                : (lang === 'vi' ? 'Kiểm tra đáp án' : 'Check answers')}
            </button>
          ) : (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              style={{ width: '100%', padding: '14px 0', fontSize: '0.86rem', justifyContent: 'center' }}
            >
              {lang === 'vi' ? 'Làm lại bài tập' : 'Retake Exercises'}
            </button>
          )}
        </div>
      )}

      {activeTab === 'pdf' && (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-panel" style={{
            padding: '40px 24px',
            borderRadius: 24,
            background: 'rgba(18, 43, 59, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', padding: 18, borderRadius: '50%' }}>
              <FileText size={44} strokeWidth={1.5} />
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--foam)' }}>
                {day.pdfTitle}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--silver)', marginTop: 4 }}>
                {day.pdfMeta}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 8 }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', gap: 6 }}
                onClick={() => setShowPdfViewer(true)}
              >
                <Eye size={15} />
                {lang === 'vi' ? 'Xem tài liệu' : 'View document'}
              </button>
            </div>
          </div>

          <div className="alert alert--info" style={{ fontSize: '0.74rem', lineHeight: 1.45, margin: 0, textAlign: 'left' }}>
            <span>
              {lang === 'vi'
                ? 'Lưu ý: Bản xem tài liệu đã được tối ưu thành từng trang vừa chiều ngang màn hình, không cần kéo qua lại.'
                : 'Note: The document viewer is optimized into full-width pages, so you do not need horizontal scrolling.'}
            </span>
          </div>
        </div>
      )}

      {showPdfViewer && (
        <div
          className="modal-overlay"
          onClick={() => setShowPdfViewer(false)}
          style={{ alignItems: 'stretch', padding: 0 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 720,
              height: '100dvh',
              margin: '0 auto',
              background: 'var(--deep)',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid var(--line)',
              borderRight: '1px solid var(--line)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: 'calc(12px + env(safe-area-inset-top)) 14px 12px',
              borderBottom: '1px solid var(--line)',
              background: 'rgba(7, 16, 20, 0.96)',
              flexShrink: 0,
            }}>
              <button
                className="btn-secondary btn-sm"
                onClick={() => setShowPdfViewer(false)}
                style={{ width: 'auto', padding: '8px 12px', gap: 4 }}
              >
                <ChevronLeft size={16} />
                {lang === 'vi' ? 'Đóng' : 'Close'}
              </button>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foam)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {day.pdfTitle}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--silver)' }}>
                  {lang === 'vi' ? 'Bấm Đóng để quay lại bài học' : 'Tap Close to return to the lesson'}
                </div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 10,
                background: '#111',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {day.pdfImages?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  {day.pdfImages.map((image, index) => (
                    <div
                      key={image}
                      style={{
                        width: '100%',
                        maxWidth: 680,
                        background: '#fff',
                        borderRadius: 6,
                        overflow: 'hidden',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
                      }}
                    >
                      <img
                        src={image}
                        alt={`${day.pdfTitle} - page ${index + 1}`}
                        loading="lazy"
                        style={{
                          display: 'block',
                          width: '100%',
                          height: 'auto',
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <iframe
                  src={`${day.pdfPath}#view=FitH&toolbar=0&navpanes=0`}
                  title={day.pdfTitle}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: '#111',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  );
}

// src/pages/ImportAnswerPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseAnswerKey, type ParsedAnswer } from '../services/answerParser';
import { ScanLine, Trash2, AlertTriangle, Info, CheckCircle2, Save } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { dbService } from '../services/dbService';

const PLACEHOLDERS = {
  numbered: '101A 102C 103D 104B 105A\n106D 107B 108C 109A 110D\n...',
  bare:     'A C D B A D C B A D\nC A B D C A D B C A\n...',
};

export default function ImportAnswerPage() {
  const navigate = useNavigate();
  const [mode,   setMode]   = useState<'numbered' | 'bare' | 'vocab'>('numbered');
  const [raw,    setRaw]    = useState('');
  const [parsed, setParsed] = useState<ParsedAnswer[] | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [error,  setError]  = useState('');
  const { t, lang } = useLang();

  // State for Custom Test Title Prompt
  const [showNameModal, setShowNameModal] = useState(false);
  const [testTitle, setTestTitle] = useState('');

  const handleParse = () => {
    setError('');
    setImportedCount(null);
    if (!raw.trim()) { setError(t('import', 'err_empty')); return; }

    if (mode === 'vocab') {
      const count = dbService.importVocabFromTsv(raw);
      if (count === 0) {
        setError(lang === 'vi' ? 'Không tìm thấy dữ liệu từ vựng hợp lệ. Vui lòng kiểm tra lại định dạng hàng/cột.' : 'No valid vocabulary rows found. Check column tab formats.');
        return;
      }
      setImportedCount(count);
      setRaw('');
      dbService.pushVocabToServer();
      return;
    }

    const res = parseAnswerKey(raw);
    if (res.length === 0) {
      setError(t('import', 'err_none'));
      return;
    }
    if (res.length < 100) {
      setError(t('import', 'err_partial').replace('{n}', String(res.length)));
    }
    setParsed(res);
  };

  const handleClear = () => {
    setRaw('');
    setParsed(null);
    setError('');
    setImportedCount(null);
  };

  const handleOpenSaveModal = () => {
    const nextNum = dbService.getTests().length + 1;
    setTestTitle(`Imported Reading Test ${String(nextNum).padStart(2, '0')}`);
    setShowNameModal(true);
  };

  const handleSaveTest = () => {
    if (!parsed) return;
    const titleToSave = testTitle.trim() || `Imported Reading Test ${String(dbService.getTests().length + 1).padStart(2, '0')}`;
    dbService.createCustomTest(titleToSave, parsed);
    setShowNameModal(false);
    navigate('/tests');
  };

  const p5 = parsed?.filter(a => a.part === 5).length ?? 0;
  const p6 = parsed?.filter(a => a.part === 6).length ?? 0;
  const p7 = parsed?.filter(a => a.part === 7).length ?? 0;

  return (
    <>
      <div style={{ padding: 'calc(16px + env(safe-area-inset-top)) 16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        
        {/* Title */}
        <div style={{ textAlign: 'left', marginBottom: 4 }}>
          <p style={{
            fontFamily: 'var(--font-label)', fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--aqua)', marginBottom: 8,
          }}>
            {lang === 'vi' ? 'CỔNG NHẬP LIỆU' : 'IMPORT CENTER'}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700,
            color: 'var(--foam)', margin: 0
          }}>
            {lang === 'vi' ? 'Nhập dữ liệu' : 'Import'}
          </h1>
        </div>

        {/* Mode toggle */}
        <div className="segmented-control">
          <button
            className={mode === 'numbered' ? 'active' : ''}
            onClick={() => { setMode('numbered'); handleClear(); }}
          >
            {t('import', 'mode_numbered')}
          </button>
          <button
            className={mode === 'bare' ? 'active' : ''}
            onClick={() => { setMode('bare'); handleClear(); }}
          >
            {t('import', 'mode_bare')}
          </button>
          <button
            className={mode === 'vocab' ? 'active' : ''}
            onClick={() => { setMode('vocab'); handleClear(); }}
          >
            {lang === 'vi' ? 'Từ vựng (Sheets)' : 'Vocab (Sheets)'}
          </button>
        </div>

        {/* Format hint */}
        <div className="alert alert--info" style={{ alignItems: 'flex-start' }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: '0.74rem', lineHeight: 1.45 }}>
            {mode === 'vocab' ? (
              lang === 'vi'
                ? 'Cách nhập: Copy các cột trong Google Sheets/Excel rồi dán thẳng vào đây. Cột xếp theo thứ tự: Từ | Loại từ | Nghĩa | Ví dụ EN | Ví dụ VI | Đồng nghĩa | Ghi chú'
                : 'How to import: Copy table columns from Google Sheets/Excel and paste here. Columns: Word | Type | Meaning | Example EN | Example VI | Synonyms | Notes/Usage'
            ) : (
              mode === 'numbered' ? t('import', 'hint_numbered') : t('import', 'hint_bare')
            )}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          className="glass-textarea"
          value={raw}
          onChange={e => {
            setRaw(e.target.value);
            setParsed(null);
            if (error && e.target.value) setError('');
          }}
          placeholder={
            mode === 'vocab'
              ? (lang === 'vi'
                  ? 'Dán các dòng dữ liệu dạng tab ở đây...\nreimbursement\tnoun\tkhoản hoàn tiền\tHave you finished...\tBạn đã xem xét...\trefund; repayment\tThường gặp...'
                  : 'Paste tab-separated columns here...\nreimbursement\tnoun\trefund\tHave you finished...\tBạn đã xem xét...\trefund; repayment\tThường gặp...')
              : PLACEHOLDERS[mode as 'numbered' | 'bare']
          }
          spellCheck={false}
          rows={8}
          aria-label={t('import', 'title')}
          style={{
            background: 'rgba(18, 43, 59, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 18,
            color: 'var(--foam)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            padding: 14,
            outline: 'none'
          }}
        />

        {/* Error / Success Alerts */}
        {error && (
          <div className={`alert ${parsed ? 'alert--warn' : 'alert--danger'}`}>
            <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        {importedCount !== null && (
          <div className="alert alert--success fade-up" style={{ marginTop: 2 }}>
            <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.74rem' }}>
              <strong>
                {lang === 'vi'
                  ? `Đã nạp thành công ${importedCount} từ vựng vào kho học tập!`
                  : `Successfully imported ${importedCount} vocabulary items!`}
              </strong>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handleParse}>
            <ScanLine size={16} strokeWidth={2.5} />
            {mode === 'vocab'
              ? (lang === 'vi' ? 'Nhập từ vựng' : 'Import Vocabulary')
              : t('import', 'parse_btn')
            }
          </button>
          {(raw || parsed || importedCount) && (
            <button
              className="btn-secondary btn-sm"
              style={{ width: 'auto', paddingLeft: 14, paddingRight: 14 }}
              onClick={handleClear}
              aria-label={t('import', 'clear')}
            >
              <Trash2 size={15} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Preview */}
        {parsed && (
          <div className="fade-up">
            {/* Status banner */}
            <div className={`alert ${parsed.length === 100 ? 'alert--success' : 'alert--warn'}`} style={{ marginBottom: 14 }}>
              <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
              <div>
                <strong>{t('import', 'status_ok').replace('{n}', String(parsed.length))}</strong>
                {parsed.length < 100 && ` — ${t('import', 'status_missing').replace('{m}', String(100 - parsed.length))}`}
              </div>
            </div>

            {/* Part summary */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Part 5', count: p5, color: 'var(--aqua)' },
                { label: 'Part 6', count: p6, color: 'var(--cyan)'  },
                { label: 'Part 7', count: p7, color: 'var(--silver)'   },
              ].map(({ label, count, color }) => (
                <div key={label} className="stat-glass" style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '1.3rem', fontWeight: 700, color }}>{count}</div>
                  <div style={{ fontFamily: 'var(--font-label)', fontSize: '0.62rem', color: 'var(--silver)', marginTop: 2, fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Grid preview */}
            <p className="section-label" style={{ padding: 0, marginBottom: 10 }}>{t('import', 'preview')}</p>
            <div className="answer-preview-grid">
              {parsed.map(({ questionNo, answer }) => (
                <div key={questionNo} className="answer-preview-cell">
                  <span className="answer-preview-cell__no">{questionNo}</span>
                  <span className="answer-preview-cell__ans">{answer}</span>
                </div>
              ))}
            </div>

            {/* Save CTA */}
            <button
              className="btn-primary"
              style={{ marginTop: 18, width: '100%', justifyContent: 'center', gap: 6 }}
              onClick={handleOpenSaveModal}
            >
              <Save size={16} />
              {t('import', 'save')}
            </button>

            <div className="alert alert--info" style={{ marginTop: 12 }}>
              <Info size={14} style={{ flexShrink: 0 }} />
              {t('import', 'save_note')}
            </div>
          </div>
        )}

        <div style={{ height: 16 }} />
      </div>

      {/* Save Name Modal Prompt overlay */}
      {showNameModal && (
        <div className="modal-overlay" onClick={() => setShowNameModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ padding: '24px 20px', borderRadius: 24, textAlign: 'left' }}>
            <div className="modal-handle" />
            
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--foam)', margin: '0 0 12px 0' }}>
              {lang === 'vi' ? 'Đặt tên đề thi mới' : 'Create Custom Test'}
            </h3>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--silver)', marginBottom: 16 }}>
              {lang === 'vi' 
                ? 'Nhập tên hiển thị để dễ dàng phân biệt đề thi này trên danh sách.'
                : 'Enter a descriptive title for this custom test.'
              }
            </p>

            <input 
              type="text"
              className="glass-textarea"
              value={testTitle}
              onChange={e => setTestTitle(e.target.value)}
              placeholder="Ví dụ: 2022 Test 5 Part 5"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 12,
                background: 'rgba(18, 43, 59, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--foam)',
                fontSize: '0.86rem',
                outline: 'none',
                marginBottom: 20
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                className="btn-secondary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowNameModal(false)}
              >
                {lang === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleSaveTest}
              >
                {lang === 'vi' ? 'Lưu đề thi' : 'Save Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

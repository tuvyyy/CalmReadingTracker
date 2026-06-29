// src/i18n/translations.ts

export type Lang = 'vi' | 'en';

export const translations = {
  // ── Bottom Nav ──────────────────────────────────
  nav: {
    home:     { vi: 'Home',    en: 'Home'     },
    tests:    { vi: 'Làm bài', en: 'Tests'    },
    import:   { vi: 'Import',  en: 'Import'   },
    wrong:    { vi: 'Câu sai', en: 'Mistakes' },
    vocab:    { vi: 'Từ vựng', en: 'Vocab'    },
    grammar:  { vi: 'Ngữ pháp', en: 'Grammar' },
    settings: { vi: 'Cài đặt', en: 'Settings' },
  },

  // ── Home ────────────────────────────────────────
  home: {
    eyebrow:  { vi: 'WATER READING',       en: 'WATER READING'         },
    title:    { vi: 'Luyện tập\ncó mục tiêu.', en: 'Practice with\ncalm focus.' },
    quote:    { vi: 'Làm Reading, chấm điểm và gom lỗi sai để ôn lại mỗi ngày trong tĩnh lặng.',
                en: 'Do Reading, grade answers, collect mistakes and review them every day in calm.' },
    sectionActions: { vi: 'Hành trình ôn tập', en: 'Your study journey' },
    sectionRecent:  { vi: 'Ghi chép gần đây',  en: 'Recent activity'   },
    tests_done: { vi: 'đề',    en: 'tests' },
    wrong_cnt:  { vi: 'lỗi',   en: 'wrong' },
    avg_score:  { vi: 'TB',    en: 'avg'   },

    action_tests:   { vi: 'Làm bài',      en: 'Practice'      },
    action_tests_s: { vi: 'Chọn đề thi và bắt đầu làm bài tập trung', en: 'Choose a test and start a focused session' },
    action_import:   { vi: 'Import đáp án', en: 'Import answers' },
    action_import_s: { vi: 'Nhập đáp án nhanh để chấm điểm và phân tích', en: 'Paste answer keys to grade and analyse' },
    action_wrong:   { vi: 'Câu đã sai',   en: 'Mistakes'      },
    action_wrong_s: { vi: 'Ôn lại 12 lỗi sai đã lưu trong sổ tay', en: 'Review 12 saved mistakes in your journal' },
    action_vocab:   { vi: 'Từ vựng',      en: 'Vocabulary'    },
    action_vocab_s: { vi: 'Rèn luyện vốn từ vựng TOEIC cốt lõi qua thẻ quiz', en: 'Build TOEIC core vocabulary with flashcard quizzes' },

    recent_test_title: { vi: 'test 10 part 5 2022', en: 'test 10 part 5 2022' },
    recent_test_sub:   { vi: 'Bộ Part 5 có giải thích chi tiết', en: 'Part 5 set with detailed explanations' },
    recent_wrong_title: { vi: '12 câu sai chưa ôn',   en: '12 mistakes to review' },
    recent_wrong_sub:   { vi: 'Gồm ngữ pháp & từ vựng Part 5, 6', en: 'Grammar & vocabulary in Part 5, 6' },
  },

  // ── Tests ───────────────────────────────────────
  tests: {
    eyebrow:   { vi: 'EXAM DECK',            en: 'EXAM DECK'               },
    title:     { vi: 'Làm bài',              en: 'Practice'                },
    subtitle:  { vi: '{done}/{total} bộ đề đã hoàn thành trong bộ sưu tập.', en: '{done}/{total} test decks completed.' },
    newTest:   { vi: 'Tạo bộ đề mới',        en: 'New test deck'           },
    filter_all:     { vi: 'Tất cả',  en: 'All'       },
    filter_pending: { vi: 'Chưa làm', en: 'Not done' },
    filter_done:    { vi: 'Đã làm',  en: 'Done'     },
    status_done:    { vi: 'Đã làm',  en: 'Done'     },
    status_pending: { vi: 'Chưa làm', en: 'Not done' },
    meta:      { vi: 'Câu {range} · 100 câu · 75 phút', en: 'Q {range} · 100 Qs · 75 min' },
    start:     { vi: 'Bắt đầu', en: 'Start'   },
    redo:      { vi: 'Làm lại', en: 'Retake'  },
  },

  // ── Practice ────────────────────────────────────
  practice: {
    progress:  { vi: 'Đã làm {done}/{total} câu', en: 'Done {done}/{total} Qs' },
    submit:    { vi: 'Chấm bài · {done}/{total}', en: 'Grade · {done}/{total}' },
    back:      { vi: 'Quay lại',  en: 'Back'    },
    result_correct: { vi: 'Đúng {correct}/{total} câu', en: '{correct}/{total} correct' },
    excellent: { vi: 'Xuất sắc!',  en: 'Excellent!' },
    good:      { vi: 'Tốt lắm!',  en: 'Great job!' },
    keep_going:{ vi: 'Cố lên nhé!', en: 'Keep going!' },
    view_answers: { vi: 'Xem đáp án chi tiết', en: 'View detailed answers' },
    view_wrong:   { vi: 'Xem sổ tay câu sai',  en: 'Open mistake journal'  },
    back_to_list: { vi: 'Về danh sách đề',     en: 'Back to test list'     },
  },

  // ── Import ──────────────────────────────────────
  import: {
    eyebrow:   { vi: 'IMPORT PORTAL',   en: 'IMPORT PORTAL'    },
    title:     { vi: 'Đáp án',          en: 'Answer Key'       },
    subtitle:  { vi: 'Nhập đáp án từ sách / PDF với bất kỳ định dạng nào.', en: 'Paste answer keys from book or PDF in any format.' },
    mode_numbered: { vi: 'Có số câu', en: 'Numbered'   },
    mode_bare:     { vi: 'Chỉ A B C D', en: 'Bare A B C D' },
    hint_numbered: { vi: 'Hỗ trợ: 101A 102C · 101. A · 101-A', en: 'Supports: 101A 102C · 101. A · 101-A' },
    hint_bare:     { vi: 'Nhập lần lượt A B C D từ câu 101, cách nhau bởi dấu cách hoặc xuống dòng.', en: 'Enter A B C D in order from question 101, separated by spaces or newlines.' },
    parse_btn:  { vi: 'Phân tích đáp án', en: 'Parse answer key' },
    clear:      { vi: 'Xóa',             en: 'Clear'            },
    status_ok:  { vi: 'Đã nhận {n}/100 đáp án', en: 'Received {n}/100 answers' },
    status_missing: { vi: 'thiếu {m} câu', en: '{m} answers missing' },
    preview:    { vi: 'Preview đáp án',  en: 'Answer preview'   },
    save:       { vi: 'Lưu đáp án vào bộ đề', en: 'Save to test deck' },
    save_note:  { vi: 'Tính năng lưu sẽ có trong phiên bản tiếp theo.', en: 'Save feature coming in next version.' },
    err_empty:  { vi: 'Vui lòng nhập đáp án trước.', en: 'Please enter answers first.' },
    err_none:   { vi: 'Không tìm thấy đáp án hợp lệ. Kiểm tra lại định dạng.', en: 'No valid answers found. Check the format.' },
    err_partial:{ vi: 'Chỉ nhận được {n}/100 câu. Kiểm tra xem có thiếu câu nào không.', en: 'Only got {n}/100 questions. Check for missing ones.' },
  },

  // ── Wrong ───────────────────────────────────────
  wrong: {
    eyebrow:   { vi: 'MISTAKE JOURNAL',    en: 'MISTAKE JOURNAL'   },
    title:     { vi: 'Sổ tay lỗi sai',    en: 'Mistake Journal'   },
    subtitle:  { vi: '{pending} câu cần lưu ý ôn tập · {total} câu đã gom', en: '{pending} to review · {total} total collected' },
    quiz_btn:  { vi: 'Ôn quiz lỗi sai',   en: 'Quick review quiz' },
    filter_all:     { vi: 'Tất cả',     en: 'All'       },
    filter_grammar: { vi: 'Ngữ pháp',   en: 'Grammar'   },
    filter_vocab:   { vi: 'Từ vựng',    en: 'Vocabulary'},
    filter_reading: { vi: 'Đọc thiếu',  en: 'Reading'   },
    filter_careless:{ vi: 'Sai ẩu',     en: 'Careless'  },
    error_grammar:  { vi: 'Ngữ pháp',   en: 'Grammar'   },
    error_vocab:    { vi: 'Từ vựng',    en: 'Vocabulary'},
    error_reading:  { vi: 'Đọc thiếu ý',en: 'Missed meaning'},
    error_careless: { vi: 'Sai ẩu',     en: 'Careless'  },
    chosen: { vi: 'Đã chọn', en: 'Chosen'  },
    correct:{ vi: 'Đúng',    en: 'Correct' },
    reviewed:     { vi: 'Đã ôn',           en: 'Reviewed'      },
    mark_reviewed:{ vi: 'Đánh dấu đã ôn', en: 'Mark reviewed' },
    empty_title:{ vi: 'Không có câu sai loại này', en: 'No mistakes of this type' },
    empty_sub:  { vi: 'Hãy tiếp tục tập trung để duy trì kết quả tốt!', en: 'Keep your focus to maintain good results!' },
  },

  // ── Vocab ───────────────────────────────────────
  vocab: {
    eyebrow:    { vi: 'VOCABULARY',         en: 'VOCABULARY'         },
    title:      { vi: 'Từ vựng',            en: 'Vocabulary'         },
    subtitle:   { vi: 'Ôn từ hay sai và từ TOEIC thường gặp.', en: 'Review frequently mistaken and common TOEIC words.' },
    stat_new:      { vi: 'Mới',    en: 'New'      },
    stat_review:   { vi: 'Cần ôn', en: 'Review'   },
    stat_mastered: { vi: 'Thuộc',  en: 'Mastered' },
    tab_quiz: { vi: 'Quiz ôn từ',   en: 'Word quiz' },
    tab_list: { vi: 'Danh sách từ', en: 'Word list' },
    quiz_label: { vi: 'VOCABULARY STUDY', en: 'VOCABULARY STUDY' },
    next_btn:   { vi: 'Câu tiếp',          en: 'Next word'        },
    status_new:      { vi: 'Mới',    en: 'New'      },
    status_review:   { vi: 'Cần ôn', en: 'Review'   },
    status_mastered: { vi: 'Thuộc',  en: 'Mastered' },
    empty_title: { vi: 'Đã ôn hết từ cần ôn',       en: 'All words reviewed!'     },
    empty_sub:   { vi: 'Bạn đã thuộc tất cả từ vựng trong danh sách hiện tại.', en: 'You have mastered all words in the current list.' },
  },

  // ── Settings ────────────────────────────────────
  settings: {
    eyebrow:    { vi: 'PREFERENCES',     en: 'PREFERENCES'     },
    title:      { vi: 'Cài đặt',         en: 'Settings'        },
    subtitle:   { vi: 'Tuỳ chỉnh trải nghiệm luyện tập của bạn.', en: 'Customise your practice experience.' },

    section_language: { vi: 'Ngôn ngữ',       en: 'Language'         },
    lang_label:       { vi: 'Giao diện hiển thị', en: 'Display language' },
    lang_vi:          { vi: 'Tiếng Việt',      en: 'Vietnamese'       },
    lang_en:          { vi: 'English',          en: 'English'          },

    section_practice: { vi: 'Luyện tập',       en: 'Practice'         },
    timer_label:      { vi: 'Hiện đồng hồ đếm ngược', en: 'Show countdown timer' },
    sound_label:      { vi: 'Âm thanh phản hồi',       en: 'Feedback sounds'      },
    highlight_label:  { vi: 'Tô sáng hàng câu khi chọn', en: 'Highlight row on answer' },

    section_data:  { vi: 'Dữ liệu',       en: 'Data'              },
    reset_wrong:   { vi: 'Xoá lịch sử câu sai', en: 'Clear mistake history'    },
    reset_vocab:   { vi: 'Đặt lại tiến độ từ vựng', en: 'Reset vocabulary progress' },
    reset_all:     { vi: 'Xoá toàn bộ dữ liệu',    en: 'Clear all data'         },

    section_about: { vi: 'Thông tin',     en: 'About'             },
    version:       { vi: 'Phiên bản',     en: 'Version'           },
    built_with:    { vi: 'Xây dựng với React + Vite + TypeScript', en: 'Built with React + Vite + TypeScript' },

    danger_reset:  { vi: 'Thao tác không thể hoàn tác.', en: 'This action cannot be undone.' },
  },
} as const;

export type TranslationKey = typeof translations;

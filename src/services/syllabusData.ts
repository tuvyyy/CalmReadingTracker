import { GRAMMAR_QUESTIONS } from './grammarData';

export interface SyllabusDay {
  id: string;
  dayNo: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  pdfPath: string;
  pdfTitle: string;
  pdfMeta: string;
  pdfImages?: string[];
  theorySlides: {
    title: string;
    content: string;
  }[];
  questions: SyllabusQuestion[];
}

export interface SyllabusQuestion {
  id: string;
  type: 'bracket' | 'multiple';
  sourceLabel?: string;
  passage?: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const memoPassage = `FROM: Elliot Adams
TO: James Taylor

A client ___(7)___ our office on Monday at 10 A.M. I would like you to attend a meeting with him
at 11:30 A.M. to discuss his project. A detailed ___(8)___ of the project will be sent to you
tomorrow. I would like to go over it with you Friday morning. ___(9)___. If you have any
questions, let me know as soon as possible.`;

const pdfPageImages = (dayNo: number, totalPages: number) =>
  Array.from({ length: totalPages }, (_, index) => `/assets/pdf-pages/day-${dayNo}/page-${String(index + 1).padStart(2, '0')}.jpg`);

const grammarCategoryLabels: Record<string, string> = {
  NOUNS: 'Danh từ',
  ADJECTIVES: 'Tính từ',
  ADVERBS: 'Trạng từ',
  PRONOUNS: 'Đại từ',
  PREPOSITIONS: 'Giới từ',
  CONJUNCTIONS: 'Liên từ',
  'NUMERIC EXPRESSIONS BEFORE NOUNS': 'Cụm số trước danh từ',
  'RELATIVE CLAUSES': 'Mệnh đề quan hệ',
  'TO INFINITIVES AND GERUNDS': 'To-V và V-ing',
  'PRESENT SIMPLE TENSE': 'Hiện tại đơn',
  'PASSIVE VOICE': 'Bị động',
  IMPERATIVE: 'Mệnh lệnh',
  'PASSIVE AND SPECIAL PASSIVE CASES': 'Bị động đặc biệt',
  'MODAL VERBS': 'Động từ khuyết thiếu',
  'CONDITIONAL SENTENCES': 'Câu điều kiện',
  'REDUCING RELATIVE CLAUSES': 'Rút gọn mệnh đề quan hệ',
  VERBS: 'Động từ',
  'SENTENCE ELEMENTS': 'Thành phần câu',
  'ADVERBIAL CLAUSES OF TIME': 'Mệnh đề trạng ngữ chỉ thời gian',
  'PHRASES & CLAUSES': 'Cụm từ và mệnh đề',
  'PHRASES & CLAUSES OF CONCESSION': 'Nhượng bộ',
  'PHRASES & CLAUSES OF EFFECT': 'Kết quả',
  'PHRASES & CLAUSES OF PURPOSE': 'Mục đích',
  'PHRASES & CLAUSES OF REASON': 'Lý do',
};

const grammarSyllabusQuestions: SyllabusQuestion[] = GRAMMAR_QUESTIONS.map((question, index) => ({
  id: `grammar-${question.id.toLowerCase()}`,
  type: 'multiple',
  sourceLabel: `${grammarCategoryLabels[question.category] ?? question.category} ${index + 1}`,
  question: question.question,
  options: question.options,
  answer: question.answer,
  explanation: question.explanation,
}));

export const SYLLABUS_DAYS: SyllabusDay[] = [
  {
    id: 'grammar-core',
    dayNo: 1,
    title: 'Tổng ôn ngữ pháp TOEIC',
    titleEn: 'TOEIC Grammar Core',
    description: 'Gộp 52 câu ngữ pháp từ 24 chuyên đề vào một bài mở đầu trong lộ trình 30 ngày.',
    descriptionEn: 'A 52-question grammar review from 24 topics, merged into the first day of the 30-day path.',
    pdfPath: '',
    pdfTitle: 'Grammar Core - 52 câu hỏi',
    pdfMeta: 'Bộ câu hỏi tích hợp từ chuyên đề Ngữ pháp · Không có PDF riêng',
    theorySlides: [
      {
        title: '1. Mục tiêu của ngày học',
        content: `Day 1 dùng để kiểm tra nền ngữ pháp trước khi đi vào từng bài TOEIC theo PDF.

Bạn sẽ làm 52 câu trắc nghiệm, phủ các điểm dễ gặp trong Part 5:
- Danh từ, động từ, tính từ, trạng từ
- Đại từ, giới từ, liên từ
- Mệnh đề quan hệ, câu điều kiện, bị động
- To-V, V-ing, cụm từ và mệnh đề`,
      },
      {
        title: '2. Cách làm nhanh Part 5',
        content: `1. Xác định vị trí trống đang cần từ loại nào.
2. Nhìn dấu hiệu quanh chỗ trống: mạo từ, giới từ, động từ, danh từ.
3. Loại đáp án sai từ loại trước, rồi mới xét nghĩa.
4. Với câu dài, tìm chủ ngữ và động từ chính trước khi đọc toàn bộ câu.`,
      },
      {
        title: '3. Cách tự chấm sau khi làm',
        content: `Sau khi chọn đủ 52 câu, bấm Kiểm tra đáp án.

Hãy đọc kỹ phần giải thích cho câu sai. Nếu sai nhiều ở cùng một nhóm như danh từ, bị động hoặc mệnh đề quan hệ, bạn nên quay lại ôn nhóm đó trước khi học Day 2.`,
      },
    ],
    questions: grammarSyllabusQuestions,
  },
  {
    id: 'day-1',
    dayNo: 2,
    title: 'Thành phần câu: Chủ ngữ và Động từ',
    titleEn: 'Sentence Components: Subject & Verb',
    description: 'Tìm vị trí, vai trò và cách xác định chủ ngữ - động từ trong câu TOEIC.',
    descriptionEn: 'Learn position, role and how to identify Subject and Verb in TOEIC sentences.',
    pdfPath: '/assets/day-1-reading.pdf',
    pdfTitle: 'Day 1 Reading - Chủ ngữ & Động từ.pdf',
    pdfMeta: 'Dung lượng: 222 KB · Tài liệu ôn thi TOEIC SHINE',
    pdfImages: pdfPageImages(1, 5),
    theorySlides: [
      {
        title: '1. Khái niệm cơ bản',
        content: `Chủ ngữ là chủ thể thực hiện hành động hoặc ở trong một trạng thái nào đó.

Ví dụ:
The octopus dances.
=> "The octopus" là chủ ngữ.

Động từ chỉ hành động hoặc trạng thái của chủ ngữ.

Ví dụ:
The octopus dances.
=> "dances" là động từ chỉ hành động.`,
      },
      {
        title: '2. Vị trí và cách nhận biết Chủ ngữ',
        content: `Chủ ngữ thường đứng ở đầu câu, trước động từ.

Ví dụ:
Errors occurred.
=> "Errors" là chủ ngữ.

Các từ/cụm từ có thể làm chủ ngữ:
1. Danh từ: The proposal sounds excellent.
2. Đại từ: They are my coworkers.
3. Danh động từ V-ing: Getting enough rest is important.
4. To + động từ nguyên thể: To finish the race is my only goal.
5. Mệnh đề danh ngữ: That he will come is certain.`,
      },
      {
        title: '3. Vị trí và cách nhận biết Động từ',
        content: `Động từ thường đứng ngay sau chủ ngữ.

Ví dụ:
The plan succeeded.
=> "succeeded" là động từ.

Các dạng có thể đóng vai trò động từ:
1. Động từ thường: They create new designs.
2. Trợ động từ + động từ: Jane will explain the process.
3. Động từ chia thì: Mr. Lee purchased new office furniture.`,
      },
    ],
    questions: [
      { id: 'd1-q1', type: 'bracket', sourceLabel: 'Chủ ngữ 1', question: '1. (Register/Registration) begins at 7 A.M.', options: ['Register', 'Registration'], answer: 'Registration', explanation: 'Vị trí đầu câu cần danh từ làm chủ ngữ: Registration.' },
      { id: 'd1-q2', type: 'bracket', sourceLabel: 'Chủ ngữ 2', question: '2. The (cost/costly) of housing rose dramatically last year.', options: ['cost', 'costly'], answer: 'cost', explanation: 'Sau "The" và trước "of" cần danh từ: cost.' },
      { id: 'd1-q3', type: 'bracket', sourceLabel: 'Chủ ngữ 3', question: '3. (Receive/To receive) the Nobel Prize is the dream of many scientists.', options: ['Receive', 'To receive'], answer: 'To receive', explanation: 'Cụm To + V có thể làm chủ ngữ: To receive.' },
      { id: 'd1-q4', type: 'bracket', sourceLabel: 'Chủ ngữ 4', question: '4. (Drinking/Drink) enough water is important.', options: ['Drinking', 'Drink'], answer: 'Drinking', explanation: 'Danh động từ V-ing có thể làm chủ ngữ: Drinking.' },
      { id: 'd1-q5', type: 'bracket', sourceLabel: 'Chủ ngữ 5', question: '5. Their (strategic/strategy) is to target business people.', options: ['strategic', 'strategy'], answer: 'strategy', explanation: 'Sau tính từ sở hữu "Their" cần danh từ: strategy.' },
      { id: 'd1-q6', type: 'bracket', sourceLabel: 'Chủ ngữ 6', question: '6. The (competition/competitive) is still in the planning stage.', options: ['competition', 'competitive'], answer: 'competition', explanation: 'Sau "The" cần danh từ làm chủ ngữ: competition.' },
      { id: 'd1-q7', type: 'bracket', sourceLabel: 'Động từ 1', question: '1. These positions (require/requirement) extensive experience.', options: ['require', 'requirement'], answer: 'require', explanation: 'Câu cần động từ chính sau chủ ngữ số nhiều: require.' },
      { id: 'd1-q8', type: 'bracket', sourceLabel: 'Động từ 2', question: '2. All employees (to organize/should organize) their own weekly schedules.', options: ['to organize', 'should organize'], answer: 'should organize', explanation: 'Vị trí vị ngữ cần cụm động từ hoàn chỉnh: should organize.' },
      { id: 'd1-q9', type: 'bracket', sourceLabel: 'Động từ 3', question: '3. Mr. Lee (purchased/purchasing) new office furniture.', options: ['purchased', 'purchasing'], answer: 'purchased', explanation: 'Câu cần động từ chính chia thì: purchased.' },
      { id: 'd1-q10', type: 'bracket', sourceLabel: 'Động từ 4', question: '4. Dialogue (helpful/can help) people to resolve problems.', options: ['helpful', 'can help'], answer: 'can help', explanation: '"helpful" là tính từ; "can help" là vị ngữ đúng.' },
      { id: 'd1-q11', type: 'multiple', sourceLabel: 'Chủ ngữ 7', question: '7. The _____ of accidents should take priority in the workplace.', options: ['(A) prevent', '(B) prevented', '(C) prevention', '(D) preventive'], answer: 'C', explanation: 'Cần danh từ làm chủ ngữ: prevention.' },
      { id: 'd1-q12', type: 'multiple', sourceLabel: 'Chủ ngữ 8', question: '8. The _____ of a hospital wing will make room for more patients.', options: ['(A) construction', '(B) construct', '(C) constructed', '(D) constructive'], answer: 'A', explanation: 'Cần danh từ: construction.' },
      { id: 'd1-q13', type: 'multiple', sourceLabel: 'Chủ ngữ 9', question: '9. _____ should submit their evaluations of the new hair dryer before leaving.', options: ['(A) Participants', '(B) Participates', '(C) Participate', '(D) Participatory'], answer: 'A', explanation: 'Cần danh từ chỉ người làm chủ ngữ: Participants.' },
      { id: 'd1-q14', type: 'multiple', sourceLabel: 'Chủ ngữ 10', question: '10. Because of the financial manager’s poor performance, the _____ dismissed him.', options: ['(A) direct', '(B) directly', '(C) director', '(D) directed'], answer: 'C', explanation: 'Cần danh từ chỉ người: director.' },
      { id: 'd1-q15', type: 'multiple', sourceLabel: 'Động từ 5', question: '5. The conference _____ with a speech by the company’s president.', options: ['(A) will conclude', '(B) conclusion', '(C) concluding', '(D) to conclude'], answer: 'A', explanation: 'Câu thiếu động từ chính: will conclude.' },
      { id: 'd1-q16', type: 'multiple', sourceLabel: 'Động từ 6', question: '6. The members of the personnel department _____ every applicant’s file.', options: ['(A) to review', '(B) reviewing', '(C) reviewed', '(D) reviewer'], answer: 'C', explanation: 'Cần động từ chính chia thì: reviewed.' },
      { id: 'd1-q17', type: 'multiple', sourceLabel: 'Động từ 7', passage: memoPassage, question: '7. Chọn đáp án thích hợp điền vào chỗ trống (7).', options: ['(A) visitor', '(B) visiting', '(C) to visit', '(D) will visit'], answer: 'D', explanation: 'Sau "A client" cần động từ chính: will visit.' },
      { id: 'd1-q18', type: 'multiple', sourceLabel: 'Động từ 8', passage: memoPassage, question: '8. Chọn đáp án thích hợp điền vào chỗ trống (8).', options: ['(A) explainable', '(B) explanation', '(C) explains', '(D) explain'], answer: 'B', explanation: 'Sau tính từ "detailed" cần danh từ: explanation.' },
      { id: 'd1-q19', type: 'multiple', sourceLabel: 'Động từ 9', passage: memoPassage, question: '9. Chọn đáp án thích hợp điền vào chỗ trống (9).', options: ['(A) Thank you for your inquiry on this matter.', '(B) The meeting may have to be postponed.', '(C) Please review the material before then.', '(D) Confirmation of your schedule has been noted.'], answer: 'C', explanation: 'Ngữ cảnh yêu cầu đọc tài liệu trước buổi trao đổi: Please review the material before then.' },
    ],
  },
  {
    id: 'day-2',
    dayNo: 3,
    title: 'Từ vựng: Tuyển dụng',
    titleEn: 'Vocabulary: Recruitment',
    description: 'Học nhóm từ tuyển dụng: résumé, applicant, requirement, qualified, interview, hire.',
    descriptionEn: 'Study recruitment vocabulary: résumé, applicant, requirement, qualified, interview, hire.',
    pdfPath: '/assets/day-2.pdf',
    pdfTitle: 'Day 2 Vocabulary - Tuyển dụng.pdf',
    pdfMeta: 'Dung lượng: 700 KB · Tài liệu ôn thi TOEIC SHINE',
    pdfImages: pdfPageImages(2, 7),
    theorySlides: [
      {
        title: '1. Nhóm từ ứng tuyển',
        content: `résumé (n): sơ yếu lý lịch
opening (n): vị trí trống; sự mở cửa
applicant (n): ứng viên
apply (v): ứng tuyển, áp dụng
application (n): đơn ứng tuyển, sự ứng dụng
appliance (n): thiết bị, dụng cụ

Mẹo TOEIC:
applicant là người ứng tuyển, application là đơn/bản đăng ký, appliance là thiết bị. Ba từ này rất dễ bị nhiễu trong Part 5.`,
      },
      {
        title: '2. Điều kiện và năng lực',
        content: `requirement (n): yêu cầu, điều kiện cần thiết
require (v): yêu cầu
meet (v): đáp ứng, thỏa mãn
qualified (adj): đủ điều kiện
qualification (n): năng lực, phẩm chất
candidate (n): ứng viên, thí sinh

Cụm thường gặp:
meet requirements
be qualified for
qualifications for`,
      },
      {
        title: '3. Phỏng vấn và tuyển dụng',
        content: `confidence (n): sự tự tin, lòng tin
highly (adv): rất, hết sức
professional (adj/n): chuyên nghiệp; chuyên gia
interview (n/v): cuộc phỏng vấn; phỏng vấn
hire (v): tuyển dụng, thuê
training (n): sự đào tạo
reference (n): thư giới thiệu, sự tham khảo
position (n): vị trí, chức vụ
achievement (n): thành tích
eligible (adj): đủ tư cách
identify (v): nhận diện`,
      },
    ],
    questions: [
      { id: 'd2-q1', type: 'multiple', sourceLabel: 'Vocabulary 01', question: '01. applicant', options: ['(A) đào tạo, huấn luyện', '(B) sự giới thiệu, tham khảo', '(C) tuyển dụng', '(D) thỏa mãn, đáp ứng', '(E) ứng viên', '(F) có ấn tượng'], answer: 'E', explanation: 'applicant là ứng viên/người xin việc.' },
      { id: 'd2-q2', type: 'multiple', sourceLabel: 'Vocabulary 02', question: '02. impressed', options: ['(A) đào tạo, huấn luyện', '(B) sự giới thiệu, tham khảo', '(C) tuyển dụng', '(D) thỏa mãn, đáp ứng', '(E) ứng viên', '(F) có ấn tượng'], answer: 'F', explanation: 'impressed nghĩa là có ấn tượng/cảm phục.' },
      { id: 'd2-q3', type: 'multiple', sourceLabel: 'Vocabulary 03', question: '03. training', options: ['(A) đào tạo, huấn luyện', '(B) sự giới thiệu, tham khảo', '(C) tuyển dụng', '(D) thỏa mãn, đáp ứng', '(E) ứng viên', '(F) có ấn tượng'], answer: 'A', explanation: 'training là sự đào tạo/huấn luyện.' },
      { id: 'd2-q4', type: 'multiple', sourceLabel: 'Vocabulary 04', question: '04. meet', options: ['(A) đào tạo, huấn luyện', '(B) sự giới thiệu, tham khảo', '(C) tuyển dụng', '(D) thỏa mãn, đáp ứng', '(E) ứng viên', '(F) có ấn tượng'], answer: 'D', explanation: 'meet requirements = đáp ứng yêu cầu.' },
      { id: 'd2-q5', type: 'multiple', sourceLabel: 'Vocabulary 05', question: '05. reference', options: ['(A) đào tạo, huấn luyện', '(B) sự giới thiệu, tham khảo', '(C) tuyển dụng', '(D) thỏa mãn, đáp ứng', '(E) ứng viên', '(F) có ấn tượng'], answer: 'B', explanation: 'reference là sự giới thiệu/tham khảo.' },
      { id: 'd2-q6', type: 'multiple', sourceLabel: 'Vocabulary 06', question: '06. Mark’s ________ language skills helped him to get the job.', options: ['(A) candidate', '(B) excellent', '(C) managerial', '(D) interview', '(E) hire', '(F) qualify', '(G) qualified', '(H) profession'], answer: 'B', explanation: 'excellent language skills = kỹ năng ngôn ngữ xuất sắc.' },
      { id: 'd2-q7', type: 'multiple', sourceLabel: 'Vocabulary 07', question: '07. The ________ with a business major wants to work as a manager.', options: ['(A) candidate', '(B) excellent', '(C) managerial', '(D) interview', '(E) hire', '(F) qualify', '(G) qualified', '(H) profession'], answer: 'A', explanation: 'candidate là ứng viên/thí sinh.' },
      { id: 'd2-q8', type: 'multiple', sourceLabel: 'Vocabulary 08', question: '08. The store will ________ five people to work at the recently opened branch.', options: ['(A) candidate', '(B) excellent', '(C) managerial', '(D) interview', '(E) hire', '(F) qualify', '(G) qualified', '(H) profession'], answer: 'E', explanation: 'will + động từ nguyên thể: hire.' },
      { id: 'd2-q9', type: 'multiple', sourceLabel: 'Vocabulary 09', question: '09. Only those who are proficient in programming are ________ to apply.', options: ['(A) candidate', '(B) excellent', '(C) managerial', '(D) interview', '(E) hire', '(F) qualify', '(G) qualified', '(H) profession'], answer: 'G', explanation: 'be qualified to apply = đủ điều kiện ứng tuyển.' },
      { id: 'd2-q10', type: 'multiple', sourceLabel: 'Vocabulary 10', question: '10. During the ________, Jennifer was asked some difficult questions.', options: ['(A) candidate', '(B) excellent', '(C) managerial', '(D) interview', '(E) hire', '(F) qualify', '(G) qualified', '(H) profession'], answer: 'D', explanation: 'during the interview = trong buổi phỏng vấn.' },
    ],
  },
  {
    id: 'day-3',
    dayNo: 4,
    title: 'Thành phần câu: Tân ngữ và Bổ ngữ',
    titleEn: 'Sentence Components: Object & Complement',
    description: 'Phân biệt tân ngữ chịu tác động của động từ và bổ ngữ bổ sung thông tin.',
    descriptionEn: 'Distinguish objects affected by verbs and complements that complete meaning.',
    pdfPath: '/assets/day-3.pdf',
    pdfTitle: 'Day 3 Reading - Tân ngữ & Bổ ngữ.pdf',
    pdfMeta: 'Dung lượng: 439 KB · Tài liệu ôn thi TOEIC SHINE',
    pdfImages: pdfPageImages(3, 5),
    theorySlides: [
      {
        title: '1. Tân ngữ là gì?',
        content: `Tân ngữ là người/vật/sự việc đứng sau động từ và chịu tác động của động từ.

Ví dụ:
I like teachers.
=> "teachers" là tân ngữ của động từ "like".

Tân ngữ thường đứng ngay sau động từ:
Mr. Kim met the marketing manager.`,
      },
      {
        title: '2. Bổ ngữ là gì?',
        content: `Bổ ngữ là từ/cụm từ bổ sung thông tin cho thành phần khác trong câu.

Bổ ngữ của chủ ngữ:
She is a secretary.
=> "a secretary" bổ nghĩa cho "She".

Bổ ngữ của tân ngữ:
The news made the workers happy.
=> "happy" bổ nghĩa cho "the workers".`,
      },
      {
        title: '3. Từ loại thường gặp',
        content: `Tân ngữ có thể là:
1. Danh từ: opened a branch
2. Đại từ: know her
3. Danh động từ: finished preparing
4. To + V: wants to see
5. Mệnh đề danh ngữ: asked that we update

Bổ ngữ có thể là:
1. Danh từ: is an accountant
2. Danh động từ: is cutting costs
3. To + V: is to expand
4. Mệnh đề danh từ: is that...
5. Tính từ: is reliable / found the hotel comfortable`,
      },
    ],
    questions: [
      { id: 'd3-q1', type: 'bracket', sourceLabel: 'Tân ngữ 1', question: '1. He reported the (problem/problematic) to the administrator.', options: ['problem', 'problematic'], answer: 'problem', explanation: 'Sau động từ "reported" cần tân ngữ là danh từ: problem.' },
      { id: 'd3-q2', type: 'bracket', sourceLabel: 'Tân ngữ 2', question: '2. We signed an (agree/agreement) with a foreign company.', options: ['agree', 'agreement'], answer: 'agreement', explanation: 'Sau mạo từ "an" cần danh từ: agreement.' },
      { id: 'd3-q3', type: 'bracket', sourceLabel: 'Tân ngữ 3', question: '3. Many young consumers prefer (to shop/shop) online.', options: ['to shop', 'shop'], answer: 'to shop', explanation: 'prefer có thể đi với to-V làm tân ngữ: to shop.' },
      { id: 'd3-q4', type: 'bracket', sourceLabel: 'Tân ngữ 4', question: '4. The labor union demanded the (resign/resignation) of the president.', options: ['resign', 'resignation'], answer: 'resignation', explanation: 'Sau "the" cần danh từ: resignation.' },
      { id: 'd3-q5', type: 'bracket', sourceLabel: 'Tân ngữ 5', question: '5. Mr. Kato considered (launching/launch) a campaign to promote the new product.', options: ['launching', 'launch'], answer: 'launching', explanation: 'consider thường đi với V-ing: launching.' },
      { id: 'd3-q6', type: 'bracket', sourceLabel: 'Tân ngữ 6', question: '6. Flyaway Service guarantees (deliver/delivery) within three days.', options: ['deliver', 'delivery'], answer: 'delivery', explanation: 'guarantees cần tân ngữ danh từ: delivery.' },
      { id: 'd3-q7', type: 'multiple', sourceLabel: 'Tân ngữ 7', question: '7. The event organizer will arrange the _____ according to the host’s requests.', options: ['(A) received', '(B) reception', '(C) receptive', '(D) receptively'], answer: 'B', explanation: 'Cần danh từ làm tân ngữ: reception.' },
      { id: 'd3-q8', type: 'multiple', sourceLabel: 'Tân ngữ 8', question: '8. Some employees have the _____ of working from home.', options: ['(A) benefited', '(B) beneficially', '(C) beneficial', '(D) benefit'], answer: 'D', explanation: 'the benefit of = lợi ích của.' },
      { id: 'd3-q9', type: 'multiple', sourceLabel: 'Tân ngữ 9', question: '9. The proper _____ of equipment can prevent workers from being injured.', options: ['(A) utilization', '(B) utilize', '(C) utilizes', '(D) utilized'], answer: 'A', explanation: 'Sau tính từ "proper" cần danh từ: utilization.' },
      { id: 'd3-q10', type: 'multiple', sourceLabel: 'Tân ngữ 10', question: '10. Mr. Hornby immediately recognized the _____ between the two camera models.', options: ['(A) difference', '(B) differ', '(C) different', '(D) differs'], answer: 'A', explanation: 'Sau "the" cần danh từ: difference.' },
      { id: 'd3-q11', type: 'bracket', sourceLabel: 'Bổ ngữ 1', question: '1. Our renovated offices are (spacious/spaciously) and have high ceilings.', options: ['spacious', 'spaciously'], answer: 'spacious', explanation: 'Sau linking verb "are" cần tính từ làm bổ ngữ: spacious.' },
      { id: 'd3-q12', type: 'bracket', sourceLabel: 'Bổ ngữ 2', question: '2. Impressive performances made the play (popular/popularly).', options: ['popular', 'popularly'], answer: 'popular', explanation: 'Bổ ngữ của tân ngữ "the play" là tính từ: popular.' },
      { id: 'd3-q13', type: 'bracket', sourceLabel: 'Bổ ngữ 3', question: '3. Airplane tickets are not (transferable/transfer) to other individuals.', options: ['transferable', 'transfer'], answer: 'transferable', explanation: 'Sau "are not" cần tính từ bổ ngữ: transferable.' },
      { id: 'd3-q14', type: 'bracket', sourceLabel: 'Bổ ngữ 4', question: '4. We consider Ms. Elson a qualified (apply/applicant).', options: ['apply', 'applicant'], answer: 'applicant', explanation: 'Cụm bổ ngữ cần danh từ chỉ người: applicant.' },
      { id: 'd3-q15', type: 'bracket', sourceLabel: 'Bổ ngữ 5', question: '5. It is (advise/advisable) to obtain a second opinion before you make an investment.', options: ['advise', 'advisable'], answer: 'advisable', explanation: 'Sau "It is" cần tính từ: advisable.' },
      { id: 'd3-q16', type: 'bracket', sourceLabel: 'Bổ ngữ 6', question: '6. Jack is a (manager/manage) of the human resources department.', options: ['manager', 'manage'], answer: 'manager', explanation: 'Sau mạo từ "a" cần danh từ: manager.' },
      { id: 'd3-q17', type: 'multiple', sourceLabel: 'Bổ ngữ 7', question: '7. The tour was a big _____ to the travelers who signed up for it.', options: ['(A) disappointing', '(B) disappointedly', '(C) disappoint', '(D) disappointment'], answer: 'D', explanation: 'Sau "a big" cần danh từ: disappointment.' },
      { id: 'd3-q18', type: 'multiple', sourceLabel: 'Bổ ngữ 8', question: '8. Researchers found the recycling system _____ in reducing garbage.', options: ['(A) effect', '(B) effects', '(C) effective', '(D) effectively'], answer: 'C', explanation: 'Bổ ngữ của tân ngữ "system" là tính từ: effective.' },
      { id: 'd3-q19', type: 'multiple', sourceLabel: 'Bổ ngữ 9', question: '9. Steven Williams was a market _____ for KMN Incorporated.', options: ['(A) analyze', '(B) analyzes', '(C) analyst', '(D) analyzing'], answer: 'C', explanation: 'Sau "a market" cần danh từ chỉ người/nghề: analyst.' },
      { id: 'd3-q20', type: 'multiple', sourceLabel: 'Bổ ngữ 10', question: '10. State governments and local citizens have been _____ in developing and financing educational programs.', options: ['(A) cooperative', '(B) cooperate', '(C) cooperated', '(D) cooperatively'], answer: 'A', explanation: 'Sau "have been" cần tính từ bổ ngữ: cooperative.' },
    ],
  },
  {
    id: 'day-4',
    dayNo: 5,
    title: 'Từ vựng: Phép tắc và Quy định',
    titleEn: 'Vocabulary: Rules & Regulations',
    description: 'Học nhóm từ về chính sách, quy định, quyền truy cập, phê duyệt và kiểm tra.',
    descriptionEn: 'Study vocabulary about policies, regulations, access, approval, and inspection.',
    pdfPath: '/assets/day-4.pdf',
    pdfTitle: 'Day 4 Vocabulary - Phép tắc & Quy định.pdf',
    pdfMeta: 'Dung lượng: 647 KB · Tài liệu ôn thi TOEIC SHINE',
    pdfImages: pdfPageImages(4, 8),
    theorySlides: [
      {
        title: '1. Quy định và tuân thủ',
        content: `attire (n): trang phục, cách ăn mặc
code (n): quy định, điều lệ, mật mã
policy (n): chính sách, quy chế
comply (v): tuân thủ
compliance (n): sự tuân thủ
regulation (n): quy định, quy tắc

Cụm cần nhớ:
comply with regulations
safety regulations
dress code`,
      },
      {
        title: '2. Ngoại lệ, quyền truy cập và phê duyệt',
        content: `exception (n): ngoại lệ
adhere to (v): tuân thủ, bám sát
refrain from (v): kiềm chế, hạn chế làm gì
permission (n): sự cho phép
access (n/v): quyền truy cập; truy cập
approval (n): sự phê duyệt

Cụm cần nhớ:
with the exception of
adhere to policies
have access to
obtain approval`,
      },
      {
        title: '3. Sửa đổi, kiểm tra và sắp xếp',
        content: `thoroughly (adv): một cách kỹ lưỡng
revise (v): sửa đổi
approach (n): cách tiếp cận
form (n): hình thức, loại
immediately (adv): ngay lập tức
inspection (n): sự kiểm tra
arrangement (n): sự sắp xếp

Cụm cần nhớ:
a form of identification
immediately after
facility inspection
make arrangements for`,
      },
    ],
    questions: [
      { id: 'd4-q1', type: 'multiple', sourceLabel: 'Vocabulary 01', question: '01. access', options: ['(A) truy cập', '(B) xem xét, kiểm tra', '(C) ngay lập tức', '(D) sự chấp thuận, sự phê duyệt', '(E) trang trọng', '(F) biên soạn', '(G) sự thành lập'], answer: 'A', explanation: 'access nghĩa là quyền truy cập hoặc truy cập.' },
      { id: 'd4-q2', type: 'multiple', sourceLabel: 'Vocabulary 02', question: '02. approval', options: ['(A) truy cập', '(B) xem xét, kiểm tra', '(C) ngay lập tức', '(D) sự chấp thuận, sự phê duyệt', '(E) trang trọng', '(F) biên soạn', '(G) sự thành lập'], answer: 'D', explanation: 'approval là sự chấp thuận/phê duyệt.' },
      { id: 'd4-q3', type: 'multiple', sourceLabel: 'Vocabulary 03', question: '03. immediately', options: ['(A) truy cập', '(B) xem xét, kiểm tra', '(C) ngay lập tức', '(D) sự chấp thuận, sự phê duyệt', '(E) trang trọng', '(F) biên soạn', '(G) sự thành lập'], answer: 'C', explanation: 'immediately nghĩa là ngay lập tức.' },
      { id: 'd4-q4', type: 'multiple', sourceLabel: 'Vocabulary 04', question: '04. formal', options: ['(A) truy cập', '(B) xem xét, kiểm tra', '(C) ngay lập tức', '(D) sự chấp thuận, sự phê duyệt', '(E) trang trọng', '(F) biên soạn', '(G) sự thành lập'], answer: 'E', explanation: 'formal nghĩa là trang trọng.' },
      { id: 'd4-q5', type: 'multiple', sourceLabel: 'Vocabulary 05', question: '05. inspect', options: ['(A) truy cập', '(B) xem xét, kiểm tra', '(C) ngay lập tức', '(D) sự chấp thuận, sự phê duyệt', '(E) trang trọng', '(F) biên soạn', '(G) sự thành lập'], answer: 'B', explanation: 'inspect nghĩa là xem xét/kiểm tra.' },
      { id: 'd4-q6', type: 'multiple', sourceLabel: 'Vocabulary 06', question: '06. A(n) ________ of office equipment will be conducted on Monday.', options: ['(A) Effect', '(B) Concern', '(C) Approach', '(D) Revise', '(E) Arrangements', '(F) Thoroughly', '(G) Permit', '(H) Inspection'], answer: 'H', explanation: 'an inspection of office equipment = một cuộc kiểm tra thiết bị văn phòng.' },
      { id: 'd4-q7', type: 'multiple', sourceLabel: 'Vocabulary 07', question: '07. The ________ for the meeting will be carried out by the personnel department.', options: ['(A) Effect', '(B) Concern', '(C) Approach', '(D) Revise', '(E) Arrangements', '(F) Thoroughly', '(G) Permit', '(H) Inspection'], answer: 'E', explanation: 'arrangements for the meeting = các sắp xếp cho cuộc họp.' },
      { id: 'd4-q8', type: 'multiple', sourceLabel: 'Vocabulary 08', question: '08. Secretarial staff ______ reviewed the new work schedule before finalizing it.', options: ['(A) Effect', '(B) Concern', '(C) Approach', '(D) Revise', '(E) Arrangements', '(F) Thoroughly', '(G) Permit', '(H) Inspection'], answer: 'F', explanation: 'thoroughly reviewed = xem xét kỹ lưỡng.' },
      { id: 'd4-q9', type: 'multiple', sourceLabel: 'Vocabulary 09', question: '09. Those without the security band will not be _______ to enter the company.', options: ['(A) Effect', '(B) Concern', '(C) Approach', '(D) Revise', '(E) Arrangements', '(F) Thoroughly', '(G) Permit', '(H) Inspection'], answer: 'G', explanation: 'be permitted to enter = được phép vào.' },
      { id: 'd4-q10', type: 'multiple', sourceLabel: 'Vocabulary 10', question: '10. Do you have any _________ for the problem I have mentioned?', options: ['(A) Effect', '(B) Concern', '(C) Approach', '(D) Revise', '(E) Arrangements', '(F) Thoroughly', '(G) Permit', '(H) Inspection'], answer: 'B', explanation: 'concern for/about a problem = mối quan ngại về vấn đề.' },
    ],
  },
  {
    id: 'day-5',
    dayNo: 6,
    title: 'Từ loại: Danh từ',
    titleEn: 'Parts of Speech: Nouns',
    description: 'Học vị trí danh từ, danh từ đếm được và không đếm được trong TOEIC.',
    descriptionEn: 'Learn noun positions, countable nouns, and uncountable nouns in TOEIC.',
    pdfPath: '/assets/day-5.pdf',
    pdfTitle: 'Day 5 Reading - Danh từ.pdf',
    pdfMeta: 'Dung lượng: 270 KB · Tài liệu ôn thi TOEIC SHINE',
    pdfImages: pdfPageImages(5, 5),
    theorySlides: [
      {
        title: '1. Danh từ là gì?',
        content: `Danh từ là từ chỉ người, vật, địa điểm, sự việc hoặc khái niệm.

Ví dụ:
mother, house, air, location, discussion, journalist.

Trong câu TOEIC, danh từ thường xuất hiện ở vị trí chủ ngữ, tân ngữ hoặc bổ ngữ.`,
      },
      {
        title: '2. Vị trí của danh từ',
        content: `Danh từ có thể đứng:
1. Ở vị trí chủ ngữ:
The location is ideal for the office.

2. Ở vị trí tân ngữ:
We had a discussion about the news.

3. Ở vị trí bổ ngữ:
Mr. Manning is a journalist.

Danh từ cũng thường đứng sau mạo từ, tính từ sở hữu hoặc tính từ.`,
      },
      {
        title: '3. Đếm được và không đếm được',
        content: `Danh từ đếm được có số ít/số nhiều:
a camera, documents, prices, results.

Danh từ không đếm được không dùng a/an và không thêm s:
access, advice, baggage, equipment, furniture, information, luggage, news, stationery.

Mẹo TOEIC:
equipment, information, advice, luggage thường gây bẫy vì tiếng Việt nghe như có thể đếm được.`,
      },
    ],
    questions: [
      { id: 'd5-q1', type: 'bracket', sourceLabel: 'Vị trí danh từ 1', question: '1. Our company strengthened (security, secure) by hiring more guards.', options: ['security', 'secure'], answer: 'security', explanation: 'Cần danh từ làm tân ngữ: security.' },
      { id: 'd5-q2', type: 'bracket', sourceLabel: 'Vị trí danh từ 2', question: '2. The (grow, growth) of the information technology market was larger than expected.', options: ['grow', 'growth'], answer: 'growth', explanation: 'Sau "The" cần danh từ: growth.' },
      { id: 'd5-q3', type: 'bracket', sourceLabel: 'Vị trí danh từ 3', question: '3. Oil companies earned a (profit, profitable) during the last quarter.', options: ['profit', 'profitable'], answer: 'profit', explanation: 'Sau mạo từ "a" cần danh từ: profit.' },
      { id: 'd5-q4', type: 'bracket', sourceLabel: 'Vị trí danh từ 4', question: '4. There will be a (technician, technical) to repair the faulty equipment.', options: ['technician', 'technical'], answer: 'technician', explanation: 'Sau "a" cần danh từ chỉ người: technician.' },
      { id: 'd5-q5', type: 'bracket', sourceLabel: 'Vị trí danh từ 5', question: '5. Thomas has to show his (identify, identification) to enter the laboratory.', options: ['identify', 'identification'], answer: 'identification', explanation: 'Sau tính từ sở hữu "his" cần danh từ: identification.' },
      { id: 'd5-q6', type: 'bracket', sourceLabel: 'Vị trí danh từ 6', question: '6. The movie drew widespread (criticism, criticize).', options: ['criticism', 'criticize'], answer: 'criticism', explanation: 'Cần danh từ làm tân ngữ: criticism.' },
      { id: 'd5-q7', type: 'multiple', sourceLabel: 'Vị trí danh từ 7', question: '7. The company needs a _____ of recent comments from its product users.', options: ['(A) summarize', '(B) summary', '(C) summarizes', '(D) summarized'], answer: 'B', explanation: 'Sau "a" cần danh từ: summary.' },
      { id: 'd5-q8', type: 'multiple', sourceLabel: 'Vị trí danh từ 8', question: '8. He immediately _____ the ideas submitted by the committee.', options: ['(A) rejected', '(B) rejecting', '(C) rejection', '(D) to reject'], answer: 'A', explanation: 'Cần động từ chính chia thì: rejected.' },
      { id: 'd5-q9', type: 'multiple', sourceLabel: 'Vị trí danh từ 9', question: '9. The loan application was given final _____ by the bank.', options: ['(A) approved', '(B) approving', '(C) approve', '(D) approval'], answer: 'D', explanation: 'Sau tính từ "final" cần danh từ: approval.' },
      { id: 'd5-q10', type: 'multiple', sourceLabel: 'Vị trí danh từ 10', question: '10. As soon as an _____ of the budget is completed, the report will be reviewed by the boards of directors.', options: ['(A) evaluation', '(B) evaluate', '(C) evaluative', '(D) evaluating'], answer: 'A', explanation: 'Sau "an" cần danh từ: evaluation.' },
      { id: 'd5-q11', type: 'bracket', sourceLabel: 'Đếm được/không đếm được 1', question: '1. Diana obtained (access, accesses) to the classified files.', options: ['access', 'accesses'], answer: 'access', explanation: 'access là danh từ không đếm được trong cụm obtain access to.' },
      { id: 'd5-q12', type: 'bracket', sourceLabel: 'Đếm được/không đếm được 2', question: '2. The supplier offers many different types of (equipments, equipment).', options: ['equipments', 'equipment'], answer: 'equipment', explanation: 'equipment là danh từ không đếm được.' },
      { id: 'd5-q13', type: 'bracket', sourceLabel: 'Đếm được/không đếm được 3', question: '3. Mr. Anderson received some (advice, advices) from his coworkers.', options: ['advice', 'advices'], answer: 'advice', explanation: 'advice là danh từ không đếm được.' },
      { id: 'd5-q14', type: 'bracket', sourceLabel: 'Đếm được/không đếm được 4', question: '4. Jennifer will stay in Hong Kong for (a month, month) to hire more engineers.', options: ['a month', 'month'], answer: 'a month', explanation: 'month là danh từ đếm được số ít nên cần a.' },
      { id: 'd5-q15', type: 'bracket', sourceLabel: 'Đếm được/không đếm được 5', question: '5. He reported his missing (luggages, luggage) to an airline official.', options: ['luggages', 'luggage'], answer: 'luggage', explanation: 'luggage là danh từ không đếm được.' },
      { id: 'd5-q16', type: 'bracket', sourceLabel: 'Đếm được/không đếm được 6', question: '6. The store will provide (discount, discounts) on selected items starting next week.', options: ['discount', 'discounts'], answer: 'discounts', explanation: 'discount là danh từ đếm được, ở đây dùng dạng số nhiều.' },
      { id: 'd5-q17', type: 'multiple', sourceLabel: 'Đếm được/không đếm được 7', question: '7. The researchers must check the _____ of the recently published study.', options: ['(A) refer', '(B) referenced', '(C) referential', '(D) references'], answer: 'D', explanation: 'Cần danh từ số nhiều: references.' },
      { id: 'd5-q18', type: 'multiple', sourceLabel: 'Đếm được/không đếm được 8', question: '8. The director has asked us to send monthly _____ to Ms. Shriver in the finance department.', options: ['(A) statements', '(B) statement', '(C) states', '(D) state'], answer: 'A', explanation: 'monthly statements = các bản sao kê/báo cáo hàng tháng.' },
      { id: 'd5-q19', type: 'multiple', sourceLabel: 'Đếm được/không đếm được 9', question: '9. Customers who signed up for a free trial should make a request for necessary _____.', options: ['(A) informed', '(B) information', '(C) inform', '(D) informations'], answer: 'B', explanation: 'information là danh từ không đếm được.' },
      { id: 'd5-q20', type: 'multiple', sourceLabel: 'Đếm được/không đếm được 10', question: '10. _____ of the labor union met with management to discuss the contract for the next year.', options: ['(A) Represent', '(B) Representing', '(C) Representatives', '(D) Representatives'], answer: 'D', explanation: 'Theo key PDF: (D). Câu cần danh từ số nhiều làm chủ ngữ: Representatives.' },
    ],
  },
  {
    id: 'day-6',
    dayNo: 7,
    title: 'Từ vựng: Công việc văn phòng (1)',
    titleEn: 'Vocabulary: Office Work (1)',
    description: 'Học nhóm từ về deadline, submit, instruction, management, notify và perform.',
    descriptionEn: 'Study office-work vocabulary: deadline, submit, instruction, management, notify, and perform.',
    pdfPath: '/assets/day-6.pdf',
    pdfTitle: 'Day 6 Vocabulary - Công việc văn phòng (1).pdf',
    pdfMeta: 'Dung lượng: 513 KB · Tài liệu ôn thi TOEIC SHINE',
    pdfImages: pdfPageImages(6, 8),
    theorySlides: [
      {
        title: '1. Công việc và bộ phận',
        content: `accustomed (adj): quen với
corporation (n): công ty, tập đoàn
corporate (adj): thuộc về tập đoàn
demanding (adj): đòi hỏi khắt khe
colleague (n): đồng nghiệp
division (n): bộ phận, sự phân chia

Cụm cần nhớ:
be accustomed to -ing
corporation khác corporate
automobile division`,
      },
      {
        title: '2. Yêu cầu, quản lý và nộp hồ sơ',
        content: `request (n/v): yêu cầu
efficiently (adv): một cách hiệu quả
manage (v): quản lý, xoay sở
management (n): sự quản lý, ban điều hành
submit (v): nộp, đệ trình
directly (adv): trực tiếp

Cụm cần nhớ:
upon request
request for
manage to do
submit A to B
report directly`,
      },
      {
        title: '3. Nhắc nhở, hướng dẫn và thực hiện',
        content: `remind (v): nhắc nhở
instruct (v): hướng dẫn, chỉ thị
instruction (n): lời chỉ dẫn
deadline (n): hạn chót, thời hạn
sample (n/v): mẫu thử; thử
notify (v): thông báo
perform (v): thi hành, thực hiện
monitor (v): giám sát, theo dõi
deserve (v): xứng đáng
assignment (n): nhiệm vụ
entire (adj): toàn bộ`,
      },
    ],
    questions: [
      { id: 'd6-q1', type: 'multiple', sourceLabel: 'Vocabulary 01', question: '01. deadline', options: ['(A) vật thử, mẫu thử', '(B) thông báo, cho biết', '(C) hạn chót, thời hạn', '(D) nộp, đệ trình', '(E) thi hành, thực hiện, hoạt động', '(F) xứng đáng', '(G) chỉ dẫn'], answer: 'C', explanation: 'deadline nghĩa là hạn chót/thời hạn.' },
      { id: 'd6-q2', type: 'multiple', sourceLabel: 'Vocabulary 02', question: '02. submit', options: ['(A) vật thử, mẫu thử', '(B) thông báo, cho biết', '(C) hạn chót, thời hạn', '(D) nộp, đệ trình', '(E) thi hành, thực hiện, hoạt động', '(F) xứng đáng', '(G) chỉ dẫn'], answer: 'D', explanation: 'submit nghĩa là nộp/đệ trình.' },
      { id: 'd6-q3', type: 'multiple', sourceLabel: 'Vocabulary 03', question: '03. sample', options: ['(A) vật thử, mẫu thử', '(B) thông báo, cho biết', '(C) hạn chót, thời hạn', '(D) nộp, đệ trình', '(E) thi hành, thực hiện, hoạt động', '(F) xứng đáng', '(G) chỉ dẫn'], answer: 'A', explanation: 'sample là vật mẫu/mẫu thử.' },
      { id: 'd6-q4', type: 'multiple', sourceLabel: 'Vocabulary 04', question: '04. perform', options: ['(A) vật thử, mẫu thử', '(B) thông báo, cho biết', '(C) hạn chót, thời hạn', '(D) nộp, đệ trình', '(E) thi hành, thực hiện, hoạt động', '(F) xứng đáng', '(G) chỉ dẫn'], answer: 'E', explanation: 'perform nghĩa là thi hành/thực hiện/hoạt động.' },
      { id: 'd6-q5', type: 'multiple', sourceLabel: 'Vocabulary 05', question: '05. notify', options: ['(A) vật thử, mẫu thử', '(B) thông báo, cho biết', '(C) hạn chót, thời hạn', '(D) nộp, đệ trình', '(E) thi hành, thực hiện, hoạt động', '(F) xứng đáng', '(G) chỉ dẫn'], answer: 'B', explanation: 'notify nghĩa là thông báo/cho biết.' },
      { id: 'd6-q6', type: 'multiple', sourceLabel: 'Vocabulary 06', question: '06. They were __________ to remove the vehicles from the site immediately as they were causing an obstruction.', options: ['(A) Instruct', '(B) Instructing', '(C) Instructed', '(D) Instruction'], answer: 'C', explanation: 'Câu bị động cần quá khứ phân từ: were instructed to remove.' },
      { id: 'd6-q7', type: 'multiple', sourceLabel: 'Vocabulary 07', question: '07. Has she had any experience of ________ large projects?', options: ['(A) Managing', '(B) Manage', '(C) Managed', '(D) Manageable'], answer: 'A', explanation: 'Sau giới từ "of" cần V-ing: managing.' },
      { id: 'd6-q8', type: 'multiple', sourceLabel: 'Vocabulary 08', question: '08. Randy’s ________ schedule made him work all last week.', options: ['(A) oversee', '(B) demanding', '(C) entire', '(D) convey', '(E) monitor'], answer: 'B', explanation: 'demanding schedule = lịch trình đòi hỏi khắt khe.' },
      { id: 'd6-q9', type: 'multiple', sourceLabel: 'Vocabulary 09', question: '09. A supervisor must be on hand to ________ the power station at all times.', options: ['(A) oversee', '(B) demanding', '(C) entire', '(D) convey', '(E) monitor'], answer: 'E', explanation: 'monitor the power station = giám sát nhà máy điện.' },
      { id: 'd6-q10', type: 'multiple', sourceLabel: 'Vocabulary 10', question: '10. The _______ office facility is being renovated for the first time in 40 years.', options: ['(A) oversee', '(B) demanding', '(C) entire', '(D) convey', '(E) monitor'], answer: 'C', explanation: 'entire office facility = toàn bộ cơ sở văn phòng.' },
    ],
  },
  {
    id: 'day-7',
    dayNo: 8,
    title: 'Từ loại: Đại từ',
    titleEn: 'Parts of Speech: Pronouns',
    description: 'Học đại từ nhân xưng, đại từ chỉ định và đại từ bất định trong TOEIC.',
    descriptionEn: 'Study personal pronouns, demonstratives, and indefinite pronouns in TOEIC.',
    pdfPath: '/assets/day-7.pdf',
    pdfTitle: 'Day 7 Reading - Đại từ.pdf',
    pdfMeta: 'Dung lượng: 274 KB · Tài liệu ôn thi TOEIC SHINE',
    pdfImages: pdfPageImages(7, 6),
    theorySlides: [
      {
        title: '1. Đại từ nhân xưng',
        content: `Đại từ thay thế cho danh từ đã nhắc trước đó để tránh lặp từ.

Đại từ chủ ngữ đứng ở vị trí chủ ngữ:
She opened a new bank account.

Đại từ tân ngữ đứng ở vị trí tân ngữ:
The host showed me the living room.

Tính từ sở hữu đứng trước danh từ:
Mr. Jones was satisfied with his salary.

Đại từ sở hữu có thể đứng độc lập:
Hers has two. / He likes mine.

Đại từ phản thân dùng khi chủ ngữ và tân ngữ cùng một đối tượng hoặc để nhấn mạnh:
Bob introduced himself.`,
      },
      {
        title: '2. Đại từ chỉ định',
        content: `that/those dùng để tránh lặp lại danh từ trong so sánh.

that thay danh từ số ít:
Our printer is cheaper than that of our competitor.

those thay danh từ số nhiều:
This week's reviews are better than those from last week.

Tính từ chỉ định đứng trước danh từ:
this/that + danh từ số ít
these/those + danh từ số nhiều`,
      },
      {
        title: '3. Đại từ bất định',
        content: `some thường dùng trong câu khẳng định.
any thường dùng trong câu phủ định, nghi vấn hoặc điều kiện.

Với 2 đối tượng:
one = một cái
the other = cái còn lại

Với 3 đối tượng trở lên:
one = một cái
another = một cái khác
others = những cái khác
the others = toàn bộ những cái còn lại`,
      },
    ],
    questions: [
      { id: 'd7-q1', type: 'bracket', sourceLabel: 'Đại từ nhân xưng 1', question: '1. (They/Their) are planning to go on vacation next Friday.', options: ['They', 'Their'], answer: 'They', explanation: 'Vị trí chủ ngữ cần đại từ chủ ngữ: They.' },
      { id: 'd7-q2', type: 'bracket', sourceLabel: 'Đại từ nhân xưng 2', question: '2. Mr. Ford was late for (him/his) physical examination.', options: ['him', 'his'], answer: 'his', explanation: 'Trước danh từ "physical examination" cần tính từ sở hữu: his.' },
      { id: 'd7-q3', type: 'bracket', sourceLabel: 'Đại từ nhân xưng 3', question: '3. We would like to read other book reviews before we write (our/ours).', options: ['our', 'ours'], answer: 'ours', explanation: 'Cần đại từ sở hữu đứng độc lập: ours.' },
      { id: 'd7-q4', type: 'bracket', sourceLabel: 'Đại từ nhân xưng 4', question: '4. Alice assisted (us/our) with preparations for the next seminar.', options: ['us', 'our'], answer: 'us', explanation: 'Sau động từ "assisted" cần đại từ tân ngữ: us.' },
      { id: 'd7-q5', type: 'bracket', sourceLabel: 'Đại từ nhân xưng 5', question: '5. The employees dealt with the problem by (them/themselves).', options: ['them', 'themselves'], answer: 'themselves', explanation: 'by themselves = tự họ.' },
      { id: 'd7-q6', type: 'bracket', sourceLabel: 'Đại từ nhân xưng 6', question: '6. Nurses must check on (them/their) patients frequently.', options: ['them', 'their'], answer: 'their', explanation: 'Trước danh từ "patients" cần tính từ sở hữu: their.' },
      { id: 'd7-q7', type: 'multiple', sourceLabel: 'Đại từ nhân xưng 7', question: '7. Companies should examine the environmental effects of ______ activities.', options: ['(A) they', '(B) their', '(C) themselves', '(D) them'], answer: 'B', explanation: 'Trước danh từ "activities" cần tính từ sở hữu: their.' },
      { id: 'd7-q8', type: 'multiple', sourceLabel: 'Đại từ nhân xưng 8', question: '8. A consultant visited the office and gave several ______ about our work system.', options: ['(A) recommending', '(B) recommend', '(C) recommendation', '(D) recommendations'], answer: 'D', explanation: 'Sau "several" cần danh từ số nhiều: recommendations.' },
      { id: 'd7-q9', type: 'multiple', sourceLabel: 'Đại từ nhân xưng 9', question: '9. _______ may order office supplies from this store’s catalog.', options: ['(A) You', '(B) Your', '(C) Yours', '(D) Yourself'], answer: 'A', explanation: 'Vị trí chủ ngữ cần đại từ chủ ngữ: You.' },
      { id: 'd7-q10', type: 'multiple', sourceLabel: 'Đại từ nhân xưng 10', question: '10. Ms. Thompson told the organizer that she would do all of the cooking for the event by ______.', options: ['(A) her', '(B) hers', '(C) she', '(D) herself'], answer: 'D', explanation: 'by herself = tự cô ấy.' },
      { id: 'd7-q11', type: 'bracket', sourceLabel: 'Đại từ chỉ định 1', question: '1. (That/Those) analysts predicted slower economic growth.', options: ['That', 'Those'], answer: 'Those', explanation: 'analysts là danh từ số nhiều nên dùng Those.' },
      { id: 'd7-q12', type: 'bracket', sourceLabel: 'Đại từ chỉ định 2', question: '2. There are 20 new articles on (this/these) list.', options: ['this', 'these'], answer: 'this', explanation: 'list là danh từ số ít nên dùng this.' },
      { id: 'd7-q13', type: 'bracket', sourceLabel: 'Đại từ chỉ định 3', question: '3. The cost of rent is higher than (that/those) of electricity.', options: ['that', 'those'], answer: 'that', explanation: 'that thay cho cost, danh từ số ít.' },
      { id: 'd7-q14', type: 'bracket', sourceLabel: 'Đại từ chỉ định 4', question: '4. (Those/That) editor got an award last year.', options: ['Those', 'That'], answer: 'That', explanation: 'editor là danh từ số ít nên dùng That.' },
      { id: 'd7-q15', type: 'bracket', sourceLabel: 'Đại từ chỉ định 5', question: '5. These results are inconsistent with (that/those) of previous studies.', options: ['that', 'those'], answer: 'those', explanation: 'those thay cho results, danh từ số nhiều.' },
      { id: 'd7-q16', type: 'bracket', sourceLabel: 'Đại từ chỉ định 6', question: '6. (These/This) revisions are important for the completion of the proposal.', options: ['These', 'This'], answer: 'These', explanation: 'revisions là danh từ số nhiều nên dùng These.' },
      { id: 'd7-q17', type: 'multiple', sourceLabel: 'Đại từ chỉ định 7', question: '7. HT’s sports bags differ from _____ of Star Track in price and quality.', options: ['(A) those', '(B) these', '(C) this', '(D) them'], answer: 'A', explanation: 'those thay cho sports bags trong so sánh.' },
      { id: 'd7-q18', type: 'multiple', sourceLabel: 'Đại từ chỉ định 8', question: '8. Our company implemented a program for structural reforms, but ______ plan was unsuccessful.', options: ['(A) those', '(B) they', '(C) these', '(D) this'], answer: 'D', explanation: 'plan là danh từ số ít gần ý vừa nhắc nên dùng this.' },
      { id: 'd7-q19', type: 'multiple', sourceLabel: 'Đại từ chỉ định 9', question: '9. Our line of designer clothing is more expensive than _____ of other brands.', options: ['(A) this', '(B) these', '(C) that', '(D) their'], answer: 'C', explanation: 'that thay cho line, danh từ số ít.' },
      { id: 'd7-q20', type: 'multiple', sourceLabel: 'Đại từ chỉ định 10', question: '10. The salesman sold _______ an additional water purifier for $200.', options: ['(A) she', '(B) her', '(C) hers', '(D) herself'], answer: 'B', explanation: 'Sau động từ "sold" cần đại từ tân ngữ: her.' },
      { id: 'd7-q21', type: 'bracket', sourceLabel: 'Đại từ bất định 1', question: '1. (The other/The others) proposals got more support from the board.', options: ['The other', 'The others'], answer: 'The other', explanation: 'proposals là danh từ đi sau, cần tính từ/định từ: The other proposals.' },
      { id: 'd7-q22', type: 'bracket', sourceLabel: 'Đại từ bất định 2', question: '2. Your personal information will not be used for (other/another) purposes.', options: ['other', 'another'], answer: 'other', explanation: 'purposes là danh từ số nhiều nên dùng other.' },
      { id: 'd7-q23', type: 'bracket', sourceLabel: 'Đại từ bất định 3', question: '3. (Any/Some) English legal terms are difficult to translate into Korean.', options: ['Any', 'Some'], answer: 'Some', explanation: 'Câu khẳng định dùng some.' },
      { id: 'd7-q24', type: 'bracket', sourceLabel: 'Đại từ bất định 4', question: '4. One worker prefers morning meeting, while (other/another) favors afternoon sessions.', options: ['other', 'another'], answer: 'another', explanation: 'another = một người khác.' },
      { id: 'd7-q25', type: 'bracket', sourceLabel: 'Đại từ bất định 5', question: '5. One report was excellent, but (the others/another) were unsatisfactory.', options: ['the others', 'another'], answer: 'the others', explanation: 'were cho thấy cần số nhiều: the others.' },
      { id: 'd7-q26', type: 'bracket', sourceLabel: 'Đại từ bất định 6', question: '6. (The others/The other) presentation on marketing strategies will be given tomorrow.', options: ['The others', 'The other'], answer: 'The other', explanation: 'presentation là danh từ số ít nên dùng The other.' },
      { id: 'd7-q27', type: 'multiple', sourceLabel: 'Đại từ bất định 7', question: '7. The interviewer learned that Mr. Sherman had _______ experience in advertising and public relations.', options: ['(A) either', '(B) some', '(C) any', '(D) others'], answer: 'B', explanation: 'Câu khẳng định dùng some experience.' },
      { id: 'd7-q28', type: 'multiple', sourceLabel: 'Đại từ bất định 8', question: '8. To prevent the loss of data, all files are copied from one server to ______ every 10 minutes.', options: ['(A) one', '(B) other', '(C) another', '(D) one another'], answer: 'C', explanation: 'from one server to another = từ một máy chủ sang máy chủ khác.' },
      { id: 'd7-q29', type: 'multiple', sourceLabel: 'Đại từ bất định 9', question: '9. The legal department supports outsourcings, but _______ departments oppose the idea.', options: ['(A) one', '(B) another', '(C) others', '(D) the other'], answer: 'D', explanation: 'Theo key PDF: (D) the other departments.' },
      { id: 'd7-q30', type: 'multiple', sourceLabel: 'Đại từ bất định 10', question: '10. The CEO of the bankrupt Build Corporation did not have _______ management skills.', options: ['(A) another', '(B) some', '(C) any', '(D) few'], answer: 'C', explanation: 'Câu phủ định dùng any.' },
    ],
  },
  {
    id: 'day-8',
    dayNo: 9,
    title: 'Từ vựng: Công việc văn phòng (2)',
    titleEn: 'Vocabulary: Office Work (2)',
    description: 'Học nhóm từ về assume, responsible, supervise, adjust, personnel và direction.',
    descriptionEn: 'Study office-work vocabulary: assume, responsible, supervise, adjust, personnel, and direction.',
    pdfPath: '/assets/day-8.pdf',
    pdfTitle: 'Day 8 Vocabulary - Công việc văn phòng (2).pdf',
    pdfMeta: 'Dung lượng: 522 KB · Tài liệu ôn thi TOEIC SHINE',
    pdfImages: pdfPageImages(8, 7),
    theorySlides: [
      {
        title: '1. Công việc và thái độ làm việc',
        content: `lax (adj): thiếu nghiêm túc, không cẩn thận
procrastinate (v): trì hoãn, chần chừ
combined (adj): được kết hợp, chung, tổng hợp
accomplish (v): hoàn thành, đạt được
voluntarily (adv): tự nguyện
undertake (v): đảm nhận

Cụm cần nhớ:
combined experience
combined efforts
accomplished author
voluntarily took on a task`,
      },
      {
        title: '2. Nhân sự và hỗ trợ',
        content: `assume (v): cho rằng, giả sử; đảm đương
occasionally (adv): thỉnh thoảng
employee (n): nhân viên
assist (v): trợ giúp, hỗ trợ
assistance (n): sự giúp đỡ
assistant (n): trợ lý
satisfied (adj): hài lòng
manner (n): cách, lối, thái độ

Cụm cần nhớ:
assist with
be satisfied with`,
      },
      {
        title: '3. Trách nhiệm và điều phối',
        content: `responsible (adj): có trách nhiệm
conduct (v): tiến hành, chỉ đạo
adjust (v): điều chỉnh, thích ứng
adjustable (adj): có thể điều chỉnh
personnel (n): nhân viên
agree (v): đồng ý
supervise (v): giám sát
coworker (n): đồng nghiệp
direct (v): hướng dẫn, chỉ đạo
direction (n): sự chỉ dẫn

Cụm cần nhớ:
be responsible for
conduct an inspection
adjust to
agree on/to/with
direct A to B`,
      },
    ],
    questions: [
      { id: 'd8-q1', type: 'multiple', sourceLabel: 'Vocabulary 01', question: '01. assume', options: ['(A) có thể điều chỉnh được', '(B) giám sát', '(C) cho rằng, giả sử là đúng', '(D) thi thoảng', '(E) có trách nhiệm', '(F) chỉ đạo, điều khiển', '(G) đồng ý'], answer: 'C', explanation: 'assume nghĩa là cho rằng/giả sử là đúng.' },
      { id: 'd8-q2', type: 'multiple', sourceLabel: 'Vocabulary 02', question: '02. occasionally', options: ['(A) có thể điều chỉnh được', '(B) giám sát', '(C) cho rằng, giả sử là đúng', '(D) thi thoảng', '(E) có trách nhiệm', '(F) chỉ đạo, điều khiển', '(G) đồng ý'], answer: 'D', explanation: 'occasionally nghĩa là thỉnh thoảng/thi thoảng.' },
      { id: 'd8-q3', type: 'multiple', sourceLabel: 'Vocabulary 03', question: '03. responsible', options: ['(A) có thể điều chỉnh được', '(B) giám sát', '(C) cho rằng, giả sử là đúng', '(D) thi thoảng', '(E) có trách nhiệm', '(F) chỉ đạo, điều khiển', '(G) đồng ý'], answer: 'E', explanation: 'responsible nghĩa là có trách nhiệm.' },
      { id: 'd8-q4', type: 'multiple', sourceLabel: 'Vocabulary 04', question: '04. supervise', options: ['(A) có thể điều chỉnh được', '(B) giám sát', '(C) cho rằng, giả sử là đúng', '(D) thi thoảng', '(E) có trách nhiệm', '(F) chỉ đạo, điều khiển', '(G) đồng ý'], answer: 'B', explanation: 'supervise nghĩa là giám sát.' },
      { id: 'd8-q5', type: 'multiple', sourceLabel: 'Vocabulary 05', question: '05. adjustable', options: ['(A) có thể điều chỉnh được', '(B) giám sát', '(C) cho rằng, giả sử là đúng', '(D) thi thoảng', '(E) có trách nhiệm', '(F) chỉ đạo, điều khiển', '(G) đồng ý'], answer: 'A', explanation: 'adjustable nghĩa là có thể điều chỉnh được.' },
      { id: 'd8-q6', type: 'bracket', sourceLabel: 'Vocabulary 06', question: '06. Thousands of (satisfied/satisfying) customers take advantages of our account daily.', options: ['satisfied', 'satisfying'], answer: 'satisfied', explanation: 'satisfied customers = khách hàng hài lòng.' },
      { id: 'd8-q7', type: 'bracket', sourceLabel: 'Vocabulary 07', question: '07. Allison (assistance/assisted) Mark with his report so he could finish it on time.', options: ['assistance', 'assisted'], answer: 'assisted', explanation: 'Câu cần động từ quá khứ: assisted.' },
      { id: 'd8-q8', type: 'bracket', sourceLabel: 'Vocabulary 08', question: '08. The receptionist show the new employees the (direct/direction) to the auditorium where orientation will be held.', options: ['direct', 'direction'], answer: 'direction', explanation: 'Sau "the" cần danh từ: direction.' },
      { id: 'd8-q9', type: 'bracket', sourceLabel: 'Vocabulary 09', question: '09. The marketing department will (assume/assumption) responsibility for the project.', options: ['assume', 'assumption'], answer: 'assume', explanation: 'Sau will cần động từ nguyên thể: assume.' },
      { id: 'd8-q10', type: 'bracket', sourceLabel: 'Vocabulary 10', question: '10. We are concerned about the physical and psychological well-being of our (employers/employees).', options: ['employers', 'employees'], answer: 'employees', explanation: 'employees là nhân viên/người lao động, đúng với ngữ cảnh phúc lợi.' },
    ],
  },
  {
    id: 'day-9',
    dayNo: 10,
    title: 'Từ loại: Tính từ và Trạng từ',
    titleEn: 'Parts of Speech: Adjectives & Adverbs',
    description: 'Phân biệt vị trí tính từ, trạng từ và các cặp dễ gây nhầm lẫn trong TOEIC.',
    descriptionEn: 'Distinguish adjective/adverb positions and commonly confused pairs in TOEIC.',
    pdfPath: '/assets/day-9.pdf',
    pdfTitle: 'Day 9 Reading - Tính từ & Trạng từ.pdf',
    pdfMeta: 'Dung lượng: 245 KB · Tài liệu ôn thi TOEIC SHINE',
    pdfImages: pdfPageImages(9, 5),
    theorySlides: [
      {
        title: '1. Tính từ là gì?',
        content: `Tính từ miêu tả hình dáng, trạng thái hoặc tính chất của danh từ.

Vị trí thường gặp:
1. Trước danh từ:
We received helpful advice.

2. Ở vị trí bổ ngữ:
The receptionist is very kind.

Trong TOEIC, tính từ thường được kiểm tra qua vị trí trước danh từ hoặc sau linking verb.`,
      },
      {
        title: '2. Trạng từ là gì?',
        content: `Trạng từ bổ nghĩa cho động từ, tính từ, trạng từ khác hoặc cả câu.

Vị trí thường gặp:
1. Trước tính từ:
a highly innovative design

2. Trước trạng từ khác:
extremely badly

3. Trước hoặc sau động từ:
accurately entered / passed quickly

4. Đầu câu:
Regrettably, we do not have this.`,
      },
      {
        title: '3. Cặp dễ nhầm',
        content: `Một số cặp cần nhớ:
close / closely
hard / hardly
high / highly
late / lately
near / nearly
reliable / reliant
responsible / responsive
successful / successive
favorite / favorable
economic / economical

Mẹo TOEIC:
Đừng chỉ nhìn đuôi -ly. Một số từ như hard, late, near vừa có dạng thường vừa có dạng -ly nhưng nghĩa khác nhau.`,
      },
    ],
    questions: [
      { id: 'd9-q1', type: 'bracket', sourceLabel: 'Tính từ 1', question: '1. Consumers provide (construct/constructive) feedback on our new product lines.', options: ['construct', 'constructive'], answer: 'constructive', explanation: 'Trước danh từ "feedback" cần tính từ: constructive.' },
      { id: 'd9-q2', type: 'bracket', sourceLabel: 'Tính từ 2', question: '2. (Success/Successful) candidates require excellent communication skills.', options: ['Success', 'Successful'], answer: 'Successful', explanation: 'Trước danh từ "candidates" cần tính từ: Successful.' },
      { id: 'd9-q3', type: 'bracket', sourceLabel: 'Tính từ 3', question: '3. The service at the automobile repair center is (quick/quickly).', options: ['quick', 'quickly'], answer: 'quick', explanation: 'Sau linking verb "is" cần tính từ: quick.' },
      { id: 'd9-q4', type: 'bracket', sourceLabel: 'Tính từ 4', question: '4. The applicants were presented with (specific/specify) information on what to submit.', options: ['specific', 'specify'], answer: 'specific', explanation: 'Trước danh từ "information" cần tính từ: specific.' },
      { id: 'd9-q5', type: 'bracket', sourceLabel: 'Tính từ 5', question: '5. The Pinesville Report is an (ideal/ideally) location to spend a holiday.', options: ['ideal', 'ideally'], answer: 'ideal', explanation: 'Trước danh từ "location" cần tính từ: ideal.' },
      { id: 'd9-q6', type: 'bracket', sourceLabel: 'Tính từ 6', question: '6. Susan is not (surely/sure) if she will accept the position.', options: ['surely', 'sure'], answer: 'sure', explanation: 'Sau "is not" cần tính từ bổ ngữ: sure.' },
      { id: 'd9-q7', type: 'multiple', sourceLabel: 'Tính từ 7', question: '7. The advertising campaign produced a ______ increase in sales.', options: ['(A) notice', '(B) notices', '(C) noticeably', '(D) noticeable'], answer: 'D', explanation: 'Trước danh từ "increase" cần tính từ: noticeable.' },
      { id: 'd9-q8', type: 'multiple', sourceLabel: 'Tính từ 8', question: '8. Tour participants should bring ______ cash with them for snack and souvenirs.', options: ['(A) adequacy', '(B) adequately', '(C) adequateness', '(D) adequate'], answer: 'D', explanation: 'Trước danh từ "cash" cần tính từ: adequate.' },
      { id: 'd9-q9', type: 'multiple', sourceLabel: 'Tính từ 9', question: '9. My staff and I would like to express ______ gratitude for all your hard work.', options: ['(A) my', '(B) your', '(C) our', '(D) their'], answer: 'C', explanation: 'Chủ thể "My staff and I" tương ứng với sở hữu "our".' },
      { id: 'd9-q10', type: 'multiple', sourceLabel: 'Tính từ 10', question: '10. The author was highly _______ to a lot of writers starting out their careers.', options: ['(A) influential', '(B) influentially', '(C) influence', '(D) influences'], answer: 'A', explanation: 'Sau "was highly" cần tính từ: influential.' },
      { id: 'd9-q11', type: 'bracket', sourceLabel: 'Trạng từ 1', question: '1. Ms. Bryd (usually/usual) makes coffee when she arrives at the office.', options: ['usually', 'usual'], answer: 'usually', explanation: 'Bổ nghĩa cho động từ "makes" cần trạng từ: usually.' },
      { id: 'd9-q12', type: 'bracket', sourceLabel: 'Trạng từ 2', question: '2. The president (eventual/eventually) decided to close down the old branch.', options: ['eventual', 'eventually'], answer: 'eventually', explanation: 'Bổ nghĩa cho động từ "decided" cần trạng từ: eventually.' },
      { id: 'd9-q13', type: 'bracket', sourceLabel: 'Trạng từ 3', question: '3. The parcel was (mistake/mistakenly) sent to the wrong address.', options: ['mistake', 'mistakenly'], answer: 'mistakenly', explanation: 'Bổ nghĩa cho động từ bị động "was sent" cần trạng từ: mistakenly.' },
      { id: 'd9-q14', type: 'bracket', sourceLabel: 'Trạng từ 4', question: '4. The unemployment rate has been decreasing (relative/relatively) slowly.', options: ['relative', 'relatively'], answer: 'relatively', explanation: 'Bổ nghĩa cho trạng từ "slowly" cần trạng từ: relatively.' },
      { id: 'd9-q15', type: 'bracket', sourceLabel: 'Trạng từ 5', question: '5. Applicants must complete these forms (correctly/correct) in order to register.', options: ['correctly', 'correct'], answer: 'correctly', explanation: 'Bổ nghĩa cho động từ "complete" cần trạng từ: correctly.' },
      { id: 'd9-q16', type: 'bracket', sourceLabel: 'Trạng từ 6', question: '6. The CEO files overseas (regular/regularly) to check on the company’s branches.', options: ['regular', 'regularly'], answer: 'regularly', explanation: 'Bổ nghĩa cho động từ "files" theo key PDF: regularly.' },
      { id: 'd9-q17', type: 'multiple', sourceLabel: 'Trạng từ 7', question: '7. The Rubberstein Museum will be _____ ready for its reopening on August 3.', options: ['(A) finally', '(B) final', '(C) finalizing', '(D) finally'], answer: 'D', explanation: 'Theo key PDF: (D) finally. PDF có option A và D trùng nhau.' },
      { id: 'd9-q18', type: 'multiple', sourceLabel: 'Trạng từ 8', question: '8. All supervisors in the company agreed that Mr. Yoshio works _______.', options: ['(A) productively', '(B) productive', '(C) productivity', '(D) production'], answer: 'A', explanation: 'Bổ nghĩa cho động từ "works" cần trạng từ: productively.' },
      { id: 'd9-q19', type: 'multiple', sourceLabel: 'Trạng từ 9', question: '9. Consumer opinion is becoming an ______ essential factor in project planning.', options: ['(A) increase', '(B) increased', '(C) increasing', '(D) increasingly'], answer: 'D', explanation: 'Bổ nghĩa cho tính từ "essential" cần trạng từ: increasingly.' },
      { id: 'd9-q20', type: 'multiple', sourceLabel: 'Trạng từ 10', question: '10. Management is satisfied that it chose the applicants with the most ________ characteristics.', options: ['(A) desiring', '(B) desirable', '(C) desire', '(D) desirably'], answer: 'B', explanation: 'Trước danh từ "characteristics" cần tính từ: desirable.' },
      { id: 'd9-q21', type: 'bracket', sourceLabel: 'Dễ nhầm 1', question: '1. The election was (close/closely) observed by the media.', options: ['close', 'closely'], answer: 'closely', explanation: 'closely observed = được theo dõi sát sao.' },
      { id: 'd9-q22', type: 'bracket', sourceLabel: 'Dễ nhầm 2', question: '2. The travel agency offers (reliant/reliable) service.', options: ['reliant', 'reliable'], answer: 'reliable', explanation: 'reliable service = dịch vụ đáng tin cậy.' },
      { id: 'd9-q23', type: 'bracket', sourceLabel: 'Dễ nhầm 3', question: '3. (Near/Nearly) 70 percent of companies say that their business operations are profitable.', options: ['Near', 'Nearly'], answer: 'Nearly', explanation: 'Nearly 70 percent = gần 70 phần trăm.' },
      { id: 'd9-q24', type: 'bracket', sourceLabel: 'Dễ nhầm 4', question: '4. The pilot is (responsible/responsive) for the safety of the passengers.', options: ['responsible', 'responsive'], answer: 'responsible', explanation: 'be responsible for = chịu trách nhiệm về.' },
      { id: 'd9-q25', type: 'multiple', sourceLabel: 'Dễ nhầm 5', question: '5. The attached file is a list of _______ professors who will speak at the seminar.', options: ['(A) Distinguish', '(B) Distinguished', '(C) Distinguishably', '(D) Distinguishable'], answer: 'B', explanation: 'distinguished professors = các giáo sư xuất sắc/danh tiếng.' },
      { id: 'd9-q26', type: 'multiple', sourceLabel: 'Dễ nhầm 6', question: '6. The presenter gave the international investors a _____ impression at the meeting.', options: ['(A) Favorable', '(B) Favorite', '(C) Favorableness', '(D) Favorer'], answer: 'A', explanation: 'a favorable impression = ấn tượng tốt/thuận lợi.' },
      { id: 'd9-q27', type: 'multiple', sourceLabel: 'Dễ nhầm 7', passage: `If you need advice on managing your savings, contact Investment Associates introduces clients to (7) ______ consultant in the field of banking, investment and finance. Our specialists are (8) _____ qualified to guide you through the investment strategies that best suit your particular needs. Your initial consultation with us will be free. (9) ________. Contact us at 555-2091 to set up an appointment.`, question: '7. Chọn đáp án thích hợp điền vào chỗ trống (7).', options: ['(A) professionally', '(B) professional', '(C) professors', '(D) professionals'], answer: 'B', explanation: 'Trước danh từ "consultant" cần tính từ: professional.' },
      { id: 'd9-q28', type: 'multiple', sourceLabel: 'Dễ nhầm 8', passage: `If you need advice on managing your savings, contact Investment Associates introduces clients to (7) ______ consultant in the field of banking, investment and finance. Our specialists are (8) _____ qualified to guide you through the investment strategies that best suit your particular needs. Your initial consultation with us will be free. (9) ________. Contact us at 555-2091 to set up an appointment.`, question: '8. Chọn đáp án thích hợp điền vào chỗ trống (8).', options: ['(A) high', '(B) height', '(C) highly', '(D) higher'], answer: 'C', explanation: 'highly qualified = rất đủ năng lực.' },
      { id: 'd9-q29', type: 'multiple', sourceLabel: 'Dễ nhầm 9', passage: `If you need advice on managing your savings, contact Investment Associates introduces clients to (7) ______ consultant in the field of banking, investment and finance. Our specialists are (8) _____ qualified to guide you through the investment strategies that best suit your particular needs. Your initial consultation with us will be free. (9) ________. Contact us at 555-2091 to set up an appointment.`, question: '9. Chọn đáp án thích hợp điền vào chỗ trống (9).', options: ['(A) Your needs may differ from ours.', '(B) This applies whether you choose to use our service or not.', '(C) Sign up to become a certified consultant.', '(D) Your financial insight has been constructive.'], answer: 'B', explanation: 'Câu này nối hợp lý với ý buổi tư vấn ban đầu miễn phí dù có dùng dịch vụ hay không.' },
    ],
  },
];

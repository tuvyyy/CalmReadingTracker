// src/services/grammarData.ts

export interface GrammarQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  answer: string; // 'A' | 'B' | 'C' | 'D'
  explanation: string;
  status: 'ok' | 'check';
}

export const GRAMMAR_QUESTIONS: GrammarQuestion[] = [
  {
    "id": "Q001",
    "category": "NOUNS",
    "question": "Once the _____ of the parking lot is completed, visitor will have no problem parking their cars.",
    "options": [
      "A. construction",
      "B. construct",
      "C. constructive",
      "D. constructing"
    ],
    "answer": "A",
    "explanation": "Sau mạo từ the và giới từ of cần danh từ: construction.",
    "status": "ok"
  },
  {
    "id": "Q002",
    "category": "ADJECTIVES",
    "question": "The championship match will start ___ at eight o’clock this Saturday night.",
    "options": [
      "A. precisely",
      "B. preciseness",
      "C. precise",
      "D. precision"
    ],
    "answer": "A",
    "explanation": "Sau động từ start cần trạng từ bổ nghĩa thời gian/mức độ: precisely.",
    "status": "ok"
  },
  {
    "id": "Q003",
    "category": "ADVERBS",
    "question": "Ms. Byrd _____ makes coffee when she arrives at the office.",
    "options": [
      "A. usual",
      "B. usualize",
      "C. unusual",
      "D. usually"
    ],
    "answer": "D",
    "explanation": "Vị trí trước động từ makes cần trạng từ tần suất: usually.",
    "status": "ok"
  },
  {
    "id": "Q004",
    "category": "PRONOUNS",
    "question": "Business owners should think about what _____ can do for the public.",
    "options": [
      "A. he",
      "B. she",
      "C. they",
      "D. you"
    ],
    "answer": "C",
    "explanation": "Business owners là số nhiều nên đại từ phù hợp là they.",
    "status": "ok"
  },
  {
    "id": "Q005",
    "category": "PREPOSITIONS",
    "question": "We apologize ____ the inconvenience caused by the delay in shipment.",
    "options": [
      "A. to",
      "B. on",
      "C. for",
      "D. about"
    ],
    "answer": "C",
    "explanation": "Cụm cố định: apologize for + noun/V-ing.",
    "status": "ok"
  },
  {
    "id": "Q006",
    "category": "CONJUNCTIONS",
    "question": "The meeting was postponed ____ the CEO was unavailable.",
    "options": [
      "A. but",
      "B. because",
      "C. although",
      "D. so"
    ],
    "answer": "B",
    "explanation": "Mệnh đề sau nêu lý do nên dùng because.",
    "status": "ok"
  },
  {
    "id": "Q007",
    "category": "NUMERIC EXPRESSIONS BEFORE NOUNS",
    "question": "The company signed a ______ contract with the supplier.",
    "options": [
      "A. three-years",
      "B. three-year",
      "C. three years",
      "D. three year"
    ],
    "answer": "B",
    "explanation": "Cụm số + danh từ số ít dùng như tính từ: three-year contract.",
    "status": "ok"
  },
  {
    "id": "Q008",
    "category": "RELATIVE CLAUSES",
    "question": "Mr. Ross, _____ is repainting the interior of the lobby, was recommended by a friend of the building manager.",
    "options": [
      "A. himself",
      "B. he",
      "C. who",
      "D. which"
    ],
    "answer": "C",
    "explanation": "Mệnh đề quan hệ chỉ người làm chủ ngữ dùng who.",
    "status": "ok"
  },
  {
    "id": "Q009",
    "category": "TO INFINITIVES AND GERUNDS",
    "question": "We decided _____ a new office in the city center.",
    "options": [
      "A. renting",
      "B. to rent",
      "C. rent",
      "D. rented"
    ],
    "answer": "B",
    "explanation": "Cấu trúc decide + to V.",
    "status": "ok"
  },
  {
    "id": "Q010",
    "category": "PRESENT SIMPLE TENSE",
    "question": "(Phần thì mình thấy đề cũng tựa tựa nhau nên mình để 1 câu minh họa thôi nha tại mình lười =)) ) Ms. Morgan recruited the individuals that the company _____ for the next three months.",
    "options": [
      "A. will employ (tương lai đơn)",
      "B. to employ (dạng to + V)",
      "C. has been employed (hiện tại hoàn thành nhưng ở dạng bị động)",
      "D. employ"
    ],
    "answer": "A",
    "explanation": "Ngữ cảnh nói các cá nhân công ty sẽ tuyển trong 3 tháng tới nên dùng will employ.",
    "status": "ok"
  },
  {
    "id": "Q011",
    "category": "PASSIVE VOICE",
    "question": "The boy has the hair ______ (cut).",
    "options": [
      "A. cut",
      "B. cutting",
      "C. to cut",
      "D. was cut"
    ],
    "answer": "A",
    "explanation": "Cấu trúc have/get something done: have the hair cut.",
    "status": "ok"
  },
  {
    "id": "Q012",
    "category": "IMPERATIVE",
    "question": "_____ the form before submitting your application.",
    "options": [
      "A. Fill out",
      "B. Filling out",
      "C. Fills out",
      "D. To fill out"
    ],
    "answer": "A",
    "explanation": "Câu mệnh lệnh bắt đầu bằng động từ nguyên mẫu: Fill out.",
    "status": "ok"
  },
  {
    "id": "Q013",
    "category": "PASSIVE AND SPECIAL PASSIVE CASES",
    "question": "The report ______ by the marketing team yesterday.",
    "options": [
      "A. was written",
      "B. wrote",
      "C. writes",
      "D. is writing"
    ],
    "answer": "A",
    "explanation": "Bị động quá khứ đơn: was/were + V3.",
    "status": "ok"
  },
  {
    "id": "Q014",
    "category": "MODAL VERBS",
    "question": "You _______ submit the report by 5 PM tomorrow. It’s the deadline.",
    "options": [
      "A. may",
      "B. must",
      "C. can",
      "D. could"
    ],
    "answer": "B",
    "explanation": "Deadline bắt buộc nên dùng must.",
    "status": "ok"
  },
  {
    "id": "Q015",
    "category": "CONDITIONAL SENTENCES",
    "question": "If the company ______ (reduce) production costs, it ______ (increase) its profits.",
    "options": [
      "A. reduced / would increase",
      "B. reduces / will increase",
      "C. had reduced / would have increased",
      "D. reduces / would increase"
    ],
    "answer": "B",
    "explanation": "Điều kiện loại 1: If + present simple, will + V.",
    "status": "ok"
  },
  {
    "id": "Q016",
    "category": "REDUCING RELATIVE CLAUSES",
    "question": "The documents ______ by the legal department must be reviewed before submission.",
    "options": [
      "A. to review",
      "B. reviewing",
      "C. reviewed",
      "D. review"
    ],
    "answer": "C",
    "explanation": "Rút gọn mệnh đề quan hệ bị động: documents reviewed by...",
    "status": "ok"
  },
  {
    "id": "Q017",
    "category": "REDUCING RELATIVE CLAUSES",
    "question": "The new policy, ______ next month, will require all employees to submit weekly progress reports.",
    "options": [
      "A. implementing",
      "B. implemented",
      "C. to be implemented",
      "D. was implemented"
    ],
    "answer": "C",
    "explanation": "Chính sách sẽ được thực hiện trong tương lai nên dùng to be implemented.",
    "status": "ok"
  },
  {
    "id": "Q018",
    "category": "REDUCING RELATIVE CLAUSES",
    "question": "Company Announcement To All Employees, The annual company retreat, ______ (1) next Friday, will be held at Green Valley Resort. Employees ______ (2) the event must RSVP by Wednesday. Please note that all transportation arrangements will be provided by the company. Additionally, those ______ (3) dietary restrictions should inform the HR department as soon as possible so that accommodations can be arranged. We look forward to a productive and enjoyable retreat! Best, HR Team Cần chọn đáp án cho chỗ trống (1).",
    "options": [
      "A. holding",
      "B. held",
      "C. to be held",
      "D. being held"
    ],
    "answer": "C",
    "explanation": "Sự kiện sẽ được tổ chức trong tương lai nên dùng to be held.",
    "status": "ok"
  },
  {
    "id": "Q019",
    "category": "REDUCING RELATIVE CLAUSES",
    "question": "Company Announcement To All Employees, The annual company retreat, ______ (1) next Friday, will be held at Green Valley Resort. Employees ______ (2) the event must RSVP by Wednesday. Please note that all transportation arrangements will be provided by the company. Additionally, those ______ (3) dietary restrictions should inform the HR department as soon as possible so that accommodations can be arranged. We look forward to a productive and enjoyable retreat! Best, HR Team Cần chọn đáp án cho chỗ trống (2).",
    "options": [
      "A. attending",
      "B. attended",
      "C. to attend",
      "D. to be attended"
    ],
    "answer": "A",
    "explanation": "Employees attending the event = những nhân viên tham dự sự kiện.",
    "status": "ok"
  },
  {
    "id": "Q020",
    "category": "VERBS",
    "question": "The new policy requires all employees ______ an online training course.",
    "options": [
      "A. completing",
      "B. to complete",
      "C. complete",
      "D. completed"
    ],
    "answer": "B",
    "explanation": "Cấu trúc require + object + to V.",
    "status": "ok"
  },
  {
    "id": "Q021",
    "category": "VERBS",
    "question": "If you have any questions regarding your account, please ______ customer support.",
    "options": [
      "A. contacted",
      "B. contact",
      "C. contacts",
      "D. contacting"
    ],
    "answer": "B",
    "explanation": "Sau please dùng động từ nguyên mẫu: contact.",
    "status": "ok"
  },
  {
    "id": "Q022",
    "category": "VERBS",
    "question": "Company Announcement To: All Employees Subject: Office Renovation Dear Team, As part of our ongoing efforts to enhance workplace productivity, we ______ (1) a renovation project for our main office. Construction work ______ (2) next Monday and is expected to last for two weeks. During this period, employees are encouraged to work remotely. If you need to retrieve any personal belongings from the office, please ______ (3) them by Friday evening. We appreciate your cooperation and look forward to seeing the new improvements. Best regards, HR Department (1) Cần chọn đáp án cho chỗ trống (1).",
    "options": [
      "A. initiate",
      "B. have initiated",
      "C. will initiate",
      "D. initiated"
    ],
    "answer": "C",
    "explanation": "Ngữ cảnh thông báo kế hoạch sắp diễn ra nên dùng will initiate.",
    "status": "ok"
  },
  {
    "id": "Q023",
    "category": "SENTENCE ELEMENTS",
    "question": "______ received the shipment yesterday, the warehouse staff began checking the inventory.",
    "options": [
      "A. Having",
      "B. Have",
      "C. Had",
      "D. Has"
    ],
    "answer": "A",
    "explanation": "Having + V3 diễn tả hành động hoàn thành trước hành động chính.",
    "status": "ok"
  },
  {
    "id": "Q024",
    "category": "SENTENCE ELEMENTS",
    "question": "Internal Memo from Management To: All Employees Subject: Office Policy Update Dear Team, We would like to remind everyone of the new office policies that will take effect next month. All employees ______ (1) in remote work arrangements must submit a formal request for approval. Additionally, the IT department will be responsible for ______ (2) technical support to remote workers. For security purposes, all staff members ______ (3) to change their login passwords every 90 days. Please ensure compliance to maintain the integrity of our system. Best regards, Management Chọn đáp án đúng để điền vào chỗ trống: (1) Cần chọn đáp án cho chỗ trống (1).",
    "options": [
      "A. engaging",
      "B. engaged",
      "C. engages",
      "D. engage"
    ],
    "answer": "B",
    "explanation": "employees engaged in remote work = nhân viên tham gia/làm việc từ xa.",
    "status": "ok"
  },
  {
    "id": "Q025",
    "category": "ADVERBIAL CLAUSES OF TIME",
    "question": "The sales department performed exceptionally well ______ the holiday season.",
    "options": [
      "A. during",
      "B. until",
      "C. although",
      "D. because"
    ],
    "answer": "A",
    "explanation": "Sau performed exceptionally well cần giới từ during chỉ thời gian diễn ra sự kiện.",
    "status": "ok"
  },
  {
    "id": "Q026",
    "category": "ADVERBIAL CLAUSES OF TIME",
    "question": "______ the new regulations take effect, all employees must attend a compliance workshop.",
    "options": [
      "A. Until",
      "B. Once",
      "C. Whereas",
      "D. Despite"
    ],
    "answer": "B",
    "explanation": "Once = ngay khi/sau khi quy định có hiệu lực.",
    "status": "ok"
  },
  {
    "id": "Q027",
    "category": "ADVERBIAL CLAUSES OF TIME",
    "question": "The company expanded internationally ______ it had established a strong domestic market.",
    "options": [
      "A. before",
      "B. when",
      "C. once",
      "D. while"
    ],
    "answer": "C",
    "explanation": "Once it had established... = sau khi đã thiết lập thị trường nội địa vững mạnh.",
    "status": "ok"
  },
  {
    "id": "Q028",
    "category": "ADVERBIAL CLAUSES OF TIME",
    "question": "Company Memo To: All Staff Subject: Upcoming Office Renovation Dear Team, We would like to inform you that the office renovation will begin next Monday. Please note that certain areas of the office will be inaccessible ______ (1) the construction is underway. Employees are encouraged to work remotely ______ (2) the project is completed. Additionally, the IT department will provide support to ensure smooth remote access to company systems. Please contact the helpdesk ______ (3) you encounter any technical difficulties. Thank you for your cooperation. Best regards, Office Management Chọn đáp án đúng để điền vào chỗ trống: (1) Cần chọn đáp án cho chỗ trống (1).",
    "options": [
      "A. after",
      "B. while",
      "C. since",
      "D. before"
    ],
    "answer": "B",
    "explanation": "While diễn tả trong lúc công trình đang thi công.",
    "status": "ok"
  },
  {
    "id": "Q029",
    "category": "PHRASES & CLAUSES",
    "question": "______ completing the training session, employees will be assigned their new tasks.",
    "options": [
      "A. After",
      "B. Since",
      "C. Despite",
      "D. Whether"
    ],
    "answer": "A",
    "explanation": "After + V-ing/N: sau khi hoàn thành buổi đào tạo.",
    "status": "ok"
  },
  {
    "id": "Q030",
    "category": "PHRASES & CLAUSES",
    "question": "The company has implemented a new policy ______ employees must submit their expense reports within 30 days.",
    "options": [
      "A. who",
      "B. which",
      "C. that",
      "D. where"
    ],
    "answer": "C",
    "explanation": "That dẫn mệnh đề bổ nghĩa cho policy.",
    "status": "ok"
  },
  {
    "id": "Q031",
    "category": "PHRASES & CLAUSES",
    "question": "______ the manager was on vacation, the assistant handled all urgent matters.",
    "options": [
      "A. Because",
      "B. While",
      "C. Unless",
      "D. In case"
    ],
    "answer": "A",
    "explanation": "Because nêu lý do trợ lý xử lý việc khẩn cấp.",
    "status": "ok"
  },
  {
    "id": "Q032",
    "category": "PHRASES & CLAUSES",
    "question": "Internal Memo To: All Employees Subject: Office Policy Update Dear Team, We would like to inform you of a few changes to our office policies. Effective next month, all employees must clock in using the new digital system ______ (1) they arrive at the office. Additionally, personal devices should be kept in silent mode during working hours ______ (2) they do not interfere with business operations. In terms of break schedules, employees are encouraged to take short breaks ______ (3) they complete major tasks. These updates aim to improve productivity and efficiency. Thank you for your cooperation. Best regards, HR Department Chọn đáp án đúng để điền vào chỗ trống: (1) Cần chọn đáp án cho chỗ trống (1).",
    "options": [
      "A. after",
      "B. when",
      "C. because",
      "D. so that"
    ],
    "answer": "B",
    "explanation": "When diễn tả thời điểm nhân viên đến văn phòng.",
    "status": "ok"
  },
  {
    "id": "Q033",
    "category": "PHRASES & CLAUSES",
    "question": "Internal Memo To: All Employees Subject: Office Policy Update Dear Team, We would like to inform you of a few changes to our office policies. Effective next month, all employees must clock in using the new digital system ______ (1) they arrive at the office. Additionally, personal devices should be kept in silent mode during working hours ______ (2) they do not interfere with business operations. In terms of break schedules, employees are encouraged to take short breaks ______ (3) they complete major tasks. These updates aim to improve productivity and efficiency. Thank you for your cooperation. Best regards, HR Department Chọn đáp án đúng để điền vào chỗ trống: (1) Cần chọn đáp án cho chỗ trống (2).",
    "options": [
      "A. in case",
      "B. while",
      "C. so that",
      "D. unless"
    ],
    "answer": "C",
    "explanation": "So that + S + V diễn tả mục đích.",
    "status": "ok"
  },
  {
    "id": "Q034",
    "category": "PHRASES & CLAUSES",
    "question": "Internal Memo To: All Employees Subject: Office Policy Update Dear Team, We would like to inform you of a few changes to our office policies. Effective next month, all employees must clock in using the new digital system ______ (1) they arrive at the office. Additionally, personal devices should be kept in silent mode during working hours ______ (2) they do not interfere with business operations. In terms of break schedules, employees are encouraged to take short breaks ______ (3) they complete major tasks. These updates aim to improve productivity and efficiency. Thank you for your cooperation. Best regards, HR Department Chọn đáp án đúng để điền vào chỗ trống: (1) Cần chọn đáp án cho chỗ trống (3).",
    "options": [
      "A. because",
      "B. whenever",
      "C. instead of",
      "D. despite"
    ],
    "answer": "B",
    "explanation": "Whenever = bất cứ khi nào hoàn thành nhiệm vụ lớn.",
    "status": "ok"
  },
  {
    "id": "Q035",
    "category": "PHRASES & CLAUSES OF CONCESSION",
    "question": "______ the project faced many challenges, the team managed to complete it on time.",
    "options": [
      "A. Although",
      "B. Because",
      "C. Due to",
      "D. Since"
    ],
    "answer": "A",
    "explanation": "Although + clause diễn tả nhượng bộ.",
    "status": "ok"
  },
  {
    "id": "Q036",
    "category": "PHRASES & CLAUSES OF CONCESSION",
    "question": "The company continued to expand ______ a decline in the economy.",
    "options": [
      "A. unless",
      "B. despite",
      "C. because of",
      "D. so that"
    ],
    "answer": "B",
    "explanation": "Despite + noun phrase diễn tả nhượng bộ.",
    "status": "ok"
  },
  {
    "id": "Q037",
    "category": "PHRASES & CLAUSES OF CONCESSION",
    "question": "______ he had limited experience, he was promoted to a managerial position.",
    "options": [
      "A. Even though",
      "B. Since",
      "C. So that",
      "D. Whereas"
    ],
    "answer": "A",
    "explanation": "Even though + clause diễn tả nhượng bộ.",
    "status": "ok"
  },
  {
    "id": "Q038",
    "category": "PHRASES & CLAUSES OF EFFECT",
    "question": "The company experienced a significant increase in sales ______ the success of its recent advertising campaign.",
    "options": [
      "A. so that",
      "B. because",
      "C. due to",
      "D. in order to"
    ],
    "answer": "C",
    "explanation": "Due to + noun phrase chỉ nguyên nhân.",
    "status": "ok"
  },
  {
    "id": "Q039",
    "category": "PHRASES & CLAUSES OF EFFECT",
    "question": "The software update caused a system error, ______ some employees could not access their accounts.",
    "options": [
      "A. since",
      "B. so",
      "C. due to",
      "D. as"
    ],
    "answer": "B",
    "explanation": "So nối kết quả: lỗi hệ thống nên nhân viên không truy cập được.",
    "status": "ok"
  },
  {
    "id": "Q040",
    "category": "PHRASES & CLAUSES OF EFFECT",
    "question": "The demand for online services has grown rapidly, ______ many companies are investing in digital platforms.",
    "options": [
      "A. as a result",
      "B. because",
      "C. due to",
      "D. therefore"
    ],
    "answer": "A",
    "explanation": "As a result dùng để nêu kết quả.",
    "status": "ok"
  },
  {
    "id": "Q041",
    "category": "PHRASES & CLAUSES OF EFFECT",
    "question": "The budget was not approved, ______ the project had to be postponed.",
    "options": [
      "A. as",
      "B. so",
      "C. because of",
      "D. due to"
    ],
    "answer": "B",
    "explanation": "So nối mệnh đề kết quả: dự án phải hoãn.",
    "status": "ok"
  },
  {
    "id": "Q042",
    "category": "PHRASES & CLAUSES OF EFFECT",
    "question": "To: All Employees Subject: Workplace Safety Improvements Dear Team, We recently conducted a workplace safety review and identified areas for improvement. ______ (1) several reports of minor accidents, we have decided to enhance our safety measures. The company will be installing new warning signs and providing additional training sessions. ______ (2), all employees are required to complete a mandatory safety training course by the end of the month. We believe these updates will significantly reduce workplace risks. ______ (3), we encourage all employees to report any safety concerns immediately. Best regards, Management Chọn đáp án đúng để điền vào chỗ trống: (1) Cần chọn đáp án cho chỗ trống (1).",
    "options": [
      "A. Because",
      "B. Because of",
      "C. Although",
      "D. In order to"
    ],
    "answer": "B",
    "explanation": "Trước cụm danh từ several reports... cần giới từ Because of chỉ nguyên nhân.",
    "status": "ok"
  },
  {
    "id": "Q043",
    "category": "PHRASES & CLAUSES OF EFFECT",
    "question": "To: All Employees Subject: Workplace Safety Improvements Dear Team, We recently conducted a workplace safety review and identified areas for improvement. ______ (1) several reports of minor accidents, we have decided to enhance our safety measures. The company will be installing new warning signs and providing additional training sessions. ______ (2), all employees are required to complete a mandatory safety training course by the end of the month. We believe these updates will significantly reduce workplace risks. ______ (3), we encourage all employees to report any safety concerns immediately. Best regards, Management Chọn đáp án đúng để điền vào chỗ trống: (1) Cần chọn đáp án cho chỗ trống (2).",
    "options": [
      "A. Therefore",
      "B. As a result",
      "C. Because",
      "D. Due to"
    ],
    "answer": "A",
    "explanation": "Therefore dùng đầu câu để nêu kết quả/suy ra hành động bắt buộc.",
    "status": "ok"
  },
  {
    "id": "Q044",
    "category": "PHRASES & CLAUSES OF PURPOSE",
    "question": "The IT department updated the security system ______ prevent cyberattacks.",
    "options": [
      "A. for",
      "B. so that",
      "C. in order to",
      "D. because"
    ],
    "answer": "C",
    "explanation": "In order to + V diễn tả mục đích.",
    "status": "ok"
  },
  {
    "id": "Q045",
    "category": "PHRASES & CLAUSES OF PURPOSE",
    "question": "We are conducting a survey ______ understand our customers' preferences better.",
    "options": [
      "A. due to",
      "B. so that",
      "C. in order to",
      "D. whereas"
    ],
    "answer": "C",
    "explanation": "In order to + V diễn tả mục đích.",
    "status": "ok"
  },
  {
    "id": "Q046",
    "category": "PHRASES & CLAUSES OF PURPOSE",
    "question": "The training session was extended ______ the participants could have more time to practice.",
    "options": [
      "A. so that",
      "B. due to",
      "C. despite",
      "D. because"
    ],
    "answer": "A",
    "explanation": "So that + S + could/have... diễn tả mục đích.",
    "status": "ok"
  },
  {
    "id": "Q047",
    "category": "PHRASES & CLAUSES OF PURPOSE",
    "question": "Internal Memo To: All Employees Subject: Updated Workplace Guidelines Dear Team, As part of our commitment to improving workplace efficiency, we are implementing several new policies. The management team has introduced flexible work hours ______ (1) employees can maintain a better work-life balance. Additionally, we have upgraded the internal communication system ______ (2) facilitate faster and more effective collaboration among departments. We encourage all employees to familiarize themselves with these updates ______ (3) we can create a more productive work environment together. If you have any questions, please reach out to your supervisor. Best regards, HR Department Chọn đáp án đúng để điền vào chỗ trống: (1) Cần chọn đáp án cho chỗ trống (1).",
    "options": [
      "A. in order to",
      "B. so that",
      "C. for",
      "D. because of"
    ],
    "answer": "B",
    "explanation": "So that + S + V diễn tả mục đích.",
    "status": "ok"
  },
  {
    "id": "Q048",
    "category": "PHRASES & CLAUSES OF PURPOSE",
    "question": "Internal Memo To: All Employees Subject: Updated Workplace Guidelines Dear Team, As part of our commitment to improving workplace efficiency, we are implementing several new policies. The management team has introduced flexible work hours ______ (1) employees can maintain a better work-life balance. Additionally, we have upgraded the internal communication system ______ (2) facilitate faster and more effective collaboration among departments. We encourage all employees to familiarize themselves with these updates ______ (3) we can create a more productive work environment together. If you have any questions, please reach out to your supervisor. Best regards, HR Department Chọn đáp án đúng để điền vào chỗ trống: (1) Cần chọn đáp án cho chỗ trống (2).",
    "options": [
      "A. in order to",
      "B. so that",
      "C. due to",
      "D. despite"
    ],
    "answer": "A",
    "explanation": "Trước động từ nguyên mẫu facilitate cần cụm chỉ mục đích in order to.",
    "status": "ok"
  },
  {
    "id": "Q049",
    "category": "PHRASES & CLAUSES OF REASON",
    "question": "The company delayed the product launch ______ unexpected technical issues.",
    "options": [
      "A. because of",
      "B. so that",
      "C. in order to",
      "D. due"
    ],
    "answer": "A",
    "explanation": "Because of + noun phrase chỉ nguyên nhân.",
    "status": "ok"
  },
  {
    "id": "Q050",
    "category": "PHRASES & CLAUSES OF REASON",
    "question": "The meeting was canceled ______ the manager was unavailable.",
    "options": [
      "A. because",
      "B. despite",
      "C. in order to",
      "D. although"
    ],
    "answer": "A",
    "explanation": "Because + clause chỉ nguyên nhân.",
    "status": "ok"
  },
  {
    "id": "Q051",
    "category": "PHRASES & CLAUSES OF REASON",
    "question": "The office was closed for two days ______ the heavy snowfall.",
    "options": [
      "A. although",
      "B. so that",
      "C. due to",
      "D. instead of"
    ],
    "answer": "C",
    "explanation": "Due to + noun phrase chỉ nguyên nhân.",
    "status": "ok"
  },
  {
    "id": "Q052",
    "category": "PHRASES & CLAUSES OF REASON",
    "question": "The project was successful ______ the team’s dedication and hard work.",
    "options": [
      "A. despite",
      "B. because of",
      "C. unless",
      "D. although"
    ],
    "answer": "B",
    "explanation": "Because of + noun phrase chỉ nguyên nhân.",
    "status": "ok"
  }
];

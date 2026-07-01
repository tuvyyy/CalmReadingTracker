import { GRAMMAR_QUESTIONS } from './grammarData';
import { type ParsedAnswer } from './answerParser';
import {
  BUILT_IN_PART5_PRACTICE_TESTS,
  type PracticeQuestion,
} from './part5PracticeData';

export interface TestItem {
  id: string;
  index: number;
  title: string;
  range: string;
  status: 'done' | 'pending';
  score?: number;
  totalCount?: number;
  part?: string;
}

export interface TestVocabItem {
  id:         string;
  word:       string;
  type:       string;
  meaning:    string;
  example:    string;
  exampleVi?: string;
  synonyms?:  string;
  usage?:     string;
  options:    string[];
  status?:    'new' | 'review' | 'mastered';
}

const STORAGE_KEY = 'toeic_test_results';
const VOCAB_STORAGE_KEY = 'toeic_vocab_list';
const LEGACY_SAMPLE_TEST_IDS = new Set(['ets-01', 'ets-02', 'ets-03', 'ets-04']);

const BUILT_IN_TESTS: TestItem[] = BUILT_IN_PART5_PRACTICE_TESTS.map((test, index) => ({
  id: test.id,
  index: index + 1,
  title: test.title,
  range: '101 – 130',
  status: 'pending',
  totalCount: 30,
  part: '5',
}));

type VocabSeedItem = Omit<TestVocabItem, 'options'> & { options?: string[] };

const BUILT_IN_VOCAB_SEEDS: VocabSeedItem[] = [
  {
    id: 'v1', word: 'reimbursement', type: 'noun',
    meaning: 'hoàn trả / khoản hoàn tiền',
    example: 'Have you finished reviewing the travel reimbursement forms from all the departments?',
    exampleVi: 'Bạn đã xem xét xong các mẫu đơn hoàn trả chi phí công tác từ tất cả các phòng ban chưa?',
    synonyms: 'refund; repayment; compensation',
    usage: 'Thường gặp trong ngữ cảnh công ty, chi phí công tác, mẫu đơn hoàn tiền.',
    options: ['hoàn trả / khoản hoàn tiền', 'chỗ ở / nơi lưu trú', 'chi phí / khoản phí', 'boong tàu'],
    status: 'new',
  },
  {
    id: 'v2', word: 'accommodation', type: 'noun',
    meaning: 'chỗ ở / nơi lưu trú',
    example: "Well, our policy is for employees to stay at a hotel that's on our list of approved accommodations.",
    exampleVi: 'Vâng, chính sách của chúng tôi là nhân viên phải ở tại khách sạn nằm trong danh sách chỗ ở được phê duyệt.',
    synonyms: 'lodging; rooms; housing',
    usage: 'Khách sạn này không có trong danh sách.',
    options: ['chỗ ở / nơi lưu trú', 'bảng tính', 'sân thượng / sân hiên', 'lề đường / mép vỉa hè'],
    status: 'new',
  },
  {
    id: 'v3', word: 'spreadsheet', type: 'noun',
    meaning: 'bảng tính',
    example: 'Review a spreadsheet.',
    exampleVi: 'Xem lại bảng tính.',
    synonyms: 'worksheet; data sheet; Excel file',
    options: ['bảng tính', 'sự kiểm tra / thanh tra', 'hàng rào', 'ngăn kéo'],
    status: 'new',
  },
  {
    id: 'v4', word: 'expense', type: 'noun',
    meaning: 'chi phí / khoản phí',
    example: 'As a supervisor, I can approve the expense this one time.',
    exampleVi: 'Là giám sát viên, tôi có thể phê duyệt chi phí lần này.',
    synonyms: 'cost; fee; charge',
    options: ['chi phí / khoản phí', 'hoàn trả / khoản hoàn tiền', 'chặt / cắt nhỏ', 'sương mù'],
    status: 'new',
  },
  {
    id: 'v5', word: 'representatives', type: 'noun',
    meaning: 'các đại diện / nhân viên đại diện',
    example: 'Moritz Ziegler, one of our sales representatives.',
    exampleVi: 'Moritz Ziegler, một trong những đại diện bán hàng của chúng tôi.',
    synonyms: 'agents; delegates; staff members; salespeople',
    options: ['các đại diện / nhân viên đại diện', 'dụng cụ ăn uống', 'sân thượng / sân hiên', 'boong tàu'],
    status: 'new',
  },
  {
    id: 'v6', word: 'deck', type: 'noun',
    meaning: 'boong tàu',
    example: "How's everything up here on deck?",
    exampleVi: 'Mọi việc trên boong tàu thế nào rồi?',
    options: ['boong tàu', 'hàng rào', 'lề đường / mép vỉa hè', 'chỗ ở / nơi lưu trú'],
    status: 'new',
  },
  {
    id: 'v7', word: 'uneventful', type: 'adjective',
    meaning: 'bình thường / không có gì đặc biệt / suôn sẻ',
    example: 'It was an uneventful night.',
    exampleVi: 'Đêm nay yên bình quá.',
    synonyms: 'routine; ordinary; smooth; quiet; incident-free',
    options: ['bình thường / không có gì đặc biệt / suôn sẻ', 'bị vứt bỏ / loại bỏ', 'khí tượng học', 'ngăn kéo'],
    status: 'new',
  },
  {
    id: 'v8', word: 'meteorology', type: 'noun',
    meaning: 'khí tượng học',
    example: 'Meteorology is the study of weather.',
    exampleVi: 'Khí tượng học là bộ môn khoa học nghiên cứu về thời tiết.',
    options: ['khí tượng học', 'sự kiểm tra / thanh tra', 'bến cảng', 'hoàn trả / khoản hoàn tiền'],
    status: 'new',
  },
  {
    id: 'v9', word: 'fog', type: 'noun',
    meaning: 'sương mù',
    example: 'I hope the fog over the harbor lifts soon.',
    exampleVi: 'Tôi hy vọng sương mù trên khu cảng sẽ sớm tan.',
    options: ['sương mù', 'boong tàu', 'lề đường / mép vỉa hè', 'bảng tính'],
    status: 'new',
  },
  {
    id: 'v10', word: 'harbor', type: 'noun',
    meaning: 'cảng / bến cảng',
    example: 'I hope the fog over the harbor lifts soon.',
    exampleVi: 'Tôi hy vọng sương mù trên khu cảng sẽ sớm tan.',
    synonyms: 'dock; marina',
    options: ['cảng / bến cảng', 'sân thượng / sân hiên', 'hàng rào', 'các đại diện / nhân viên đại diện'],
    status: 'new',
  },
  {
    id: 'v11', word: 'lift', type: 'verb',
    meaning: 'nâng lên / tan đi',
    example: 'I hope the fog over the harbor lifts soon.',
    exampleVi: 'Tôi hy vọng sương mù trên khu cảng sẽ sớm tan.',
    synonyms: 'fade away',
    options: ['nâng lên / tan đi', 'chặt / cắt nhỏ', 'bị vứt bỏ / loại bỏ', 'chi phí / khoản phí'],
    status: 'new',
  },
  {
    id: 'v12', word: 'terrace', type: 'noun',
    meaning: 'sân thượng / sân hiên / khu vực ngoài trời',
    example: "I know I asked to be seated on your beautiful terrace, but it's very hot today.",
    exampleVi: 'Tôi biết tôi đã yêu cầu ngồi trên sân thượng tuyệt đẹp của cô, nhưng hôm nay trời rất nóng.',
    options: ['sân thượng / sân hiên / khu vực ngoài trời', 'chỗ ở / nơi lưu trú', 'lề đường / mép vỉa hè', 'ngăn kéo'],
    status: 'new',
  },
  {
    id: 'v13', word: 'fence', type: 'noun',
    meaning: 'hàng rào',
    example: 'Wood is piled near a fence.',
    exampleVi: 'Gỗ được chất gần hàng rào.',
    options: ['hàng rào', 'bảng tính', 'sương mù', 'dụng cụ ăn uống'],
    status: 'new',
  },
  {
    id: 'v14', word: 'utensils', type: 'noun',
    meaning: 'dụng cụ ăn uống / dụng cụ nhà bếp',
    example: 'Some utensils have been discarded in a bin.',
    exampleVi: 'Một số đồ dùng đã bị bỏ vào thùng rác.',
    synonyms: 'tools; cutlery; kitchenware',
    usage: 'Hay gặp trong chủ đề nhà hàng, khách sạn, bếp, phục vụ ăn uống. Số ít là utensil.',
    options: ['dụng cụ ăn uống / dụng cụ nhà bếp', 'các đại diện / nhân viên đại diện', 'chi phí / khoản phí', 'khí tượng học'],
    status: 'new',
  },
  {
    id: 'v15', word: 'drawer', type: 'noun',
    meaning: 'ngăn kéo',
    example: 'Some drawers have been left open.',
    exampleVi: 'Một số ngăn kéo đã bị mở.',
    synonyms: 'compartments; storage spaces',
    usage: 'Hay gặp trong chủ đề văn phòng, nhà cửa, dọn dẹp, nội thất.',
    options: ['ngăn kéo', 'hàng rào', 'boong tàu', 'sân thượng / sân hiên / khu vực ngoài trời'],
    status: 'new',
  },
  {
    id: 'v16', word: 'discard', type: 'verb',
    meaning: 'bị vứt bỏ / đã bị loại bỏ',
    example: 'Some utensils have been discarded in a bin.',
    exampleVi: 'Một số đồ dùng đã bị bỏ vào thùng rác.',
    synonyms: 'thrown away; removed; disposed of; unwanted',
    usage: 'Hay gặp trong ngữ cảnh dọn dẹp, tái chế, kho hàng, văn phòng.',
    options: ['bị vứt bỏ / đã bị loại bỏ', 'nâng lên / tan đi', 'chặt / cắt nhỏ', 'bình thường / không có gì đặc biệt / suôn sẻ'],
    status: 'new',
  },
  {
    id: 'v17', word: 'chop', type: 'verb',
    meaning: 'chặt / cắt nhỏ',
    example: 'A man is chopping some wood into pieces.',
    exampleVi: 'Một người đàn ông đang chặt gỗ thành từng mảnh.',
    synonyms: 'cut; slice; dice',
    usage: 'Chop thường là cắt/chặt mạnh tay hơn cut. slice = cắt lát, dice = cắt hạt lựu.',
    options: ['chặt / cắt nhỏ', 'nâng lên / tan đi', 'bị vứt bỏ / loại bỏ', 'chi phí / khoản phí'],
    status: 'new',
  },
  {
    id: 'v18', word: 'inspection', type: 'noun',
    meaning: 'sự kiểm tra, sự thanh tra, sự xem xét kỹ lưỡng',
    example: 'The factory will undergo a routine safety inspection tomorrow.',
    exampleVi: 'Nhà máy sẽ trải qua một cuộc kiểm tra an toàn định kỳ vào ngày mai.',
    synonyms: 'examination; check; review; assessment; investigation',
    usage: 'Động từ: inspect (kiểm tra, thanh tra). Danh từ chỉ người: inspector (thrain viên, người kiểm định).',
    options: ['sự kiểm tra, sự thanh tra, sự xem xét kỹ lưỡng', 'khí tượng học', 'bảng tính', 'chỗ ở / nơi lưu trú'],
    status: 'new',
  },
  {
    id: 'v19', word: 'curb', type: 'noun',
    meaning: 'lề đường, mép vỉa hè',
    example: "She's stepping off a curb.",
    exampleVi: 'Cô ấy đang bước xuống khỏi lề đường.',
    synonyms: 'edge (mép), border, pavement edge',
    usage: 'Noun: Lề đường. Động từ: Kiềm chế, hạn chế (ví dụ: curb inflation = kiềm chế lạm phát).',
    options: ['lề đường, mép vỉa hè', 'hàng rào', 'sân thượng / sân hiên / khu vực ngoài trời', 'cảng / bến cảng'],
    status: 'new',
  },
  {
    id: 'v_listening_20', word: 'nominate', type: 'verb',
    meaning: 'đề cử / chỉ định',
    example: 'The board will nominate one candidate for the leadership position.',
    exampleVi: 'Hội đồng sẽ đề cử một ứng viên cho vị trí lãnh đạo.',
    synonyms: 'appoint; propose; recommend',
    usage: 'nominate someone for/as something; nominate a candidate; dùng cho bầu chọn, chức vụ, giải thưởng hoặc vai trò trong công ty.',
    status: 'new',
  },
  {
    id: 'v_listening_21', word: 'chairperson', type: 'noun',
    meaning: 'chủ tịch / người chủ trì',
    example: 'The chairperson will lead the monthly planning meeting.',
    exampleVi: 'Chủ tịch sẽ điều hành cuộc họp lập kế hoạch hằng tháng.',
    synonyms: 'chair; head; presiding officer',
    usage: 'committee chairperson; board chairperson; meeting chairperson; chỉ người đứng đầu hoặc người điều phối một hội đồng/cuộc họp.',
    status: 'new',
  },
  {
    id: 'v_listening_22', word: 'moderately', type: 'adverb',
    meaning: 'vừa phải / chừng mực',
    example: 'The product is moderately priced for small businesses.',
    exampleVi: 'Sản phẩm có giá vừa phải đối với các doanh nghiệp nhỏ.',
    synonyms: 'reasonably; fairly; somewhat',
    usage: 'moderately priced; moderately successful; use moderately; trạng từ bổ nghĩa cho tính từ/động từ, nghĩa không quá nhiều.',
    status: 'new',
  },
  {
    id: 'v_listening_23', word: 'exclusively', type: 'adverb',
    meaning: 'độc quyền / chỉ riêng',
    example: 'The discount is available exclusively to members.',
    exampleVi: 'Ưu đãi chỉ dành riêng cho hội viên.',
    synonyms: 'only; solely; uniquely',
    usage: 'available exclusively; sold exclusively; exclusively for members; hay đi với available/sold/offered để nói phạm vi độc quyền.',
    status: 'new',
  },
  {
    id: 'v_listening_24', word: 'additionally', type: 'adverb',
    meaning: 'ngoài ra / thêm vào đó',
    example: 'The company offers free delivery; additionally, it provides installation support.',
    exampleVi: 'Công ty cung cấp giao hàng miễn phí; ngoài ra, công ty còn hỗ trợ lắp đặt.',
    synonyms: 'also; furthermore; moreover',
    usage: 'additionally; additionally provide/offer/include; từ nối bổ sung ý, thường đứng đầu câu hoặc sau dấu chấm phẩy.',
    status: 'new',
  },
  {
    id: 'v_listening_25', word: 'grounded', type: 'adjective',
    meaning: 'có cơ sở / thực tế / vững chắc',
    example: 'Her decision was grounded in customer feedback.',
    exampleVi: 'Quyết định của cô ấy dựa trên phản hồi của khách hàng.',
    synonyms: 'based; founded; practical',
    usage: 'grounded in facts/data/evidence; well-grounded; TOEIC hay gặp cấu trúc be grounded in + noun.',
    status: 'new',
  },
  {
    id: 'v_listening_26', word: 'confidential', type: 'adjective',
    meaning: 'bảo mật / bí mật',
    example: 'All employee records must remain confidential.',
    exampleVi: 'Tất cả hồ sơ nhân viên phải được giữ bí mật.',
    synonyms: 'private; secret; restricted',
    usage: 'confidential information; confidential report; keep confidential; hay dùng trong bối cảnh tài liệu, hồ sơ, thông tin khách hàng.',
    status: 'new',
  },
  {
    id: 'v_listening_27', word: 'capable', type: 'adjective',
    meaning: 'có khả năng / đủ năng lực',
    example: 'Ms. Benning is capable of leading a large team.',
    exampleVi: 'Cô Benning có khả năng dẫn dắt một đội ngũ lớn.',
    synonyms: 'competent; able; qualified',
    usage: 'capable of + V-ing; fully capable; highly capable; cấu trúc quan trọng: capable of + V-ing.',
    status: 'new',
  },
  {
    id: 'v_listening_28', word: 'ruling', type: 'noun',
    meaning: 'phán quyết / quyết định chính thức',
    example: 'The court issued a ruling on the contract dispute.',
    exampleVi: 'Tòa án đã đưa ra phán quyết về tranh chấp hợp đồng.',
    synonyms: 'decision; judgment; verdict',
    usage: 'court ruling; final ruling; issue a ruling; thường dùng trong ngữ cảnh pháp lý hoặc quyết định chính thức.',
    status: 'new',
  },
  {
    id: 'v_listening_29', word: 'shifting', type: 'adjective',
    meaning: 'đang thay đổi / dịch chuyển',
    example: 'The company adjusted its strategy to meet shifting market demands.',
    exampleVi: 'Công ty đã điều chỉnh chiến lược để đáp ứng nhu cầu thị trường đang thay đổi.',
    synonyms: 'changing; moving; evolving',
    usage: 'shifting demand; shifting priorities; shifting market; thường bổ nghĩa cho demand, priorities, trends, market.',
    status: 'new',
  },
  {
    id: 'v_listening_30', word: 'convincing', type: 'adjective',
    meaning: 'thuyết phục',
    example: 'The manager gave a convincing reason for the schedule change.',
    exampleVi: 'Người quản lý đưa ra một lý do thuyết phục cho việc thay đổi lịch trình.',
    synonyms: 'persuasive; compelling; credible',
    usage: 'convincing case; convincing argument; convincing reason; presenting a convincing case = trình bày một lập luận thuyết phục.',
    status: 'new',
  },
  {
    id: 'v_listening_31', word: 'divided', type: 'verb / adjective',
    meaning: 'được chia / bị chia ra',
    example: 'The project budget was divided among three departments.',
    exampleVi: 'Ngân sách dự án được chia cho ba phòng ban.',
    synonyms: 'split; separated; allocated',
    usage: 'divide among/between; divided into sections; dạng quá khứ/quá khứ phân từ của divide.',
    status: 'new',
  },
  {
    id: 'v_listening_32', word: 'deducted', type: 'verb',
    meaning: 'khấu trừ / trừ ra',
    example: 'The service fee was deducted from the final payment.',
    exampleVi: 'Phí dịch vụ đã được khấu trừ khỏi khoản thanh toán cuối cùng.',
    synonyms: 'subtracted; withheld; taken off',
    usage: 'deduct from; deduct a fee; deducted amount; hay gặp trong lương, phí, thuế, hóa đơn.',
    status: 'new',
  },
  {
    id: 'v_listening_33', word: 'calculated', type: 'verb / adjective',
    meaning: 'tính toán / được tính toán',
    example: 'The accountant calculated the total cost of the renovation.',
    exampleVi: 'Kế toán đã tính tổng chi phí của việc cải tạo.',
    synonyms: 'computed; estimated; worked out',
    usage: 'calculate the cost; calculate interest; carefully calculated; từ thường gặp trong tài chính, chi phí, số liệu.',
    status: 'new',
  },
  {
    id: 'v_listening_34', word: 'prolonged', type: 'adjective / verb',
    meaning: 'kéo dài / bị kéo dài',
    example: 'A prolonged delay affected the delivery schedule.',
    exampleVi: 'Sự chậm trễ kéo dài đã ảnh hưởng đến lịch giao hàng.',
    synonyms: 'extended; lengthened; drawn-out',
    usage: 'prolonged delay; prolonged discussion; prolonged period; hay dùng cho delay, discussion, period, absence.',
    status: 'new',
  },
  {
    id: 'v_listening_35', word: 'settle a debt', type: 'verb phrase',
    meaning: 'trả hết nợ / thanh toán khoản nợ',
    example: 'Mr. Gordon continued to repay the loan in small amounts to settle his debt.',
    exampleVi: 'Ông Gordon tiếp tục trả khoản vay từng khoản nhỏ để thanh toán hết nợ.',
    synonyms: 'pay off; repay; clear a debt',
    usage: 'settle a debt; settle an account; settle a bill; settle đi với debt = trả hết/thanh toán khoản nợ.',
    status: 'new',
  },
  {
    id: 'v_listening_36', word: 'identical', type: 'adjective',
    meaning: 'giống hệt / y hệt',
    example: 'The two invoices are almost identical.',
    exampleVi: 'Hai hóa đơn gần như giống hệt nhau.',
    synonyms: 'same; matching; indistinguishable',
    usage: 'identical to; almost identical; identical copies; cấu trúc: identical to + noun.',
    status: 'new',
  },
  {
    id: 'v_listening_37', word: 'broad', type: 'adjective',
    meaning: 'rộng / bao quát',
    example: 'The report provides a broad overview of the industry.',
    exampleVi: 'Báo cáo cung cấp cái nhìn tổng quan rộng về ngành.',
    synonyms: 'wide; extensive; general',
    usage: 'broad range; broad overview; broad market; thường dùng với range, overview, market, experience.',
    status: 'new',
  },
  {
    id: 'v_listening_38', word: 'dominant', type: 'adjective',
    meaning: 'thống trị / chiếm ưu thế / áp đảo',
    example: 'The company became the dominant provider in mobile telecommunications.',
    exampleVi: 'Công ty đã trở thành nhà cung cấp thống trị trong lĩnh vực viễn thông di động.',
    synonyms: 'leading; major; prevailing',
    usage: 'dominant provider; dominant position; dominant market player; dominant provider = nhà cung cấp thống trị/áp đảo.',
    status: 'new',
  },
  {
    id: 'v_listening_39', word: 'similar', type: 'adjective',
    meaning: 'tương tự / giống',
    example: 'The new software is similar to the previous version.',
    exampleVi: 'Phần mềm mới tương tự phiên bản trước.',
    synonyms: 'alike; comparable; related',
    usage: 'similar to; similar features; similar design; cấu trúc: similar to + noun.',
    status: 'new',
  },
  {
    id: 'v_listening_40', word: 'generously', type: 'adverb',
    meaning: 'hào phóng / rộng lượng',
    example: 'The company generously donated equipment to the school.',
    exampleVi: 'Công ty đã hào phóng quyên tặng thiết bị cho trường học.',
    synonyms: 'kindly; freely; liberally',
    usage: 'donate generously; generously allow; give generously; generously allow = hào phóng cho phép.',
    status: 'new',
  },
  {
    id: 'v_listening_41', word: 'accidentally', type: 'adverb',
    meaning: 'vô tình / tình cờ',
    example: 'The assistant accidentally sent the report to the wrong department.',
    exampleVi: 'Trợ lý đã vô tình gửi báo cáo đến sai phòng ban.',
    synonyms: 'unintentionally; by mistake; inadvertently',
    usage: 'accidentally delete/send/break; accidentally left; trạng từ chỉ hành động không cố ý.',
    status: 'new',
  },
  {
    id: 'v_listening_42', word: 'immensely', type: 'adverb',
    meaning: 'vô cùng / cực kỳ',
    example: 'The training program was immensely helpful for new staff.',
    exampleVi: 'Chương trình đào tạo cực kỳ hữu ích cho nhân viên mới.',
    synonyms: 'extremely; greatly; tremendously',
    usage: 'immensely helpful; immensely popular; immensely grateful; trạng từ nhấn mạnh mức độ mạnh.',
    status: 'new',
  },
  {
    id: 'v_listening_43', word: 'intensively', type: 'adverb',
    meaning: 'chuyên sâu / với cường độ cao',
    example: 'The staff were trained intensively before the software launch.',
    exampleVi: 'Nhân viên được đào tạo chuyên sâu trước khi ra mắt phần mềm.',
    synonyms: 'thoroughly; deeply; extensively',
    usage: 'train/study/work intensively; thường dùng khi nói về đào tạo, học tập hoặc làm việc với cường độ cao.',
    status: 'new',
  },
  {
    id: 'v_listening_44', word: 'imagination', type: 'noun',
    meaning: 'trí tưởng tượng',
    example: 'Good advertising often depends on creativity and imagination.',
    exampleVi: 'Quảng cáo tốt thường phụ thuộc vào sự sáng tạo và trí tưởng tượng.',
    synonyms: 'creativity; inventiveness',
    usage: 'use your imagination; creativity and imagination; danh từ trong ngữ cảnh sáng tạo, quảng cáo, ý tưởng.',
    status: 'new',
  },
  {
    id: 'v_listening_45', word: 'perspective', type: 'noun',
    meaning: 'góc nhìn / quan điểm',
    example: 'Working overseas gave her a new perspective on customer service.',
    exampleVi: 'Làm việc ở nước ngoài cho cô ấy một góc nhìn mới về dịch vụ khách hàng.',
    synonyms: 'viewpoint; point of view; outlook',
    usage: 'a new perspective on; from a different perspective; perspective on + noun = góc nhìn về một vấn đề.',
    status: 'new',
  },
  {
    id: 'v_listening_46', word: 'overview', type: 'noun',
    meaning: 'tổng quan / cái nhìn khái quát',
    example: 'Before the meeting, the manager gave an overview of the quarterly results.',
    exampleVi: 'Trước cuộc họp, quản lý đưa ra phần tổng quan về kết quả quý.',
    synonyms: 'summary; outline; review',
    usage: 'give/provide an overview of; overview of + noun = phần tổng quan về nội dung nào đó.',
    status: 'new',
  },
  {
    id: 'v_listening_47', word: 'reflection', type: 'noun',
    meaning: 'sự suy ngẫm / sự nhìn lại',
    example: 'His speech was a reflection on the company’s first ten years.',
    exampleVi: 'Bài phát biểu của anh ấy là sự nhìn lại mười năm đầu của công ty.',
    synonyms: 'thought; consideration; review',
    usage: 'reflection on; time for reflection; còn có nghĩa là hình ảnh phản chiếu tùy ngữ cảnh.',
    status: 'new',
  },
  {
    id: 'v_listening_48', word: 'monument', type: 'noun',
    meaning: 'tượng đài',
    example: 'Many tourists stopped to take photos of the historic monument in the city square.',
    exampleVi: 'Nhiều du khách dừng lại để chụp ảnh tượng đài lịch sử ở quảng trường thành phố.',
    synonyms: 'memorial; statue; landmark',
    usage: 'historic monument; war monument; national monument; monument = tượng đài / công trình kỷ niệm.',
    status: 'new',
  },
];

function buildVocabOptions(items: VocabSeedItem[]): TestVocabItem[] {
  return items.map((item, index) => {
    const base = item.options?.includes(item.meaning)
      ? [...item.options]
      : [item.meaning, ...(item.options ?? [])];
    const distractors = items
      .filter(other => other.word.toLowerCase() !== item.word.toLowerCase())
      .map(other => other.meaning)
      .filter((meaning, meaningIndex, list) => meaning && meaning !== item.meaning && list.indexOf(meaning) === meaningIndex);

    let offset = 1;
    while (base.length < 4 && distractors.length > 0 && offset <= distractors.length * 2) {
      const candidate = distractors[(index + offset * 3) % distractors.length];
      if (!base.includes(candidate)) base.push(candidate);
      offset++;
    }

    return {
      ...item,
      options: base.slice(0, 4),
      status: item.status || 'new',
    };
  });
}

const BUILT_IN_VOCAB: TestVocabItem[] = buildVocabOptions(BUILT_IN_VOCAB_SEEDS);

export interface SavedResult {
  score: number;
  totalCount?: number;
  total?: number;
  part?: string;
  submittedAt: string;
}

class DbService {
  private saveBuiltInPracticeSet() {
    try {
      BUILT_IN_PART5_PRACTICE_TESTS.forEach(test => {
        const answerKeyMap: Record<number, string> = {};
        test.questions.forEach(q => {
          answerKeyMap[q.questionNo] = q.answer;
        });
        localStorage.setItem(`toeic_answer_key_${test.id}`, JSON.stringify(answerKeyMap));
        localStorage.setItem(`toeic_question_set_${test.id}`, JSON.stringify(test.questions));
      });
    } catch {
      // ignore
    }
  }

  private ensureBuiltInTests(list: TestItem[]): TestItem[] {
    this.saveBuiltInPracticeSet();

    const builtInIds = new Set(BUILT_IN_PART5_PRACTICE_TESTS.map(test => test.id));
    const builtInTests: TestItem[] = BUILT_IN_PART5_PRACTICE_TESTS.map((test, index) => ({
      id: test.id,
      index: index + 1,
      title: test.title,
      range: '101 – 130',
      status: 'pending',
      totalCount: 30,
      part: '5',
    }));

    const customTests = list
      .filter(test => !LEGACY_SAMPLE_TEST_IDS.has(test.id) && !builtInIds.has(test.id))
      .sort((a, b) => a.index - b.index)
      .map((test, index) => ({ ...test, index: index + builtInTests.length + 1 }));

    return [
      ...builtInTests,
      ...customTests,
    ];
  }

  private mergeBuiltInVocab(list: TestVocabItem[]): TestVocabItem[] {
    const localByWord = new Map<string, TestVocabItem>();
    list.forEach(item => {
      localByWord.set(item.word.toLowerCase().trim(), item);
    });

    const builtInWords = new Set(BUILT_IN_VOCAB.map(item => item.word.toLowerCase().trim()));
    const mergedBuiltIns = BUILT_IN_VOCAB.map(item => {
      const existing = localByWord.get(item.word.toLowerCase().trim());
      if (!existing) return item;

      return {
        ...item,
        id: existing.id || item.id,
        status: existing.status || item.status || 'new',
        options: item.options.length >= 4 ? item.options : existing.options,
      };
    });

    const customItems = list.filter(item => !builtInWords.has(item.word.toLowerCase().trim()));
    return [...mergedBuiltIns, ...customItems];
  }

  private getResults(): Record<string, SavedResult> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return {};

      const data = JSON.parse(stored);
      let changed = false;
      LEGACY_SAMPLE_TEST_IDS.forEach(id => {
        if (data[id]) {
          delete data[id];
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      return data;
    } catch {
      return {};
    }
  }

  public getTests(): TestItem[] {
    try {
      const stored = localStorage.getItem('toeic_tests_list');
      let list: TestItem[] = stored ? JSON.parse(stored) : [];
      if (list.length === 0) {
        list = [...BUILT_IN_TESTS];
      }
      list = this.ensureBuiltInTests(list);
      localStorage.setItem('toeic_tests_list', JSON.stringify(list));
      
      const results = this.getResults();
      return list.map(t => {
        const saved = results[t.id];
        if (saved) {
          return {
            ...t,
            status: 'done',
            score: saved.score,
            totalCount: saved.totalCount || saved.total, // fallback if total is used
            part: saved.part
          };
        }
        return {
          ...t,
          status: t.status || 'pending'
        };
      });
    } catch {
      return this.ensureBuiltInTests([...BUILT_IN_TESTS]);
    }
  }

  public saveTestsList(list: TestItem[]) {
    try {
      localStorage.setItem('toeic_tests_list', JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  public createCustomTest(title: string, answers: ParsedAnswer[]): string {
    const list = this.getTests();
    const nextIndex = list.length > 0 ? Math.max(...list.map(t => t.index)) + 1 : 1;
    const testId = `custom-${Date.now()}`;
    
    const newTest: TestItem = {
      id: testId,
      index: nextIndex,
      title,
      range: '101 – 200',
      status: 'pending'
    };
    
    list.push(newTest);
    this.saveTestsList(list);
    
    // Save answer keys
    const answerKeyMap: Record<number, string> = {};
    answers.forEach(a => {
      answerKeyMap[a.questionNo] = a.answer;
    });
    localStorage.setItem(`toeic_answer_key_${testId}`, JSON.stringify(answerKeyMap));
    
    return testId;
  }

  public deleteTest(testId: string) {
    const list = this.getTests();
    const updated = list.filter(t => t.id !== testId);
    this.saveTestsList(updated);
    
    // Clean up answers and scores
    localStorage.removeItem(`toeic_answer_key_${testId}`);
    localStorage.removeItem(`toeic_question_set_${testId}`);
    try {
      const results = this.getResults();
      delete results[testId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch {
      // ignore
    }
  }

  public getAnswerKey(testId: string): Record<number, string> {
    const builtInTest = BUILT_IN_PART5_PRACTICE_TESTS.find(test => test.id === testId);
    if (builtInTest) {
      this.saveBuiltInPracticeSet();
      return Object.fromEntries(builtInTest.questions.map(q => [q.questionNo, q.answer]));
    }

    try {
      const stored = localStorage.getItem(`toeic_answer_key_${testId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    return {};
  }

  public hasAnswerKey(testId: string): boolean {
    try {
      return localStorage.getItem(`toeic_answer_key_${testId}`) !== null;
    } catch {
      return false;
    }
  }

  public getPracticeQuestions(testId: string): PracticeQuestion[] {
    try {
      if (BUILT_IN_PART5_PRACTICE_TESTS.some(test => test.id === testId)) {
        this.saveBuiltInPracticeSet();
      }
      const stored = localStorage.getItem(`toeic_question_set_${testId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public saveResult(testId: string, score: number, totalCount: number = 100, part: string = 'all') {
    try {
      const results = this.getResults();
      results[testId] = {
        score,
        totalCount,
        part,
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
      this.recordStudyAction(100);
    } catch (e) {
      // ignore
    }
  }

  // ── Wrong Questions Persistence ──
  public getWrongQuestions(): any[] {
    try {
      const stored = localStorage.getItem('toeic_wrong_questions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public saveWrongQuestion(
    testTitle: string,
    questionNo: number,
    part: 5 | 6 | 7,
    chosen: string,
    correct: string,
    testId?: string,
    questionDetail?: PracticeQuestion,
  ) {
    try {
      const list = this.getWrongQuestions();
      const existingIndex = list.findIndex((item: any) => item.testTitle === testTitle && item.questionNo === questionNo);
      const current: any = existingIndex >= 0 ? list[existingIndex] : {};
      const nextItem = {
        ...current,
        id: current.id || Date.now() + Math.random(),
        questionNo,
        part,
        chosen,
        correct,
        errorType: current.errorType || 'grammar',
        note: `Lỗi sai: chọn nhầm ${chosen} (đáp án đúng: ${correct}).`,
        testTitle,
        testId: testId || current.testId,
        question: questionDetail?.question || current.question,
        options: questionDetail?.options || current.options,
        explanation: questionDetail?.explanation || current.explanation,
        translation: questionDetail?.translation || current.translation,
        vocabulary: questionDetail?.vocabulary || current.vocabulary,
      };

      if (existingIndex >= 0) list[existingIndex] = nextItem;
      else list.push(nextItem);
      localStorage.setItem('toeic_wrong_questions', JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  public getWrongQuestionDetail(item: any): PracticeQuestion | null {
    const title = String(item?.testTitle || '').replace(/\s+\(Part\s+\d+\)$/i, '').trim();
    const builtInTest = BUILT_IN_PART5_PRACTICE_TESTS.find(test =>
      item?.testId === test.id ||
      title === test.title ||
      String(item?.testTitle || '').startsWith(test.title)
    );

    const directQuestion = item?.question && Array.isArray(item?.options)
      ? {
          questionNo: item.questionNo,
          part: item.part,
          question: item.question,
          options: item.options,
          answer: item.correct,
          explanation: item.explanation || item.note || '',
          translation: item.translation,
          vocabulary: item.vocabulary,
        } as PracticeQuestion
      : null;

    return builtInTest?.questions.find(q => q.questionNo === item.questionNo) || directQuestion;
  }

  public deleteWrongQuestion(id: number) {
    try {
      const list = this.getWrongQuestions();
      const updated = list.filter((item: any) => item.id !== id);
      localStorage.setItem('toeic_wrong_questions', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  public getMetrics() {
    const tests = this.getTests();
    const completed = tests.filter(t => t.status === 'done');
    const totalDone = completed.length;
    const avgScore = totalDone > 0 
      ? Math.round(completed.reduce((acc, t) => acc + (t.score || 0), 0) / totalDone)
      : 0;
    
    const wrongCount = this.getWrongQuestions().length;

    return {
      tests: totalDone,
      wrong: wrongCount,
      avg: avgScore,
    };
  }

  // ── Vocabulary LocalStorage operations ──
  public getVocabList(): TestVocabItem[] {
    try {
      const stored = localStorage.getItem(VOCAB_STORAGE_KEY);
      if (stored) {
        const merged = this.mergeBuiltInVocab(JSON.parse(stored));
        localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch {
      // ignore
    }
    return this.mergeBuiltInVocab(BUILT_IN_VOCAB);
  }

  public handleVocabAnswer(id: string, correct: boolean) {
    const list = this.getVocabList();
    const updated = list.map(v => {
      if (v.id !== id) return v;
      let nextStatus = v.status || 'new';
      if (correct) {
        if (nextStatus === 'new') nextStatus = 'review';
        else if (nextStatus === 'review') nextStatus = 'mastered';
      } else {
        if (nextStatus === 'mastered') nextStatus = 'review';
        else if (nextStatus === 'review') nextStatus = 'new';
      }
      return { ...v, status: nextStatus };
    });
    try {
      localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(updated));
      this.recordStudyAction(5);
    } catch {
      // ignore
    }
  }

  public importVocabFromTsv(tsvText: string): number {
    const lines = tsvText.split(/\r?\n/);
    const currentList = this.getVocabList();
    const vocabMap = new Map<string, TestVocabItem>();
    
    currentList.forEach(v => {
      vocabMap.set(v.word.toLowerCase().trim(), v);
    });

    let importedCount = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Copying from Google Sheets yields tab (\t) separated columns
      const cols = trimmed.split('\t');
      if (cols.length < 3) continue; // Minimum required: Word, Type, Meaning

      const word = cols[0].trim();
      const type = cols[1].trim();
      const meaning = cols[2].trim();
      if (!word || !meaning) continue;

      const example = cols[3] ? cols[3].trim() : '';
      const exampleVi = cols[4] ? cols[4].trim() : '';
      const synonyms = cols[5] ? cols[5].trim() : '';
      const usage = cols[6] ? cols[6].trim() : '';

      const key = word.toLowerCase().trim();
      const existing = vocabMap.get(key);

      const item: TestVocabItem = {
        id: existing ? existing.id : `v_imported_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        word,
        type,
        meaning,
        example: example || `Example sentence for ${word}.`,
        exampleVi,
        synonyms,
        usage,
        options: existing ? existing.options : [meaning],
        status: existing ? existing.status : 'new', // PRESERVE existing study status (new/review/mastered)
      };

      vocabMap.set(key, item);
      importedCount++;
    }

    try {
      const updatedList = Array.from(vocabMap.values());

      // Dynamically fill wrong options if there aren't at least 4 options
      updatedList.forEach(item => {
        if (item.options.length < 4 || !item.options.includes(item.meaning)) {
          const otherMeanings = updatedList
            .filter(o => o.word.toLowerCase() !== item.word.toLowerCase())
            .map(o => o.meaning);
          const shuffled = otherMeanings.sort(() => 0.5 - Math.random());
          item.options = [item.meaning, ...shuffled.slice(0, 3)];
        }
      });

      localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      // ignore
    }

    return importedCount;
  }

  public async syncVocabWithServer(): Promise<number> {
    try {
      const res = await fetch('/api/sync/vocab');
      if (!res.ok) return 0;

      const serverList: TestVocabItem[] = await res.json();
      if (!Array.isArray(serverList) || serverList.length === 0) return 0;

      const localList = this.getVocabList();
      const localMap = new Map<string, TestVocabItem>();
      localList.forEach(v => localMap.set(v.word.toLowerCase().trim(), v));

      let mergedCount = 0;

      serverList.forEach(item => {
        const key = item.word.toLowerCase().trim();
        const existing = localMap.get(key);

        if (existing) {
          // Update details, preserve local study status
          localMap.set(key, {
            ...item,
            id: existing.id,
            options: item.options.length >= 4 ? item.options : existing.options,
            status: existing.status || item.status || 'new',
          });
        } else {
          // Add new item
          localMap.set(key, {
            ...item,
            status: item.status || 'new',
          });
          mergedCount++;
        }
      });

      const mergedList = Array.from(localMap.values());
      
      // Ensure distractors are built properly
      mergedList.forEach(item => {
        if (item.options.length < 4 || !item.options.includes(item.meaning)) {
          const otherMeanings = mergedList
            .filter(o => o.word.toLowerCase() !== item.word.toLowerCase())
            .map(o => o.meaning);
          const shuffled = otherMeanings.sort(() => 0.5 - Math.random());
          item.options = [item.meaning, ...shuffled.slice(0, 3)];
        }
      });

      localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(mergedList));

      // Push back to make them consistent
      await fetch('/api/sync/vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedList),
      });

      return mergedCount;
    } catch (e) {
      console.error('Failed to sync vocabulary:', e);
      return 0;
    }
  }

  public async pushVocabToServer(): Promise<boolean> {
    try {
      const localList = this.getVocabList();
      const res = await fetch('/api/sync/vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localList),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // ── Grammar Persistence ──
  public getGrammarAnswers(): Record<string, { chosen: string; correct: boolean; answeredAt: string }> {
    try {
      const stored = localStorage.getItem('toeic_grammar_answers');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  public saveGrammarAnswer(questionId: string, chosen: string, correct: boolean) {
    try {
      const answers = this.getGrammarAnswers();
      answers[questionId] = {
        chosen,
        correct,
        answeredAt: new Date().toISOString(),
      };
      localStorage.setItem('toeic_grammar_answers', JSON.stringify(answers));
    } catch (e) {
      // ignore
    }
  }

  public getGrammarMetrics() {
    const answers = this.getGrammarAnswers();
    const totalQuestions = GRAMMAR_QUESTIONS.length;
    const completedCount = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const categoryMap = new Map<string, { total: number; done: number; correct: number }>();
    
    GRAMMAR_QUESTIONS.forEach(q => {
      const cat = q.category;
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, { total: 0, done: 0, correct: 0 });
      }
      const state = categoryMap.get(cat)!;
      state.total++;
      
      const ans = answers[q.id];
      if (ans) {
        state.done++;
        if (ans.correct) state.correct++;
      }
    });

    return {
      total: totalQuestions,
      done: completedCount,
      correct: correctCount,
      pct,
      categories: Object.fromEntries(categoryMap.entries()),
    };
  }

  // ── Syllabus Progress Persistence ──
  public getSyllabusProgress(dayId: string): { completed: boolean; score: number; total: number } | null {
    try {
      const stored = localStorage.getItem('toeic_syllabus_progress');
      if (!stored) return null;
      const data = JSON.parse(stored);
      return data[dayId] || null;
    } catch {
      return null;
    }
  }

  public saveSyllabusProgress(dayId: string, score: number, total: number) {
    try {
      const stored = localStorage.getItem('toeic_syllabus_progress');
      const data = stored ? JSON.parse(stored) : {};
      data[dayId] = {
        completed: true,
        score,
        total,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('toeic_syllabus_progress', JSON.stringify(data));
      this.recordStudyAction(50);
    } catch (e) {
      // ignore
    }
  }

  // ── Gamification System ──
  public getUserXP(): number {
    try {
      return parseInt(localStorage.getItem('user_xp') || '0', 10);
    } catch {
      return 0;
    }
  }

  public addXP(amount: number): number {
    try {
      const current = this.getUserXP();
      const nextXp = current + amount;
      localStorage.setItem('user_xp', nextXp.toString());
      return nextXp;
    } catch {
      return 0;
    }
  }

  public getStreakCount(): number {
    try {
      const lastStudyDate = localStorage.getItem('user_last_study_date') || '';
      if (!lastStudyDate) return 0;
      
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const localDate = new Date(now.getTime() - (offset * 60 * 1000));
      const todayStr = localDate.toISOString().split('T')[0];
      
      const yesterday = new Date(localDate.getTime() - 24 * 60 * 60 * 1000);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastStudyDate !== todayStr && lastStudyDate !== yesterdayStr) {
        localStorage.setItem('user_streak_count', '0');
        return 0;
      }
      
      return parseInt(localStorage.getItem('user_streak_count') || '0', 10);
    } catch {
      return 0;
    }
  }

  public getStudyHistory(): string[] {
    try {
      const stored = localStorage.getItem('user_study_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public recordStudyAction(xpToAdd: number = 0) {
    try {
      const now = new Date();
      const offset = now.getTimezoneOffset();
      const localDate = new Date(now.getTime() - (offset * 60 * 1000));
      const todayStr = localDate.toISOString().split('T')[0];
      
      const stored = localStorage.getItem('user_study_history');
      const history: string[] = stored ? JSON.parse(stored) : [];
      
      if (xpToAdd > 0) {
        this.addXP(xpToAdd);
      }
      
      if (history.includes(todayStr)) {
        return; // Already studied today
      }
      
      const lastStudyDate = localStorage.getItem('user_last_study_date') || '';
      let streak = parseInt(localStorage.getItem('user_streak_count') || '0', 10);
      
      const yesterday = new Date(localDate.getTime() - 24 * 60 * 60 * 1000);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (!lastStudyDate) {
        streak = 1;
      } else if (lastStudyDate === yesterdayStr) {
        streak += 1;
      } else {
        streak = 1; // broken
      }
      
      history.push(todayStr);
      localStorage.setItem('user_study_history', JSON.stringify(history));
      localStorage.setItem('user_streak_count', streak.toString());
      localStorage.setItem('user_last_study_date', todayStr);
    } catch (e) {
      // ignore
    }
  }

  public clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VOCAB_STORAGE_KEY);
      localStorage.removeItem('toeic_grammar_answers');
      localStorage.removeItem('toeic_syllabus_progress');
    } catch {
      // ignore
    }
  }
}

export const dbService = new DbService();

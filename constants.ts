
import { Passage, MathLesson, DialogueScript } from './types';

export const PASSAGES: Passage[] = [
  {
    id: 1,
    title: "Bài 1: Tôi là học sinh lớp 2",
    volume: 1,
    content: "Ngày khai trường, mẹ dắt tay tôi đến trường. Tôi vừa đi vừa khóc. Mẹ dỗ dành: “Đừng khóc, con trai của mẹ giỏi lắm, đi học với các bạn vui lắm!”. Trường học thật đẹp, có cả cầu trượt. Cô giáo hiền như mẹ. Tôi mạnh dạn vào lớp, ngồi vào bàn đầu. Tôi tự nhủ: “Mình là học sinh lớp Hai rồi!”.",
  },
  {
    id: 2,
    title: "Bài 2: Ngày hôm qua đâu rồi?",
    volume: 1,
    content: "Em cầm tờ lịch cũ, ngày hôm qua đâu rồi? Ra ngoài sân hỏi bố, xoa đầu em, bố cười. Ngày hôm qua ở lại, trên cành hoa trong vườn. Nụ hồng lớn lên mãi, đợi đến ngày tỏa hương. Ngày hôm qua ở lại, trong hạt lúa mẹ trồng. Cánh đồng chờ gặt hái, chín vàng màu ước mong.",
  },
  {
    id: 3,
    title: "Bài 4: Chiếc bút mực",
    volume: 1,
    content: "Ở lớp, em luôn cố gắng viết thật nắn nót. Thế nhưng, mấy con chữ của em vẫn xiêu vẹo, nghiêng ngả. Hôm đó, bố cho em một cây bút mực rất đẹp. Em vui sướng đem bút đến lớp, khoe với các bạn. Mai gợi ý: 'Chúng mình cùng thi viết chữ đẹp nhé!'. Nghe vậy, em rất háo hức. Em nắn nót viết từng chữ. 'A! Chữ của em đẹp hơn rồi!' - Mai reo lên. Em rất vui.",
  },
  {
    id: 4,
    title: "Bài 10: Vầng trăng và con đường",
    volume: 2,
    content: "Con đường này, tôi đã đi lại nhiều lần. Nhưng đêm nay, tôi mới nhận ra vẻ đẹp của nó. Ánh trăng vàng dịu mát đậu trên lá cây, con đường và cả trên vai tôi. Thỉnh thoảng, một cơn gió nhẹ lướt qua, những chiếc lá xao động, lấp lánh như những ánh sao. Tôi bước đi, trăng theo tôi như một người bạn. Tôi và trăng cùng đi trong đêm tĩnh lặng.",
  },
  {
    id: 5,
    title: "Bài 15: Cây và hoa bên lăng Bác",
    volume: 2,
    content: "Trên quảng trường Ba Đình lịch sử, lăng Bác uy nghi mà gần gũi. Cây và hoa khắp miền đất nước về đây tụ hội, đâm chồi, phô sắc và toả ngát hương thơm. Ngày ngày, người người từ khắp nơi về đây thăm Bác. Lòng họ trào dâng niềm kính yêu và biết ơn vô hạn. Cây và hoa cũng như say trong hương sắc của tình yêu thương ấy.",
  }
];

export const DIALOGUE_SCRIPTS: DialogueScript[] = [
  {
    id: 1,
    title: "Rùa và Thỏ",
    characters: ["Thỏ", "Rùa"],
    script: [
      { character: "AI", line: "Một hôm, Thỏ và Rùa cãi nhau xem ai nhanh hơn." },
      { character: "AI", line: "Thỏ nói: 'Cậu chậm như sên ấy, dám thi chạy với tớ không?'" },
      { character: "USER", line: "Tớ đồng ý! Chúng ta hãy thử xem ai về đích trước." },
      { character: "AI", line: "Thỏ cắm đầu chạy thật nhanh, bỏ Rùa ở lại phía sau. Chạy được nửa đường, không thấy Rùa đâu, Thỏ nghĩ: 'Rùa chậm thế thì mình ngủ một giấc cũng thắng.' Thế là Thỏ nằm xuống gốc cây ngủ thiếp đi." },
      { character: "USER", line: "Mình phải cố gắng hết sức, cứ từ từ tiến về phía trước." },
      { character: "AI", line: "Khi Thỏ tỉnh dậy, đã thấy Rùa gần về đích. Thỏ vội vàng chạy theo nhưng không kịp nữa. Rùa đã thắng cuộc." },
    ]
  },
    {
    id: 2,
    title: "Cáo và Quạ",
    characters: ["Cáo", "Quạ"],
    script: [
      { character: "AI", line: "Quạ tha được một miếng phô mai. Nó bay đến đậu trên một cành cây cao để ăn." },
      { character: "AI", line: "Cáo đi qua, ngửi thấy mùi phô mai thơm lừng, liền nghĩ cách cướp lấy. Cáo đứng dưới gốc cây và nói:" },
      { character: "USER", line: "Chào bạn Quạ xinh đẹp! Bộ lông của bạn thật mượt mà, vóc dáng mới đáng yêu làm sao!" },
      { character: "AI", line: "Quạ nghe thấy thế thì thích lắm. Cáo lại nói tiếp:" },
      { character: "USER", line: "Giá mà bạn có giọng hát hay nữa thì đúng là nữ hoàng của các loài chim. Bạn hát cho tôi nghe một bài được không?" },
      { character: "AI", line: "Quạ thích quá, liền mở miệng hát 'quạ... quạ...'. Miếng phô mai rơi xuống, Cáo chộp lấy rồi chạy biến vào rừng." },
    ]
  }
];


export const MATH_LESSONS_VOL1: MathLesson[] = [
  {
    id: 1,
    title: "Bài 6-8: Phép cộng, phép trừ (có nhớ) trong phạm vi 100",
    description: "Các bài toán cộng và trừ các số có hai chữ số, có nhớ một lần."
  },
  {
    id: 2,
    title: "Bài 9-10: Bài toán về nhiều hơn, ít hơn",
    description: "Giải các bài toán có lời văn sử dụng 'nhiều hơn' hoặc 'ít hơn' một số đơn vị."
  },
  {
    id: 3,
    title: "Bài 12-13: Bảng nhân 2 và Bảng chia 2",
    description: "Các bài toán liên quan đến phép nhân và phép chia trong bảng 2."
  },
  {
    id: 4,
    title: "Bài 22-23: Hình học cơ bản",
    description: "Nhận biết và đếm điểm, đoạn thẳng, đường thẳng, và các hình khối đơn giản."
  },
  {
    id: 5,
    title: "Bài 30-31: Giờ, phút và xem đồng hồ",
    description: "Các bài toán liên quan đến việc xem giờ đúng và tính toán thời gian đơn giản."
  },
   {
    id: 6,
    title: "Tổng hợp",
    description: "Một bài toán ngẫu nhiên từ tất cả các chủ đề đã học trong tập 1."
  }
];

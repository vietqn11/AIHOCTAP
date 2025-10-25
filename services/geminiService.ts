import { GoogleGenAI, Modality, Type } from "@google/genai";
import { EvaluationResult, WritingFeedback, VocabularySuggestion, MathProblem, MathFeedback, WordProblem, WordProblemFeedback, WordProblemHint, MathLesson, RolePlayResult, HandwritingFeedback, OutlineStep, StoryImage } from '../types';

if (!process.env.API_KEY) {
    // This is a placeholder. In a real environment, the key is expected to be set.
    // In this playground, it's injected.
    console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// ===================================
// DỊCH VỤ MÔN TIẾNG VIỆT
// ===================================

export async function evaluateReading(passageText: string, transcript: string): Promise<EvaluationResult> {
    const model = "gemini-2.5-pro";
    const prompt = `
        Bạn là một giáo viên Tiếng Việt chuyên chấm bài đọc cho học sinh lớp 2.
        Văn bản gốc là: "${passageText}"
        Văn bản học sinh đọc được (đã được ghi âm và chuyển thành chữ) là: "${transcript}"

        Dựa vào sự so sánh giữa hai văn bản, hãy đưa ra đánh giá chi tiết theo định dạng JSON. Chấm điểm trên thang điểm 100.
        - totalScore: Tổng điểm, là điểm trung bình của 3 tiêu chí còn lại.
        - fluency: Điểm lưu loát (đánh giá sự trôi chảy, ngắt nghỉ đúng chỗ, tốc độ vừa phải).
        - pronunciation: Điểm phát âm (đánh giá các từ bị sai so với văn bản gốc).
        - accuracy: Điểm chính xác (đánh giá việc đọc đúng, đủ từ, không thêm bớt từ).
        - generalFeedback: Nhận xét chung ngắn gọn (2-3 câu), mang tính động viên, chỉ ra điểm cần cải thiện.
        - positivePoints: Một điểm tích cực cụ thể mà học sinh đã làm tốt.
        - wordsToImprove: Một mảng các đối tượng. Mỗi đối tượng chứa một từ/cụm từ học sinh đọc sai và câu văn gốc chứa từ đó. Chỉ liệt kê tối đa 5 lỗi sai tiêu biểu nhất. Nếu không có lỗi, trả về mảng rỗng []. Ví dụ: [{ "word": "nghiêng ngả", "context": "Thế nhưng, mấy con chữ của em vẫn xiêu vẹo, nghiêng ngả." }]

        YÊU CẦU QUAN TRỌNG: Chỉ trả về duy nhất một đối tượng JSON hợp lệ, không có bất kỳ văn bản giải thích, markdown formatting (như \`\`\`json) hay ký tự nào khác bao quanh.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        totalScore: { type: Type.NUMBER },
                        fluency: { type: Type.NUMBER },
                        pronunciation: { type: Type.NUMBER },
                        accuracy: { type: Type.NUMBER },
                        generalFeedback: { type: Type.STRING },
                        positivePoints: { type: Type.STRING },
                        wordsToImprove: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    word: { type: Type.STRING },
                                    context: { type: Type.STRING },
                                },
                                required: ['word', 'context'],
                            },
                        },
                    },
                    required: ['totalScore', 'fluency', 'pronunciation', 'accuracy', 'generalFeedback', 'positivePoints', 'wordsToImprove'],
                },
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as EvaluationResult;

        if (typeof result.totalScore !== 'number' || !Array.isArray(result.wordsToImprove)) {
            throw new Error("Invalid JSON structure from AI");
        }
        return result;

    } catch (error) {
        console.error("Error evaluating reading:", error);
        throw new Error("Failed to get evaluation from AI.");
    }
}

export async function extractDifficultWords(passageText: string): Promise<string[]> {
    const model = "gemini-2.5-flash";
    const prompt = `Bạn là một giáo viên Tiếng Việt AI. Dựa vào bài đọc dành cho học sinh lớp 2 sau đây, hãy chọn ra 5 từ hoặc cụm từ khó phát âm hoặc khó hiểu nhất đối với các em.
    Bài đọc: "${passageText}"
    YÊU CẦU QUAN TRỌNG: Chỉ trả về một mảng JSON chứa chính xác 5 chuỗi là các từ/cụm từ đó. Ví dụ: ["khuỷu tay", "ngoằn ngoèo", "sưởi nắng", "lấp lánh", "uy nghi"]`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        const result = JSON.parse(response.text.trim()) as string[];
        if (Array.isArray(result) && result.length > 0) {
            return result;
        }
        throw new Error("AI did not return a valid array of difficult words.");
    } catch (error) {
        console.error("Error extracting difficult words:", error);
        throw new Error("Failed to extract difficult words from AI.");
    }
}

export async function getWritingFeedback(topic: string, studentText: string): Promise<WritingFeedback> {
  const model = "gemini-2.5-pro";
  const prompt = `
    Bạn là một trợ lý AI thân thiện, chuyên đưa ra nhận xét cho bài tập làm văn của học sinh lớp 2. 
    Luôn sử dụng ngôn ngữ nhẹ nhàng, tích cực, và khích lệ. Không chấm điểm, không chê bai.
    Chủ đề bài viết: "${topic}"
    Bài viết của học sinh: "${studentText}"

    Hãy đưa ra nhận xét theo định dạng JSON.
    - positiveFeedback: Một lời khen cụ thể, thật lòng về một điểm hay trong bài (ví dụ: cách dùng từ, ý tưởng, câu văn sáng tạo).
    - suggestions: Một mảng chứa 2-3 gợi ý đơn giản, dễ hiểu để bài viết hay hơn. Các gợi ý nên tập trung vào việc thêm chi tiết, dùng từ đa dạng hơn, hoặc cách diễn đạt.

    YÊU CẦU QUAN TRỌNG: Chỉ trả về duy nhất một đối tượng JSON hợp lệ, không có bất kỳ văn bản giải thích, markdown formatting (như \`\`\`json) hay ký tự nào khác bao quanh.
    Ví dụ: { "positiveFeedback": "Câu văn 'chú mèo mướp có bộ lông mềm như nhung' của con rất hay và giàu hình ảnh!", "suggestions": ["Con có thể kể thêm về một kỷ niệm vui của con với chú mèo.", "Lần tới, con thử dùng thêm các từ chỉ màu sắc xem sao nhé."] }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            positiveFeedback: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['positiveFeedback', 'suggestions'],
        },
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as WritingFeedback;

    if (typeof result.positiveFeedback !== 'string' || !Array.isArray(result.suggestions)) {
      throw new Error("Invalid JSON structure from AI for writing feedback");
    }
    return result;

  } catch (error) {
    console.error("Error getting writing feedback:", error);
    throw new Error("Failed to get writing feedback from AI.");
  }
}

export async function getSentenceSuggestions(topic: string, currentText: string): Promise<string[]> {
    const model = "gemini-2.5-flash";
    const prompt = `
        Bạn là một trợ lý AI giúp học sinh lớp 2 viết văn.
        Chủ đề: "${topic}"
        Học sinh đã viết: "${currentText}"

        Dựa vào những gì học sinh đã viết, hãy gợi ý 3 câu văn tiếp theo thật đơn giản, thú vị và sáng tạo để giúp bé viết tiếp. 
        Mỗi câu nên theo một hướng hơi khác nhau một chút.
        YÊU CẦU QUAN TRỌNG: Chỉ trả về một mảng JSON chứa chính xác 3 chuỗi câu văn. Ví dụ: ["Câu gợi ý 1.", "Câu gợi ý 2.", "Câu gợi ý 3."]
    `;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const result = JSON.parse(response.text) as string[];
        if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
            return result;
        }
        throw new Error("AI did not return a valid array of strings.");
    } catch(e) {
        console.error("Error getting sentence suggestions:", e);
        throw new Error("Failed to get sentence suggestions from AI.");
    }
}

export async function getVocabularySuggestion(studentText: string): Promise<VocabularySuggestion | null> {
    if (studentText.trim().length < 10) return null; // Not enough text to analyze
    const model = "gemini-2.5-pro";
    const prompt = `
      Bạn là một giáo viên Tiếng Việt AI, giúp học sinh lớp 2 mở rộng vốn từ.
      Bài viết của học sinh: "${studentText}"

      Hãy đọc kỹ bài viết và tìm MỘT từ đơn giản, phổ thông (ví dụ: "đẹp", "vui", "to", "buồn", "đi") mà có thể thay thế bằng một từ khác hay hơn, giàu hình ảnh hơn.
      Nếu tìm được, hãy trả về một đối tượng JSON với các thuộc tính sau:
      - originalWord: Từ gốc trong bài.
      - suggestedWord: Từ gợi ý thay thế.
      - explanation: Giải thích ngắn gọn tại sao từ mới hay hơn (1 câu, thật dễ hiểu cho trẻ lớp 2).
      - example: Một câu ví dụ mới sử dụng từ được gợi ý.

      Nếu không tìm thấy từ nào phù hợp để thay thế trong bài viết, hãy trả về một chuỗi rỗng.
      YÊU CẦU QUAN TRỌNG: Chỉ trả về một đối tượng JSON hợp lệ hoặc một chuỗi rỗng, không có markdown hay giải thích gì thêm.
    `;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        originalWord: { type: Type.STRING },
                        suggestedWord: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        example: { type: Type.STRING },
                    },
                    required: ['originalWord', 'suggestedWord', 'explanation', 'example']
                }
            }
        });

        const text = response.text.trim();
        if (!text || text === '""' || text === '{}') return null;
        
        const result = JSON.parse(text) as VocabularySuggestion;
        if (result.originalWord && result.suggestedWord) {
            return result;
        }
        return null;

    } catch(e) {
        console.error("Error getting vocabulary suggestion:", e);
        return null;
    }
}

export async function getOutlineStep(topic: string, currentOutline: OutlineStep[]): Promise<{ question: string; isFinished: boolean }> {
    const model = "gemini-2.5-flash";
    const history = currentOutline.map(step => `AI hỏi: ${step.question}\nEm trả lời: ${step.userResponse}`).join('\n\n');
    const stepCount = currentOutline.length;

    let systemInstruction = `Bạn là một AI thân thiện, đang giúp một học sinh lớp 2 lập dàn ý cho bài văn với chủ đề: "${topic}". 
    Bạn sẽ hỏi từng câu hỏi một để dẫn dắt bé. Luôn hỏi những câu đơn giản, gợi mở, vui vẻ.
    Dàn ý cần có 3 phần: Mở bài (1 câu), Thân bài (2-3 câu), Kết bài (1 câu).
    Dựa vào lịch sử trò chuyện, hãy hỏi câu tiếp theo.`;

    if (stepCount === 0) systemInstruction += ` Bắt đầu bằng câu hỏi cho phần Mở bài.`;
    else if (stepCount === 1) systemInstruction += ` Bây giờ hỏi câu đầu tiên cho phần Thân bài.`;
    else if (stepCount >= 2 && stepCount < 4) systemInstruction += ` Bây giờ hỏi câu tiếp theo cho phần Thân bài.`;
    else if (stepCount === 4) systemInstruction += ` Bây giờ hỏi câu cho phần Kết bài.`;
    
    const prompt = `Lịch sử dàn ý:\n${history}\n\nHãy đưa ra câu hỏi tiếp theo.`;

    if (stepCount >= 5) {
        return { question: "Dàn ý của con đã hoàn tất rồi!", isFinished: true };
    }

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { systemInstruction }
        });
        return { question: response.text, isFinished: false };
    } catch (error) {
        console.error("Error getting outline step:", error);
        throw new Error("Failed to get outline step from AI.");
    }
}

export async function generateStructuredOutline(topic: string, outlineSteps: OutlineStep[]): Promise<string> {
    const model = "gemini-2.5-flash";
    const studentIdeas = outlineSteps.map((step, index) => `- Ý ${index + 1}: ${step.userResponse}`).join('\n');

    const prompt = `
      Bạn là một giáo viên AI, giúp một học sinh lớp 2 hoàn thiện dàn ý cho bài văn.
      Chủ đề: "${topic}"
      Các ý chính học sinh đã trả lời:
      ${studentIdeas}

      Dựa vào các ý chính trên, hãy tạo một dàn ý chi tiết có cấu trúc 3 phần rõ ràng (Mở bài, Thân bài, Kết bài).
      - Giữ nguyên ý chính của học sinh nhưng hãy diễn đạt lại cho hay hơn, giàu hình ảnh hơn.
      - Ở mỗi phần, đặc biệt là phần Thân bài, hãy phát triển các ý của học sinh thành các gạch đầu dòng hoàn chỉnh để gợi ý cho bé viết.
      - Ví dụ, nếu học sinh trả lời "con mèo màu vàng", hãy phát triển thành "- Chú mèo có bộ lông màu vàng óng ả như nắng mùa thu."

      YÊU CẦU QUAN TRỌNG: Chỉ trả về duy nhất chuỗi văn bản là dàn ý hoàn chỉnh, sẵn sàng để điền vào trình soạn thảo.
      Ví dụ kết quả:
      Mở bài:
      - Giới thiệu về chú mèo tam thể mà nhà em mới nuôi.
      Thân bài:
      - Tả hình dáng của chú: bộ lông ba màu mềm mượt, đôi mắt tròn xoe như hai hòn bi ve.
      - Tả hoạt động của chú: chú rất thích nằm sưởi nắng bên cửa sổ và chơi với cuộn len.
      Kết bài:
      - Nêu cảm nghĩ của em: em rất yêu quý chú mèo và sẽ chăm sóc chú cẩn thận.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating structured outline:", error);
        throw new Error("Failed to generate structured outline from AI.");
    }
}

export async function generateStoryImage(topic: string): Promise<StoryImage> {
    const model = 'gemini-2.5-flash-image';
    const prompt = `Vẽ một bức tranh minh họa câu chuyện đầy màu sắc, vui nhộn, và thân thiện cho trẻ em lớp 2, theo phong cách hoạt hình. Bức tranh phải rõ ràng và đầy cảm hứng. Chủ đề là: "${topic}"`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData?.data) {
                return {
                    prompt: topic,
                    imageUrl: `data:image/png;base64,${part.inlineData.data}`
                };
            }
        }

        throw new Error("No image data returned from Gemini API.");
    } catch (error) {
        console.error("Error generating story image:", error);
        throw error;
    }
}

export async function getRolePlayFeedback(scriptTitle: string, userLines: { original: string; spoken: string }[]): Promise<RolePlayResult> {
  const model = "gemini-2.5-flash";
  const userPerformance = userLines.map(l => `- Lời thoại gốc: "${l.original}"\n- Em đọc: "${l.spoken}"`).join('\n');

  const prompt = `Bạn là một giáo viên AI vui vẻ, đang nhận xét phần đọc truyện phân vai của học sinh lớp 2.
  Tên câu chuyện: "${scriptTitle}"
  Phần đọc của học sinh:
  ${userPerformance}

  Hãy đưa ra một lời nhận xét ngắn gọn (2-3 câu), tích cực và vui vẻ. Khen ngợi sự cố gắng của bé và có thể đưa ra một gợi ý nhỏ về ngữ điệu nếu cần. Ví dụ: "Con nhập vai Rùa rất đạt! Con đã đọc rất rõ ràng và đầy quyết tâm. Lần sau con thử đọc chậm hơn một chút nữa để thể hiện sự kiên trì của Rùa nhé!".
  Chỉ trả về duy nhất một chuỗi văn bản là lời nhận xét.`;

  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return { feedback: response.text };
  } catch (error) {
    console.error("Error getting role play feedback:", error);
    throw new Error("Failed to get role play feedback from AI.");
  }
}

export async function evaluateHandwrittenText(imageBase64: string): Promise<HandwritingFeedback> {
  const model = "gemini-2.5-pro"; // Vision capabilities needed
  const prompt = `Bạn là một giáo viên Tiếng Việt AI, chuyên chấm bài tập làm văn viết tay của học sinh lớp 2.
  1.  **Chuyển đổi:** Đầu tiên, hãy đọc và chuyển đổi toàn bộ chữ viết tay trong ảnh thành văn bản gõ (transcribe). Cố gắng giữ nguyên định dạng và lỗi chính tả (nếu có).
  2.  **Đánh giá:** Dựa vào văn bản đã chuyển đổi, hãy đưa ra nhận xét. Luôn sử dụng ngôn ngữ nhẹ nhàng, tích cực, và khích lệ. Không chấm điểm.
      -   **positiveFeedback:** Một lời khen cụ thể, thật lòng về một điểm hay trong bài (ví dụ: cách dùng từ, ý tưởng, câu văn sáng tạo).
      -   **suggestions:** Một mảng chứa 2-3 gợi ý đơn giản, dễ hiểu để bài viết hay hơn.
  
  YÊU CẦU QUAN TRỌNG: Chỉ trả về một đối tượng JSON hợp lệ với cấu trúc sau, không có markdown hay giải thích gì thêm:
  {
      "transcribedText": "Văn bản bạn đã đọc được từ ảnh",
      "positiveFeedback": "Lời khen của bạn",
      "suggestions": ["Gợi ý 1", "Gợi ý 2"]
  }`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcribedText: { type: Type.STRING },
            positiveFeedback: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['transcribedText', 'positiveFeedback', 'suggestions']
        }
      }
    });

    const result = JSON.parse(response.text.trim()) as Omit<HandwritingFeedback, 'imageUrl'>;
    if (typeof result.transcribedText !== 'string' || !Array.isArray(result.suggestions)) {
      throw new Error("Invalid JSON structure from AI vision evaluation");
    }
    // The imageUrl is handled client-side and created there.
    return { ...result, imageUrl: `data:image/jpeg;base64,${imageBase64}` };
  } catch (error) {
    console.error("Error evaluating handwritten text:", error);
    throw new Error("Failed to evaluate handwritten text from AI.");
  }
}


// ===================================
// DỊCH VỤ MÔN TOÁN
// ===================================

export async function evaluateMentalMathAnswer(problem: MathProblem, studentAnswerText: string): Promise<MathFeedback> {
    const model = "gemini-2.5-pro";
    const prompt = `
      Bạn là một gia sư toán AI vui vẻ cho học sinh lớp 2.
      Bài toán là: "${problem.questionText.replace('?', '')}".
      Câu trả lời đúng là: ${problem.answer}.
      Câu trả lời của học sinh (dạng văn bản được ghi âm) là: "${studentAnswerText}".

      Hãy phân tích câu trả lời của học sinh. Học sinh có thể trả lời bằng số (ví dụ: "15") hoặc bằng chữ (ví dụ: "mười lăm", "mười năm"). Hãy cố gắng hiểu câu trả lời của bé.
      1. Xác định xem câu trả lời của học sinh có đúng với đáp án không.
      2. Đưa ra một lời nhận xét ngắn gọn, thân thiện, mang tính xây dựng.
      - Nếu đúng, hãy khen bé một cách vui vẻ (ví dụ: "Chính xác!", "Giỏi quá! 10 điểm!", "Đúng rồi con ơi!").
      - Nếu sai, hãy động viên và đưa ra một mẹo tính nhẩm đơn giản, dễ hiểu để bé có thể tự sửa (ví dụ: "Gần đúng rồi! Con thử lấy ${problem.operand1} cộng ${problem.operand2 % 10} trước xem sao nhé.", "Sai một chút thôi! Con nhớ là mình đang làm phép trừ nhé.").

      Chỉ trả về một đối tượng JSON với định dạng sau, không có markdown hay bất kỳ chữ nào khác:
      {
        "isCorrect": true hoặc false,
        "feedbackText": "Lời nhận xét của bạn dành cho học sinh"
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN },
                        feedbackText: { type: Type.STRING }
                    },
                    required: ['isCorrect', 'feedbackText']
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as MathFeedback;

        if (typeof result.isCorrect !== 'boolean' || typeof result.feedbackText !== 'string') {
            throw new Error("Invalid JSON structure from AI for math feedback");
        }
        return result;

    } catch (error) {
        console.error("Error evaluating math answer:", error);
        throw new Error("Failed to get math evaluation from AI.");
    }
}

export async function generateWordProblem(lesson: MathLesson): Promise<WordProblem> {
    const model = "gemini-2.5-pro";
    const prompt = `
      Bạn là một AI chuyên tạo ra các bài toán có lời văn vui và đơn giản, phù hợp với học sinh lớp 2 ở Việt Nam.
      
      YÊU CẦU QUAN TRỌNG: Hãy tạo một bài toán có lời văn bám sát vào nội dung của bài học sau:
      - Tên bài học: "${lesson.title}"
      - Mô tả: "${lesson.description}"

      Bài toán chỉ nên bao gồm MỘT hoặc HAI phép tính phù hợp với bài học.
      Chủ đề nên gần gũi với trẻ em như: đi chợ, bạn bè, đồ chơi, trường học, con vật...
      Nếu tên bài học là "Tổng hợp", hãy tạo một bài toán ngẫu nhiên từ bất kỳ chủ đề nào của lớp 2.
      
      Chỉ trả về một đối tượng JSON hợp lệ với định dạng sau, không có bất kỳ văn bản giải thích hay markdown nào khác:
      {
        "questionText": "Nội dung bài toán có lời văn.",
        "answer": 45
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questionText: { type: Type.STRING },
                        answer: { type: Type.NUMBER }
                    },
                    required: ['questionText', 'answer']
                }
            }
        });
        const result = JSON.parse(response.text.trim()) as WordProblem;
        if (typeof result.questionText !== 'string' || typeof result.answer !== 'number') {
            throw new Error("Invalid JSON structure from AI for word problem");
        }
        return result;
    } catch (error) {
        console.error("Error generating word problem:", error);
        throw new Error("Failed to generate word problem from AI.");
    }
}

export async function evaluateWordProblemAnswer(problem: WordProblem, studentAnswerText: string): Promise<WordProblemFeedback> {
    const model = "gemini-2.5-pro";
    const prompt = `
      Bạn là một giáo viên AI chấm bài toán có lời văn cho học sinh lớp 2. Luôn thân thiện và khuyến khích.
      Bài toán là: "${problem.questionText}"
      Đáp án đúng là: ${problem.answer}.
      Học sinh trả lời là: "${studentAnswerText}".

      Hãy phân tích câu trả lời của học sinh (có thể là số hoặc chữ) và đưa ra nhận xét.
      - isCorrect: true nếu học sinh trả lời đúng, false nếu sai.
      - feedbackText: Một lời nhận xét ngắn gọn, trực tiếp. Ví dụ: "Chính xác! Con giỏi lắm!", "Chưa đúng rồi, con thử lại nhé!".
      - explanation: Giải thích cách làm bài toán này một cách thật đơn giản, từng bước một, để học sinh lớp 2 có thể hiểu được. Luôn bắt đầu bằng "Cách làm:".

      YÊU CẦU QUAN TRỌNG: Chỉ trả về một đối tượng JSON hợp lệ với định dạng sau:
      {
        "isCorrect": boolean,
        "feedbackText": "string",
        "explanation": "string"
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN },
                        feedbackText: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                    },
                    required: ['isCorrect', 'feedbackText', 'explanation']
                }
            }
        });
        const result = JSON.parse(response.text.trim()) as WordProblemFeedback;
        if (typeof result.isCorrect !== 'boolean' || typeof result.feedbackText !== 'string') {
            throw new Error("Invalid JSON structure from AI for word problem feedback");
        }
        return result;
    } catch (error) {
        console.error("Error evaluating word problem answer:", error);
        throw new Error("Failed to evaluate word problem answer from AI.");
    }
}

export async function getWordProblemHint(problem: WordProblem): Promise<WordProblemHint> {
    const model = "gemini-2.5-flash";
    const prompt = `
      Bạn là một gia sư toán AI. Một học sinh lớp 2 đang gặp khó khăn với bài toán sau:
      "${problem.questionText}"

      Hãy đưa ra MỘT câu hỏi gợi ý nhẹ nhàng để giúp bé suy nghĩ đúng hướng.
      KHÔNG được tiết lộ đáp án hoặc cách giải. Chỉ đặt câu hỏi.
      Ví dụ: "Con hãy đọc kỹ xem lúc đầu An có bao nhiêu cái kẹo nhé?", "Bài toán hỏi Lan còn lại bao nhiêu, vậy mình nên làm phép tính gì nhỉ?".

      YÊU CẦU QUAN TRỌNG: Chỉ trả về một đối tượng JSON hợp lệ với định dạng sau:
      {
        "hintText": "Câu hỏi gợi ý của bạn."
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        hintText: { type: Type.STRING }
                    },
                    required: ['hintText']
                }
            }
        });
        const result = JSON.parse(response.text.trim()) as WordProblemHint;
        if (typeof result.hintText !== 'string') {
            throw new Error("Invalid JSON structure from AI for word problem hint");
        }
        return result;
    } catch (error) {
        console.error("Error getting word problem hint:", error);
        throw new Error("Failed to get word problem hint from AI.");
    }
}

// ===================================
// DỊCH VỤ CÁC MÔN HỌC KHÁC
// ===================================

export async function getSimpleAIResponse(prompt: string): Promise<string> {
    const model = "gemini-2.5-flash";
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Error getting simple AI response:", error);
        throw new Error("Failed to get response from AI.");
    }
}

export async function getScienceAnswer(question: string): Promise<string> {
    const prompt = `Bạn là một nhà khoa học AI, chuyên giải thích các khái niệm phức tạp cho trẻ em lớp 2 một cách đơn giản, ngắn gọn và thú vị. Trả lời câu hỏi sau: "${question}"`;
    return getSimpleAIResponse(prompt);
}

export async function getEthicsDilemma(): Promise<string> {
    const prompt = `Bạn là một giáo viên đạo đức AI. Hãy tạo ra MỘT tình huống đạo đức ngắn gọn, thực tế cho học sinh lớp 2 suy ngẫm. Ví dụ: "Nếu con thấy bạn mình làm rơi rác ra sân trường, con sẽ làm gì?". Chỉ trả về câu hỏi tình huống.`;
    return getSimpleAIResponse(prompt);
}

export async function getMusicQuiz(): Promise<string> {
    const prompt = `Bạn là một người dẫn chương trình đố vui âm nhạc cho trẻ em. Hãy tạo MỘT câu đố vui để đố về một loại nhạc cụ. Câu đố nên mô tả âm thanh hoặc hình dáng của nhạc cụ đó. Ví dụ: "Tớ có thân hình cong cong, sáu dây đàn, và tiếng kêu trong trẻo. Tớ là ai?". Chỉ trả về câu đố.`;
    return getSimpleAIResponse(prompt);
}

export async function getPEActivity(): Promise<string> {
    const prompt = `Bạn là một huấn luyện viên thể dục AI vui nhộn. Hãy gợi ý MỘT bài tập vận động đơn giản, an toàn mà học sinh lớp 2 có thể làm ngay tại nhà. Ví dụ: "Hôm nay, chúng mình cùng nhau nhảy tại chỗ 10 lần xem ai cao hơn nào!". Chỉ trả về lời gợi ý.`;
    return getSimpleAIResponse(prompt);
}

export async function getExperienceActivity(): Promise<string> {
    const prompt = `Bạn là một AI hướng dẫn kỹ năng sống. Hãy gợi ý MỘT hoạt động trải nghiệm hoặc một việc tốt đơn giản mà học sinh lớp 2 có thể làm trong ngày để giúp đỡ gia đình hoặc bạn bè. Ví dụ: "Hôm nay, con thử tự mình sắp xếp lại góc học tập cho thật gọn gàng xem sao nhé!". Chỉ trả về lời gợi ý.`;
    return getSimpleAIResponse(prompt);
}

export async function getTypingPracticeSentence(): Promise<string> {
    const prompt = `Bạn là một AI tạo câu luyện gõ phím cho học sinh lớp 2. Hãy tạo ra MỘT câu văn tiếng Việt ngắn, vui nhộn và có ý nghĩa, không chứa các ký tự đặc biệt. Ví dụ: "Chú mèo mướp nằm sưởi nắng bên cửa sổ."`;
    return getSimpleAIResponse(prompt);
}

export async function generateColoringPage(prompt: string): Promise<string> {
    const fullPrompt = `Tạo một trang tô màu đơn giản cho trẻ em với các đường nét đen đậm, nền trắng, không có bóng mờ, theo phong cách sách tô màu, chất lượng cao. Chủ đề là: ${prompt}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: fullPrompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData?.data) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data returned from Gemini API.");
    } catch (error) {
        console.error("Error generating coloring page:", error);
        throw error; // Rethrow the original error
    }
}


// ===================================
// DỊCH VỤ CHUNG
// ===================================

export async function getTTS(text: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A voice that supports Vietnamese well
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data returned from API.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error getting TTS from Gemini:", error);
        throw new Error("Failed to generate speech.");
    }
}
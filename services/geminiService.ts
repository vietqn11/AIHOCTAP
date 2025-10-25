import { GoogleGenAI, Type, Modality } from "@google/genai";
import { RolePlayHistoryLine, WritingEvaluation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export const evaluateReading = async (passageText: string, audioBase64: string, mimeType: string, durationInSeconds: number) => {
    const wordCount = passageText.split(/\s+/).length;
    const wpm = durationInSeconds > 0 ? Math.round((wordCount / durationInSeconds) * 60) : 0;

    const prompt = `Bạn là một giáo viên tiếng Việt lớp 2 tận tâm. Hãy đánh giá bài đọc của học sinh dựa trên văn bản và file âm thanh.
    Hãy đưa ra nhận xét thật nhẹ nhàng, tích cực và mang tính xây dựng. Bắt đầu bằng lời khen, sau đó mới chỉ ra điểm cần cải thiện. Giọng văn cần thân thiện và phù hợp với trẻ em.
    
    Văn bản gốc: "${passageText}"
    Thời gian đọc: ${durationInSeconds.toFixed(1)} giây.
    
    Hãy đưa ra đánh giá theo định dạng JSON với các tiêu chí sau:
    - totalScore: Điểm tổng thể (thang điểm 10).
    - fluency: Độ trôi chảy (thang điểm 10).
    - pronunciation: Phát âm (thang điểm 10).
    - accuracy: Độ chính xác (đọc đúng chữ) (thang điểm 10).
    - wordsPerMinute: Tốc độ đọc (từ/phút), hãy dùng giá trị ${wpm}.
    - generalFeedback: Nhận xét chung ngắn gọn, động viên.
    - positivePoints: Những điểm em đã làm tốt.
    - wordsToImprove: Một danh sách các từ em cần cải thiện, mỗi từ gồm có "word" (từ đọc sai) và "context" (câu chứa từ đó).
    `;

    const audioPart = {
        inlineData: {
            mimeType: mimeType,
            data: audioBase64,
        },
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [{ text: prompt }, audioPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    totalScore: { type: Type.NUMBER },
                    fluency: { type: Type.NUMBER },
                    pronunciation: { type: Type.NUMBER },
                    accuracy: { type: Type.NUMBER },
                    wordsPerMinute: { type: Type.NUMBER },
                    generalFeedback: { type: Type.STRING },
                    positivePoints: { type: Type.STRING },
                    wordsToImprove: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                word: { type: Type.STRING },
                                context: { type: Type.STRING }
                            },
                             required: ["word", "context"]
                        }
                    }
                },
                 required: ["totalScore", "fluency", "pronunciation", "accuracy", "wordsPerMinute", "generalFeedback", "positivePoints", "wordsToImprove"]
            }
        }
    });
    
    return JSON.parse(response.text);
};


export const generateReadingComprehensionQuestions = async (passageText: string) => {
    const prompt = `Bạn là giáo viên lớp 2. Dựa vào đoạn văn sau, hãy tạo ra 2-3 câu hỏi trắc nghiệm để kiểm tra khả năng đọc hiểu của học sinh. Mỗi câu hỏi phải có 3 lựa chọn, trong đó chỉ có một lựa chọn đúng.
    
    Đoạn văn: "${passageText}"

    Hãy trả lời dưới dạng JSON, là một mảng các đối tượng. Mỗi đối tượng có các trường: "question" (string), "options" (mảng 3 string), và "correctOptionIndex" (số, chỉ mục của câu trả lời đúng, bắt đầu từ 0).
    `;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctOptionIndex: { type: Type.NUMBER }
                    },
                    required: ["question", "options", "correctOptionIndex"]
                }
            }
        }
    });

    return JSON.parse(response.text);
};


export const identifyAndExplainDifficultWords = async (passageText: string) => {
    const prompt = `Với vai trò là giáo viên lớp 2, hãy xác định 3-5 từ khó nhất trong đoạn văn sau cho một học sinh lớp 2. Với mỗi từ, hãy giải thích nghĩa của nó một cách đơn giản và cho một câu ví dụ dễ hiểu.
    
    Đoạn văn: "${passageText}"

    Vui lòng trả lời dưới dạng JSON, là một mảng các đối tượng, mỗi đối tượng có các trường: "word", "explanation", và "example".
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        example: { type: Type.STRING }
                    },
                    required: ["word", "explanation", "example"]
                }
            }
        }
    });

    return JSON.parse(response.text);
};


export const generateTextToSpeech = async (text: string) => {
    const prompt = `Hãy đọc đoạn văn bản sau bằng giọng nữ miền Bắc Việt Nam, chuẩn, rõ ràng, truyền cảm và thân thiện, với tốc độ vừa phải phù hợp cho học sinh lớp 2 nghe và học theo. Văn bản: "${text}"`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("Could not generate audio.");
    }
    return base64Audio;
};


export const generateWritingTopics = async () => {
    const prompt = `Bạn là giáo viên lớp 2. Hãy đưa ra 5 chủ đề viết văn thú vị và phù hợp cho học sinh lớp 2. Các chủ đề nên gần gũi với cuộc sống hàng ngày của các em.
    
    Vui lòng trả lời dưới dạng JSON, là một mảng các chuỗi (string).
    Ví dụ: ["Kể về một ngày nghỉ cuối tuần của em", "Tả con vật nuôi mà em yêu thích"]
    `;
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
    return JSON.parse(response.text);
};


export const evaluateWriting = async (text: string): Promise<WritingEvaluation> => {
    const evaluationPrompt = `Bạn là một giáo viên lớp 2. Hãy chấm điểm đoạn văn sau của một học sinh theo thang điểm 10 cho mỗi tiêu chí. Đưa ra nhận xét chung nhẹ nhàng, động viên.
    
    Đoạn văn: "${text}"

    Hãy trả lời dưới dạng JSON với các trường:
    - "contentScore": Điểm nội dung (đúng chủ đề, đủ ý).
    - "structureScore": Điểm bố cục (có mở bài, thân bài, kết bài đơn giản).
    - "wordingScore": Điểm từ ngữ (dùng từ phù hợp, ít lặp từ).
    - "creativityScore": Điểm sáng tạo (có chi tiết thú vị, cảm xúc).
    - "feedback": Nhận xét chung (khen ngợi và góp ý nhẹ nhàng).
    - "imagePrompt": Một câu mô tả ngắn gọn (bằng tiếng Anh) để tạo hình ảnh minh họa cho bài văn (ví dụ: "A cute orange cat sleeping on a windowsill, cartoon style").
    `;

    const evalResponse = await ai.models.generateContent({
        model,
        contents: evaluationPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    contentScore: { type: Type.NUMBER },
                    structureScore: { type: Type.NUMBER },
                    wordingScore: { type: Type.NUMBER },
                    creativityScore: { type: Type.NUMBER },
                    feedback: { type: Type.STRING },
                    imagePrompt: { type: Type.STRING }
                },
                required: ["contentScore", "structureScore", "wordingScore", "creativityScore", "feedback", "imagePrompt"]
            }
        }
    });

    const evalResult = JSON.parse(evalResponse.text);

    const imageBase64 = await generateImageFromPrompt(evalResult.imagePrompt);

    return {
        contentScore: evalResult.contentScore,
        structureScore: evalResult.structureScore,
        wordingScore: evalResult.wordingScore,
        creativityScore: evalResult.creativityScore,
        feedback: evalResult.feedback,
        imageUrl: imageBase64,
    };
};

export const evaluateHandwriting = async (imageBase64: string) => {
    const prompt = `Bạn là giáo viên lớp 2 chuyên luyện chữ. Hãy phân tích hình ảnh bài viết tay này.
    1. Chuyển nó thành văn bản.
    2. Đưa ra nhận xét về nét chữ, độ sạch sẽ, bố cục.
    3. Đưa ra gợi ý để cải thiện.
    
    Trả lời dưới dạng JSON với các trường: "transcribedText", "positiveFeedback", "suggestions" (mảng string).
    `;
    const imagePart = {
        inlineData: { mimeType: 'image/jpeg', data: imageBase64 },
    };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [{ text: prompt }, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    transcribedText: { type: Type.STRING },
                    positiveFeedback: { type: Type.STRING },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["transcribedText", "positiveFeedback", "suggestions"]
            }
        }
    });
    return JSON.parse(response.text);
};

export const generateWritingOutline = async (topic: string) => {
    const prompt = `Với vai trò là giáo viên lớp 2, hãy giúp học sinh lập một dàn ý đơn giản cho đề bài sau: "${topic}". Dàn ý nên có 3 phần: Mở bài, Thân bài, Kết bài. Mỗi phần có 1-2 câu hỏi gợi ý.
    
    Vui lòng trả lời dưới dạng JSON với cấu trúc: { "opening": ["câu hỏi 1", "câu hỏi 2"], "body": [...], "conclusion": [...] }.
    `;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    opening: { type: Type.ARRAY, items: { type: Type.STRING } },
                    body: { type: Type.ARRAY, items: { type: Type.STRING } },
                    conclusion: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["opening", "body", "conclusion"]
            }
        }
    });
    return JSON.parse(response.text);
};

export const generateMentalMathProblem = async () => {
    const prompt = `Tạo một bài toán nhẩm ngẫu nhiên cho học sinh lớp 2, bao gồm phép cộng, trừ, nhân, chia trong phạm vi 100 (ưu tiên cộng trừ).
    Trả về dưới dạng JSON với các trường: "questionText" (ví dụ: "25 + 17 = ?") và "answer" (dạng số).
    `;
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
                required: ["questionText", "answer"]
            }
        }
    });
    return JSON.parse(response.text);
};

export const generateWordProblem = async (lessonTitle: string) => {
    const prompt = `Bạn là giáo viên Toán lớp 2. Hãy tạo một bài toán có lời văn phù hợp với chủ đề "${lessonTitle}". Bài toán phải có độ khó vừa phải cho học sinh lớp 2.
    
    Vui lòng trả lời dưới dạng JSON với các trường: "questionText" và "answer" (dạng số).
    `;
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
                required: ["questionText", "answer"]
            }
        }
    });
    return JSON.parse(response.text);
};

export const evaluateWordProblemAnswer = async (problemText: string, userAnswer: number) => {
    const prompt = `Bạn là giáo viên Toán lớp 2. Một học sinh đã trả lời một bài toán. Hãy kiểm tra câu trả lời và đưa ra lời giải thích.
    Bài toán: "${problemText}"
    Câu trả lời của học sinh: ${userAnswer}

    Trả lời dưới dạng JSON với các trường: "isCorrect" (boolean), "feedbackText" (một câu ngắn như "Đúng rồi!" hoặc "Chưa đúng, hãy thử lại nhé!"), và "explanation" (giải thích cách giải bài toán, ngay cả khi câu trả lời đúng).
    `;
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
                    explanation: { type: Type.STRING }
                },
                required: ["isCorrect", "feedbackText", "explanation"]
            }
        }
    });
    return JSON.parse(response.text);
};


export const provideWordProblemHint = async (problemText: string) => {
    const prompt = `Bạn là giáo viên Toán lớp 2. Hãy đưa ra một gợi ý nhỏ cho bài toán sau, không tiết lộ đáp án.
    Bài toán: "${problemText}"

    Trả lời dưới dạng JSON với một trường duy nhất: "hintText".
    `;
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
                required: ["hintText"]
            }
        }
    });
    return JSON.parse(response.text);
};


export const evaluateRolePlayReading = async (scriptLine: string, audioBase64: string, mimeType: string) => {
    const prompt = `Bạn là giáo viên lớp 2. Hãy đánh giá xem học sinh đọc lời thoại có khớp với kịch bản không. Chỉ cần nhận xét về độ chính xác.
    Kịch bản: "${scriptLine}"
    
    Phân tích âm thanh và so sánh với văn bản. Trả về bản ghi những gì bạn nghe được.
    
    Trả lời dưới dạng JSON với các trường: "transcribedText" (string) và "feedback" (string, nhận xét ngắn gọn về độ chính xác).
    `;
    const audioPart = {
        inlineData: { mimeType, data: audioBase64 },
    };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [{ text: prompt }, audioPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    transcribedText: { type: Type.STRING },
                    feedback: { type: Type.STRING }
                },
                required: ["transcribedText", "feedback"]
            }
        }
    });
    return JSON.parse(response.text);
};

export const generateSimpleChatResponse = async (subject: string, question: string, persona: string) => {
    const prompt = `Bạn là ${persona}. Hãy trả lời câu hỏi sau về chủ đề "${subject}" một cách đơn giản, dễ hiểu, và thân thiện với học sinh lớp 2.
    Câu hỏi: "${question}"`;

    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
};

export const analyzeImageForNature = async (imageBase64: string) => {
    const prompt = `Bạn là một nhà tự nhiên học thân thiện nói chuyện với một đứa trẻ lớp 2. Hãy nhìn vào hình ảnh này và cho tôi biết:
    1. Tên của sinh vật hoặc thực vật này là gì?
    2. Một mô tả ngắn gọn, dễ hiểu về nó.
    3. Một "sự thật thú vị" về nó.
    
    Hãy trả lời dưới dạng JSON với các trường: "name", "description", và "funFact". Nếu bạn không thể xác định được, hãy trả lời một cách thân thiện.
    `;
    const imagePart = {
        inlineData: { mimeType: 'image/jpeg', data: imageBase64 },
    };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [{ text: prompt }, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    funFact: { type: Type.STRING }
                },
                required: ["name", "description", "funFact"]
            }
        }
    });
    return JSON.parse(response.text);
};


export const generateEthicalDilemma = async () => {
    const prompt = `Bạn là một giáo viên đạo đức lớp 2. Hãy tạo ra một tình huống khó xử đơn giản, thực tế cho một đứa trẻ. Sau đó, đưa ra 2-3 lựa chọn hành động.
    
    Trả lời dưới dạng JSON với các trường: "scenario" (string) và "choices" (mảng string).
    `;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    scenario: { type: Type.STRING },
                    choices: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["scenario", "choices"]
            }
        }
    });
    return JSON.parse(response.text);
};

export const evaluateEthicalChoice = async (scenario: string, choice: string) => {
    const prompt = `Bạn là một giáo viên đạo đức lớp 2. Một học sinh đã đối mặt với tình huống sau: "${scenario}" và đã chọn: "${choice}".
    
    Hãy đưa ra phản hồi nhẹ nhàng, giải thích tại sao lựa chọn đó lại tốt (hoặc tại sao một lựa chọn khác có thể tốt hơn). Luôn luôn động viên.
    
    Trả lời dưới dạng JSON với một trường duy nhất: "feedback" (string).
    `;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    feedback: { type: Type.STRING }
                },
                required: ["feedback"]
            }
        }
    });
    return JSON.parse(response.text);
};

export const generateArtIdea = async (topic: string) => {
    const prompt = `Với vai trò là một giáo viên mỹ thuật vui tính, hãy đưa ra một ý tưởng vẽ tranh thật sáng tạo và chi tiết cho một học sinh lớp 2 về chủ đề: "${topic}".`;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    const fullPrompt = `Tạo một trang tô màu đơn giản, nét vẽ rõ ràng, cho trẻ em, với hình ảnh của: ${prompt}. Chỉ có nét đen trên nền trắng.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: fullPrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("Không thể tạo hình ảnh.");
};

export const summarizeRolePlay = async (scriptTitle: string, history: RolePlayHistoryLine[]) => {
    const prompt = `Bạn là giáo viên lớp 2. Dựa trên kịch bản "${scriptTitle}" và phần thể hiện của học sinh, hãy viết một nhận xét ngắn gọn, động viên.
    Lịch sử đọc của học sinh:
    ${history.map(line => `- Kịch bản: "${line.original}"\n  - Em đọc: "${line.spoken}"`).join('\n')}
    
    Hãy trả lời dưới dạng JSON với một trường duy nhất: "feedback" (string).`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    feedback: { type: Type.STRING }
                },
                required: ["feedback"]
            }
        }
    });
    return JSON.parse(response.text);
};

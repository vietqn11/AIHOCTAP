import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export const evaluateReading = async (passageText: string, audioBase64: string) => {
    const prompt = `Bạn là một giáo viên tiếng Việt lớp 2. Hãy đánh giá bài đọc của học sinh dựa trên văn bản và file âm thanh.
    Văn bản gốc: "${passageText}"
    
    Hãy đưa ra đánh giá theo định dạng JSON với các tiêu chí sau:
    - totalScore: Điểm tổng thể (thang điểm 10).
    - fluency: Độ trôi chảy (thang điểm 10).
    - pronunciation: Phát âm (thang điểm 10).
    - accuracy: Độ chính xác (đọc đúng chữ) (thang điểm 10).
    - generalFeedback: Nhận xét chung ngắn gọn, động viên.
    - positivePoints: Những điểm em đã làm tốt.
    - wordsToImprove: Một danh sách các từ em cần cải thiện, mỗi từ gồm có "word" (từ đọc sai) và "context" (câu chứa từ đó).
    `;

    const audioPart = {
        inlineData: {
            mimeType: 'audio/webm',
            data: audioBase64,
        },
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Use a more capable model for multi-modal input
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
                 required: ["totalScore", "fluency", "pronunciation", "accuracy", "generalFeedback", "positivePoints", "wordsToImprove"]
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
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: `Hãy đọc câu sau bằng giọng nữ Việt Nam chuẩn, thân thiện: ${text}` }] }],
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


export const provideWritingFeedback = async (text: string) => {
    const prompt = `Bạn là giáo viên lớp 2. Hãy nhận xét về đoạn văn sau của một học sinh. Đưa ra nhận xét nhẹ nhàng, tập trung vào điểm tốt và gợi ý để bài viết tốt hơn.
    
    Đoạn văn: "${text}"

    Vui lòng trả lời dưới dạng JSON với 2 trường: "positiveFeedback" (những lời khen) và "suggestions" (một mảng các gợi ý cụ thể).
    `;
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    positiveFeedback: { type: Type.STRING },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["positiveFeedback", "suggestions"]
            }
        }
    });
    return JSON.parse(response.text);
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


export const evaluateRolePlayReading = async (scriptLine: string, audioBase64: string) => {
    const prompt = `Bạn là giáo viên lớp 2. Hãy đánh giá xem học sinh đọc lời thoại có khớp với kịch bản không. Chỉ cần nhận xét về độ chính xác.
    Kịch bản: "${scriptLine}"
    
    Phân tích âm thanh và so sánh với văn bản. Trả về bản ghi những gì bạn nghe được.
    
    Trả lời dưới dạng JSON với các trường: "transcribedText" (string) và "feedback" (string, nhận xét ngắn gọn về độ chính xác).
    `;
    const audioPart = {
        inlineData: { mimeType: 'audio/webm', data: audioBase64 },
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

export const generateSimpleChatResponse = async (subject: string, question: string) => {
    const prompt = `Bạn là một trợ lý học tập thân thiện cho học sinh lớp 2. Hãy trả lời câu hỏi sau về chủ đề "${subject}" một cách đơn giản, dễ hiểu.
    Câu hỏi: "${question}"`;

    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
};
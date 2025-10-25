import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, MathProblem, MathFeedback } from '../../types';
import { getTTS, evaluateMentalMathAnswer } from '../../services/geminiService';
import { saveMathResult } from '../../services/googleSheetsService';
import { playAudioFromBase64 } from '../../utils/audioUtils';
import Spinner from '../Spinner';
import { MicIcon, StopCircleIcon } from '../icons/Icons';

interface MentalMathPageProps {
  user: User;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
}

const MentalMathPage: React.FC<MentalMathPageProps> = ({ user, score, setScore, onBack }) => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [feedback, setFeedback] = useState<MathFeedback | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any | null>(null);
  const transcriptRef = useRef<string>('');
  
  const scoreRef = useRef(score);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    // This function will be called when the component unmounts.
    return () => {
      // Save the result when the user leaves the page.
      if (scoreRef.current > 0) {
        saveMathResult(user, 'Luyện tính nhẩm', scoreRef.current);
      }
    };
  }, [user]);

  const generateProblem = useCallback(async () => {
    setFeedback(null);
    transcriptRef.current = '';
    setError(null);

    // Fix: Explicitly type `operator` to prevent it from being widened to `string`.
    const operator: '+' | '-' = Math.random() > 0.5 ? '+' : '-';
    let operand1 = Math.floor(Math.random() * 90) + 10; // 10-99
    let operand2 = Math.floor(Math.random() * 90) + 10; // 10-99

    if (operator === '-' && operand1 < operand2) {
      [operand1, operand2] = [operand2, operand1]; // Swap to avoid negative results
    }

    const answer = operator === '+' ? operand1 + operand2 : operand1 - operand2;
    const questionText = `${operand1} ${operator} ${operand2} = ?`;
    const questionSpeech = `${operand1} ${operator === '+' ? 'cộng' : 'trừ'} ${operand2} bằng mấy?`;
    
    const newProblem = { operand1, operand2, operator, questionText, questionSpeech, answer };
    setProblem(newProblem);
    
    // Read the problem aloud
    setIsReadingAloud(true);
    try {
      const audioBase64 = await getTTS(questionSpeech);
      await playAudioFromBase64(audioBase64);
    } catch(e) {
      console.error(e);
      setError("Lỗi! Không thể đọc câu hỏi.");
    } finally {
      setIsReadingAloud(false);
    }
  }, []);

  useEffect(() => {
    generateProblem(); // Generate first problem on mount
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Trình duyệt không hỗ trợ nhận dạng giọng nói.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript;
      transcriptRef.current = transcript;
    };

    recognition.onend = () => {
        setIsListening(false);
        if(transcriptRef.current) {
            handleProcessAnswer();
        }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      let errorMessage = `Lỗi nhận dạng giọng nói: ${event.error}.`;
       if (event.error === 'not-allowed') {
        errorMessage = "Không thể truy cập micro. Vui lòng cấp quyền sử dụng micro trong cài đặt trình duyệt.";
      }
      setError(errorMessage);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [generateProblem]);
  
  const handleBack = () => {
    // The save is handled by the unmount effect, so we can just navigate back.
    onBack();
  };

  const handleToggleListening = () => {
    if (!recognitionRef.current || isProcessing || isReadingAloud) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      transcriptRef.current = '';
      setError(null);
      setFeedback(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
         console.error("Could not start recognition", e);
         setError("Không thể bắt đầu ghi âm.");
      }
    }
  };

  const handleProcessAnswer = async () => {
    if (!problem || transcriptRef.current.trim() === '') {
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await evaluateMentalMathAnswer(problem, transcriptRef.current);
      setFeedback(result);
      if (result.isCorrect) {
        setScore(prevScore => prevScore + 1);
      }
    } catch (e) {
      console.error(e);
      setError("Đã có lỗi xảy ra khi chấm bài. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const canInteract = !isListening && !isProcessing && !isReadingAloud;

  return (
    <div className="max-w-2xl mx-auto text-center">
        <button onClick={handleBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại chọn hoạt động</button>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Luyện tính nhẩm</h2>
            <div className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                <span>⭐</span>
                <span>{score}</span>
            </div>
        </div>

        <div className="bg-purple-50 p-8 rounded-lg border-2 border-purple-200 my-8">
            <p className="text-5xl font-bold text-purple-700 tracking-wider">
                {problem?.questionText || '...'}
            </p>
        </div>

        <div className="h-16 flex items-center justify-center">
            {feedback && (
                 <div className={`px-4 py-2 rounded-lg text-lg font-semibold ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.feedbackText}
                 </div>
            )}
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-4">
             <button
                onClick={handleToggleListening}
                disabled={!canInteract || !!feedback} // Disable after answering
                className={`flex items-center justify-center gap-3 px-8 py-4 w-64 rounded-full text-xl font-bold text-white transition-all transform ${
                    isListening ? 'bg-red-500 animate-pulse' : (!canInteract || !!feedback) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                }`}
            >
                {isProcessing ? (
                    <> <Spinner /> <span>Đang chấm...</span> </>
                ) : isListening ? (
                    <> <StopCircleIcon /> <span>Đang nghe...</span> </>
                ) : (
                    <> <MicIcon /> <span>Trả lời</span> </>
                )}
            </button>
        </div>

        {feedback && (
             <button 
                onClick={generateProblem} 
                className="mt-6 px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-full hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg"
             >
                Câu tiếp theo
             </button>
        )}
      
        {error && <p className="mt-6 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
      </div>
    </div>
  );
};

export default MentalMathPage;
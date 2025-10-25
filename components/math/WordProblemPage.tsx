import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, WordProblem, WordProblemFeedback, MathLesson } from '../../types';
import { getTTS, generateWordProblem, evaluateWordProblemAnswer, getWordProblemHint } from '../../services/geminiService';
import { saveMathResult } from '../../services/googleSheetsService';
import { playAudioFromBase64 } from '../../utils/audioUtils';
import Spinner from '../Spinner';
import { MicIcon, StopCircleIcon, SpeakerIcon, LightbulbIcon, NextIcon } from '../icons/Icons';

interface WordProblemPageProps {
  user: User;
  lesson: MathLesson;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
}

const WordProblemPage: React.FC<WordProblemPageProps> = ({ user, lesson, score, setScore, onBack }) => {
  const [problem, setProblem] = useState<WordProblem | null>(null);
  const [feedback, setFeedback] = useState<WordProblemFeedback | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // For AI evaluation
  const [isLoading, setIsLoading] = useState(true); // For loading problem/TTS
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
        saveMathResult(user, `Toán: ${lesson.title}`, scoreRef.current);
      }
    };
  }, [user, lesson]);

  const handleNewProblem = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    setHint(null);
    transcriptRef.current = '';
    setError(null);
    try {
      const newProblem = await generateWordProblem(lesson);
      setProblem(newProblem);
    } catch (e) {
      console.error(e);
      setError("Lỗi! Không thể tạo bài toán mới. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [lesson]);

  useEffect(() => {
    handleNewProblem(); // Generate first problem

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => transcriptRef.current = event.results[event.results.length - 1][0].transcript;
    recognition.onend = () => {
      setIsListening(false);
      if(transcriptRef.current) handleProcessAnswer();
    }
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setError(`Lỗi nhận dạng giọng nói: ${event.error}.`);
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [handleNewProblem]);

  const handleReadAloud = async (text: string) => {
    if (isLoading || isProcessing) return;
    setIsLoading(true);
    try {
      const audioBase64 = await getTTS(text);
      await playAudioFromBase64(audioBase64);
    } catch(e) {
      console.error(e);
      setError("Lỗi! Không thể đọc thành tiếng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHint = async () => {
    if (!problem || isLoading || isProcessing) return;
    setIsLoading(true);
    try {
      const hintResult = await getWordProblemHint(problem);
      setHint(hintResult.hintText);
    } catch (e) {
        setError("Lỗi! Không thể lấy gợi ý lúc này.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleToggleListening = () => {
    if (!recognitionRef.current || isProcessing || isLoading) return;
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
         setError("Không thể bắt đầu ghi âm.");
      }
    }
  };

  const handleProcessAnswer = async () => {
    if (!problem || transcriptRef.current.trim() === '') return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await evaluateWordProblemAnswer(problem, transcriptRef.current);
      setFeedback(result);
      if (result.isCorrect) {
        setScore(prevScore => prevScore + 1);
      }
    } catch (e) {
      setError("Đã có lỗi xảy ra khi chấm bài.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBack = () => {
    // The save is now handled by the unmount effect.
    onBack();
  };

  const canInteract = !isListening && !isProcessing && !isLoading;

  return (
    <div className="max-w-2xl mx-auto text-center">
        <button onClick={handleBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại chọn bài học</button>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 relative">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 text-left">Toán có lời văn</h2>
                <p className="text-sm text-gray-500 text-left">{lesson.title}</p>
            </div>
            <div className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                <span>⭐</span>
                <span>{score}</span>
            </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 my-8 min-h-[150px] flex items-center justify-center">
            {isLoading && !problem ? <Spinner /> : (
                 <div className="flex items-start gap-4">
                    <span className="text-4xl pt-1">🤖</span>
                    <p className="text-xl text-left font-semibold text-blue-800">
                        {problem?.questionText}
                    </p>
                 </div>
            )}
        </div>

        {feedback && (
             <div className={`p-4 rounded-lg text-lg mb-4 ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-bold">{feedback.feedbackText}</p>
                <p className="text-base mt-2 text-left">{feedback.explanation}</p>
             </div>
        )}

        {hint && !feedback && (
             <div className="p-3 rounded-lg text-md mb-4 bg-yellow-100 text-yellow-800 italic">
                {hint}
             </div>
        )}
        
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {!feedback && (
                <>
                <button onClick={() => problem && handleReadAloud(problem.questionText)} disabled={!canInteract} className="flex items-center gap-2 px-4 py-2 text-md font-medium text-white bg-green-500 rounded-full hover:bg-green-600 disabled:bg-gray-400"> <SpeakerIcon /> Đọc đề bài toán</button>
                <button onClick={handleGetHint} disabled={!canInteract} className="flex items-center gap-2 px-4 py-2 text-md font-medium text-white bg-yellow-500 rounded-full hover:bg-yellow-600 disabled:bg-gray-400"> <LightbulbIcon /> Gợi ý</button>
                <button
                    onClick={handleToggleListening}
                    disabled={!canInteract}
                    className={`flex items-center justify-center gap-3 px-8 py-4 w-64 rounded-full text-xl font-bold text-white transition-all ${
                        isListening ? 'bg-red-500 animate-pulse' : !canInteract ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isProcessing ? <><Spinner /><span>Đang chấm</span></> : isListening ? <><StopCircleIcon /><span>Đang nghe...</span></> : <><MicIcon /><span>Trả lời</span></>}
                </button>
                </>
            )}

            {feedback && (
                 <button onClick={handleNewProblem} disabled={isLoading} className="flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xl font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-transform transform hover:scale-105 shadow-lg">
                    {isLoading ? <Spinner /> : <NextIcon />}
                    Câu tiếp theo
                 </button>
            )}
        </div>
      
        {error && <p className="mt-6 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
      </div>
    </div>
  );
};

export default WordProblemPage;
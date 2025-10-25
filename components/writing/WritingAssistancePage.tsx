
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { User, WritingFeedback } from '../../types';
import { getWritingFeedback, getSentenceSuggestions } from '../../services/geminiService';
import { saveWritingSubmission } from '../../services/googleSheetsService';
import Spinner from '../Spinner';
import { MicIcon, StopCircleIcon } from '../icons/Icons';

interface WritingAssistancePageProps {
  user: User;
  topic: string;
  initialText?: string | null;
  onFinishWriting: (submission: string, feedback: WritingFeedback) => void;
  onBack: () => void;
}

const WritingAssistancePage: React.FC<WritingAssistancePageProps> = ({ user, topic, initialText, onFinishWriting, onBack }) => {
  const [text, setText] = useState(initialText || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');

  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
       if (finalTranscript) {
           setText(prevText => prevText.trim() + ' ' + finalTranscript.trim() + '. ');
       }
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      let errorMessage = `Lỗi nhận dạng giọng nói: ${event.error}.`;
      if (event.error === 'not-allowed') {
        errorMessage = "Không thể truy cập micro. Vui lòng đảm bảo bạn đã cấp quyền sử dụng micro cho trang web này trong cài đặt trình duyệt.";
      } else if (event.error === 'no-speech') {
        errorMessage = "Không nhận diện được giọng nói trong lúc này. Vui lòng thử lại.";
      }
      setError(errorMessage);
      setIsDictating(false);
    };
    recognition.onend = () => {
        if (isDictating) { // restart if it stops unexpectedly
            recognition.start();
        }
    }

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isDictating]);


  const handleGetSuggestions = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setSuggestions([]);
    setError('');
    try {
      const result = await getSentenceSuggestions(topic, text);
      setSuggestions(result);
    } catch (e) {
      setError('AI không thể đưa ra gợi ý lúc này. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, text, isLoading]);
  
  const handleToggleDictation = () => {
    if (!recognitionRef.current) {
        setError("Tính năng nói để viết không khả dụng trên trình duyệt này.");
        return;
    }
    if (isDictating) {
        recognitionRef.current.stop();
        setIsDictating(false);
    } else {
        setText(prev => prev.trim() + ' ');
        recognitionRef.current.start();
        setIsDictating(true);
    }
  };

  const handleSubmit = async () => {
    if (text.trim().split(' ').length < 10) { 
      setError('Bài viết của con hơi ngắn. Hãy viết thêm một chút nữa nhé!');
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const feedback = await getWritingFeedback(topic, text);
      await saveWritingSubmission(user, topic, text, feedback);
      onFinishWriting(text, feedback);
    } catch (e) {
      setError('Không thể chấm bài lúc này. Vui lòng thử lại sau.');
      setIsLoading(false);
    }
  };
  
  const canInteract = !isLoading && !isDictating;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại</button>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">Chủ đề: {topic}</h2>
        <p className="text-center text-gray-500 mb-6">Hãy viết hoặc nói ý tưởng của con vào ô bên dưới nhé.</p>

        <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Bắt đầu viết ở đây..."
              className="w-full h-64 p-4 pr-16 border border-gray-300 rounded-lg text-lg leading-relaxed focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isDictating}
            />
            <button onClick={handleToggleDictation} title="Nói để viết"
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isDictating ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-blue-100'}`}
            >
                {isDictating ? <StopCircleIcon/> : <MicIcon />}
            </button>
        </div>
        
        {suggestions.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <p className="font-bold text-blue-800 mb-2">Thử những ý này xem sao nhé:</p>
            <div className="flex flex-col sm:flex-row gap-2">
                {suggestions.map((s, i) => (
                    <button key={i} onClick={() => setText(prev => prev.trim() + ' ' + s)}
                    className="text-left text-sm p-2 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                    >
                       "{s}"
                    </button>
                ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleGetSuggestions}
            disabled={!canInteract}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-lg font-semibold text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400 transition-all transform hover:scale-105"
          >
            {isLoading ? <Spinner /> : '💡'}
            Gợi ý
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canInteract}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-all transform hover:scale-105"
          >
            {isLoading ? <Spinner /> : '✅'}
            Nộp bài
          </button>
        </div>
        {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
      </div>
    </div>
  );
};

export default WritingAssistancePage;
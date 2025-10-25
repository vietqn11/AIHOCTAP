import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, Passage, EvaluationResult } from '../types';
import { evaluateReading, getTTS } from '../services/geminiService';
import { saveReadingResult } from '../services/googleSheetsService';
import { playAudioFromBase64 } from '../utils/audioUtils';
import Spinner from './Spinner';
import { MicIcon, PlayIcon, StopCircleIcon } from './icons/Icons';


const ReadingPage: React.FC<{
  user: User;
  passage: Passage;
  onFinishReading: (result: EvaluationResult) => void;
}> = ({ user, passage, onFinishReading }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fix: Use 'any' for the SpeechRecognition ref type as it's a non-standard browser API.
  const recognitionRef = useRef<any | null>(null);
  const transcriptRef = useRef<string>('');

  useEffect(() => {
    // Fix: Cast window to 'any' to access vendor-prefixed speech recognition API.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng thử trên Chrome hoặc Safari.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      transcriptRef.current += finalTranscript + ' ';
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      let errorMessage = `Lỗi nhận dạng giọng nói: ${event.error}. Vui lòng thử lại.`;
      if (event.error === 'not-allowed') {
        errorMessage = "Không thể truy cập micro. Vui lòng đảm bảo bạn đã cấp quyền sử dụng micro cho trang web này trong cài đặt trình duyệt.";
      } else if (event.error === 'no-speech') {
        errorMessage = "Không nhận diện được giọng nói. Vui lòng thử nói to và rõ hơn.";
      }
      setError(errorMessage);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      handleProcessReading();
    } else {
      transcriptRef.current = '';
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
         console.error("Could not start recognition", e);
         setError("Không thể bắt đầu ghi âm. Vui lòng kiểm tra quyền micro.");
      }
    }
  };

  const handleProcessReading = async () => {
    if (transcriptRef.current.trim() === '') {
      setError("Không ghi nhận được giọng đọc. Vui lòng thử lại.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await evaluateReading(passage.content, transcriptRef.current);
      onFinishReading(result);
      await saveReadingResult(user, passage.title, result);
    } catch (e) {
      console.error(e);
      setError("Đã có lỗi xảy ra khi chấm bài. Vui lòng thử lại sau.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReadAloud = async () => {
    if (isReadingAloud) return;
    setIsReadingAloud(true);
    setError(null);
    try {
      const audioBase64 = await getTTS(passage.content);
      await playAudioFromBase64(audioBase64);
    } catch (e) {
      console.error(e);
      setError("Không thể đọc mẫu. Vui lòng thử lại.");
    } finally {
      setIsReadingAloud(false);
    }
  };

  const canInteract = !isListening && !isProcessing && !isReadingAloud;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">{passage.title}</h2>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border leading-loose text-lg sm:text-xl text-justify max-h-96 overflow-y-auto">
          {passage.content}
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleReadAloud}
          disabled={!canInteract}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-lg font-semibold text-white transition-all transform ${
            !canInteract ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 hover:scale-105'
          }`}
        >
          {isReadingAloud ? <Spinner /> : <PlayIcon />}
          <span>Đọc mẫu</span>
        </button>
        <button
          onClick={handleToggleListening}
          disabled={isProcessing || isReadingAloud}
          className={`flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xl font-bold text-white transition-all transform ${
            isListening ? 'bg-red-500 animate-pulse' : isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
          }`}
        >
          {isProcessing ? (
            <>
              <Spinner />
              <span>Đang chấm bài...</span>
            </>
          ) : isListening ? (
            <>
              <StopCircleIcon />
              <span>Dừng đọc</span>
            </>
          ) : (
            <>
              <MicIcon />
              <span>Bắt đầu đọc</span>
            </>
          )}
        </button>
      </div>

      {error && <p className="mt-6 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
    </div>
  );
};

export default ReadingPage;
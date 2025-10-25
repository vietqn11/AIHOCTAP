
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, DialogueScript, RolePlayResult, DialogueLine } from '../../types';
import { getTTS, getRolePlayFeedback } from '../../services/geminiService';
import { playAudioFromBase64 } from '../../utils/audioUtils';
import Spinner from '../Spinner';
import { MicIcon } from '../icons/Icons';

interface RolePlayReadingPageProps {
  user: User;
  script: DialogueScript;
  onFinish: (result: RolePlayResult) => void;
}

const RolePlayReadingPage: React.FC<RolePlayReadingPageProps> = ({ user, script, onFinish }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [userTranscripts, setUserTranscripts] = useState<{ original: string; spoken: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef<any>(null);

  const processNextLine = useCallback(async () => {
    if (currentLineIndex >= script.script.length) {
      // End of script, process results
      setIsProcessing(true);
      try {
        const result = await getRolePlayFeedback(script.title, userTranscripts);
        onFinish(result);
      } catch (e) {
        setError("Không thể nhận xét. Vui lòng thử lại.");
        setIsProcessing(false);
      }
      return;
    }

    const currentLine = script.script[currentLineIndex];
    if (currentLine.character === 'AI') {
      setIsAISpeaking(true);
      try {
        const audioBase64 = await getTTS(currentLine.line);
        await playAudioFromBase64(audioBase64);
        setCurrentLineIndex(prev => prev + 1);
      } catch (e) {
        setError("AI không thể đọc lời thoại.");
      } finally {
        setIsAISpeaking(false);
      }
    } else { // User's turn
      // Wait for user to click button
    }
  }, [currentLineIndex, script, userTranscripts, onFinish]);

  useEffect(() => {
    processNextLine();
  }, [processNextLine]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setUserTranscripts(prev => [
        ...prev,
        { original: script.script[currentLineIndex].line, spoken: transcript }
      ]);
      setCurrentLineIndex(prev => prev + 1);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setError(`Lỗi nhận dạng giọng nói: ${event.error}.`);
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, [currentLineIndex, script.script]);

  const handleUserRecord = () => {
    if (!recognitionRef.current || isListening || isAISpeaking || isProcessing) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      setError("Không thể bắt đầu ghi âm.");
    }
  };

  const currentLine = script.script[currentLineIndex];
  const isUserTurn = currentLine && currentLine.character === 'USER';

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Câu chuyện: {script.title}</h2>
        <p className="text-gray-600 mb-6">Vai của con: <span className="font-bold text-blue-600">{script.characters[1]}</span></p>

        <div className="min-h-[200px] bg-gray-50 p-4 rounded-lg border space-y-4">
          {script.script.map((line, index) => (
            <div key={index} className={`p-3 rounded-lg transition-all duration-500 ${index < currentLineIndex ? 'opacity-50' : ''} ${index === currentLineIndex ? 'bg-yellow-100 scale-105' : ''}`}>
              <p className={`font-bold ${line.character === 'USER' ? 'text-blue-700' : 'text-green-700'}`}>
                {line.character === 'USER' ? script.characters[1] : script.characters[0]}:
              </p>
              <p className="text-lg">{line.line}</p>
            </div>
          ))}
        </div>
        
        {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
        
        <div className="mt-8">
            {isProcessing ? (
                <div className="flex items-center justify-center gap-3"><Spinner /> <span>Đang nhận xét...</span></div>
            ) : isAISpeaking ? (
                <div className="flex items-center justify-center gap-3"><Spinner /> <span>Đến lượt AI...</span></div>
            ) : isUserTurn && (
                <button
                    onClick={handleUserRecord}
                    disabled={isListening}
                    className={`flex items-center justify-center gap-3 px-8 py-4 w-64 mx-auto rounded-full text-xl font-bold text-white transition-all transform ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}`}
                >
                    <MicIcon />
                    {isListening ? 'Đang nghe...' : 'Đọc lời thoại'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default RolePlayReadingPage;

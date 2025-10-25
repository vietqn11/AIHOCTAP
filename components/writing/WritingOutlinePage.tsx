import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, OutlineStep } from '../../types';
import { getOutlineStep, generateStructuredOutline } from '../../services/geminiService';
import Spinner from '../Spinner';

interface WritingOutlinePageProps {
  user: User;
  topic: string;
  onFinish: (outlineText: string) => void;
  onBack: () => void;
}

const WritingOutlinePage: React.FC<WritingOutlinePageProps> = ({ user, topic, onFinish, onBack }) => {
  const [outline, setOutline] = useState<OutlineStep[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(scrollToBottom, [outline, currentQuestion]);

  const fetchNextQuestion = useCallback(async (currentSteps: OutlineStep[]) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getOutlineStep(topic, currentSteps);
      setCurrentQuestion(result.question);
      if (result.isFinished) {
          setIsFinished(true);
      }
    } catch (e) {
      setError('AI không thể đưa ra câu hỏi lúc này. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    fetchNextQuestion([]);
  }, [fetchNextQuestion]);

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || isLoading) return;
    
    const newSteps: OutlineStep[] = [...outline, { question: currentQuestion, userResponse: userAnswer }];
    setOutline(newSteps);
    setUserAnswer('');
    setCurrentQuestion('');
    fetchNextQuestion(newSteps);
  };
  
  const handleCompleteOutline = async () => {
      if (isGenerating) return;
      setIsGenerating(true);
      setError('');
      try {
        const finalOutline = await generateStructuredOutline(topic, outline);
        onFinish(finalOutline);
      } catch (e) {
        setError('AI không thể tạo dàn ý chi tiết lúc này. Con có thể thử lại.');
        setIsGenerating(false);
      }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại chọn chủ đề</button>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">Cùng AI Lập Dàn Ý</h2>
        <p className="text-center text-gray-500 mb-6">Trả lời các câu hỏi của AI để xây dựng dàn ý cho chủ đề: <strong className="text-blue-600">{topic}</strong></p>

        <div className="h-96 bg-gray-50 border rounded-lg p-4 space-y-4 overflow-y-auto">
          {outline.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-start">
                <div className="bg-blue-100 text-blue-800 p-3 rounded-lg max-w-xs">
                  <p className="font-bold">AI 🤖</p>
                  <p>{step.question}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-green-100 text-green-800 p-3 rounded-lg max-w-xs">
                   <p className="font-bold text-right">{user.name}</p>
                   <p>{step.userResponse}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
           {isLoading && <div className="flex justify-start"><div className="bg-blue-100 p-3 rounded-lg"><Spinner size="sm" /></div></div>}
           {currentQuestion && !isLoading && (
               <div className="flex justify-start">
                 <div className="bg-blue-100 text-blue-800 p-3 rounded-lg max-w-xs animate-fade-in">
                   <p className="font-bold">AI 🤖</p>
                   <p>{currentQuestion}</p>
                 </div>
               </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
        
        {!isFinished ? (
            <form onSubmit={handleSubmitAnswer} className="mt-4 flex gap-2">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={isLoading ? "AI đang suy nghĩ..." : "Nhập câu trả lời của con..."}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading || !currentQuestion}
              />
              <button 
                type="submit"
                disabled={isLoading || !userAnswer.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 disabled:bg-gray-400"
              >
                Gửi
              </button>
            </form>
        ) : (
            <div className="mt-6 text-center">
                <p className="font-bold text-green-600">Tuyệt vời! Dàn ý của con đã xong.</p>
                <button
                    onClick={handleCompleteOutline}
                    disabled={isGenerating}
                    className="mt-4 flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-transform transform hover:scale-105 shadow-lg"
                >
                    {isGenerating ? <><Spinner size="sm" /> <span>Đang hoàn thiện...</span></> : 'Xem dàn ý chi tiết & Bắt đầu viết'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default WritingOutlinePage;
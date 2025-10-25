
import React, { useState } from 'react';
import { getScienceAnswer } from '../../services/geminiService';
import Spinner from '../Spinner';

interface NatureAndSocietyPageProps {
  onBack: () => void;
}

const SubjectPageLayout: React.FC<{ title: string; description: string; icon: string; onBack: () => void; children: React.ReactNode }> = ({ title, description, icon, onBack, children }) => (
  <div className="max-w-2xl mx-auto text-center">
    <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại Tự nhiên & Xã hội</button>
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 relative">
      <div className="flex flex-col sm:flex-row text-center sm:text-left items-center gap-4 mb-6">
        <div className="text-6xl">{icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  </div>
);

const NatureAndSocietyPage: React.FC<NatureAndSocietyPageProps> = ({ onBack }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Vui lòng nhập câu hỏi của con nhé.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnswer('');
    try {
      const result = await getScienceAnswer(question);
      setAnswer(result);
    } catch (e) {
      setError('AI không thể trả lời câu hỏi lúc này, con thử lại sau nhé.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubjectPageLayout
      title="Trò chuyện khoa học"
      description="Con có thắc mắc gì về thế giới xung quanh không? Hãy hỏi AI nhé!"
      icon="🌍"
      onBack={onBack}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ví dụ: Vì sao lá cây có màu xanh?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 transition"
        >
          {isLoading ? <Spinner /> : 'Hỏi AI!'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
      
      {answer && (
        <div className="mt-6 text-left p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="font-bold text-teal-800">Câu trả lời từ AI:</p>
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </SubjectPageLayout>
  );
};

export default NatureAndSocietyPage;

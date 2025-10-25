
import React, { useState, useCallback, useEffect } from 'react';
import { getTypingPracticeSentence } from '../../services/geminiService';
import Spinner from '../Spinner';

interface InformaticsPageProps {
  onBack: () => void;
}

const SubjectPageLayout: React.FC<{ title: string; description: string; icon: string; onBack: () => void; children: React.ReactNode }> = ({ title, description, icon, onBack, children }) => (
  <div className="max-w-2xl mx-auto text-center">
    <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại môn Tin Học</button>
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

const InformaticsPage: React.FC<InformaticsPageProps> = ({ onBack }) => {
  const [sentence, setSentence] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSentence = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getTypingPracticeSentence();
      setSentence(result);
    } catch (e) {
      setError('Không thể lấy câu mới, con thử lại sau nhé.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSentence();
  }, [fetchSentence]);

  return (
    <SubjectPageLayout
      title="Luyện gõ chữ"
      description="Cùng luyện gõ chữ Tiếng Việt cho nhanh và đúng nào!"
      icon="💻"
      onBack={onBack}
    >
      <div className="min-h-[150px] flex items-center justify-center bg-gray-100 border-2 border-gray-200 rounded-lg p-6 my-6">
        {isLoading ? <Spinner /> : (
            <p className="text-xl font-mono tracking-wider font-semibold text-gray-800">{sentence}</p>
        )}
      </div>
      
      <textarea
        placeholder="Gõ lại câu ở trên vào đây..."
        className="w-full h-24 p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 font-mono"
        disabled={isLoading}
      />

      <button
        onClick={fetchSentence}
        disabled={isLoading}
        className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 transition"
      >
        {isLoading ? <Spinner /> : 'Lấy câu khác'}
      </button>

      {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
    </SubjectPageLayout>
  );
};

export default InformaticsPage;


import React, { useState, useCallback, useEffect } from 'react';
import { getMusicQuiz } from '../../services/geminiService';
import Spinner from '../Spinner';

interface MusicPageProps {
  onBack: () => void;
}

const SubjectPageLayout: React.FC<{ title: string; description: string; icon: string; onBack: () => void; children: React.ReactNode }> = ({ title, description, icon, onBack, children }) => (
  <div className="max-w-2xl mx-auto text-center">
    <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại môn Âm Nhạc</button>
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

const MusicPage: React.FC<MusicPageProps> = ({ onBack }) => {
  const [quiz, setQuiz] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuiz = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getMusicQuiz();
      setQuiz(result);
    } catch (e) {
      setError('Không thể lấy câu đố mới, con thử lại sau nhé.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  return (
    <SubjectPageLayout
      title="Câu đố nhạc cụ"
      description="Thử tài đoán tên các loại nhạc cụ qua câu đố của AI nào!"
      icon="🎵"
      onBack={onBack}
    >
      <div className="min-h-[150px] flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg p-6 my-6">
        {isLoading ? <Spinner /> : (
            <p className="text-xl font-semibold text-red-800">{quiz}</p>
        )}
      </div>
      
      <button
        onClick={fetchQuiz}
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 transition"
      >
        {isLoading ? <Spinner /> : 'Câu đố khác'}
      </button>

      {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
    </SubjectPageLayout>
  );
};

export default MusicPage;

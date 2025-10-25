
import React, { useState, useCallback, useEffect } from 'react';
import { getPEActivity } from '../../services/geminiService';
import Spinner from '../Spinner';

interface PEPageProps {
  onBack: () => void;
}

const SubjectPageLayout: React.FC<{ title: string; description: string; icon: string; onBack: () => void; children: React.ReactNode }> = ({ title, description, icon, onBack, children }) => (
  <div className="max-w-2xl mx-auto text-center">
    <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại môn Thể Dục</button>
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

const PEPage: React.FC<PEPageProps> = ({ onBack }) => {
  const [activity, setActivity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await getPEActivity();
      setActivity(result);
    } catch (e) {
      setError('Không thể lấy gợi ý mới, con thử lại sau nhé.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return (
    <SubjectPageLayout
      title="Gợi ý vận động"
      description="Cùng xem hôm nay AI có gợi ý vận động gì vui nhé!"
      icon="🤸"
      onBack={onBack}
    >
      <div className="min-h-[150px] flex items-center justify-center bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 my-6">
        {isLoading ? <Spinner /> : (
            <p className="text-xl font-semibold text-yellow-800">{activity}</p>
        )}
      </div>
      
      <button
        onClick={fetchActivity}
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 transition"
      >
        {isLoading ? <Spinner /> : 'Gợi ý khác'}
      </button>

      {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
    </SubjectPageLayout>
  );
};

export default PEPage;

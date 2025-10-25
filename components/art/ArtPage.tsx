
import React, { useState } from 'react';
import { generateColoringPage } from '../../services/geminiService';
import Spinner from '../Spinner';

interface ArtPageProps {
  onBack: () => void;
}

const SubjectPageLayout: React.FC<{ title: string; description: string; icon: string; onBack: () => void; children: React.ReactNode }> = ({ title, description, icon, onBack, children }) => (
  <div className="max-w-2xl mx-auto text-center">
    <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại môn Mỹ Thuật</button>
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

const ArtPage: React.FC<ArtPageProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [imageData, setImageData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Con muốn AI vẽ gì nào?');
      return;
    }
    setIsLoading(true);
    setError('');
    setImageData('');
    try {
      const result = await generateColoringPage(prompt);
      setImageData(result);
    } catch (e: any) {
      console.error("Art Page Error:", e);
      if (e && e.message && e.message.includes("429")) {
        setError('AI đang hơi bận một chút. Con vui lòng đợi khoảng 1 phút rồi thử lại nhé!');
      } else {
        setError('AI không thể vẽ tranh lúc này, con thử lại sau nhé.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubjectPageLayout
      title="Vẽ tranh tô màu"
      description="Nói cho AI biết con muốn tô màu gì, AI sẽ vẽ cho con nhé!"
      icon="🎨"
      onBack={onBack}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ví dụ: một chú khủng long, một nàng công chúa..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 transition"
        >
          {isLoading ? <Spinner /> : 'Vẽ tranh tô màu!'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
      
      <div className="mt-6">
        {isLoading && <div className="flex justify-center"><Spinner /></div>}
        {imageData && (
          <div className="p-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-lg">
            <p className="font-bold text-orange-800 mb-2">Tranh của con đây!</p>
            <img 
              src={`data:image/png;base64,${imageData}`} 
              alt={`Tranh tô màu: ${prompt}`} 
              className="w-full h-auto rounded-md shadow-md"
            />
             <p className="text-sm text-gray-500 mt-2">Con có thể lưu ảnh về và in ra để tô màu nhé.</p>
          </div>
        )}
      </div>
    </SubjectPageLayout>
  );
};

export default ArtPage;

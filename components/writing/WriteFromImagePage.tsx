
import React, { useState, useEffect, useCallback } from 'react';
import { User, StoryImage, WritingFeedback } from '../../types';
import { generateStoryImage, getWritingFeedback } from '../../services/geminiService';
import { saveWritingSubmission } from '../../services/googleSheetsService';
import Spinner from '../Spinner';

interface WriteFromImagePageProps {
  user: User;
  onFinishWriting: (submission: string, feedback: WritingFeedback) => void;
  onBack: () => void;
}

const TOPICS = [
  "một chú robot đang tưới cây",
  "các bạn nhỏ đang chơi thả diều trên cánh đồng",
  "một gia đình gấu trúc đang ăn măng",
  "một phi hành gia đang đi bộ trên mặt trăng",
  "một con tàu cướp biển trên đại dương",
];

const WriteFromImagePage: React.FC<WriteFromImagePageProps> = ({ user, onFinishWriting, onBack }) => {
  const [storyImage, setStoryImage] = useState<StoryImage | null>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchImage = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
      const result = await generateStoryImage(randomTopic);
      setStoryImage(result);
    } catch (e: any) {
        if (e && e.message && e.message.includes("429")) {
            setError('AI đang hơi bận một chút. Vui lòng đợi khoảng 1 phút rồi thử lại nhé!');
        } else {
            setError('AI không thể vẽ tranh lúc này, con thử lại sau nhé.');
        }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);
  
  const handleSubmit = async () => {
    if (text.trim().split(' ').length < 5) { 
      setError('Con hãy viết ít nhất 5 từ để miêu tả bức tranh nhé!');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
      const topic = `Miêu tả bức tranh: ${storyImage?.prompt}`;
      const feedback = await getWritingFeedback(topic, text);
      await saveWritingSubmission(user, topic, text, feedback);
      onFinishWriting(text, feedback);
    } catch (e) {
      setError('Không thể chấm bài lúc này. Vui lòng thử lại sau.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại</button>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">Viết từ tranh vẽ</h2>
        <p className="text-center text-gray-500 mb-6">Hãy quan sát bức tranh và viết một câu chuyện hoặc miêu tả những gì con thấy nhé.</p>

        <div className="my-6 min-h-[300px] flex items-center justify-center bg-gray-100 rounded-lg border p-4">
            {isLoading && <Spinner />}
            {storyImage && !isLoading && <img src={storyImage.imageUrl} alt={storyImage.prompt} className="max-w-full max-h-[400px] rounded-md" />}
        </div>
        
        {!isLoading && storyImage && (
            <>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Bắt đầu viết ở đây..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg text-lg leading-relaxed focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={fetchImage}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-full text-lg font-semibold text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
                  >
                    Lấy tranh khác
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isSubmitting ? <Spinner /> : '✅'}
                    Nộp bài
                  </button>
                </div>
            </>
        )}
        {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
      </div>
    </div>
  );
};

export default WriteFromImagePage;
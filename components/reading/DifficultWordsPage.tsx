
import React, { useState } from 'react';
import { getTTS } from '../../services/geminiService';
import { playAudioFromBase64 } from '../../utils/audioUtils';
import Spinner from '../Spinner';
import { SpeakerIcon } from '../icons/Icons';

interface DifficultWordsPageProps {
  words: string[];
  onFinish: () => void;
  onBack: () => void;
}

const DifficultWordsPage: React.FC<DifficultWordsPageProps> = ({ words, onFinish, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  const handlePlayAudio = async (word: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    setError('');
    try {
      const audioBase64 = await getTTS(word);
      await playAudioFromBase64(audioBase64);
    } catch (e) {
      setError('Không thể đọc mẫu lúc này.');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const currentWord = words[currentIndex];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại chọn bài</button>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Luyện từ khó</h2>
        <p className="text-gray-500 mt-2 mb-8">Hãy cùng luyện đọc những từ này trước khi vào bài đọc chính nhé!</p>

        <div className="relative w-full h-48 flex items-center justify-center bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-5xl font-bold text-blue-700">{currentWord}</p>
        </div>

        <div className="mt-4">
          <button 
            onClick={() => handlePlayAudio(currentWord)}
            disabled={isPlaying}
            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 text-md font-medium text-white bg-green-500 rounded-full hover:bg-green-600 disabled:bg-gray-400"
          >
            {isPlaying ? <Spinner size="sm" /> : <SpeakerIcon />}
            Nghe đọc mẫu
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <span className="font-semibold text-gray-600">{currentIndex + 1} / {words.length}</span>
          <button 
            onClick={handleNext} 
            disabled={currentIndex === words.length - 1}
            className="px-6 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>

        <div className="mt-8 border-t pt-6">
          <button 
            onClick={onFinish}
            className="w-full px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg"
          >
            Bắt đầu đọc bài chính
          </button>
        </div>

        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default DifficultWordsPage;
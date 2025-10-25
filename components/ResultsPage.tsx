
import React, { useState } from 'react';
import { User, Passage, EvaluationResult } from '../types';
import { getTTS } from '../services/geminiService';
import { playAudioFromBase64 } from '../utils/audioUtils';
import { SpeakerIcon } from './icons/Icons';
import Spinner from './Spinner';

interface ResultsPageProps {
  user: User;
  passage: Passage;
  result: EvaluationResult;
  onStartOver: () => void;
}

const ScoreCircle: React.FC<{ score: number; label: string }> = ({ score, label }) => {
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-green-500';
    if (s >= 65) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`relative w-28 h-28 rounded-full flex items-center justify-center bg-gray-100 border-4 ${getScoreColor(score).replace('text-', 'border-')}`}>
        <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
        <span className="absolute bottom-6 text-sm font-semibold text-gray-600">/100</span>
      </div>
      <p className="mt-2 font-semibold text-gray-700">{label}</p>
    </div>
  );
};

const ResultsPage: React.FC<ResultsPageProps> = ({ user, passage, result, onStartOver }) => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  
  const handleReplayWord = async (text: string, index: number) => {
    if (playingId !== null) return;
    setPlayingId(index);
    try {
      const audioBase64 = await getTTS(text);
      await playAudioFromBase64(audioBase64);
    } catch (error) {
      console.error("Failed to play audio for word", error);
      alert("Lỗi! Không thể phát lại âm thanh.");
    } finally {
      setPlayingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-600">Kết quả bài đọc: {passage.title}</h2>
        <p className="mt-2 text-lg text-gray-600">Làm tốt lắm, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <ScoreCircle score={result.totalScore} label="Tổng điểm" />
        <ScoreCircle score={result.accuracy} label="Độ chính xác" />
        <ScoreCircle score={result.fluency} label="Độ lưu loát" />
        <ScoreCircle score={result.pronunciation} label="Phát âm" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Nhận xét chi tiết</h3>
        <div>
          <h4 className="font-semibold text-green-600">Điểm tích cực:</h4>
          <p className="text-gray-700 pl-4">{result.positivePoints}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-600">Nhận xét chung:</h4>
          <p className="text-gray-700 pl-4">{result.generalFeedback}</p>
        </div>
      </div>
      
      {result.wordsToImprove && result.wordsToImprove.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-orange-600 mb-4">Các từ cần luyện tập thêm</h3>
          <ul className="space-y-4">
            {result.wordsToImprove.map((item, index) => (
              <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex-grow">
                  <p className="text-gray-800" dangerouslySetInnerHTML={{__html: item.context.replace(new RegExp(`(${item.word})`, 'gi'), '<strong class="text-orange-700 font-bold">$1</strong>')}} />
                </div>
                <button
                  onClick={() => handleReplayWord(item.context, index)}
                  disabled={playingId !== null}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                >
                  {playingId === index ? <Spinner size="sm" /> : <SpeakerIcon />}
                  <span>Nghe lại</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center pt-4">
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          Làm bài khác
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;

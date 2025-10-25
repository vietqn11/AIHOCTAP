
import React, { useState, useEffect } from 'react';
import { User, WritingFeedback, VocabularySuggestion, HandwritingFeedback } from '../../types';
import { getVocabularySuggestion } from '../../services/geminiService';
import Spinner from '../Spinner';

interface WritingResultPageProps {
  user: User;
  topic: string;
  submission: string;
  feedback: WritingFeedback | HandwritingFeedback;
  onStartOver: () => void;
}

const VocabularyCorner: React.FC<{ submission: string }> = ({ submission }) => {
    const [suggestion, setSuggestion] = useState<VocabularySuggestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!submission) {
            setIsLoading(false);
            return;
        };
        const fetchSuggestion = async () => {
            const result = await getVocabularySuggestion(submission);
            setSuggestion(result);
            setIsLoading(false);
        };
        fetchSuggestion();
    }, [submission]);

    if (isLoading) {
        return (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center gap-3">
                <Spinner size="sm"/>
                <p className="text-yellow-800">AI đang tìm một từ hay cho con...</p>
            </div>
        )
    }

    if (!suggestion) {
        return null;
    }

    return (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-800 text-lg">🎓 Góc Từ Vựng</h4>
            <p className="mt-2 text-gray-800">
                Trong bài con có dùng từ <strong className="font-semibold text-red-600">"{suggestion.originalWord}"</strong>. 
                Lần tới, con hãy thử dùng từ <strong className="font-semibold text-green-700">"{suggestion.suggestedWord}"</strong> xem sao nhé!
            </p>
            <p className="mt-2 text-sm text-gray-700 italic">"{suggestion.explanation}"</p>
            <p className="mt-2 text-gray-800">
                <strong className="font-semibold">Ví dụ:</strong> {suggestion.example}
            </p>
        </div>
    );
};


const WritingResultPage: React.FC<WritingResultPageProps> = ({ user, topic, submission, feedback, onStartOver }) => {
  const isHandwritten = 'transcribedText' in feedback;
  const handwritingResult = isHandwritten ? feedback as HandwritingFeedback : null;
  const textSubmission = isHandwritten ? handwritingResult!.transcribedText : submission;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-green-600">Bài viết đã được gửi!</h2>
        <p className="mt-2 text-lg text-gray-600">Con đã làm rất tốt, {user.name}!</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Bài viết của con:</h3>
        {isHandwritten && handwritingResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold text-gray-600 mb-2">Ảnh chụp bài làm</h4>
                    <img src={handwritingResult.imageUrl} alt="Bài viết tay của học sinh" className="rounded-lg border shadow-sm" />
                </div>
                 <div>
                    <h4 className="font-semibold text-gray-600 mb-2">AI đọc thành chữ:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border h-full">{handwritingResult.transcribedText || "(AI không nhận dạng được chữ)"}</p>
                 </div>
            </div>
        )}
        {!isHandwritten && (
            <p className="text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border">{submission}</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Nhận xét từ AI 🤖</h3>
        
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-700 text-lg">🌟 Điểm khen ngợi</h4>
            <p className="text-gray-800 mt-2">{feedback.positiveFeedback}</p>
        </div>

        {feedback.suggestions && feedback.suggestions.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-700 text-lg">💡 Gợi ý để bài hay hơn</h4>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-800">
              {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
        
        <VocabularyCorner submission={textSubmission} />
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          Làm bài khác
        </button>
      </div>
    </div>
  );
};

export default WritingResultPage;

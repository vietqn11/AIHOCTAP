import React from 'react';
import { Page, PageProps } from '../../types';

const ScoreCircle = ({ label, score }: { label: string; score: number }) => {
    const getScoreColor = (s: number) => {
        if (s >= 8) return 'text-green-500';
        if (s >= 5) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full border-4 ${getScoreColor(score).replace('text-', 'border-')} flex items-center justify-center`}>
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}</span>
            </div>
            <p className="mt-2 font-semibold text-gray-600">{label}</p>
        </div>
    );
};


const ResultPage = ({ navigate, context }: PageProps) => {
    const { evaluation, passage } = context;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Kết quả đọc bài: {passage.title}</h2>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
                <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Điểm số của em</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <ScoreCircle label="Tổng thể" score={evaluation.totalScore} />
                    <ScoreCircle label="Trôi chảy" score={evaluation.fluency} />
                    <ScoreCircle label="Phát âm" score={evaluation.pronunciation} />
                    <ScoreCircle label="Chính xác" score={evaluation.accuracy} />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Nhận xét của AI</h3>
                    <p className="text-gray-700 mb-4">{evaluation.generalFeedback}</p>
                    <h4 className="font-semibold text-green-600">Những điểm em làm tốt:</h4>
                    <p className="text-gray-700">{evaluation.positivePoints}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Cần luyện tập thêm</h3>
                    {evaluation.wordsToImprove.length > 0 ? (
                        <ul className="space-y-3">
                            {evaluation.wordsToImprove.map((item, index) => (
                                <li key={index} className="p-3 bg-red-50 rounded-md">
                                    <p className="font-bold text-red-700">{item.word}</p>
                                    <p className="text-sm text-gray-600 italic">"{item.context}"</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">Tuyệt vời! Em đã đọc đúng tất cả các từ.</p>
                    )}
                </div>
            </div>

            <div className="mt-12 flex justify-center space-x-4">
                <button
                    onClick={() => navigate(Page.Reading, { passage })}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Thử lại
                </button>
                <button
                    onClick={() => navigate(Page.PassageSelection, { mode: 'read' })}
                    className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105"
                >
                    Chọn bài khác
                </button>
            </div>
        </div>
    );
};

export default ResultPage;

import React from 'react';
import { Page } from '../../constants.js';

const WritingResultPage = ({ navigate, context }) => {
    const { feedback, topic, writtenText } = context;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Kết quả bài viết: {topic}</h2>

            <div className="grid md:grid-cols-2 gap-8">
                 <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Bài viết của em</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{writtenText}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Góp ý từ AI</h3>
                    <div className="mb-4">
                        <h4 className="font-semibold text-green-600">Những điểm em làm tốt:</h4>
                        <p className="text-gray-700">{feedback.positiveFeedback}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-amber-600">Gợi ý để bài viết hay hơn:</h4>
                         {feedback.suggestions.length > 0 ? (
                            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                                {feedback.suggestions.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-gray-700">Không có gợi ý nào, bài viết của em rất tốt!</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12 flex justify-center space-x-4">
                <button
                    onClick={() => navigate(Page.WritingAssistance, { topic })}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Viết lại
                </button>
                <button
                    onClick={() => navigate(Page.WritingTopicSelection)}
                    className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105"
                >
                    Chọn chủ đề khác
                </button>
            </div>
        </div>
    );
};

export default WritingResultPage;
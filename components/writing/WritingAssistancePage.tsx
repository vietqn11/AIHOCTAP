import React, { useState } from 'react';
import { Page, PageProps, WritingEvaluation } from '../../types';
import { evaluateWriting } from '../../services/geminiService';
import Spinner from '../Spinner';

const WritingAssistancePage = ({ navigate, context }: PageProps) => {
    const { topic } = context;
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (text.trim().length < 10) {
            setError("Em hãy viết dài hơn một chút nhé!");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const evaluation: WritingEvaluation = await evaluateWriting(text);
            navigate(Page.WritingEvaluationResult, { evaluation, topic, writtenText: text });
        } catch (err) {
            setError('Không thể nhận góp ý. Vui lòng thử lại.');
            console.error(err);
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Luyện viết đoạn văn</h2>
            <p className="text-center text-gray-600 mb-8 font-semibold">Chủ đề: {topic}</p>

            <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Em hãy viết bài văn của mình vào đây..."
                />
            </div>
            
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}

            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center justify-center px-8 py-3 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-transform transform hover:scale-105 disabled:bg-gray-400"
                >
                    {isLoading ? <Spinner size="sm" /> : "Nộp bài và nhận góp ý"}
                </button>
            </div>
        </div>
    );
};

export default WritingAssistancePage;

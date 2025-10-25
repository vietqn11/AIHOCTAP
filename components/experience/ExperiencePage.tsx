import React, { useState } from 'react';
import { PageProps } from '../../types';
import { generateSimpleChatResponse } from '../../services/geminiService';
import Spinner from '../Spinner';

const ExperiencePage = (props: PageProps) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAsk = async () => {
        if (question.trim() === '') return;
        setIsLoading(true);
        setAnswer('');
        try {
            const response = await generateSimpleChatResponse('Hoạt động trải nghiệm', question);
            setAnswer(response);
        } catch (error) {
            setAnswer('Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Hoạt động Trải nghiệm</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-center text-gray-600 mb-4">Em có ý tưởng gì cho hoạt động cuối tuần không? Hãy hỏi AI nhé.</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ví dụ: Gợi ý một hoạt động làm cùng gia đình"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500"
                    />
                    <button onClick={handleAsk} disabled={isLoading} className="px-6 py-2 bg-lime-600 text-white font-semibold rounded-md shadow-sm hover:bg-lime-700 disabled:bg-gray-400">
                        {isLoading ? <Spinner size="sm" /> : "Hỏi"}
                    </button>
                </div>

                {answer && !isLoading && (
                    <div className="mt-6 p-4 bg-lime-50 border border-lime-200 rounded-md">
                        <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperiencePage;
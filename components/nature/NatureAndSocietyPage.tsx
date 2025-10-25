import React, { useState } from 'react';
import { PageProps } from '../../types';
import { generateSimpleChatResponse } from '../../services/geminiService';
import Spinner from '../Spinner';

const NatureAndSocietyPage = (props: PageProps) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAsk = async () => {
        if (question.trim() === '') return;
        setIsLoading(true);
        setAnswer('');
        try {
            const response = await generateSimpleChatResponse('Tự nhiên và Xã hội', question);
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
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Khám phá Tự nhiên & Xã hội</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-center text-gray-600 mb-4">Em có thắc mắc gì về thế giới xung quanh không? Hãy hỏi ở đây nhé!</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ví dụ: Tại sao lại có cầu vồng?"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                    <button onClick={handleAsk} disabled={isLoading} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400">
                        {isLoading ? <Spinner size="sm" /> : "Hỏi"}
                    </button>
                </div>

                {answer && !isLoading && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NatureAndSocietyPage;
import React, { useState } from 'react';
import { generateSimpleChatResponse } from '../../services/geminiService.js';
import Spinner from '../Spinner.jsx';

const InformaticsPage = (props) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const persona = "một người hướng dẫn am hiểu công nghệ và kiên nhẫn, người giải thích các khái niệm cơ bản về máy tính";

    const handleAsk = async () => {
        if (question.trim() === '') return;
        setIsLoading(true);
        setAnswer('');
        try {
            const response = await generateSimpleChatResponse('Tin học', question, persona);
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
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Bạn hỏi, AI trả lời về Tin học</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-center text-gray-600 mb-4">Em có câu hỏi gì về máy tính không? Hãy hỏi AI nhé.</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ví dụ: Chuột máy tính dùng để làm gì?"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
                    />
                    <button onClick={handleAsk} disabled={isLoading} className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-md shadow-sm hover:bg-slate-700 disabled:bg-gray-400">
                        {isLoading ? <Spinner size="sm" /> : "Hỏi"}
                    </button>
                </div>

                {answer && !isLoading && (
                    <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-md">
                        <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
                    </div>
                )}
                 {isLoading && question && (
                    <div className="mt-6 flex justify-center items-center">
                        <Spinner />
                        <p className="ml-2 text-gray-600">AI đang xử lý...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InformaticsPage;
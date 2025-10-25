import React, { useState } from 'react';
import { generateSimpleChatResponse } from '../../services/geminiService.js';
import Spinner from '../Spinner.jsx';

const EthicsPage = (props) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const persona = "một người cố vấn khôn ngoan và nhẹ nhàng, người đưa ra lời khuyên về các tình huống khó xử trong cuộc sống";


    const handleAsk = async () => {
        if (question.trim() === '') return;
        setIsLoading(true);
        setAnswer('');
        try {
            const response = await generateSimpleChatResponse('Đạo đức', question, persona);
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
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Hỏi đáp về Đạo đức</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-center text-gray-600 mb-4">Nếu em có thắc mắc về một tình huống nào đó, hãy hỏi AI để có lời khuyên nhé.</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ví dụ: Em nên làm gì khi thấy bạn nói dối?"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
                    />
                    <button onClick={handleAsk} disabled={isLoading} className="px-6 py-2 bg-rose-600 text-white font-semibold rounded-md shadow-sm hover:bg-rose-700 disabled:bg-gray-400">
                        {isLoading ? <Spinner size="sm" /> : "Hỏi"}
                    </button>
                </div>

                {answer && !isLoading && (
                    <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-md">
                        <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
                    </div>
                )}
                 {isLoading && question && (
                    <div className="mt-6 flex justify-center items-center">
                        <Spinner />
                        <p className="ml-2 text-gray-600">AI đang suy nghĩ...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EthicsPage;
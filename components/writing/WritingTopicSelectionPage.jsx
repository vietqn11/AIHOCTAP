import React, { useState, useEffect } from 'react';
import { Page } from '../../constants.js';
import { generateWritingTopics } from '../../services/geminiService.js';
import Spinner from '../Spinner.jsx';

const WritingTopicSelectionPage = ({ navigate }) => {
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const fetchedTopics = await generateWritingTopics();
                setTopics(fetchedTopics);
            } catch (err) {
                setError('Không thể tải chủ đề. Vui lòng thử lại.');
                console.error(err);
                // Add fallback topics
                setTopics([
                    "Kể về một người bạn thân của em.",
                    "Tả một đồ vật trong nhà mà em yêu thích.",
                    "Kể về một ngày nghỉ cuối tuần của em."
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopics();
    }, []);

    const handleSelectTopic = (topic) => {
        navigate(Page.WritingAssistance, { topic });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Chọn một chủ đề để viết nhé!</h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Spinner />
                    <p className="ml-4 text-lg text-gray-600">AI đang nghĩ chủ đề...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {error && <p className="text-center text-red-500 mb-4">{error}</p>}
                    {topics.map((topic, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelectTopic(topic)}
                            className="w-full text-left bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-amber-500 transition-all transform hover:-translate-y-1"
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{topic}</h3>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WritingTopicSelectionPage;
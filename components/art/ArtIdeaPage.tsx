import React, { useState } from 'react';
import { Page, PageProps } from '../../types';
import { generateArtIdea } from '../../services/geminiService';
import Spinner from '../Spinner';

const ArtIdeaPage = ({ navigate }: PageProps) => {
    const [topic, setTopic] = useState('');
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetIdea = async () => {
        if (topic.trim() === '') return;
        setIsLoading(true);
        setIdea('');
        try {
            const response = await generateArtIdea(topic);
            setIdea(response);
        } catch (error) {
            setIdea('Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Tìm ý tưởng vẽ tranh</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-center text-gray-600 mb-4">Em muốn vẽ về chủ đề gì?</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Ví dụ: Một khu rừng phép thuật"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    />
                    <button onClick={handleGetIdea} disabled={isLoading} className="px-6 py-2 bg-fuchsia-600 text-white font-semibold rounded-md shadow-sm hover:bg-fuchsia-700 disabled:bg-gray-400">
                        {isLoading ? <Spinner size="sm" /> : "Tìm ý tưởng"}
                    </button>
                </div>

                {idea && !isLoading && (
                    <div className="mt-6">
                        <div className="p-4 bg-fuchsia-50 border border-fuchsia-200 rounded-md">
                            <h4 className="font-bold text-fuchsia-800 mb-2">Ý tưởng của AI:</h4>
                            <p className="text-gray-800 whitespace-pre-wrap">{idea}</p>
                        </div>
                        <button 
                            onClick={() => navigate(Page.ImageGeneration, { prompt: topic })}
                            className="mt-4 w-full py-2 bg-violet-600 text-white font-semibold rounded-md shadow-sm hover:bg-violet-700"
                        >
                            Thử tạo tranh tô màu từ chủ đề này!
                        </button>
                    </div>
                )}
                 {isLoading && topic && (
                    <div className="mt-6 flex justify-center items-center">
                        <Spinner />
                        <p className="ml-2 text-gray-600">AI đang sáng tạo...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtIdeaPage;

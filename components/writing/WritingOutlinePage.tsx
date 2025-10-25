import React, { useState } from 'react';
import { PageProps } from '../../types';
import { generateWritingOutline } from '../../services/geminiService';
import Spinner from '../Spinner';

interface Outline {
    opening: string[];
    body: string[];
    conclusion: string[];
}

const WritingOutlinePage = (props: PageProps) => {
    const [topic, setTopic] = useState('');
    const [outline, setOutline] = useState<Outline | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateOutline = async () => {
        if (topic.trim() === '') {
            setError('Vui lòng nhập chủ đề.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setOutline(null);
        try {
            const result = await generateWritingOutline(topic);
            setOutline(result);
        } catch (err) {
            setError('Không thể tạo dàn ý. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Lập dàn ý cho bài văn</h2>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Nhập đề bài hoặc chủ đề của em:</label>
                    <div className="flex gap-2">
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ví dụ: Tả con mèo nhà em"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                        />
                        <button onClick={handleGenerateOutline} disabled={isLoading} className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-sm hover:bg-violet-700 disabled:bg-gray-400">
                            {isLoading ? <Spinner size="sm" /> : "Tạo dàn ý"}
                        </button>
                    </div>
                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
               
                {outline && (
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Dàn ý cho chủ đề: "{topic}"</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-lg text-violet-700">1. Mở bài</h4>
                                <ul className="list-disc list-inside ml-4 text-gray-700">
                                    {outline.opening.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-violet-700">2. Thân bài</h4>
                                 <ul className="list-disc list-inside ml-4 text-gray-700">
                                    {outline.body.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-violet-700">3. Kết bài</h4>
                                 <ul className="list-disc list-inside ml-4 text-gray-700">
                                    {outline.conclusion.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WritingOutlinePage;
import React, { useState, useEffect } from 'react';
import { generateImageFromPrompt } from '../../services/geminiService.js';
import Spinner from '../Spinner.jsx';

const ImageGenerationPage = ({ context }) => {
    const initialPrompt = context?.prompt || '';
    const [prompt, setPrompt] = useState(initialPrompt);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (prompt.trim() === '') {
            setError('Vui lòng nhập ý tưởng để AI vẽ tranh.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImage(null);
        try {
            const imageBase64 = await generateImageFromPrompt(prompt);
            setImage(imageBase64);
        } catch (err) {
            setError("Không thể tạo hình ảnh. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Auto-generate if a prompt was passed from the previous page
    useEffect(() => {
        if(initialPrompt) {
            handleGenerate();
        }
    }, [initialPrompt]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">AI tạo tranh tô màu</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">Nhập ý tưởng của em:</label>
                <div className="flex gap-2">
                    <input
                        id="prompt"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ví dụ: Một chú mèo phi hành gia"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-sm hover:bg-violet-700 disabled:bg-gray-400">
                        {isLoading ? <Spinner size="sm" /> : "Tạo tranh"}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                
                <div className="mt-6 min-h-[300px] flex justify-center items-center bg-gray-100 rounded-md border">
                    {isLoading && (
                        <div className="text-center">
                            <Spinner />
                            <p className="mt-2 text-gray-600">AI đang vẽ, chờ một chút nhé...</p>
                        </div>
                    )}
                    {image && (
                        <img src={`data:image/png;base64,${image}`} alt={prompt} className="max-w-full max-h-96 rounded-md"/>
                    )}
                    {!isLoading && !image && (
                         <p className="text-gray-500">Tranh của em sẽ xuất hiện ở đây.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerationPage;
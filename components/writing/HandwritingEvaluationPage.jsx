import React, { useState, useRef } from 'react';
import { evaluateHandwriting } from '../../services/geminiService.js';
import Spinner from '../Spinner.jsx';
import { ArtIcon } from '../icons/Icons.jsx';

const HandwritingEvaluationPage = (props) => {
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setResult(null);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                const resultStr = reader.result;
                setImage(resultStr);
                setImageBase64(resultStr.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEvaluate = async () => {
        if (!imageBase64) {
            setError("Vui lòng chọn ảnh để chấm.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const evalResult = await evaluateHandwriting(imageBase64);
            setResult({ ...evalResult, imageUrl: image });
        } catch (err) {
            setError("AI không thể chấm bài. Vui lòng thử lại với ảnh rõ hơn.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Chấm chữ viết tay</h2>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
                    {!image && (
                        <div>
                            <ArtIcon size="xl" />
                            <p className="my-4 text-gray-600">Hãy chụp ảnh bài viết tay của em và tải lên đây nhé!</p>
                            <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-rose-600 text-white font-semibold rounded-lg shadow-md hover:bg-rose-700">
                                Chọn ảnh
                            </button>
                        </div>
                    )}
                    {image && (
                        <div>
                            <p className="mb-4 font-semibold">Ảnh bài viết của em:</p>
                            <img src={image} alt="Bài viết tay" className="max-w-full max-h-80 mx-auto rounded-md border" />
                            <div className="mt-6 flex justify-center space-x-4">
                                <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300">
                                    Chọn ảnh khác
                                </button>
                                <button onClick={handleEvaluate} disabled={isLoading} className="flex items-center justify-center px-6 py-2 bg-rose-600 text-white font-semibold rounded-lg shadow-md hover:bg-rose-700 disabled:bg-gray-400">
                                    {isLoading ? <Spinner size="sm" /> : "Nhờ AI chấm bài"}
                                </button>
                            </div>
                        </div>
                    )}
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                </div>
                
                {isLoading && (
                    <div className="text-center mt-8">
                        <p className="text-lg text-gray-600">AI đang đọc chữ của em, chờ một chút nhé...</p>
                    </div>
                )}
                {error && <p className="text-center text-red-500 mt-8">{error}</p>}
                
                {result && (
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                         <h3 className="text-xl font-bold text-gray-800 mb-4">Kết quả chấm bài</h3>
                         <div className="mb-4">
                            <h4 className="font-semibold text-blue-600">AI đọc được:</h4>
                            <p className="p-3 bg-blue-50 rounded-md mt-1 italic text-gray-800">"{result.transcribedText}"</p>
                         </div>
                         <div className="mb-4">
                            <h4 className="font-semibold text-green-600">Điểm tốt:</h4>
                            <p className="text-gray-700">{result.positiveFeedback}</p>
                         </div>
                         <div>
                            <h4 className="font-semibold text-amber-600">Gợi ý cải thiện:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HandwritingEvaluationPage;
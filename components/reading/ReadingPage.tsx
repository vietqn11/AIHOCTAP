import React, { useState, useEffect } from 'react';
import { Page, PageProps, ReadingEvaluation } from '../../types';
import { startRecording, stopRecording, blobToBase64 } from '../../utils/audioUtils';
import { evaluateReading } from '../../services/geminiService';
import { MicIcon, StopCircleIcon } from '../icons/Icons';
import Spinner from '../Spinner';

const ReadingPage = ({ navigate, context }: PageProps) => {
    const { passage } = context;
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStartRecording = async () => {
        try {
            await startRecording();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            setError("Không thể truy cập micro. Vui lòng cấp quyền và thử lại.");
        }
    };

    const handleStopRecording = async () => {
        setIsRecording(false);
        setIsLoading(true);
        try {
            const audioBlob = await stopRecording();
            const audioBase64 = await blobToBase64(audioBlob);
            const evaluationResult: ReadingEvaluation = await evaluateReading(passage.content, audioBase64);
            navigate(Page.Result, { evaluation: evaluationResult, passage });
        } catch (err) {
            setError("Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại.");
            console.error(err);
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{passage.title}</h2>
            <p className="text-center text-gray-500 mb-6">Hãy đọc to và rõ ràng đoạn văn dưới đây nhé!</p>

            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg border border-gray-200 mb-8">
                <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">{passage.content}</p>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <div className="flex flex-col items-center">
                {!isLoading ? (
                    <button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        className={`flex items-center justify-center w-24 h-24 rounded-full text-white shadow-lg transition-transform transform hover:scale-110 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {isRecording ? <StopCircleIcon size="lg" /> : <MicIcon size="lg" />}
                    </button>
                ) : (
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-400">
                        <Spinner />
                    </div>
                )}
                <p className="mt-4 text-lg font-semibold text-gray-700">
                    {isLoading ? 'AI đang chấm bài...' : (isRecording ? 'Nhấn để dừng ghi âm' : 'Nhấn để bắt đầu ghi âm')}
                </p>
            </div>
        </div>
    );
};

export default ReadingPage;

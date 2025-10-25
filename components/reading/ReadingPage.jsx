import React, { useState, useRef } from 'react';
import { Page } from '../../constants.js';
import { startRecording, stopRecording, blobToBase64, getSupportedMimeType, playBase64Audio } from '../../utils/audioUtils.js';
import { evaluateReading, generateTextToSpeech } from '../../services/geminiService.js';
import { MicIcon, StopCircleIcon, SpeakerIcon } from '../icons/Icons.jsx';
import Spinner from '../Spinner.jsx';

const ReadingPage = ({ navigate, context }) => {
    const { passage } = context;
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReadingAloud, setIsReadingAloud] = useState(false);
    const [error, setError] = useState(null);
    const recordingStartTimeRef = useRef(null);

    const handleStartRecording = async () => {
        try {
            await startRecording();
            setIsRecording(true);
            setError(null);
            recordingStartTimeRef.current = Date.now();
        } catch (err) {
            setError("Không thể truy cập micro. Vui lòng cấp quyền và thử lại.");
        }
    };

    const handleStopRecording = async () => {
        setIsRecording(false);
        setIsLoading(true);
        try {
            const durationInSeconds = recordingStartTimeRef.current ? (Date.now() - recordingStartTimeRef.current) / 1000 : 0;
            recordingStartTimeRef.current = null;

            const audioBlob = await stopRecording();
            if (audioBlob.size === 0 || durationInSeconds < 1) {
                 setError("Không ghi âm được gì. Em hãy thử lại nhé.");
                 setIsLoading(false);
                 return;
            }
            const audioBase64 = await blobToBase64(audioBlob);
            const mimeType = getSupportedMimeType();
            const evaluationResult = await evaluateReading(passage.content, audioBase64, mimeType, durationInSeconds);
            navigate(Page.Result, { evaluation: evaluationResult, passage });
        } catch (err) {
            setError("Đã có lỗi xảy ra trong quá trình AI chấm bài. Vui lòng thử lại.");
            console.error(err);
            setIsLoading(false);
        }
    };

    const handleListenToModel = async () => {
        setIsReadingAloud(true);
        setError(null);
        try {
            const audioBase64 = await generateTextToSpeech(passage.content);
            await playBase64Audio(audioBase64);
        } catch (err) {
            setError("Không thể phát âm thanh đọc mẫu. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setIsReadingAloud(false);
        }
    }

    const disableActions = isRecording || isLoading || isReadingAloud;

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{passage.title}</h2>
            <p className="text-center text-gray-500 mb-6">Hãy đọc to và rõ ràng đoạn văn dưới đây nhé!</p>

            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg border border-gray-200 mb-8">
                <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">{passage.content}</p>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <div className="flex flex-col items-center">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleListenToModel}
                        disabled={disableActions}
                        className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 disabled:opacity-50"
                    >
                        {isReadingAloud ? <Spinner size="md" /> : <SpeakerIcon size="lg" />}
                        <span className="mt-2 text-sm font-semibold">Nghe đọc mẫu</span>
                    </button>

                    {!isLoading ? (
                        <button
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            disabled={isReadingAloud}
                            className={`flex items-center justify-center w-24 h-24 rounded-full text-white shadow-lg transition-transform transform hover:scale-110 disabled:opacity-50 disabled:bg-gray-400 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {isRecording ? <StopCircleIcon size="lg" /> : <MicIcon size="lg" />}
                        </button>
                    ) : (
                        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-400">
                            <Spinner />
                        </div>
                    )}
                </div>
                 <p className="mt-4 text-lg font-semibold text-gray-700 h-6">
                    {isLoading ? 'AI đang chấm bài...' : (isRecording ? 'Nhấn để dừng ghi âm' : (isReadingAloud ? 'Đang đọc mẫu...' : 'Nhấn để bắt đầu ghi âm'))}
                </p>
            </div>
        </div>
    );
};

export default ReadingPage;
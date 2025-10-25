import React, { useState, useEffect } from 'react';
import { Page, PageProps, WritingEvaluation } from '../../types';
import { generateTextToSpeech } from '../../services/geminiService';
import { playBase64Audio } from '../../utils/audioUtils';
import { submitWritingResult } from '../../services/googleSheetsService';
import Spinner from '../Spinner';
import { SpeakerIcon } from '../icons/Icons';

const ScoreCircle = ({ label, score }: { label: string; score: number }) => {
    const getScoreColor = (s: number) => {
        if (s >= 8) return 'text-green-500';
        if (s >= 5) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex flex-col items-center">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 ${getScoreColor(score).replace('text-', 'border-')} flex items-center justify-center`}>
                <span className={`text-2xl md:text-3xl font-bold ${getScoreColor(score)}`}>{score.toFixed(1)}</span>
            </div>
            <p className="mt-2 text-sm md:text-base font-semibold text-gray-600">{label}</p>
        </div>
    );
};


const WritingEvaluationResultPage = ({ navigate, context, user }: PageProps) => {
    const { evaluation, topic, writtenText } = context;
    const [isReadingAloud, setIsReadingAloud] = useState(false);
    const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

     useEffect(() => {
        const saveResult = async () => {
            setSavingStatus('saving');
            try {
                await submitWritingResult(user, topic, writtenText, evaluation);
                setSavingStatus('saved');
            } catch (e) {
                setSavingStatus('error');
            }
        };
        if (evaluation) {
            saveResult();
        }
    }, [user, topic, writtenText, evaluation]);

    const handleReadAloud = async () => {
        setIsReadingAloud(true);
        try {
            const audioBase64 = await generateTextToSpeech(writtenText);
            await playBase64Audio(audioBase64);
        } catch (error) {
            console.error("Failed to play audio:", error);
        } finally {
            setIsReadingAloud(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Kết quả bài viết: {topic}</h2>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Bài viết của em</h3>
                     <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Nội dung</h4>
                        <button 
                            onClick={handleReadAloud}
                            disabled={isReadingAloud}
                            className="flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                            {isReadingAloud ? <Spinner size="sm" /> : <SpeakerIcon size="sm" />}
                            <span className="ml-1 text-sm">Nghe lại bài viết</span>
                        </button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">{writtenText}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">AI minh họa bài viết</h3>
                    <div className="flex justify-center items-center bg-gray-100 rounded-md border aspect-video">
                        <img src={`data:image/png;base64,${evaluation.imageUrl}`} alt={`AI illustration for ${topic}`} className="max-w-full max-h-full rounded-md object-contain"/>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Đánh giá của AI</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-6">
                    <ScoreCircle label="Nội dung" score={evaluation.contentScore} />
                    <ScoreCircle label="Bố cục" score={evaluation.structureScore} />
                    <ScoreCircle label="Từ ngữ" score={evaluation.wordingScore} />
                    <ScoreCircle label="Sáng tạo" score={evaluation.creativityScore} />
                </div>
                <div>
                     <h4 className="font-semibold text-gray-700">Nhận xét chung:</h4>
                     <p className="text-gray-700 p-3 bg-blue-50 rounded-md mt-1">{evaluation.feedback}</p>
                </div>
            </div>

            <div className="mt-12 flex flex-col items-center space-y-4">
                 <div className="text-center text-gray-500 h-5">
                    {savingStatus === 'saving' && <p>Đang lưu kết quả...</p>}
                    {savingStatus === 'saved' && <p>✓ Đã lưu kết quả thành công!</p>}
                    {savingStatus === 'error' && <p>Lỗi: Không thể lưu kết quả.</p>}
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => navigate(Page.WritingAssistance, { topic })}
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                    >
                        Viết lại
                    </button>
                    <button
                        onClick={() => navigate(Page.WritingTopicSelection)}
                        className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105"
                    >
                        Chọn chủ đề khác
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WritingEvaluationResultPage;

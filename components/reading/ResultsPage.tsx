import React, { useState, useEffect } from 'react';
import { Page, PageProps } from '../../types';
import { generateTextToSpeech } from '../../services/geminiService';
import { playBase64Audio } from '../../utils/audioUtils';
import { submitReadingResult } from '../../services/googleSheetsService';
import { SpeakerIcon } from '../icons/Icons';
import Spinner from '../Spinner';

const ScoreCircle = ({ label, score, unit }: { label: string; score: number, unit?: string }) => {
    const getScoreColor = (s: number, isWpm = false) => {
        if (isWpm) {
            if (s >= 60) return 'text-green-500';
            if (s >= 40) return 'text-yellow-500';
            return 'text-red-500';
        }
        if (s >= 8) return 'text-green-500';
        if (s >= 5) return 'text-yellow-500';
        return 'text-red-500';
    };
    
    const colorClass = getScoreColor(score, label === "Tốc độ");

    return (
        <div className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full border-4 ${colorClass.replace('text-', 'border-')} flex items-center justify-center`}>
                <span className={`text-3xl font-bold ${colorClass}`}>{score.toFixed(0)}</span>
            </div>
            <p className="mt-2 font-semibold text-gray-600">{label}{unit && <span className="text-sm"> ({unit})</span>}</p>
        </div>
    );
};


const ResultPage = ({ navigate, context, user }: PageProps) => {
    const { evaluation, passage } = context;
    const [playingWord, setPlayingWord] = useState<string | null>(null);
    const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    useEffect(() => {
        const saveResult = async () => {
            setSavingStatus('saving');
            try {
                await submitReadingResult(user, passage.title, evaluation);
                setSavingStatus('saved');
            } catch (e) {
                setSavingStatus('error');
            }
        };
        if (evaluation) {
          saveResult();
        }
    }, [user, passage.title, evaluation]);

    const handleListenToWord = async (textToRead: string, word: string) => {
        if (playingWord) return;
        setPlayingWord(word);
        try {
            const audioBase64 = await generateTextToSpeech(textToRead);
            await playBase64Audio(audioBase64);
        } catch (error) {
            console.error("Failed to play audio for word:", error);
        } finally {
            setPlayingWord(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Kết quả đọc bài: {passage.title}</h2>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
                <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Điểm số của em</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                    <ScoreCircle label="Tổng thể" score={evaluation.totalScore} />
                    <ScoreCircle label="Trôi chảy" score={evaluation.fluency} />
                    <ScoreCircle label="Phát âm" score={evaluation.pronunciation} />
                    <ScoreCircle label="Chính xác" score={evaluation.accuracy} />
                    <ScoreCircle label="Tốc độ" score={evaluation.wordsPerMinute} unit="từ/phút" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Nhận xét của AI</h3>
                    <p className="text-gray-700 mb-4">{evaluation.generalFeedback}</p>
                    <h4 className="font-semibold text-green-600">Những điểm em làm tốt:</h4>
                    <p className="text-gray-700">{evaluation.positivePoints}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Cần luyện tập thêm</h3>
                    {evaluation.wordsToImprove.length > 0 ? (
                        <ul className="space-y-3">
                            {evaluation.wordsToImprove.map((item, index) => (
                                <li key={index} className="p-3 bg-red-50 rounded-md flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-red-700">{item.word}</p>
                                        <p className="text-sm text-gray-600 italic">"{item.context}"</p>
                                    </div>
                                    <button
                                        onClick={() => handleListenToWord(item.context, item.word)}
                                        disabled={!!playingWord}
                                        className="p-2 rounded-full hover:bg-red-100 disabled:opacity-50"
                                        aria-label={`Nghe lại câu chứa từ ${item.word}`}
                                    >
                                        {playingWord === item.word ? <Spinner size="sm" /> : <SpeakerIcon size="md" />}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">Tuyệt vời! Em đã đọc đúng tất cả các từ.</p>
                    )}
                </div>
            </div>

            <div className="mt-12 flex flex-col items-center space-y-4">
                 <button
                    onClick={() => navigate(Page.ReadingComprehension, { ...context })}
                    className="w-full max-w-xs px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-transform transform hover:scale-105"
                >
                    Kiểm tra đọc hiểu
                </button>
                <div className="flex justify-center space-x-4">
                     <button
                        onClick={() => navigate(Page.Reading, { passage })}
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={() => navigate(Page.PassageSelection, { mode: 'read' })}
                        className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105"
                    >
                        Chọn bài khác
                    </button>
                </div>
                 <div className="text-center text-gray-500 h-5 mt-2">
                    {savingStatus === 'saving' && <p>Đang lưu kết quả...</p>}
                    {savingStatus === 'saved' && <p>✓ Đã lưu kết quả thành công!</p>}
                    {savingStatus === 'error' && <p>Lỗi: Không thể lưu kết quả.</p>}
                </div>
            </div>
        </div>
    );
};

export default ResultPage;

import React, { useState, useEffect } from 'react';
import { Page, PageProps, RolePlayHistoryLine } from '../../types';
import { summarizeRolePlay } from '../../services/geminiService';
import { submitRolePlayResult } from '../../services/googleSheetsService';
import Spinner from '../Spinner';

const RolePlayResultPage = ({ navigate, context, user }: PageProps) => {
    const { history, script } = context;
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
    const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    useEffect(() => {
        const getFeedbackAndSave = async () => {
            try {
                // 1. Get feedback from AI
                setIsLoadingFeedback(true);
                const userHistory = history.filter((line: RolePlayHistoryLine, index: number) => {
                    const lineInfo = script.script[index];
                    return !!lineInfo && lineInfo.character === "USER";
                });

                const result = await summarizeRolePlay(script.title, userHistory);
                setFeedback(result.feedback);
                setIsLoadingFeedback(false);

                // 2. Save result to Google Sheets
                setSavingStatus('saving');
                await submitRolePlayResult(user, script.title, result.feedback);
                setSavingStatus('saved');

            } catch (error) {
                console.error("Failed to get feedback or save result", error);
                setFeedback("Không thể tạo nhận xét tự động. Em đã làm rất tốt!");
                setIsLoadingFeedback(false);
                setSavingStatus('error');
            }
        };

        getFeedbackAndSave();
    }, [history, script, user]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Kết quả đóng vai: {script.title}</h2>
            
             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                 <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Nhận xét của AI</h3>
                 {isLoadingFeedback ? (
                     <div className="flex items-center justify-center"><Spinner /><span className="ml-2">AI đang tạo nhận xét...</span></div>
                 ) : (
                    <p className="text-center text-lg italic text-gray-700">"{feedback}"</p>
                 )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Lịch sử hội thoại</h3>
                <ul className="space-y-4">
                    {history.map((line: any, index: number) => {
                        const originalLineInfo = script.script.find((l: any) => l.line === line.original);
                        const isUserLine = originalLineInfo?.character === "USER";
                        
                        return (
                            <li key={index} className={`p-4 rounded-md ${isUserLine ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                                <p className={`font-semibold ${isUserLine ? 'text-emerald-800' : 'text-gray-600'}`}>
                                    {isUserLine ? "Lời thoại của em (gốc):" : "Lời thoại của AI:"}
                                </p>
                                <p className="italic text-gray-800">"{line.original}"</p>
                                {isUserLine && (
                                     <>
                                        <p className="font-semibold text-emerald-800 mt-2">Em đã đọc:</p>
                                        <p className="italic text-gray-800">"{line.spoken}"</p>
                                    </>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
             <div className="mt-12 flex flex-col items-center space-y-4">
                 <div className="text-center text-gray-500 h-5">
                    {savingStatus === 'saving' && <p>Đang lưu kết quả...</p>}
                    {savingStatus === 'saved' && <p>✓ Đã lưu kết quả thành công!</p>}
                    {savingStatus === 'error' && <p>Lỗi: Không thể lưu kết quả.</p>}
                </div>
                <button
                    onClick={() => navigate(Page.RolePlayScriptSelection)}
                    className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105"
                >
                    Chọn kịch bản khác
                </button>
            </div>
        </div>
    );
};

export default RolePlayResultPage;

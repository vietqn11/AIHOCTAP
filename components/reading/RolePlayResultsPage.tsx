import React from 'react';
import { Page, PageProps } from '../../types';

const RolePlayResultPage = ({ navigate, context }: PageProps) => {
    const { history, script } = context;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Kết quả đóng vai: {script.title}</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                 <p className="text-center text-lg">Hoan hô! Em đã hoàn thành vở kịch. Hãy xem lại lời thoại của mình nhé.</p>
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
             <div className="mt-12 flex justify-center space-x-4">
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
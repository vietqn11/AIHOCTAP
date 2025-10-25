import React, { useState, useEffect, useRef } from 'react';
import { Page, PageProps, RolePlayHistoryLine } from '../../types';
import { generateTextToSpeech, evaluateRolePlayReading } from '../../services/geminiService';
import { startRecording, stopRecording, blobToBase64, playBase64Audio } from '../../utils/audioUtils';
import { MicIcon, StopCircleIcon, SpeakerIcon } from '../icons/Icons';
import Spinner from '../Spinner';

type Turn = 'USER' | 'AI' | 'SYSTEM';

const RolePlayReadingPage = ({ navigate, context }: PageProps) => {
    const { script, userCharacter } = context;
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // For AI speaking or evaluating
    const [statusText, setStatusText] = useState('Bắt đầu nào!');
    const [history, setHistory] = useState<RolePlayHistoryLine[]>([]);

    const currentLine = script.script[currentLineIndex];
    const isUserTurn = currentLine?.character === 'USER';
    const aiCharacter = script.characters.find(c => c !== userCharacter);

    const processTurn = async () => {
        if (currentLineIndex >= script.script.length) {
            navigate(Page.RolePlayResult, { history, script });
            return;
        }

        const lineInfo = script.script[currentLineIndex];
        
        if (lineInfo.character === 'AI') {
            setIsLoading(true);
            setStatusText(`${aiCharacter} đang nói...`);
            try {
                const audioBase64 = await generateTextToSpeech(lineInfo.line);
                await playBase64Audio(audioBase64);
                setHistory(prev => [...prev, {original: lineInfo.line, spoken: lineInfo.line}])
                setCurrentLineIndex(prev => prev + 1);
            } catch (error) {
                console.error("AI speech failed", error);
                setStatusText("Lỗi âm thanh, bỏ qua lượt...");
                await new Promise(res => setTimeout(res, 1000));
                 setHistory(prev => [...prev, {original: lineInfo.line, spoken: `[Lỗi âm thanh]` }])
                setCurrentLineIndex(prev => prev + 1);
            } finally {
                setIsLoading(false);
            }
        } else { // User's turn
            setStatusText(`Đến lượt em! (Vai: ${userCharacter})`);
        }
    };
    
    useEffect(() => {
        processTurn();
    }, [currentLineIndex]);


    const handleStartRecording = async () => {
        await startRecording();
        setIsRecording(true);
        setStatusText("Đang ghi âm...");
    };

    const handleStopRecording = async () => {
        setIsRecording(false);
        setIsLoading(true);
        setStatusText("AI đang lắng nghe...");
        try {
            const audioBlob = await stopRecording();
            const audioBase64 = await blobToBase64(audioBlob);
            const result = await evaluateRolePlayReading(currentLine.line, audioBase64);
            setHistory(prev => [...prev, { original: currentLine.line, spoken: result.transcribedText }]);
            // For simplicity, we just move on. A more complex version could check accuracy.
        } catch (error) {
            console.error("Evaluation failed", error);
             setHistory(prev => [...prev, { original: currentLine.line, spoken: "[Lỗi xử lý giọng nói]" }]);
        } finally {
            setCurrentLineIndex(prev => prev + 1);
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{script.title}</h2>
            <p className="text-center text-gray-500 mb-6">Em vào vai: <span className="font-bold">{userCharacter}</span></p>

            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg border border-gray-200 mb-8 min-h-[150px]">
                {currentLine && (
                     <p className={`text-xl leading-relaxed text-center ${isUserTurn ? 'font-bold text-emerald-700' : 'text-gray-700'}`}>
                        {isUserTurn ? `(Lời thoại của em)` : `(${aiCharacter})`} "{currentLine.line}"
                    </p>
                )}
            </div>
            
            <div className="flex flex-col items-center">
                 {!isLoading && isUserTurn && (
                    <button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        className={`flex items-center justify-center w-24 h-24 rounded-full text-white shadow-lg transition-transform transform hover:scale-110 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                    >
                        {isRecording ? <StopCircleIcon size="lg" /> : <MicIcon size="lg" />}
                    </button>
                )}

                {isLoading && (
                     <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-400">
                        <Spinner />
                    </div>
                )}
                
                 <p className="mt-4 text-lg font-semibold text-gray-700 h-6">
                    {statusText}
                </p>
            </div>
        </div>
    );
};

export default RolePlayReadingPage;
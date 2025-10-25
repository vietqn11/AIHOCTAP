import React, { useState, useEffect } from 'react';
import { PageProps, EthicalDilemma, EthicalFeedback } from '../../types';
import { generateEthicalDilemma, evaluateEthicalChoice } from '../../services/geminiService';
import Spinner from '../Spinner';

const EthicalDilemmaPage = (props: PageProps) => {
    const [dilemma, setDilemma] = useState<EthicalDilemma | null>(null);
    const [feedback, setFeedback] = useState<EthicalFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEvaluating, setIsEvaluating] = useState(false);

    const fetchDilemma = async () => {
        setIsLoading(true);
        setFeedback(null);
        setDilemma(null);
        try {
            const newDilemma = await generateEthicalDilemma();
            setDilemma(newDilemma);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDilemma();
    }, []);

    const handleChoice = async (choice: string) => {
        if (!dilemma) return;
        setIsEvaluating(true);
        try {
            const result = await evaluateEthicalChoice(dilemma.scenario, choice);
            setFeedback(result);
        } finally {
            setIsEvaluating(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Thử thách tình huống</h2>
            {isLoading && (
                <div className="h-64 flex justify-center items-center">
                    <Spinner />
                    <p className="ml-4 text-lg text-gray-600">AI đang nghĩ ra tình huống...</p>
                </div>
            )}
            {dilemma && (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <p className="text-lg text-gray-700 mb-6 text-center italic">"{dilemma.scenario}"</p>
                    
                    {!feedback && !isEvaluating && (
                        <div className="space-y-4">
                            <p className="text-center font-semibold">Em sẽ làm gì?</p>
                            {dilemma.choices.map((choice, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleChoice(choice)}
                                    className="w-full text-left bg-rose-100 p-4 rounded-lg border border-rose-200 hover:bg-rose-200 hover:border-rose-400 transition"
                                >
                                    {choice}
                                </button>
                            ))}
                        </div>
                    )}

                    {isEvaluating && <div className="flex justify-center"><Spinner /></div>}
                    
                    {feedback && (
                        <div>
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                <h4 className="font-bold text-green-800 mb-2">Lời khuyên của AI</h4>
                                <p className="text-gray-800">{feedback.feedback}</p>
                            </div>
                            <button onClick={fetchDilemma} className="mt-6 w-full py-3 bg-rose-600 text-white font-semibold rounded-md shadow-sm hover:bg-rose-700">
                                Tình huống khác
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EthicalDilemmaPage;

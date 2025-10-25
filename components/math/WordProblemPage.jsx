import React, { useState, useEffect } from 'react';
import { generateWordProblem, evaluateWordProblemAnswer, provideWordProblemHint } from '../../services/geminiService.js';
import Spinner from '../Spinner.jsx';
import { LightbulbIcon } from '../icons/Icons.jsx';

const WordProblemsPage = ({ context }) => {
    const { lesson } = context;
    const [problem, setProblem] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [hint, setHint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [isHintLoading, setIsHintLoading] = useState(false);

    const fetchNewProblem = async () => {
        setIsLoading(true);
        setEvaluation(null);
        setHint(null);
        setUserAnswer('');
        try {
            const newProblem = await generateWordProblem(lesson.title);
            setProblem(newProblem);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNewProblem();
    }, [lesson.id]);

    const handleCheckAnswer = async () => {
        if (!problem || userAnswer.trim() === '') return;
        setIsChecking(true);
        try {
            const result = await evaluateWordProblemAnswer(problem.questionText, parseInt(userAnswer, 10));
            setEvaluation(result);
        } finally {
            setIsChecking(false);
        }
    };
    
    const handleGetHint = async () => {
        if (!problem) return;
        setIsHintLoading(true);
        try {
            const hintResult = await provideWordProblemHint(problem.questionText);
            setHint(hintResult);
        } finally {
            setIsHintLoading(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Giải toán có lời văn</h2>
            <p className="text-center text-gray-600 mb-8 font-semibold">{lesson.title}</p>
            
            {isLoading ? (
                 <div className="w-full max-w-2xl h-64 flex justify-center items-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <Spinner />
                    <p className="ml-4 text-lg">AI đang ra đề...</p>
                 </div>
            ) : problem ? (
                <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line mb-6">{problem.questionText}</p>
                    
                    {!evaluation && (
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                className="flex-grow text-lg px-4 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                                placeholder="Đáp số"
                            />
                            <button onClick={handleCheckAnswer} disabled={isChecking} className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md shadow-sm hover:bg-teal-700 disabled:bg-gray-400">
                                {isChecking ? <Spinner size="sm" /> : "Nộp bài"}
                            </button>
                        </div>
                    )}

                    {!evaluation && !hint && (
                        <div className="text-center mt-4">
                            <button onClick={handleGetHint} disabled={isHintLoading} className="text-teal-700 hover:underline flex items-center justify-center mx-auto disabled:opacity-50">
                               {isHintLoading ? <Spinner size="sm" /> : <><LightbulbIcon size="sm" /> <span className="ml-2">Cần gợi ý?</span></>}
                            </button>
                        </div>
                    )}
                    
                    {hint && <p className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">Gợi ý: {hint.hintText}</p>}

                    {evaluation && (
                        <div className="mt-6">
                            <div className={`p-4 rounded-md ${evaluation.isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                                <p className={`font-bold text-lg ${evaluation.isCorrect ? 'text-green-800' : 'text-red-800'}`}>{evaluation.feedbackText}</p>
                                <p className="mt-2 text-gray-700">{evaluation.explanation}</p>
                            </div>
                             <button onClick={fetchNewProblem} className="mt-6 w-full py-3 bg-teal-600 text-white font-semibold rounded-md shadow-sm hover:bg-teal-700">
                                Bài toán khác
                            </button>
                        </div>
                    )}
                </div>
            ) : <p>Không thể tải bài toán.</p>}
        </div>
    );
};

export default WordProblemsPage;
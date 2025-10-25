import React, { useState, useEffect, useRef } from 'react';
import { PageProps, MentalMathProblem, MentalMathEvaluation } from '../../types';
import { generateMentalMathProblem } from '../../services/geminiService';
import { submitMathResult } from '../../services/googleSheetsService';
import Spinner from '../Spinner';

const MentalMathPage = ({ user }: PageProps) => {
    const [problem, setProblem] = useState<MentalMathProblem | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [evaluation, setEvaluation] = useState<MentalMathEvaluation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);

    const scoreRef = useRef(score);
    scoreRef.current = score;

    const fetchNewProblem = async () => {
        setIsLoading(true);
        setProblem(null);
        setEvaluation(null);
        setUserAnswer('');
        try {
            const newProblem = await generateMentalMathProblem();
            setProblem(newProblem);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNewProblem();

        return () => {
            if (scoreRef.current > 0) {
                submitMathResult(user, "Toán nhẩm", scoreRef.current);
            }
        };
    }, [user]);

    const checkAnswer = () => {
        if (!problem) return;
        const answerNum = parseInt(userAnswer, 10);
        const isCorrect = answerNum === problem.answer;
        setEvaluation({
            isCorrect,
            feedbackText: isCorrect ? `Đúng rồi! ${problem.questionText.replace('?', String(problem.answer))}` : `Chưa đúng. Đáp án là ${problem.answer}.`
        });
        if (isCorrect) {
            setScore(s => s + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !evaluation) {
            checkAnswer();
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Toán nhẩm siêu tốc</h2>
            <p className="text-lg text-blue-600 font-bold mb-8">Điểm: {score}</p>

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
                {isLoading && <div className="h-32 flex justify-center items-center"><Spinner /></div>}
                {problem && (
                    <>
                        <p className="text-4xl font-bold text-gray-700 mb-6">{problem.questionText}</p>
                        <input
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!!evaluation}
                            className="w-full text-center text-2xl px-4 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Nhập đáp án"
                        />
                        {!evaluation ? (
                            <button onClick={checkAnswer} className="mt-6 w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700">
                                Kiểm tra
                            </button>
                        ) : (
                            <div className="mt-6">
                                <p className={`text-xl font-semibold ${evaluation.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {evaluation.feedbackText}
                                </p>
                                <button onClick={fetchNewProblem} className="mt-4 w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700">
                                    Câu tiếp theo
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MentalMathPage;

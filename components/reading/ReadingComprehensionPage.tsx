import React, { useState, useEffect } from 'react';
import { Page, PageProps, ReadingComprehensionQuestion } from '../../types';
import { generateReadingComprehensionQuestions } from '../../services/geminiService';
import Spinner from '../Spinner';

const ReadingComprehensionPage = ({ navigate, context }: PageProps) => {
    const { passage } = context;
    const [questions, setQuestions] = useState<ReadingComprehensionQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            try {
                const fetchedQuestions = await generateReadingComprehensionQuestions(passage.content);
                setQuestions(fetchedQuestions);
            } catch (error) {
                console.error("Failed to fetch comprehension questions:", error);
                // Handle error, maybe show a message and a back button
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [passage.content]);

    const handleAnswerSubmit = (optionIndex: number) => {
        if (isAnswered) return;
        
        setSelectedAnswer(optionIndex);
        setIsAnswered(true);
        if (optionIndex === questions[currentQuestionIndex].correctOptionIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setIsAnswered(false);
        setSelectedAnswer(null);
        setCurrentQuestionIndex(prev => prev + 1);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <Spinner />
                <p className="mt-4 text-lg text-gray-600">AI đang chuẩn bị câu hỏi...</p>
            </div>
        );
    }

    const isQuizFinished = currentQuestionIndex >= questions.length;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Kiểm tra đọc hiểu</h2>
            
            {isQuizFinished ? (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">Hoàn thành!</h3>
                    <p className="text-lg text-gray-700 mb-6">
                        Em đã trả lời đúng {score} / {questions.length} câu hỏi.
                    </p>
                    <button
                        onClick={() => navigate(Page.Result, context)}
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                    >
                        Quay lại kết quả
                    </button>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <p className="text-lg font-semibold text-gray-800 mb-6">
                        Câu {currentQuestionIndex + 1}/{questions.length}: {questions[currentQuestionIndex]?.question}
                    </p>
                    <div className="space-y-4">
                        {questions[currentQuestionIndex]?.options.map((option, index) => {
                            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition ";
                            if (isAnswered) {
                                if (index === questions[currentQuestionIndex].correctOptionIndex) {
                                    buttonClass += "bg-green-100 border-green-500 text-green-800 font-bold";
                                } else if (index === selectedAnswer) {
                                    buttonClass += "bg-red-100 border-red-500 text-red-800";
                                } else {
                                     buttonClass += "bg-gray-100 border-gray-200 opacity-60";
                                }
                            } else {
                                buttonClass += "bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-500";
                            }
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSubmit(index)}
                                    disabled={isAnswered}
                                    className={buttonClass}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    {isAnswered && (
                        <div className="mt-6 text-right">
                            <button onClick={handleNextQuestion} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                                {currentQuestionIndex === questions.length - 1 ? "Xem kết quả" : "Câu tiếp theo"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReadingComprehensionPage;

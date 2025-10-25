import React from 'react';
import { Page, PageProps } from '../../types';
import { MATH_LESSONS_VOL1 } from '../../constants';

const WordProblemLessonSelectionPage = ({ navigate }: PageProps) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Chọn dạng bài toán</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MATH_LESSONS_VOL1.map(lesson => (
                    <button
                        key={lesson.id}
                        onClick={() => navigate(Page.WordProblems, { lesson })}
                        className="text-left bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-teal-500 transition-all transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
                        <p className="text-gray-600 mt-2">{lesson.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WordProblemLessonSelectionPage;
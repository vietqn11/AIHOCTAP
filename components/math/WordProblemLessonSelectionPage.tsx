import React from 'react';
import { MathLesson } from '../../types';
import { MATH_LESSONS_VOL1 } from '../../constants';

interface WordProblemLessonSelectionPageProps {
  onSelectLesson: (lesson: MathLesson) => void;
  onBack: () => void;
}

const WordProblemLessonSelectionPage: React.FC<WordProblemLessonSelectionPageProps> = ({ onSelectLesson, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại</button>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Chọn một bài học</h2>
            <p className="text-gray-600 mt-2">AI sẽ tạo bài toán dựa trên bài học con chọn nhé.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MATH_LESSONS_VOL1.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson)}
            className="text-left p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-purple-50 border border-gray-200 transition-all transform hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-purple-700">{lesson.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{lesson.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WordProblemLessonSelectionPage;

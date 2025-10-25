import React from 'react';
import { Page } from '../../constants.js';
import { PASSAGES } from '../../constants.js';

const PassageSelectionPage = ({ navigate, context }) => {
    const { mode } = context; // 'read' or 'difficult_words'

    const handleSelectPassage = (passage) => {
        if (mode === 'read') {
            navigate(Page.Reading, { passage });
        } else {
            navigate(Page.DifficultWords, { passage });
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                {mode === 'read' ? 'Chọn bài để luyện đọc' : 'Chọn bài để xem từ khó'}
            </h2>
            <div className="space-y-4">
                {PASSAGES.map(passage => (
                    <button
                        key={passage.id}
                        onClick={() => handleSelectPassage(passage)}
                        className="w-full text-left bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-all transform hover:-translate-y-1"
                    >
                        <p className="text-sm font-semibold text-blue-600">Sách giáo khoa - Tập {passage.volume}</p>
                        <h3 className="text-xl font-bold text-gray-800 mt-1">{passage.title}</h3>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PassageSelectionPage;
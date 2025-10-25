
import React from 'react';
import { User, DialogueScript, RolePlayResult } from '../../types';

interface RolePlayResultsPageProps {
  user: User;
  script: DialogueScript;
  result: RolePlayResult;
  onStartOver: () => void;
}

const RolePlayResultsPage: React.FC<RolePlayResultsPageProps> = ({ user, script, result, onStartOver }) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-600">Hoàn thành câu chuyện!</h2>
        <p className="mt-2 text-lg text-gray-600">Con đã diễn vai {script.characters[1]} rất tốt, {user.name}!</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Nhận xét từ AI 🤖</h3>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-gray-800 mt-2 text-lg">{result.feedback}</p>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          Chọn truyện khác
        </button>
      </div>
    </div>
  );
};

export default RolePlayResultsPage;

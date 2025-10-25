
import React from 'react';
import { DialogueScript } from '../../types';
import { DIALOGUE_SCRIPTS } from '../../constants';

interface RolePlayScriptSelectionPageProps {
  onSelectScript: (script: DialogueScript) => void;
  onBack: () => void;
}

const RolePlayScriptSelectionPage: React.FC<RolePlayScriptSelectionPageProps> = ({ onSelectScript, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại</button>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Chọn một câu chuyện</h2>
        <p className="text-gray-600 mt-2">Con muốn đóng vai nhân vật nào trong câu chuyện nào?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DIALOGUE_SCRIPTS.map((script) => (
          <button
            key={script.id}
            onClick={() => onSelectScript(script)}
            className="text-left p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-blue-50 border border-gray-200 transition-all transform hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold text-blue-700">{script.title}</h3>
            <p className="mt-2 text-sm text-gray-500">Nhân vật: {script.characters.join(' và ')}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RolePlayScriptSelectionPage;

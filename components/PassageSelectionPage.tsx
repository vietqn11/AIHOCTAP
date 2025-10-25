
import React, { useState } from 'react';
import { User, Passage } from '../types';
import Spinner from './Spinner';

interface PassageSelectionPageProps {
  user: User;
  passages: Passage[];
  onSelectPassage: (passage: Passage) => Promise<void>;
  onBack: () => void;
}

const PassageSelectionPage: React.FC<PassageSelectionPageProps> = ({ user, passages, onSelectPassage, onBack }) => {
  const [loadingPassageId, setLoadingPassageId] = useState<number | null>(null);

  const passagesVol1 = passages.filter(p => p.volume === 1);
  const passagesVol2 = passages.filter(p => p.volume === 2);

  const handleSelect = async (passage: Passage) => {
    setLoadingPassageId(passage.id);
    await onSelectPassage(passage);
    // setLoadingPassageId(null); // The component will unmount anyway
  };

  const PassageList = ({ volume, list }: { volume: number; list: Passage[] }) => (
    <div>
      <h3 className="text-xl font-bold text-gray-700 border-b-2 border-blue-200 pb-2 mb-4">Tập {volume}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((passage) => (
          <button
            key={passage.id}
            onClick={() => handleSelect(passage)}
            disabled={loadingPassageId !== null}
            className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-blue-50 border border-gray-200 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-wait"
          >
            {loadingPassageId === passage.id ? (
              <div className="flex items-center gap-3">
                <Spinner size="sm" />
                <span className="font-semibold text-blue-700">Đang chuẩn bị...</span>
              </div>
            ) : (
              <p className="font-semibold text-blue-700">{passage.title}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại</button>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Chào bạn <span className="text-blue-600">{user.name}</span> lớp <span className="text-blue-600">{user.className}</span>!
        </h2>
        <p className="text-gray-600 mt-2">Hãy chọn một bài đọc bên dưới để bắt đầu luyện tập nhé.</p>
      </div>

      <div className="space-y-8">
        {passagesVol1.length > 0 && <PassageList volume={1} list={passagesVol1} />}
        {passagesVol2.length > 0 && <PassageList volume={2} list={passagesVol2} />}
      </div>
    </div>
  );
};

export default PassageSelectionPage;
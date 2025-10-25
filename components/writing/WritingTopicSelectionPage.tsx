
import React from 'react';

interface WritingTopicSelectionPageProps {
  onSelectTopic: (topic: string) => void;
  onBack: () => void;
}

const TOPICS = [
  "Tả một con vật mà em yêu thích",
  "Kể về một ngày nghỉ của em",
  "Viết thư cho một người bạn ở xa",
  "Tả một đồ vật trong nhà",
  "Kể về một việc tốt em đã làm",
  "Tả cây phượng ở sân trường em",
  "Ước mơ của em",
  "Kể về gia đình em",
];

const WritingTopicSelectionPage: React.FC<WritingTopicSelectionPageProps> = ({ onSelectTopic, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại</button>
       <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Cùng tập làm văn nào!
        </h2>
        <p className="text-gray-600 mt-2">Hãy chọn một chủ đề bên dưới để AI giúp bé viết nhé.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOPICS.map(topic => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className="text-left p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-green-50 border border-gray-200 transition-all transform hover:-translate-y-1"
          >
            <p className="text-lg font-semibold text-green-700">{topic}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WritingTopicSelectionPage;

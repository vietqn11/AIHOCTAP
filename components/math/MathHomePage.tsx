
import React from 'react';

interface MathHomePageProps {
  onStartMentalMath: () => void;
  onStartWordProblems: () => void;
  onBack: () => void;
}

const MathActivityCard: React.FC<{ title: string; description: string; icon: string; onClick?: () => void; disabled?: boolean; }> = ({ title, description, icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="text-left p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-purple-50 border border-gray-200 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  >
    <div className="flex items-center gap-4">
        <span className="text-4xl">{icon}</span>
        <div>
            <p className="text-lg font-semibold text-purple-700">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </div>
  </button>
);

const MathHomePage: React.FC<MathHomePageProps> = ({ onStartMentalMath, onStartWordProblems, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại Trang chủ</button>
       <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="text-6xl">🤖</div>
        <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Mình cùng học Toán nhé!
            </h2>
            <p className="text-gray-600 mt-2">Hãy chọn một hoạt động bên dưới để bắt đầu.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MathActivityCard 
            title="Luyện tính nhẩm"
            description="AI sẽ đọc phép tính, bé trả lời thật nhanh nhé!"
            icon="⚡"
            onClick={onStartMentalMath}
        />
        <MathActivityCard 
            title="Toán có lời văn"
            description="Giải các bài toán vui về cuộc sống hàng ngày."
            icon="📚"
            onClick={onStartWordProblems}
        />
      </div>
    </div>
  );
};

export default MathHomePage;

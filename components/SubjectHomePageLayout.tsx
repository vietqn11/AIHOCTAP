
import React from 'react';
import { ActivityCardData } from '../types';

const ActivityCard: React.FC<ActivityCardData> = ({ title, description, icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="text-left p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-blue-50 border border-gray-200 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  >
    <div className="flex items-center gap-4">
        <span className="text-4xl">{icon}</span>
        <div>
            <p className="text-lg font-semibold text-blue-700">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </div>
  </button>
);


interface SubjectHomePageLayoutProps {
    title: string;
    description: string;
    icon: string;
    onBack: () => void;
    activities: ActivityCardData[];
}

const SubjectHomePageLayout: React.FC<SubjectHomePageLayoutProps> = ({ title, description, icon, onBack, activities }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại Trang chủ</button>
       <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="text-6xl">{icon}</div>
        <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {title}
            </h2>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map(activity => (
          <ActivityCard key={activity.title} {...activity} />
        ))}
      </div>
    </div>
  );
};

export default SubjectHomePageLayout;

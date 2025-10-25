
import React from 'react';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { ActivityCardData } from '../../types';

interface ReadingHomePageProps {
  onBack: () => void;
  onNavigateToPassageSelection: () => void;
  onNavigateToRolePlay: () => void;
}

const ReadingHomePage: React.FC<ReadingHomePageProps> = ({ onBack, onNavigateToPassageSelection, onNavigateToRolePlay }) => {
  const activities: ActivityCardData[] = [
    {
      title: "Luyện đọc theo bài",
      description: "Chọn bài đọc, luyện từ khó, sau đó đọc và nhận xét từ AI.",
      icon: "📖",
      onClick: onNavigateToPassageSelection,
    },
    {
      title: "Đọc truyện phân vai",
      description: "Cùng AI đọc những câu chuyện thú vị với vai nhân vật.",
      icon: "🎭",
      onClick: onNavigateToRolePlay,
    }
  ];

  return (
    <SubjectHomePageLayout
      title="Luyện Đọc"
      description="Cùng rèn luyện để đọc thật trôi chảy và diễn cảm nhé!"
      icon="📚"
      onBack={onBack}
      activities={activities}
    />
  );
};

export default ReadingHomePage;
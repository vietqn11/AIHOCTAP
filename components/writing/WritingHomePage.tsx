
import React from 'react';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { ActivityCardData } from '../../types';

interface WritingHomePageProps {
  onBack: () => void;
  onStartWriting: (mode: 'topic' | 'outline' | 'image') => void;
  onNavigateToHandwriting: () => void;
}

const WritingHomePage: React.FC<WritingHomePageProps> = ({ onBack, onStartWriting, onNavigateToHandwriting }) => {
  const activities: ActivityCardData[] = [
    {
      title: "Viết văn theo chủ đề",
      description: "Chọn chủ đề và nhận gợi ý từ AI để hoàn thành bài văn.",
      icon: "✏️",
      onClick: () => onStartWriting('topic'),
    },
     {
      title: "Cùng AI lập dàn ý",
      description: "Xây dựng dàn ý chi tiết cho bài văn trước khi viết.",
      icon: "📝",
      onClick: () => onStartWriting('outline'),
    },
    {
      title: "Viết từ tranh vẽ",
      description: "AI sẽ vẽ một bức tranh, con hãy viết về nó nhé.",
      icon: "🖼️",
      onClick: () => onStartWriting('image'),
    },
    {
      title: "Chấm bài viết tay",
      description: "Chụp ảnh bài viết tay để AI đọc và đưa ra nhận xét.",
      icon: "📸",
      onClick: onNavigateToHandwriting,
    }
  ];

  return (
    <SubjectHomePageLayout
      title="Tập Làm Văn"
      description="Rèn luyện kỹ năng viết để tạo ra những bài văn thật hay!"
      icon="✍️"
      onBack={onBack}
      activities={activities}
    />
  );
};

export default WritingHomePage;
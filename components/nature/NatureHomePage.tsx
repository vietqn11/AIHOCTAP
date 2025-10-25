
import React from 'react';
import { ActivityCardData } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';

interface NatureHomePageProps {
  onBack: () => void;
  onNavigateToActivity: () => void;
}

const NatureHomePage: React.FC<NatureHomePageProps> = ({ onBack, onNavigateToActivity }) => {
    const activities: ActivityCardData[] = [
        {
            title: "Trò chuyện khoa học",
            description: "Hỏi AI bất cứ điều gì con thắc mắc về thế giới xung quanh.",
            icon: "💬",
            onClick: onNavigateToActivity,
        },
        {
            title: "Nhận diện vật thể",
            description: "Dùng camera để xem đây là cây gì, hoa gì, con vật gì.",
            icon: "📸",
            disabled: true,
        },
        {
            title: "Chăm sóc cây ảo",
            description: "Trồng và chăm sóc một cái cây ảo để xem nó lớn lên.",
            icon: "🌱",
            disabled: true,
        },
        {
            title: "Phân loại rác",
            description: "Học cách bảo vệ môi trường bằng việc bỏ rác đúng nơi.",
            icon: "🗑️",
            disabled: true,
        }
    ];

    return (
        <SubjectHomePageLayout
            title="Tự nhiên & Xã hội"
            description="Khám phá thế giới quanh em, từ cỏ cây, hoa lá đến các vì sao."
            icon="🌍"
            onBack={onBack}
            activities={activities}
        />
    );
};

export default NatureHomePage;

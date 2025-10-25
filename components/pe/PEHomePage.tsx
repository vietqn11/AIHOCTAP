
import React from 'react';
import { ActivityCardData } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';

interface PEHomePageProps {
  onBack: () => void;
  onNavigateToActivity: () => void;
}

const PEHomePage: React.FC<PEHomePageProps> = ({ onBack, onNavigateToActivity }) => {
    const activities: ActivityCardData[] = [
        {
            title: "Gợi ý vận động",
            description: "Xem hôm nay AI có gợi ý vận động gì vui và khỏe nhé!",
            icon: "💪",
            onClick: onNavigateToActivity,
        },
        {
            title: "AI sửa tư thế",
            description: "Dùng camera để AI xem và sửa động tác thể dục cho con.",
            icon: "🤸‍♀️",
            disabled: true,
        },
        {
            title: "Thử thách 7 ngày",
            description: "Hoàn thành các thử thách vận động đơn giản mỗi ngày.",
            icon: "🗓️",
            disabled: true,
        },
        {
            title: "Nhật ký luyện tập",
            description: "Ghi lại thành tích thể dục của con hàng ngày.",
            icon: "📈",
            disabled: true,
        }
    ];

    return (
        <SubjectHomePageLayout
            title="Thể Dục"
            description="Cùng vận động thông minh để có một cơ thể khỏe mạnh!"
            icon="🧘"
            onBack={onBack}
            activities={activities}
        />
    );
};

export default PEHomePage;

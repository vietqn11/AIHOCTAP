
import React from 'react';
import { ActivityCardData } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';

interface ExperienceHomePageProps {
  onBack: () => void;
  onNavigateToActivity: () => void;
}

const ExperienceHomePage: React.FC<ExperienceHomePageProps> = ({ onBack, onNavigateToActivity }) => {
    const activities: ActivityCardData[] = [
        {
            title: "Gợi ý hằng ngày",
            description: "Xem hôm nay AI gợi ý con làm việc tốt gì nhé!",
            icon: "✨",
            onClick: onNavigateToActivity,
        },
        {
            title: "Nhật ký trải nghiệm",
            description: "Kể cho AI nghe về một việc con đã làm hôm nay.",
            icon: "📔",
            disabled: true,
        },
        {
            title: "Khám phá nghề nghiệp",
            description: "Tìm hiểu về công việc của bác sĩ, chú công an, cô giáo...",
            icon: "👩‍⚕️",
            disabled: true,
        },
        {
            title: "Kỹ năng sống",
            description: "Học các kỹ năng quan trọng qua các tình huống vui.",
            icon: "🤝",
            disabled: true,
        }
    ];

    return (
        <SubjectHomePageLayout
            title="Hoạt động Trải nghiệm"
            description="Học hỏi những điều hay từ chính cuộc sống xung quanh."
            icon="🌟"
            onBack={onBack}
            activities={activities}
        />
    );
};

export default ExperienceHomePage;

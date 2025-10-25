
import React from 'react';
import { ActivityCardData } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';

interface ArtHomePageProps {
  onBack: () => void;
  onNavigateToActivity: () => void;
}

const ArtHomePage: React.FC<ArtHomePageProps> = ({ onBack, onNavigateToActivity }) => {
    const activities: ActivityCardData[] = [
        {
            title: "Vẽ tranh tô màu",
            description: "Nói ý tưởng của con, AI sẽ vẽ một bức tranh để con tô màu.",
            icon: "🎨",
            onClick: onNavigateToActivity,
        },
        {
            title: "Pha màu kỳ diệu",
            description: "Trộn các màu sắc với nhau để xem điều gì sẽ xảy ra nhé!",
            icon: "🧪",
            disabled: true,
        },
        {
            title: "Triển lãm ảo",
            description: "Gửi tranh của con lên đây để khoe với các bạn nào!",
            icon: "🖼️",
            disabled: true,
        },
        {
            title: "AI nhận xét tranh",
            description: "Chụp ảnh bức tranh của con để AI đưa ra lời khen nhé.",
            icon: "🤖",
            disabled: true,
        }
    ];

    return (
        <SubjectHomePageLayout
            title="Mỹ Thuật"
            description="Cùng khám phá thế giới màu sắc và sáng tạo không giới hạn!"
            icon="🖌️"
            onBack={onBack}
            activities={activities}
        />
    );
};

export default ArtHomePage;

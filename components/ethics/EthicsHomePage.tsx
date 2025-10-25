
import React from 'react';
import { ActivityCardData } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';

interface EthicsHomePageProps {
  onBack: () => void;
  onNavigateToActivity: () => void;
}

const EthicsHomePage: React.FC<EthicsHomePageProps> = ({ onBack, onNavigateToActivity }) => {
    const activities: ActivityCardData[] = [
        {
            title: "Giải quyết tình huống",
            description: "Nếu là con, con sẽ làm gì trong những tình huống này?",
            icon: "🤔",
            onClick: onNavigateToActivity,
        },
        {
            title: "Câu chuyện tương tác",
            description: "Lựa chọn của con sẽ thay đổi kết thúc của câu chuyện.",
            icon: "📖",
            disabled: true,
        },
        {
            title: "Nhật ký việc tốt",
            description: "Ghi lại những việc tốt con đã làm mỗi ngày.",
            icon: "📝",
            disabled: true,
        },
        {
            title: "Nhật ký cảm xúc",
            description: "Chia sẻ với AI về cảm xúc của con hôm nay.",
            icon: "😊",
            disabled: true,
        }
    ];

    return (
        <SubjectHomePageLayout
            title="Đạo Đức"
            description="Học cách trở thành một người bạn tốt, một người con ngoan."
            icon="❤️"
            onBack={onBack}
            activities={activities}
        />
    );
};

export default EthicsHomePage;


import React from 'react';
import { ActivityCardData } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';

interface InformaticsHomePageProps {
  onBack: () => void;
  onNavigateToActivity: () => void;
}

const InformaticsHomePage: React.FC<InformaticsHomePageProps> = ({ onBack, onNavigateToActivity }) => {
    const activities: ActivityCardData[] = [
        {
            title: "Luyện gõ chữ",
            description: "Luyện tập gõ bàn phím với các câu văn vui nhộn.",
            icon: "⌨️",
            onClick: onNavigateToActivity,
        },
        {
            title: "An toàn trên mạng",
            description: "Học cách tự bảo vệ mình khi dùng Internet.",
            icon: "🛡️",
            disabled: true,
        },
        {
            title: "Tư duy lập trình",
            description: "Làm quen với các khối lệnh đơn giản qua trò chơi.",
            icon: "🧩",
            disabled: true,
        },
        {
            title: "Tay chuột nhanh",
            description: "Trò chơi giúp con sử dụng chuột máy tính thành thạo.",
            icon: "🖱️",
            disabled: true,
        }
    ];

    return (
        <SubjectHomePageLayout
            title="Tin Học"
            description="Cùng làm bạn với chiếc máy tính thông minh nào!"
            icon="💻"
            onBack={onBack}
            activities={activities}
        />
    );
};

export default InformaticsHomePage;

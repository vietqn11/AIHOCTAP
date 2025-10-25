
import React from 'react';
import { ActivityCardData } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';

interface MusicHomePageProps {
  onBack: () => void;
  onNavigateToActivity: () => void;
}

const MusicHomePage: React.FC<MusicHomePageProps> = ({ onBack, onNavigateToActivity }) => {
    const activities: ActivityCardData[] = [
        {
            title: "Câu đố nhạc cụ",
            description: "Nghe mô tả và đoán xem đó là loại nhạc cụ gì nhé!",
            icon: "❓",
            onClick: onNavigateToActivity,
        },
        {
            title: "AI dạy hát",
            description: "Học hát từng câu với sự hướng dẫn của AI.",
            icon: "🎤",
            disabled: true,
        },
        {
            title: "Nghe đoán bài hát",
            description: "Nghe một đoạn nhạc và đoán tên bài hát quen thuộc.",
            icon: "🎶",
            disabled: true,
        },
        {
            title: "Song ca cùng AI",
            description: "Cùng hát karaoke với một người bạn AI đặc biệt.",
            icon: "듀",
            disabled: true,
        }
    ];

    return (
        <SubjectHomePageLayout
            title="Âm Nhạc"
            description="Cùng hát ca, nhảy múa và khám phá thế giới âm thanh kỳ diệu."
            icon="🎵"
            onBack={onBack}
            activities={activities}
        />
    );
};

export default MusicHomePage;

import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { ReadingIcon, LightbulbIcon, SpeakerIcon } from '../icons/Icons';

const ReadingHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Luyện đọc trôi chảy",
            description: "Đọc các bài văn và nhận đánh giá về phát âm, tốc độ và sự trôi chảy.",
            icon: <ReadingIcon size="lg" />,
            onClick: () => navigate(Page.PassageSelection, { mode: 'read' }),
            color: "from-sky-500 to-blue-600 focus:ring-blue-300",
        },
        {
            name: "Luyện đọc từ khó",
            description: "Tìm hiểu và luyện phát âm các từ khó có trong bài đọc.",
            icon: <LightbulbIcon size="lg" />,
            onClick: () => navigate(Page.PassageSelection, { mode: 'difficult_words' }),
            color: "from-amber-500 to-orange-600 focus:ring-orange-300",
        },
        {
            name: "Đọc phân vai",
            description: "Đóng vai các nhân vật và đọc lời thoại theo kịch bản có sẵn.",
            icon: <SpeakerIcon size="lg" />,
            onClick: () => navigate(Page.RolePlayScriptSelection),
            color: "from-emerald-500 to-green-600 focus:ring-green-300",
        },
    ];

    return <SubjectHomePageLayout title="Luyện Đọc" activities={activities} />;
};

export default ReadingHomePage;

import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { WritingIcon, LightbulbIcon, ArtIcon } from '../icons/Icons';

const WritingHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Luyện viết đoạn văn",
            description: "Chọn chủ đề, viết một đoạn văn và nhận góp ý để cải thiện bài viết.",
            icon: <WritingIcon size="lg" />,
            onClick: () => navigate(Page.WritingTopicSelection),
            color: "from-amber-500 to-orange-600 focus:ring-orange-300",
        },
        {
            name: "Luyện viết tay",
            description: "Chụp ảnh bài viết tay của em để AI chấm điểm và nhận xét.",
            icon: <ArtIcon size="lg" />,
            onClick: () => navigate(Page.HandwritingEvaluation),
            color: "from-rose-500 to-red-600 focus:ring-red-300",
        },
        {
            name: "Lập dàn ý",
            description: "AI sẽ giúp em lập dàn ý chi tiết cho bài văn của mình.",
            icon: <LightbulbIcon size="lg" />,
            onClick: () => navigate(Page.WritingOutline),
            color: "from-violet-500 to-purple-600 focus:ring-purple-300",
        },
    ];

    return <SubjectHomePageLayout title="Luyện Viết" activities={activities} />;
};

export default WritingHomePage;

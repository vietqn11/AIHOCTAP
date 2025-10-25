import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { ArtIcon, LightbulbIcon } from '../icons/Icons';

const ArtHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Tìm ý tưởng vẽ tranh",
            description: "Trò chuyện với AI để lấy ý tưởng sáng tạo cho tác phẩm của em.",
            icon: <LightbulbIcon size="lg" />,
            onClick: () => navigate(Page.ArtIdea),
            color: "from-fuchsia-500 to-pink-600 focus:ring-pink-300",
        },
        {
            name: "AI tạo tranh tô màu",
            description: "Biến ý tưởng của em thành một bức tranh tô màu đơn giản.",
            icon: <ArtIcon size="lg" />,
            onClick: () => navigate(Page.ImageGeneration),
            color: "from-violet-500 to-purple-600 focus:ring-purple-300",
        }
    ];

    return <SubjectHomePageLayout title="Mĩ thuật" activities={activities} />;
};

export default ArtHomePage;
import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { MusicIcon } from '../icons/Icons';

const MusicHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Khám phá Âm nhạc",
            description: "Trò chuyện với AI về các bài hát, nhạc cụ và thể loại âm nhạc.",
            icon: <MusicIcon size="lg" />,
            onClick: () => navigate(Page.Music),
            color: "from-violet-500 to-purple-600 focus:ring-purple-300",
        },
    ];

    return <SubjectHomePageLayout title="Âm nhạc" activities={activities} />;
};

export default MusicHomePage;
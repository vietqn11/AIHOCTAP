import React from 'react';
import { Page } from '../../constants.js';
import SubjectHomePageLayout from '../SubjectHomePageLayout.jsx';
import { MusicIcon } from '../icons/Icons.jsx';

const MusicHomePage = ({ navigate }) => {
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
import React from 'react';
import { Page } from '../../constants.js';
import SubjectHomePageLayout from '../SubjectHomePageLayout.jsx';
import { PEIcon } from '../icons/Icons.jsx';

const PEHomePage = ({ navigate }) => {
    const activities = [
        {
            name: "Rèn luyện thân thể",
            description: "Hỏi AI về các môn thể thao, bài tập vận động để khỏe mạnh hơn.",
            icon: <PEIcon size="lg" />,
            onClick: () => navigate(Page.PE),
            color: "from-teal-500 to-cyan-600 focus:ring-cyan-300",
        },
    ];

    return <SubjectHomePageLayout title="Giáo dục thể chất" activities={activities} />;
};

export default PEHomePage;
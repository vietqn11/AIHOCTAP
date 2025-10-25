import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { PEIcon } from '../icons/Icons';

const PEHomePage = ({ navigate }: PageProps) => {
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
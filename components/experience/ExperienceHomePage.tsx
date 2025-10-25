import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { ExperienceIcon } from '../icons/Icons';

const ExperienceHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Khám phá Trải nghiệm",
            description: "Trò chuyện với AI về các hoạt động và kỹ năng sống thú vị.",
            icon: <ExperienceIcon size="lg" />,
            onClick: () => navigate(Page.Experience),
            color: "from-lime-500 to-green-600 focus:ring-green-300",
        },
    ];

    return <SubjectHomePageLayout title="Hoạt động Trải nghiệm" activities={activities} />;
};

export default ExperienceHomePage;
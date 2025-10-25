import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { EthicsIcon } from '../icons/Icons';

const EthicsHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Tình huống đạo đức",
            description: "Kể cho AI nghe một tình huống và nhận lời khuyên bổ ích.",
            icon: <EthicsIcon size="lg" />,
            onClick: () => navigate(Page.Ethics),
            color: "from-rose-500 to-red-600 focus:ring-red-300",
        },
    ];

    return <SubjectHomePageLayout title="Đạo đức" activities={activities} />;
};

export default EthicsHomePage;
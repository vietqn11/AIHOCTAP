import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { EthicsIcon } from '../icons/Icons';

const EthicsHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Thử thách tình huống",
            description: "Giải quyết các tình huống đạo đức và nhận lời khuyên từ AI.",
            icon: <EthicsIcon size="lg" />,
            onClick: () => navigate(Page.EthicalDilemma),
            color: "from-rose-500 to-red-600 focus:ring-red-300",
        },
    ];

    return <SubjectHomePageLayout title="Đạo đức" activities={activities} />;
};

export default EthicsHomePage;
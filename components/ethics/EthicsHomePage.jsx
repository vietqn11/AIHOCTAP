import React from 'react';
import { Page } from '../../constants.js';
import SubjectHomePageLayout from '../SubjectHomePageLayout.jsx';
import { EthicsIcon } from '../icons/Icons.jsx';

const EthicsHomePage = ({ navigate }) => {
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
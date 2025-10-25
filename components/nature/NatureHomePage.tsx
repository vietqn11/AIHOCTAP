import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { NatureIcon } from '../icons/Icons';

const NatureHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Khám phá thế giới",
            description: "Hỏi AI về cây cối, động vật và mọi thứ trong thế giới tự nhiên.",
            icon: <NatureIcon size="lg" />,
            onClick: () => navigate(Page.NatureAndSociety),
            color: "from-green-500 to-emerald-600 focus:ring-emerald-300",
        },
    ];

    return <SubjectHomePageLayout title="Tự nhiên & Xã hội" activities={activities} />;
};

export default NatureHomePage;
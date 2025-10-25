import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { InformaticsIcon } from '../icons/Icons';

const InformaticsHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Tìm hiểu Tin học",
            description: "Hỏi AI bất cứ điều gì em thắc mắc về máy tính và internet.",
            icon: <InformaticsIcon size="lg" />,
            onClick: () => navigate(Page.Informatics),
            color: "from-slate-500 to-gray-600 focus:ring-gray-300",
        },
    ];

    return <SubjectHomePageLayout title="Tin học" activities={activities} />;
};

export default InformaticsHomePage;
import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { NatureIcon, ReadingIcon } from '../icons/Icons';

const NatureHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Nhận diện vật thể",
            description: "Dùng camera để hỏi AI về cây cối, con vật xung quanh em.",
            icon: <ReadingIcon size="lg" />,
            onClick: () => navigate(Page.ObjectIdentification),
            color: "from-teal-500 to-cyan-600 focus:ring-cyan-300",
        },
        {
            name: "Hỏi đáp khoa học",
            description: "Hỏi AI về cây cối, động vật và mọi thứ trong thế giới tự nhiên.",
            icon: <NatureIcon size="lg" />,
            onClick: () => navigate(Page.NatureAndSociety),
            color: "from-green-500 to-emerald-600 focus:ring-emerald-300",
        },
    ];

    return <SubjectHomePageLayout title="Tự nhiên & Xã hội" activities={activities} />;
};

export default NatureHomePage;
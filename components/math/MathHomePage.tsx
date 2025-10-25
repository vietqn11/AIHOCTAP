import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { MathIcon, LightbulbIcon } from '../icons/Icons';

const MathHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Toán nhẩm",
            description: "Luyện tập các phép tính cộng, trừ, nhân, chia trong phạm vi 100.",
            icon: <MathIcon size="lg" />,
            onClick: () => navigate(Page.MentalMath),
            color: "from-indigo-500 to-purple-600 focus:ring-purple-300",
        },
        {
            name: "Giải toán có lời văn",
            description: "Thử sức với các bài toán đố vui và nhận hướng dẫn chi tiết.",
            icon: <LightbulbIcon size="lg" />,
            onClick: () => navigate(Page.WordProblemLessonSelection),
            color: "from-teal-500 to-cyan-600 focus:ring-cyan-300",
        },
    ];

    return <SubjectHomePageLayout title="Toán học" activities={activities} />;
};

export default MathHomePage;

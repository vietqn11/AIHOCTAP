import React from 'react';
import { Page, PageProps } from '../../types';
import SubjectHomePageLayout from '../SubjectHomePageLayout';
import { ArtIcon } from '../icons/Icons';

const ArtHomePage = ({ navigate }: PageProps) => {
    const activities = [
        {
            name: "Cùng AI sáng tạo",
            description: "Trò chuyện với AI để lấy ý tưởng cho các tác phẩm nghệ thuật của em.",
            icon: <ArtIcon size="lg" />,
            onClick: () => navigate(Page.Art),
            color: "from-fuchsia-500 to-pink-600 focus:ring-pink-300",
        },
    ];

    return <SubjectHomePageLayout title="Mĩ thuật" activities={activities} />;
};

export default ArtHomePage;